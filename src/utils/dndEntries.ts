import type { PairedBlock } from "./pairChapterBlocks";

/**
 * D&D SRD 목록 단위(괴물·동물·주문·마법 물건)에서 항목 하나가 걸친 행들을 묶는다.
 *
 * 대역 페이지는 헤딩·덩어리마다 행을 나누므로 자료 상자 하나가 여러 행에 흩어진다. 행마다
 * `entry entry-<종류>` 클래스와 시작·끝 표시를 달아 두면, CSS가 열마다 이어진 카드처럼 그린다.
 *
 *   entry-start    항목 이름 헤딩 행
 *   entry-subtitle 이름 바로 아래 기울임 한 줄(“대형 기괴체, 질서 악”, “1레벨 방호계 …”)
 *   entry-section  자료 상자 안의 특징·행동 같은 절 헤딩 행
 *   entry-end      항목의 마지막 행
 */

type EntryKind = "monster" | "spell" | "item";

/** 단위 슬러그 → 항목 종류와 항목 이름 헤딩의 깊이. 목록 단위가 아니면 null. */
function entryLayout(slug: string): { kind: EntryKind; depth: number } | null {
  if (slug.startsWith("spells-")) return { kind: "spell", depth: 4 };
  if (slug.startsWith("magic-items-")) return { kind: "item", depth: 4 };
  // 괴물은 ## 무리 이름 아래 ### 자료 상자, 동물은 ## 자체가 자료 상자다.
  if (slug.startsWith("monsters-")) return { kind: "monster", depth: 3 };
  if (slug.startsWith("animals-")) return { kind: "monster", depth: 2 };
  return null;
}

/** 주문(움직이는 물체 등) 안에 든 자료 상자 절. 영어 앵커로 알아본다. */
const STAT_SECTION_ID = /^(traits|actions|bonus-actions|reactions|legendary-actions)(-\d+)?$/;

/** 기울임 하나로만 된 문단(항목 이름 아래 분류 줄). */
const SUBTITLE_HTML = /^\s*<p><em>[^<]*<\/em><\/p>\s*$/;

export function markDndEntries(slug: string, rows: PairedBlock[]): PairedBlock[] {
  const layout = entryLayout(slug);
  if (!layout) return rows;

  const classes: string[][] = rows.map(() => []);
  let open = -1; // 열려 있는 항목의 시작 행
  let last = -1; // 그 항목의 마지막 행

  const close = () => {
    if (open >= 0) classes[last]!.push("entry-end");
    open = -1;
  };

  rows.forEach((row, i) => {
    if (row.kind === "heading" && row.depth !== undefined) {
      const isSection =
        open >= 0 &&
        (row.depth > layout.depth || (row.depth === layout.depth && STAT_SECTION_ID.test(row.id ?? "")));
      if (isSection) {
        classes[i]!.push("entry", `entry-${layout.kind}`, "entry-section");
        last = i;
        return;
      }
      close();
      if (row.depth === layout.depth) {
        classes[i]!.push("entry", `entry-${layout.kind}`, "entry-start");
        open = last = i;
      }
      return;
    }
    if (open < 0) return;
    classes[i]!.push("entry", `entry-${layout.kind}`);
    if (last === open && SUBTITLE_HTML.test(row.enHtml)) classes[i]!.push("entry-subtitle");
    last = i;
  });
  close();

  return rows.map((row, i) => (classes[i]!.length ? { ...row, className: classes[i]!.join(" ") } : row));
}
