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
  /** "heading" | "preamble" */
  kind: string;
  depth?: number;
  id?: string;
  enHtml: string;
  koHtml: string;
};

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

type Section = {
  heading: { depth: number; text: string; id?: string | undefined } | null;
  from: number;
  to: number;
};

type ParsedSection = Section & { html: string };

/**
 * h2 이상 헤딩마다 새 절을 연다. 첫 헤딩 앞에 남는 블록(머리말·도입 문단)은 preamble 절이 된다.
 */
function toSections(source: string): ParsedSection[] {
  const nodes = parse(source);
  const sections: Section[] = [];
  let current: Section | null = null;

  for (const node of nodes) {
    const start = node.position?.start.offset ?? 0;
    const end = node.position?.end.offset ?? source.length;

    if (node.type === "heading" && (node as Heading).depth >= 2) {
      current = {
        heading: { depth: (node as Heading).depth, text: headingText(node), id: anchorOf(node) },
        from: start,
        to: end,
      };
      sections.push(current);
      continue;
    }

    if (!current) {
      current = { heading: null, from: start, to: end };
      sections.push(current);
    }
    current.to = end;
  }

  return sections.map((section) => ({ ...section, html: renderRange(source, section.from, section.to) }));
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
 */
export function pairSections(
  chapterSlug: string,
  enSource: string,
  koSource: string,
  label = "dw2",
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

  const rows: PairedSectionRow[] = enSections.map((enSection, i) => {
    const koSection = translated ? koSections[i] : undefined;

    if (!enSection.heading) {
      return { kind: "preamble", enHtml: enSection.html, koHtml: koSection?.html ?? "" };
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

    if (depth <= 3) headings.push({ depth, slug: id, text });

    return {
      kind: "heading",
      depth,
      id,
      // 헤딩 안의 <a>는 헤딩 자체의 id로 대체한다(중복 id 방지).
      enHtml: injectId(enSection.html.replace(INNER_ANCHOR_RE, ""), id),
      koHtml: injectId((koSection?.html ?? "").replace(INNER_ANCHOR_RE, ""), id),
    };
  });

  return { rows, headings };
}
