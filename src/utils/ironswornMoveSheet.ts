import type {
  IronswornMove,
  IronswornMoveBlock,
  IronswornMoveBlockKind,
  IronswornMoveExtra,
  IronswornMoveSheet,
  IronswornMoveTable,
} from '../components/Sheets/ironswornSheet';

/**
 * 액션 레퍼런스에 실을 액션을 영/한 대역 원고에서 뽑아낸다.
 *
 * 대역 원고(`src/data/ironsworn/{ko,en}/<슬러그>.md`)는 절 단위로 1:1 짝지어져 있고,
 * 액션 상자는 `> …` 인용, 굴림 표는 그 아래 `| … |` 표다. 그래서 절을 훑어 인용을
 * 문단·글머리 목록으로, 표를 표로 옮기면 인쇄용 레퍼런스와 같은 모양이 된다.
 * 번역을 고치면 시트도 따라 바뀌므로 문구를 두 벌로 관리할 일이 없다.
 */

/** 액션 레퍼런스 한 장을 만들 때 쓰는 값. */
export interface MoveSheetSource {
  /** 시트를 가리키는 짧은 이름(adventure …). */
  slug: string;
  title: string;
  titleEn: string;
  /** 한국어 원고 전문. */
  ko: string;
  /** 영어 원고 전문. */
  en: string;
  /** 액션 상자 없이 시트 끝에 덧붙이는 절의 한국어 제목. */
  extraTitle?: string;
}

interface Heading {
  depth: number;
  title: string;
  line: number;
}

interface Section {
  heading: Heading;
  /** 인용과 표를 담은 본문(다음 제목 전까지). */
  body: string[];
  /** 이 절이 끝나는 줄. 하위 제목도 끝으로 본다. */
  end: number;
  /** 같은 깊이나 얕은 제목 앞까지, 즉 하위 절을 아우른 끝. */
  outerEnd: number;
}

/** 인용 맨 앞에 홀로 놓여 액션 이름 옆에 붙는 꼬리표의 영문 표기. */
const TAG_EN: Record<string, string> = {
  '진행 액션': 'Progress Move',
};

