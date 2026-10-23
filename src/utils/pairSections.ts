import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypeRaw from "rehype-raw";
import rehypeStringify from "rehype-stringify";
import { toString as mdastToString } from "mdast-util-to-string";
import GithubSlugger from "github-slugger";
import type { Root, RootContent, Heading } from "mdast";

export type PairedSectionRow = {
  /** "heading" | "preamble" | "block"(절을 블록 단위로 나눴을 때 헤딩 뒤에 이어지는 덩어리) */
  kind: string;
  depth?: number;
  id?: string;
  /** 앞 덩어리와 띄울 간격. 인용·HTML 상자는 문단보다 넓게 띄운다. */
  gap?: BlockGap;
  enHtml: string;
  koHtml: string;
};

export type BlockGap = "text" | "quote" | "html";

export type PairedSectionHeading = {
  depth: number;
  slug: string;
  text: string;
};

export type PairedSections = {
  rows: PairedSectionRow[];
  headings: PairedSectionHeading[];
};

const parser = unified().use(remarkParse).use(remarkGfm);

const renderer = unified()
  .use(remarkParse)
  .use(remarkGfm)
  .use(remarkRehype, { allowDangerousHtml: true })
  .use(rehypeRaw)
  .use(rehypeStringify, { allowDangerousHtml: true });

const INNER_ANCHOR_RE = /<a\s+id="[^"]*"><\/a>/g;

function parse(source: string): RootContent[] {
  return (parser.parse(source) as Root).children;
}

function renderRange(source: string, from: number, to: number): string {
  return String(renderer.processSync(source.slice(from, to)));
}

function injectId(html: string, id: string): string {
  return html.replace(/^(<h[1-6])([ >])/, (_match, tag: string, sep: string) => `${tag} id="${id}"${sep}`);
}

/** 헤딩 안에 심어 둔 <a id="..."></a>에서 원문 앵커를 읽는다. */
function anchorOf(heading: RootContent): string | undefined {
  if (heading.type !== "heading") return undefined;
  for (const child of heading.children) {
    if (child.type === "html") {
      const anchor = child.value.match(/<a\s+id="([^"]+)"/)?.[1];
      if (anchor) return anchor.replace(/&amp;/g, "&").replace(/&quot;/g, '"');
    }
  }
  return undefined;
}

function headingText(heading: RootContent): string {
  // 앵커용 <a> 태그는 ToC 텍스트에서 뺀다.
  return mdastToString(heading, { includeHtml: false }).trim();
}

/** 절 안에서 한 줄(행)로 짝지을 덩어리. 보통 최상위 블록 하나다. */
type Block = {
  from: number;
  to: number;
  /** 덩어리 첫·끝 블록의 종류(paragraph, blockquote, html …). 짝 맞춤과 간격에 쓴다. */
  first: string;
  last: string;
};

type Section = {
  heading: { depth: number; text: string; id?: string | undefined } | null;
  from: number;
  to: number;
  /** 헤딩 노드가 끝나는 자리. 헤딩이 없으면 from과 같다. */
  headingTo: number;
  blocks: Block[];
};

type ParsedSection = Section & { html: string };

const VOID_TAGS = new Set(["area", "base", "br", "col", "embed", "hr", "img", "input", "link", "meta", "source", "track", "wbr"]);
const TAG_RE = /<(\/?)([a-zA-Z][\w-]*)\b[^>]*?(\/?)>/g;

/** HTML 조각에서 열고 닫지 않은 태그 수. `<div>`만 있고 `</div>`가 뒤 블록에 있으면 1이다. */
function openTags(html: string): number {
  let depth = 0;
  for (const [, closing, name, selfClosing] of html.replace(/<!--[\s\S]*?-->/g, "").matchAll(TAG_RE)) {
    if (selfClosing || VOID_TAGS.has(name!.toLowerCase())) continue;
    depth += closing ? -1 : 1;
  }
  return depth;
}

/** 앵커(<a id>)만 있는 HTML 블록. 화면에 보이지 않으니 다음 덩어리에 붙인다. */
const isAnchorOnly = (node: RootContent) =>
  node.type === "html" && node.value.replace(/<a\s+id="[^"]*"\s*><\/a>/g, "").trim() === "";

