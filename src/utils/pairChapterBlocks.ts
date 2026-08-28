import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypeRaw from "rehype-raw";
import rehypeStringify from "rehype-stringify";
import { toString as mdastToString } from "mdast-util-to-string";
import GithubSlugger from "github-slugger";
import type { Root, RootContent, Heading } from "mdast";

export type PairedBlock = {
  kind: string;
  depth?: number;
  id?: string;
  enHtml: string;
  koHtml: string;
};

export type ChapterHeading = {
  depth: number;
  slug: string;
  text: string;
};

export type PairedChapter = {
  rows: PairedBlock[];
  headings: ChapterHeading[];
};

const blockParser = unified().use(remarkParse).use(remarkGfm);

const blockRenderer = unified()
  .use(remarkParse)
  .use(remarkGfm)
  .use(remarkRehype, { allowDangerousHtml: true })
  .use(rehypeRaw)
  .use(rehypeStringify, { allowDangerousHtml: true });

function parseTopLevelBlocks(source: string): RootContent[] {
  const tree = blockParser.parse(source) as Root;
  return tree.children;
}

function sliceNode(source: string, node: RootContent): string {
  const start = node.position?.start.offset ?? 0;
  const end = node.position?.end.offset ?? source.length;
  return source.slice(start, end);
}

function renderBlock(markdown: string): string {
  return String(blockRenderer.processSync(markdown));
}

function preview(source: string, node: RootContent | undefined): string {
  if (!node) return "(없음)";
  const raw = sliceNode(source, node).trim().replace(/\s+/g, " ");
  return raw.length > 80 ? `${raw.slice(0, 80)}…` : raw;
}

function injectId(html: string, id: string): string {
  return html.replace(/^(<h[1-6])([ >])/, (_match, tag, sep) => `${tag} id="${id}"${sep}`);
}

export function pairChapterBlocks(chapterSlug: string, enSource: string, koSource: string): PairedChapter {
  const enBlocks = parseTopLevelBlocks(enSource);
  const koBlocks = parseTopLevelBlocks(koSource);

  if (enBlocks.length !== koBlocks.length) {
    const i = Math.min(enBlocks.length, koBlocks.length);
    throw new Error(
      `[cypher-srd:${chapterSlug}] EN has ${enBlocks.length}, KO has ${koBlocks.length} top-level blocks — ` +
        `they must match in count and order.\n` +
        `  EN[${i}]: ${preview(enSource, enBlocks[i])}\n` +
        `  KO[${i}]: ${preview(koSource, koBlocks[i])}`,
    );
  }

  const slugger = new GithubSlugger();
  const headings: ChapterHeading[] = [];

  const rows: PairedBlock[] = enBlocks.map((enNode, i) => {
    // enBlocks.length === koBlocks.length was asserted above, so this always exists.
    const koNode = koBlocks[i]!;

    if (enNode.type !== koNode.type) {
      throw new Error(
        `[cypher-srd:${chapterSlug}] ${i}번째 블록의 종류가 다릅니다: EN=${enNode.type}, KO=${koNode.type}\n` +
          `  EN: ${preview(enSource, enNode)}\n` +
          `  KO: ${preview(koSource, koNode)}`,
      );
    }

    let enHtml = renderBlock(sliceNode(enSource, enNode));
    let koHtml = renderBlock(sliceNode(koSource, koNode));

    const row: PairedBlock = { kind: enNode.type, enHtml, koHtml };

    if (enNode.type === "heading") {
      const depth = (enNode as Heading).depth;
      const isChapterTitle = i === 0 && depth === 1;
      const text = mdastToString(koNode);
      const slug = isChapterTitle ? "overview" : slugger.slug(text);

      row.depth = depth;
      row.id = slug;
      row.enHtml = injectId(enHtml, slug);
      row.koHtml = injectId(koHtml, slug);

      if (!isChapterTitle) {
        headings.push({ depth, slug, text });
      }
    }

    return row;
  });

  return { rows, headings };
}