function parseHeadings(lines: readonly string[]): Heading[] {
  const headings: Heading[] = [];
  lines.forEach((line, index) => {
    const match = /^(#{2,4})\s+(.+?)\s*$/.exec(line);
    const marks = match?.[1];
    const title = match?.[2];
    if (marks && title) headings.push({ depth: marks.length, title, line: index });
  });
  return headings;
}

/**
 * 제목마다 그 절의 본문을 잘라 준다.
 *
 * 본문은 다음 제목(깊이와 상관없이) 앞에서 끝난다. 액션 상자와 굴림 표가 모두 절
 * 앞머리에 오기 때문에, 이렇게 잘라 두면 액션에 딸리지 않은 글을 섞어 들이지 않는다.
 */
function parseSections(lines: readonly string[], headings: readonly Heading[]): Section[] {
  const sections: Section[] = [];
  for (let index = 0; index < headings.length; index += 1) {
    const heading = headings[index];
    if (!heading) continue;

    const end = headings[index + 1]?.line ?? lines.length;
    let outerEnd = lines.length;
    for (const next of headings.slice(index + 1)) {
      if (next.depth <= heading.depth) {
        outerEnd = next.line;
        break;
      }
    }

    sections.push({ heading, body: lines.slice(heading.line + 1, end), end, outerEnd });
  }
  return sections;
}

/**
 * `> - ` 글머리 줄을 앞 문단에 붙이고, 나머지는 문단으로 나눈다.
 *
 * 빈 `>` 줄이 문단의 경계다. 그 줄로 나뉘지 않고 붙어 있는 줄은 한 문단의 이어짐으로
 * 보고 이어 붙인다(영어 원고는 문단을 여러 줄로 감아 두기도 한다).
 */
function parseQuote(quote: readonly string[]): { text: string; bullets: string[] }[] {
  const paragraphs: { text: string; bullets: string[] }[] = [];
  let afterBreak = true;

  for (const raw of quote) {
    const line = raw.replace(/^>\s?/, '').trim();

    if (line.length === 0) {
      afterBreak = true;
      continue;
    }

    if (line.startsWith('- ')) {
      paragraphs[paragraphs.length - 1]?.bullets.push(line.slice(2).trim());
      afterBreak = false;
      continue;
    }

    const current = paragraphs[paragraphs.length - 1];
    if (current && !afterBreak && current.bullets.length === 0) {
      current.text = `${current.text} ${line}`;
      continue;
    }

    paragraphs.push({ text: line, bullets: [] });
    afterBreak = false;
  }

  return paragraphs;
}

function splitRow(line: string): string[] {
  return line
    .replace(/^\|/, '')
    .replace(/\|$/, '')
    .split('|')
    .map((cell) => cell.trim());
}

function isDivider(line: string): boolean {
  return /^\|[\s|:-]+\|$/.test(line);
}

/** 절 본문에서 첫 번째 마크다운 표를 옮긴다. */
function parseTable(body: readonly string[]): IronswornMoveTable | undefined {
  const start = body.findIndex((line) => line.startsWith('|'));
  if (start < 0) return undefined;

  const lines = body.slice(start).filter((line) => line.startsWith('|'));
  const header = lines[0];
  if (header === undefined) return undefined;

  return {
    columns: splitRow(header),
    rows: lines
      .slice(1)
      .filter((line) => !isDivider(line))
      .map((line) => splitRow(line)),
  };
}

function blockKind(text: string, index: number, hasBullets: boolean): IronswornMoveBlockKind {
  if (text.startsWith('**강타**')) return 'strong';
  if (text.startsWith('**약타**')) return 'weak';
  if (text.startsWith('**실패**')) return 'miss';
  // 짧은 줄이 글머리 목록을 거느리면 문단이 아니라 묶음 이름이다(머물기의 「회복하기」).
  if (hasBullets && text.length <= 14 && !/[.!?…]$/.test(text)) return 'label';
  return index === 0 ? 'trigger' : 'note';
}

/** 액션 이름에서 화면 안에서 쓰는 주소를 만든다. */
function slugify(title: string): string {
  return title
    .toLowerCase()
    .replace(/\(.*?\)/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

/** 절 아래 `####` 하위 절을 모은다. */
function childrenOf(sections: readonly Section[], parent: Section): Section[] {
  return sections.filter(
    (section) =>
      section.heading.depth === 4 &&
      section.heading.line > parent.heading.line &&
      section.heading.line < parent.outerEnd,
  );
}

/** 액션 상자 밖에 있는 절을 시트 끝의 덧붙임으로 옮긴다. */
function buildExtra(
  section: Section,
  titleEn: string,
  koChildren: readonly Section[],
  enChildren: readonly Section[],
): IronswornMoveExtra {
  const items = koChildren.map((child, index) => {
    const removePageRef = (title: string) => title.replace(/\s*\(.*?\)\s*$/, '');
    const text = child.body.find((line) => line.trim().length > 0)?.trim() ?? '';
    const labelEn = removePageRef(enChildren[index]?.heading.title ?? '');
    return {
      label: removePageRef(child.heading.title),
      ...(labelEn ? { labelEn } : {}),
      text,
    };
  });

  return { title: section.heading.title, titleEn, items };
}

/** 원고 맨 앞 제목 아래의 첫 문단을 시트 머리말로 쓴다. */
function firstParagraph(sections: readonly Section[]): string {
  const first = sections[0];
  if (!first) return '';
  for (const line of first.body) {
    const text = line.trim();
    if (text.length === 0) break;
    if (text.startsWith('#') || text.startsWith('>') || text.startsWith('-')) continue;
    return text;
  }
  return '';
}

/** 원고 한 쌍을 액션 레퍼런스 한 장으로 옮긴다. */
export function buildMoveSheet(source: MoveSheetSource): IronswornMoveSheet {
  const koLines = source.ko.split('\n');
  const enLines = source.en.split('\n');

  const koSections = parseSections(koLines, parseHeadings(koLines));
  const enSections = parseSections(enLines, parseHeadings(enLines));

  const koMoves = koSections.filter((section) => section.heading.depth === 3);
  const enMoves = enSections.filter((section) => section.heading.depth === 3);

  const moves: IronswornMove[] = [];
  let extra: IronswornMoveExtra | undefined;

  koMoves.forEach((section, index) => {
    const counterpart = enMoves[index];
    const quote = section.body.filter((line) => line.startsWith('>'));

    // 상자가 없는 절은 액션이 아니다. 전투 액션의 「싸움 중의 다른 액션」만 덧붙임으로 쓴다.
    if (quote.length === 0) {
      if (source.extraTitle && section.heading.title === source.extraTitle && counterpart) {
        extra = buildExtra(
          section,
          counterpart.heading.title,
          childrenOf(koSections, section),
          childrenOf(enSections, counterpart),
        );
      }
      return;
    }

    let tag: string | undefined;
    const blocks: IronswornMoveBlock[] = [];

    for (const paragraph of parseQuote(quote)) {
      // 상자 맨 앞의 짧은 줄은 액션에 붙는 꼬리표다(진행 액션).
      if (tag === undefined && blocks.length === 0 && TAG_EN[paragraph.text]) {
        tag = paragraph.text;
        continue;
      }
      blocks.push({
        kind: blockKind(paragraph.text, blocks.length, paragraph.bullets.length > 0),
        text: paragraph.text,
        ...(paragraph.bullets.length > 0 ? { bullets: paragraph.bullets } : {}),
      });
    }

    const table = parseTable(section.body);
    moves.push({
      slug: slugify(counterpart?.heading.title ?? section.heading.title),
      title: section.heading.title,
      titleEn: counterpart?.heading.title ?? '',
      ...(tag ? { tag, tagEn: TAG_EN[tag] ?? '' } : {}),
      blocks,
      ...(table ? { table } : {}),
    });
  });

  return {
    slug: source.slug,
    title: source.title,
    titleEn: source.titleEn,
    note: firstParagraph(koSections),
    moves,
    ...(extra ? { extra } : {}),
  };
}