/**
 * 헤딩 뒤 블록들을 덩어리로 묶는다. HTML 블록이 태그를 연 채 끝나면(`<div class="two-col">`
 * 다음에 빈 줄과 표가 오는 식) 닫힐 때까지 한 덩어리로 둔다 — 따로 렌더하면 감싸는 태그가 깨진다.
 */
function toBlocks(source: string, nodes: RootContent[]): Block[] {
  const blocks: Block[] = [];
  let current: Block | null = null;
  let depth = 0;
  let pendingFrom: number | null = null;

  for (const node of nodes) {
    const start = node.position?.start.offset ?? 0;
    const end = node.position?.end.offset ?? source.length;

    if (current && depth > 0) {
      current.to = end;
      current.last = node.type;
      if (node.type === "html") depth = Math.max(0, depth + openTags(node.value));
      continue;
    }

    if (isAnchorOnly(node)) {
      pendingFrom ??= start;
      continue;
    }

    current = { from: pendingFrom ?? start, to: end, first: node.type, last: node.type };
    pendingFrom = null;
    blocks.push(current);
    depth = node.type === "html" ? Math.max(0, openTags(node.value)) : 0;
  }

  // 절 끝에 남은 앵커는 마지막 덩어리에 붙인다.
  if (pendingFrom !== null) {
    const end = nodes.at(-1)?.position?.end.offset ?? source.length;
    if (current) current.to = end;
    else blocks.push({ from: pendingFrom, to: end, first: "html", last: "html" });
  }

  return blocks;
}

/**
 * h2 이상 헤딩마다 새 절을 연다. 첫 헤딩 앞에 남는 블록(머리말·도입 문단)은 preamble 절이 된다.
 */
function toSections(source: string): ParsedSection[] {
  const nodes = parse(source);
  const sections: (Section & { nodes: RootContent[] })[] = [];
  let current: (Section & { nodes: RootContent[] }) | null = null;

  for (const node of nodes) {
    const start = node.position?.start.offset ?? 0;
    const end = node.position?.end.offset ?? source.length;

    if (node.type === "heading" && (node as Heading).depth >= 2) {
      current = {
        heading: { depth: (node as Heading).depth, text: headingText(node), id: anchorOf(node) },
        from: start,
        to: end,
        headingTo: end,
        blocks: [],
        nodes: [],
      };
      sections.push(current);
      continue;
    }

    if (!current) {
      current = { heading: null, from: start, to: end, headingTo: start, blocks: [], nodes: [] };
      sections.push(current);
    }
    current.to = end;
    current.nodes.push(node);
  }

  return sections.map(({ nodes: sectionNodes, ...section }) => ({
    ...section,
    blocks: toBlocks(source, sectionNodes),
    html: renderRange(source, section.from, section.to),
  }));
}

/** 두 원고의 절이 같은 차례로 같은 종류의 덩어리를 가졌으면 덩어리끼리 짝지을 수 있다. */
function blocksMatch(en: Block[], ko: Block[]): boolean {
  return en.length > 1 && en.length === ko.length && en.every((block, i) => block.first === ko[i]!.first);
}

function gapBefore(previous: Block | undefined, block: Block): BlockGap {
  const kinds = [previous?.last, block.first];
  if (kinds.includes("blockquote")) return "quote";
  if (kinds.includes("html")) return "html";
  return "text";
}

function preview(source: string, section: ParsedSection | undefined): string {
  if (!section) return "(없음)";
  const raw = source.slice(section.from, section.from + 80).replace(/\s+/g, " ");
  return raw.length === 80 ? `${raw}…` : raw;
}

/**
 * 영/한 대역 뷰용 절 짝짓기.
 *
 * cypher-srd는 최상위 블록을 1:1로 짝짓지만, 원문과 번역의 블록 구조가 다른 문서(표를 문단으로
 * 정규화한 던전월드 2, 머리말 구조가 다른 게으른 GM 자료집 등)는 블록 단위로 맞지 않는다.
 * 대신 **헤딩(## 이상) 절 단위**로 짝짓는다. 두 원고의 절 개수와 헤딩 깊이가 같아야 하며,
 * 다르면 어느 절이 어긋났는지 `label`과 함께 알려 주며 실패한다.
 *
 * 절 안의 덩어리(최상위 블록) 수와 종류까지 같으면 덩어리마다 행을 나눈다. 그래야 길이가 다른
 * 두 언어의 문단이 나란히 시작한다. 구성이 다른 절은 예전처럼 절 하나가 한 행이다.
 */
export function pairSections(
  chapterSlug: string,
  enSource: string,
  koSource: string,
  label = "dw2",
  /** 오른쪽 목차에 넣을 헤딩 깊이. 항목이 h4인 목록(주문·마법 물품 등)은 4로 올린다. */
  tocDepth = 3,
): PairedSections {
  const enSections = toSections(enSource);
  const translated = koSource.trim().length > 0;
  const koSections = translated ? toSections(koSource) : [];

  if (translated && enSections.length !== koSections.length) {
    const i = Math.min(enSections.length, koSections.length);
    throw new Error(
      `[${label}:${chapterSlug}] 절 개수가 다릅니다: EN ${enSections.length}개, KO ${koSections.length}개. ` +
        `두 원고의 헤딩 구조를 맞춰 주세요.\n` +
        `  EN[${i}]: ${preview(enSource, enSections[i])}\n` +
        `  KO[${i}]: ${preview(koSource, koSections[i])}`,
    );
  }

  const slugger = new GithubSlugger();
  const headings: PairedSectionHeading[] = [];

  const rows: PairedSectionRow[] = enSections.flatMap((enSection, i) => {
    const koSection = translated ? koSections[i] : undefined;
    // 절 하나를 한 행으로 두면 영어·한국어 길이 차이가 절 끝까지 쌓여 문단이 어긋난다.
    // 덩어리 구성이 같으면 덩어리마다 행을 나눠 문단 머리를 맞춘다.
    const split = koSection !== undefined && blocksMatch(enSection.blocks, koSection.blocks);

    const blockRows = (): PairedSectionRow[] =>
      enSection.blocks.map((enBlock, j) => {
        const koBlock = koSection!.blocks[j]!;
        return {
          kind: "block",
          gap: gapBefore(enSection.blocks[j - 1], enBlock),
          enHtml: renderRange(enSource, enBlock.from, enBlock.to),
          koHtml: renderRange(koSource, koBlock.from, koBlock.to),
        };
      });

    if (!enSection.heading) {
      if (!split) return [{ kind: "preamble", enHtml: enSection.html, koHtml: koSection?.html ?? "" }];
      const [first, ...rest] = blockRows();
      return [{ ...first!, kind: "preamble", gap: undefined }, ...rest];
    }

    const koHeading = koSection?.heading;
    if (translated && koHeading && koHeading.depth !== enSection.heading.depth) {
      throw new Error(
        `[${label}:${chapterSlug}] ${i}번째 절의 헤딩 깊이가 다릅니다: EN h${enSection.heading.depth}, KO h${koHeading.depth}`,
      );
    }

    const depth = enSection.heading.depth;
    const text = (koHeading?.text || enSection.heading.text).trim();
    // 원문 앵커가 있으면 그대로 id로 쓴다 — 문서 안의 링크가 이 앵커를 가리킨다.
    const id = koHeading?.id ?? enSection.heading.id ?? slugger.slug(text);

    if (depth <= tocDepth) headings.push({ depth, slug: id, text });

    const enHtml = split ? renderRange(enSource, enSection.from, enSection.headingTo) : enSection.html;
    const koHtml = split ? renderRange(koSource, koSection!.from, koSection!.headingTo) : (koSection?.html ?? "");

    return [
      {
        kind: "heading",
        depth,
        id,
        // 헤딩 안의 <a>는 헤딩 자체의 id로 대체한다(중복 id 방지).
        enHtml: injectId(enHtml.replace(INNER_ANCHOR_RE, ""), id),
        koHtml: injectId(koHtml.replace(INNER_ANCHOR_RE, ""), id),
      },
      ...(split ? blockRows() : []),
    ];
  });

  return { rows, headings };
}
