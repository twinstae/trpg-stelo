// 던전월드 2 Beta v2.1 원문 분할 + 대역(data) 원고 생성 도구
//
//   bun scripts/dw2-split-beta.mjs
//
// 하는 일:
//  1. "Dungeon World 2 Beta v2.1.md"를 장 경계(아래 RANGES)로 잘라
//     `src/data/dw2/en/<slug>.md` 로 쓴다.
//  2. 헤딩의 `{#anchor}`를 `<a id="anchor"></a>`로 바꿔 넣는다.
//     (한글 헤딩으로 번역해도 문서 내 링크가 깨지지 않게 하는 장치)
//  3. `](#anchor)` 링크를 같은 파일이면 그대로, 다른 장이면 `/ko/awe/dw2/<장>#anchor` 로 재작성한다.
//  4. 이미 번역된 페이지(`src/pages/ko/awe/dw2/<slug>.md`)가 있으면 frontmatter를 떼고
//     `src/data/dw2/ko/<slug>.md` 로 옮긴다(번역이 끝난 장만).
//  5. 장 대제목(#)은 대역 페이지 머리말이 대신하므로 양쪽 원고 모두 앵커만 남긴다.
//  6. 줄 커버리지·앵커 중복·미매칭 링크를 검사해 보고한다.

import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";

const ROOT = new URL("../", import.meta.url).pathname;
const SRC = ROOT + "Dungeon World 2 Beta v2.1.md";
const EN_DIR = ROOT + "src/data/dw2/en/";
const KO_DIR = ROOT + "src/data/dw2/ko/";
const PAGE_DIR = ROOT + "src/pages/ko/awe/dw2/";
const BASE_URL = "/ko/awe/dw2/";

// start/end는 1-indexed 포함 범위. chapters.ts와 순서가 같아야 한다.
const RANGES = [
  { file: "00-front-matter", start: 1, end: 122 },
  { file: "introduction", start: 123, end: 241 },
  { file: "playing-the-game", start: 242, end: 336 },
  { file: "session-zero", start: 337, end: 393 },
  { file: "moves-crash-course", start: 394, end: 452 },
  { file: "character-creation", start: 453, end: 639 },
  { file: "core-moves", start: 640, end: 752 },
  { file: "extra-moves", start: 753, end: 817 },
  { file: "the-barbarian", start: 818, end: 1002 },
  { file: "the-bard", start: 1003, end: 1187 },
  { file: "the-cleric", start: 1188, end: 1380 },
  { file: "the-fighter", start: 1381, end: 1563 },
  { file: "the-rogue", start: 1564, end: 1748 },
  { file: "the-wizard", start: 1749, end: 1930 },
  { file: "behind-the-screen", start: 1931, end: 1972 },
  { file: "agenda-and-principles", start: 1973, end: 2059 },
  { file: "gm-moves", start: 2060, end: 2159 },
  { file: "preparing-a-session", start: 2160, end: 2342 },
  { file: "major-npcs", start: 2343, end: 2476 },
  { file: "npc-traits", start: 2477, end: 2598 },
  { file: "threats", start: 2599, end: 2687 },
  { file: "magic-items", start: 2688, end: 2714 },
  { file: "example-magic-items", start: 2715, end: 3101 },
  { file: "campaign-moves", start: 3102, end: 3138 },
  { file: "bonds", start: 3139, end: 3200 },
  { file: "struggles", start: 3201, end: 3233 },
  { file: "example-struggles", start: 3234, end: 3389 },
  { file: "treasure-and-wealth", start: 3390, end: 3437 },
  { file: "the-stolen-children", start: 3438, end: 3655 },
];

const source = readFileSync(SRC, "utf8");
const lines = source.split("\n");
const lineCount = source.endsWith("\n") ? lines.length - 1 : lines.length;

const problems = [];

// --- 1. 범위 검사 ---------------------------------------------------------
let cursor = 1;
for (const r of RANGES) {
  if (r.start !== cursor) problems.push(`범위 구멍/겹침: ${r.file} 이 ${cursor}에서 시작해야 하는데 ${r.start}`);
  cursor = r.end + 1;
}
// 마지막 범위가 원문보다 길면(원문이 짧아진 경우) 문제가 아니라 알림으로만 다룬다.
if (cursor - 1 < lineCount) problems.push(`마지막 범위가 ${cursor - 1}에서 끝나는데 원문은 ${lineCount}줄 — 뒤가 잘렸습니다`);
else if (cursor - 1 > lineCount) console.log(`알림: 마지막 범위 끝(${cursor - 1})이 원문 줄 수(${lineCount})보다 큽니다 — 원문이 줄어든 것으로 보입니다, 장 분할 범위(RANGES)를 확인하십시오`);

const fileOfLine = (n) => RANGES.find((r) => n >= r.start && n <= r.end)?.file;

// --- 2. 헤딩 앵커 수집 ---------------------------------------------------
// 헤딩, 그리고 목록 항목 안의 헤딩(`- [x] #### 이름 {#id}`) 둘 다 지원한다.
const ANCHOR_RE = /^(\s*(?:[-*+]\s+)?(?:\[[ xX]\]\s*)?(#{1,6})\s+)(.*?)\s*\{#([^}]+)\}\s*$/;
const hasAnchorMarker = (line) => /\{#([^}]+)\}\s*$/.test(line);
const anchorToFile = new Map();
for (let i = 0; i < lineCount; i++) {
  if (!hasAnchorMarker(lines[i])) continue;
  const m = lines[i].match(ANCHOR_RE);
  if (!m) {
    problems.push(`앵커를 헤딩으로 해석하지 못함 (${i + 1}행): ${lines[i].slice(0, 80)}`);
    continue;
  }
  const id = m[4];
  const file = fileOfLine(i + 1);
  if (anchorToFile.has(id)) problems.push(`앵커 중복: #${id} (${anchorToFile.get(id)}, ${file})`);
  anchorToFile.set(id, file);
}
const unescape = (s) => s.replace(/\\(.)/g, "$1");

// --- 2.5 레이아웃 정리 --------------------------------------------------
// 원문은 Word 문서를 Markdown으로 바꾼 것이라, 무브 본문을 1열 표 껍데기
// (`| … |` + `| :---- |`)로 감싸 두었고, 셀 안에 있던 여러 줄(무브 이름·선택지·
// 굴림 결과·체크 항목)을 한 줄로 눌러 버렸다. 그대로 두면 영어 쪽만 회색 표로
// 렌더되거나(고치기 전) 무브 하나가 통째로 한 문단이 된다. 셀 안에 남은 단서로
// 줄 구조를 되살린다. 구분선이 두 열 이상인 진짜 표(피해 주사위·마법 아이템
// 예시·재물 등)는 건드리지 않는다.
//
//   🟎/✦/✶ + `On a 10+,`  … 진짜 굴림 결과 → `* **10+:** …` 목록 항목
//   🟎/✶ (굴림이 아니면)    … 문장 안 기호 → 지운다
//   ✦ (목록 기호일 때)      … `* …` 목록 항목
//   ☐/☑ `이름 (설명)` 3개 이상 … `- ☐ …` 목록 항목
//   `\+STR if you …` 선택지  … `* …` 목록 항목
//   `이름 (substance: …)` 2개 이상 … 문단 안 줄바꿈
//   `*선택지 —*`            … `* …` 목록 항목
//   `*이름*.` / `이름. When you …` … 새 문단 (무브·선택지 이름)
//
// 중간 표시(아래 PB·LB·IB)는 최종 원고에 남지 않는다.
const PB = "\u0001"; // 문단 나눔
const LB = "\u0002"; // 문단 안 줄바꿈(하드 브레이크)
const IB = "\u0003"; // 목록 항목

const SINGLE_COL_SEP_RE = /^\|\s*:?-{3,}:?\s*\|\s*$/;
let wrappersUnwrapped = 0;

const ROLL_R = "(?:[0-9]+\\s*[–-]\\s*[0-9]+\\+?|[0-9]+\\+|[0-9]+-)";
// 굴림 결과는 `On a 10+,`처럼 굴림 뒤에 쉼표·콜론이 온다. `🟎10+ list`나
// `🟎On a 12+ when you`처럼 구두점이 없으면 문장 안 기호다.
const ROLL_CUE_RE = new RegExp(`[ \\t]*[🟎✦✶][ \\t]*(?:On[ \\t]+a[ \\t]*)?(${ROLL_R})[ \\t]*[,:][ \\t]*`, "gu");
const DIAMOND_RE = /[ \t]*◆[ \t]*/gu;
const GLYPH_RE = /[🟎✶]/gu;
const OPTION_RE = /[ \t]+(?=\\\+[A-Z]{3}[ \t]+if[ \t]+you\b)/g;
// `*작은 한 쌍 —*`처럼 이탤릭 선택지 이름 뒤에 설명이 붙는 꼴.
const ITALIC_LABEL_RE = /[ \t]+(?=\*[^*\n]{1,45}—\*)/g;
// `*Spit in Death's Face*.` 뒤에는 그 선택지의 설명이 이어진다.
// 굵은 글씨를 닫는 `**`(예: `**Cast a Spell**.`)를 이탤릭으로 오해하지 않게 앞 별을 배제한다.
const ITALIC_ITEM_END_RE = /(?<!\*)(\*\.[ \t]+)(?=[A-Z])/g;
const STEP_RE = /[ \t]+(?=(?:Then|Finally|Next|Lastly),)/g;
// 무브 이름은 `이름. When you …` 꼴로 문장이 시작된다. Word 원본에서는 이름이
// 굵게(+체크 상자) 잡혀 있었는데 변환기가 놓쳤다 — 굵기와 문단만 되살린다.
// 앞이 문장 끝일 때만 자른다 — `the GM makes a Move. If …` 같은 문장은 건드리지 않는다.
// 체크 상자 뒤에 오는 이름(`☐ Ward Words of Wisdom. Once per …`)도 있다.
const MOVE_TRIGGER_SRC =
  "(?:When|Once|Each|While|If|After|Until|Either|On|You|Anyone|Any|Sometimes|Choose|Roll|Say|Ask)\\b";
const MOVE_NAME_SRC = "((?:[A-Z][A-Za-z'’-]*(?:[ \\t]+(?:[a-z]{1,3}|&|[A-Z][A-Za-z'’-]*)){0,4})\\.)";
const MOVE_NAME_RE = new RegExp(`(?<=[.!?:☐☑])[ \\t]+${MOVE_NAME_SRC}(?=[ \\t]+${MOVE_TRIGGER_SRC})`, "g");
// 표 셀 맨 앞에서 시작하는 첫 무브 이름(`Back to Back. When you …`).
const MOVE_NAME_START_RE = new RegExp(`^${MOVE_NAME_SRC}(?=[ \\t]+${MOVE_TRIGGER_SRC})`);
// 한국어는 번역할 때 무브·선택지 이름을 `**이름.**`으로 굵게 적어 두었다.
const KO_MOVE_NAME_RE = /(?<=[.!?)\u2019"\u201d])[ \t]+(?=\*\*[^*\n]{1,40}\.\*\*)/g;
// 괄호 안 설명. `\(`처럼 이스케이프된 괄호와 링크 주소의 괄호는 먼저 감춰 두므로
// (maskLinks) 괄호·이스케이프 문자만 피하면 된다.
const PAREN_BAL = "(?:\\\\.|[^()\\\\])*";
// 설명을 닫는 괄호가 `\)`처럼 이스케이프된 곳도 있다(`increase dmg by 1\)`).
const PAREN_CLOSE = "\\\\?\\)";
const BALLOT_ITEM_RE = new RegExp(`([☐☑][ \\t]*(?:\\*[^*\\n]+\\*|[^\\s(]+)[ \\t]*\\(${PAREN_BAL}${PAREN_CLOSE})`, "g");
const SUBSTANCE_ITEM_RE = new RegExp(`([A-Z][a-z]+[ \\t]*\\(substance:${PAREN_BAL}\\))`, "g");

// Markdown 링크 주소(`](#anchor-\(x\)`)에는 진짜 괄호가 섞여 있어 항목 경계 판단을
// 흔든다. 규칙을 돌리는 동안만 감추고 마지막에 되돌린다.
const LINK_DEST_RE = /\]\(#(?:\\.|[^)\\])*\)/g;
const MASK = "\u0004";
let maskedLinks = [];
const maskLinks = (s) => s.replace(LINK_DEST_RE, (m) => `${MASK}${maskedLinks.push(m) - 1}${MASK}`);
const unmaskLinks = (s) => s.replace(/\u0004(\d+)\u0004/g, (_m, i) => maskedLinks[+i]);

/** 사이에 PB·LB·IB 말고 다른 글자가 없으면 같은 목록 묶음으로 본다. */
const spaceOnlyBetween = (sep) => sep.replace(/[\u0001\u0002\u0003]/g, "").trim() === "";

/** `이름 (설명)` 꼴 항목이 minCount개 이상 이어지면 각각 목록 항목으로 띄운다. */
function splitItemRuns(s, re, minCount, prefix, join) {
  const matches = [...s.matchAll(re)];
  if (!matches.length) return s;
  const groups = [];
  let cur = [];
  for (const m of matches) {
    const prevEnd = cur.length ? cur[cur.length - 1].index + cur[cur.length - 1][0].length : 0;
    if (cur.length && spaceOnlyBetween(s.slice(prevEnd, m.index))) cur.push(m);
    else {
      if (cur.length >= minCount) groups.push(cur);
      cur = [m];
    }
  }
  if (cur.length >= minCount) groups.push(cur);
  if (!groups.length) return s;
  let out = "";
  let last = 0;
  for (const g of groups) {
    const start = g[0].index;
    const end = g[g.length - 1].index + g[g.length - 1][0].length;
    const head = s.slice(last, start);
    // 이미 문단을 띄운 자리면 다시 띄우지 않는다(멱등).
    out += head + (head.endsWith(PB) ? "" : PB) + g.map((m) => prefix + m[1].trim()).join(join);
    last = end;
  }
  return out + s.slice(last);
}

/**
 * ✦는 목록 기호로도(PDF의 불릿), 문장 안 기호로도 쓰인다. 요소마다 첫 ✦ 앞 글자를
 * 보고 하나로 정한다 — 앞이 문장 끝이면 목록, 아니면(예: `Add ✦ *a* and ✦ *b*`)
 * 문장 안 기호라 지운다.
 */
function markStarBullets(s) {
  if (!s.includes("✦")) return s;
  const first = s.indexOf("✦");
  // ✦ 바로 앞에는 공백이 온다. 실제 앞 글자를 보려면 공백을 건너뛰어야 한다.
  const before = s.slice(0, first).replace(/[ \t]+$/, "").slice(-1);
  if (before && !".!?:*".includes(before)) return s.replace(/[ \t]*✦[ \t]*/gu, " ");
  let out = s.replace(/[ \t]*✦[ \t]*/gu, `${IB}* `);
  // 첫 항목도 같은 목록이다. 콜론으로 끝나는 도입 문장(`… following Skills: ✦ a ✦ b`)은 문단으로 남긴다.
  const head = out.slice(0, out.indexOf(IB)).trim();
  if (head && !head.endsWith(":")) out = `${IB}* ${out}`;
  return out;
}

/** 이탤릭 선택지 이름(`*작은 한 쌍 —*`)을 목록 항목으로 띄운다. */
function markItalicLabels(s) {
  return s.replace(ITALIC_LABEL_RE, (m, offset) => {
    // 이미 목록 기호 뒤에 온 것이면(`* *작은 한 쌍 —* …`) 그대로 둔다.
    const before = s.slice(0, offset).replace(/[ \t]+$/, "");
    return /(?:^|[\u0001\u0002\u0003])[-*+]$/.test(before) ? m : `${IB}* `;
  });
}

/** PB·LB·IB 표시를 실제 Markdown 줄로 바꾼다. */
function assembleBlocks(marked, fromCell) {
  const parts = marked.split(/([\u0001\u0002\u0003])/);
  const blocks = [];
  let cur = null;
  const flush = () => {
    if (cur) blocks.push(cur);
    cur = null;
  };
  let prev = null;
  for (let i = 0; i < parts.length; i++) {
    if (i % 2 === 1) {
      prev = parts[i];
      continue;
    }
    // 셀 안은 줄바꿈 자리가 사라지며 공백이 겹친 곳이 많다.
    const text = (fromCell ? parts[i].replace(/[ \t]{2,}/g, " ") : parts[i]).trim();
    if (!text) continue;
    if (prev === IB) {
      if (cur?.list) cur.lines.push(text);
      else {
        flush();
        cur = { list: true, lines: [text] };
      }
    } else if (prev === PB || !cur) {
      flush();
      cur = { list: false, lines: [text] };
    } else if (prev === LB) {
      if (cur.list) {
        flush();
        cur = { list: false, lines: [text] };
      } else cur.lines.push(text);
    } else cur.lines.push(text);
    prev = parts[i];
  }
  flush();
  // 블록 사이는 빈 줄로 띄운다. 목록과 문단이 붙어 있으면 Markdown이 문단을 목록 항목으로 삼킨다.
  const out = [];
  for (const b of blocks) {
    if (out.length) out.push("");
    out.push(b.list ? b.lines.join("\n") : b.lines.join("  \\\n"));
  }
  return out;
}

/** 한 요소(원문 한 줄, 또는 1열 표 셀 하나)를 Markdown 줄 여러 개로 편다. */
function layoutElement(line, lang, fromCell) {
  if (!line.trim()) return [line];
  maskedLinks = [];
  let s = maskLinks(line.replace(/\u200b/g, "").replace(/\r/g, ""));
  s = s.replace(ROLL_CUE_RE, (_m, roll) => `${IB}* **${dashOf(roll)}:** `);
  s = s.replace(/\u000b/g, PB); // Word의 줄바꿈(세로 탭)
  s = s.replace(DIAMOND_RE, `${IB}  - `);
  s = splitItemRuns(s, SUBSTANCE_ITEM_RE, 2, LB, "");
  s = s.replace(OPTION_RE, `${IB}* `);
  s = splitItemRuns(s, BALLOT_ITEM_RE, 3, `${IB}- `, "");
  s = markStarBullets(s);
  s = s.replace(GLYPH_RE, "");
  s = markItalicLabels(s);
  s = s.replace(ITALIC_ITEM_END_RE, `$1${PB}`);
  s = s.replace(STEP_RE, PB);
  if (lang === "ko") s = s.replace(KO_MOVE_NAME_RE, PB);
  else {
    s = s.replace(MOVE_NAME_RE, `${PB}**$1**`);
    if (fromCell) s = s.replace(MOVE_NAME_START_RE, "**$1**");
  }
  s = unmaskLinks(s);
  // 나눌 단서가 없는 줄은 그대로 둔다 — 표·시트처럼 탭과 띄어쓰기가 뜻을 지니는 줄을 건드리지 않는다.
  if (!fromCell && !/[\u0001\u0002\u0003]/.test(s)) return [s];
  return assembleBlocks(s, fromCell);
}

// --- 3. 링크 재작성 ------------------------------------------------------
const escAttr = (s) => s.replace(/&/g, "&amp;").replace(/"/g, "&quot;");
const unmatched = new Map();
let linksRewritten = 0;
let anchorsKept = 0;
let headingsDropped = 0;
let sheetRowsDemoted = 0;
let taskItemsConverted = 0;
let listHeadingsFixed = 0;

function rewriteLinks(text, currentFile) {
  let out = "";
  let i = 0;
  for (;;) {
    const idx = text.indexOf("](#", i);
    if (idx === -1) {
      out += text.slice(i);
      return out;
    }
    out += text.slice(i, idx);
    let j = idx + 3; // '#' 다음
    while (j < text.length) {
      const c = text[j];
      if (c === "\\") { j += 2; continue; }
      if (c === ")") break;
      j++;
    }
    // raw = 마크다운에 그대로 쓸 형태(이스케이프 유지), target = 앵커 조회용
    const raw = text.slice(idx + 3, j);
    const target = unescape(raw);
    const targetFile = anchorToFile.get(target);
    if (targetFile === currentFile) {
      out += `](#${raw})`;
    } else if (targetFile) {
      out += `](${BASE_URL}${targetFile}#${raw})`;
      linksRewritten++;
    } else {
      out += `](#${raw})`;
      unmatched.set(target, (unmatched.get(target) ?? 0) + 1);
    }
    i = j + 1;
  }
}

// 캐릭터 시트의 칸(관계·이름·HP·경험치)은 헤딩이 아니라 시트 줄이다.
// ###로 두면 우측 목차에 "HP 근력 민첩성 …" 같은 항목이 생기므로 헤딩에서 내린다.
// 캐릭터 시트의 칸(관계·이름·HP·경험치)은 헤딩이 아니라 시트 줄이다.
// ###로 두면 우측 목차에 "HP 근력 민첩성 …" 같은 항목이 생기므로 헤딩에서 내린다.
// 단 `### HP` 같은 진짜 소제목을 잡지 않도록 시트 줄의 열 구조까지 확인한다.
// (한글은 \w가 아니라 \b가 서지 않으므로 뒤를 직접 확인한다)
const SHEET_ROW_RE =
  /^#{3}\s+(?:Relationships\s+\S|Name \(pro\/nouns\)|HP\s+STR|XP(?=[\s—–:]|$)|관계\s+\S|이름\(대명사\)|경험치(?=[\s—–:]|$))/;

// `- [x] #### 이동 {#id}` 형태의 무브 — 체크박스를 헤딩 기호로 바꾸고 진짜 헤딩으로 만든다.
const TASK_HEADING_ANCHOR_RE = /^(\s*)-\s*\[([ xX])\]\s+(#{2,6})\s+(.*?)\s*\{#([^}]+)\}\s*$/;
const TASK_HEADING_RE = /^(\s*)-\s*\[([ xX])\]\s+(#{2,6})\s+(.*)$/;
// 장비 목록 등 일반 체크 항목은 ☐/☑ 문자로(네이티브 체크박스 대신).
const TASK_ITEM_RE = /^(\s*)-\s*\[([ xX])\]\s+(.*)$/;
// 목록 기호가 붙은 헤딩(`* #### 제목`, `- [ ] #### 제목 {#id}`).
const LIST_HEADING_RE = /^(\s*)[-*+]\s+(#{1,6})\s+(.*?)(?:\s*\{#([^}]+)\})?\s*$/;

const mark = (state) => (state.toLowerCase() === "x" ? "☑" : "☐");

function convertLine(line) {
  const taskHeadingAnchor = line.match(TASK_HEADING_ANCHOR_RE);
  if (taskHeadingAnchor) {
    const [, , state, hashes, text, id] = taskHeadingAnchor;
    anchorsKept++;
    return `${hashes} ${mark(state)} <a id="${escAttr(id)}"></a>${text}`;
  }

  const taskHeading = line.match(TASK_HEADING_RE);
  if (taskHeading) {
    const [, , state, hashes, text] = taskHeading;
    return `${hashes} ${mark(state)} ${text}`;
  }

  const m = line.match(ANCHOR_RE);
  if (m) {
    const [, prefix, hashes, text, id] = m;
    anchorsKept++;
    // 장 대제목(h1)은 대역 페이지 머리말이 대신한다 — 앵커만 남긴다.
    if (hashes === "#") {
      headingsDropped++;
      return `<a id="${escAttr(id)}"></a>`;
    }
    return `${prefix}<a id="${escAttr(id)}"></a>${text}`;
  }

  const taskItem = line.match(TASK_ITEM_RE);
  if (taskItem) {
    const [, indent, state, text] = taskItem;
    taskItemsConverted++;
    return `${indent}- ${mark(state)} ${text}`;
  }

  // `* #### 제목` 처럼 목록 기호가 붙은 헤딩 — 기호를 떼고 진짜 헤딩으로 만든다.
  const listHeading = line.match(LIST_HEADING_RE);
  if (listHeading) {
    const [, , hashes, text, id] = listHeading;
    if (id) {
      anchorsKept++;
      return `${hashes} <a id="${escAttr(id)}"></a>${text}`;
    }
    listHeadingsFixed++;
    return `${hashes} ${text}`;
  }

  if (SHEET_ROW_RE.test(line)) {
    sheetRowsDemoted++;
    return line.replace(/^#{3}\s+/, "").replace(/[ \t]{2,}/g, " ").trim();
  }

  return line;
}

// --- 2.6 굴림 결과·태그 표기 통일 ---------------------------------------
// 원문은 굴림 결과를 `🟎On a 10+, …`(가끔 ✶)처럼 기호로 붙여 두고,
// 번역은 `**🟎10+** 이면 …`처럼 또 다른 모양으로 적었다. 둘을 같은 모양으로 맞춘다.
//   줄 첫머리·문장 경계 → `* **10+:** …` 목록 항목
//   문장 중간        → 기호만 제거 (한국어 `10+이면 …`, 영어 `On a 10+, …`)
const ROLL_SRC = "[0-9]+\\s*[–-]\\s*[0-9]+\\+?|[0-9]+\\+|[0-9]+-";
const MARK_SRC = "[🟎✦✶✴]";
// 한국어 `**🟎10+** 이면 …`와 영어 `🟎On a 10+, …`를 같은 임시 토큰으로 바꾼다.
// (🟎는 서로게이트 쌍이라 정규식에 u 플래그가 필요하다)
const rollToken = new RegExp(
  `\\*{0,2}${MARK_SRC}\\s*(?:On a\\s*)?\\*{0,2}(${ROLL_SRC})\\*{0,2}\\s*[,:]?\\s*(?:이면)?\\s*`,
  "gu",
);
const TOKEN = "\u0000";
// `6-`은 “6 이하”라는 뜻이라 en dash로 바뀌면 안 된다.
const dashOf = (r) => r.replace(/^([0-9]+)\s*[–-]\s*([0-9]+)(\+?)$/, "$1–$2$3");
let rollsNormalized = 0;

function normalizeRolls(line, lang) {
  if (!/[🟎✦✶✴]/u.test(line)) return line;
  let s = line.replace(rollToken, (_m, roll) => {
    rollsNormalized++;
    return `${TOKEN}${dashOf(roll)}${TOKEN}`;
  });
  const token = `(${ROLL_SRC})`;
  // 1) 줄 첫머리 — 이미 목록 기호가 있으면 그것을 살린다.
  //    (한 요소 안에 줄바꿈이 여럿 있을 수 있으므로 m 플래그)
  //    (한 요소 안에 줄바꿈이 여럿 있을 수 있으므로 g+m 플래그 — 줄마다 적용)
  s = s.replace(new RegExp(`^(\\s*(?:[-*+]\\s+)?)${TOKEN}${token}${TOKEN}`, "gm"), (_m, prefix, roll) =>
    /[-*+]\s+$/.test(prefix) ? `${prefix}**${roll}:** ` : `${prefix}* **${roll}:** `,
  );
  // 2) 문장이 끝난 자리 — 별도 목록 항목으로 뗀다.
  s = s.replace(new RegExp(`([.?!])\\s*${TOKEN}${token}${TOKEN}`, "gm"), (_m, end, roll) => `${end}\n* **${roll}:** `);
  // 3) 남은 것은 문장 중간 — 마커만 뗀다.
  s = s.replace(new RegExp(`${TOKEN}${token}${TOKEN}`, "g"), (_m, roll) =>
    lang === "ko" ? `${roll}이면 ` : `On a ${roll}, `,
  );
  // 혹시 남은 임시 토큰은 지운다(파일에 제어문자가 새어 나가지 않게).
  return s.replace(/\u0000/g, "");
}

/** 한국어 원고의 맨 `#태그`도 코드 칩으로 맞춘다(이미 칩인 곳은 그대로). */
function codeTags(s) {
  return s.replace(/\\+#([가-힣a-z][가-힣a-z-]*)/g, "`#$1`");
}

// 번호 목록 항목 바로 뒤에 들여쓰기 없이 온 목록 기호는 그 항목의 하위 목록으로 본다.
// 그대로 두면 목록이 끊겨 `<ol>…(끝)</ol><ul>…</ul><ol start="6">`처럼 쪼개지고
// (진행 순서 흐름도가 그렇다) 한국어 번역의 중첩 목록과 모양이 달라진다.
function nestSublists(bodyLines) {
  const out = [];
  let inSublist = false;
  for (const line of bodyLines) {
    if (/^\d+\.\s/.test(line)) {
      inSublist = false;
      out.push(line);
      continue;
    }
    if (/^[-*+]\s/.test(line) && (inSublist || /^\d+\.\s/.test(out[out.length - 1] ?? ""))) {
      inSublist = true;
      out.push("   " + line);
      continue;
    }
    inSublist = false;
    out.push(line);
  }
  return out;
}

/** 원문 줄들을 레이아웃 정리 → 헤딩·체크 변환 → 굴림 표기 통일 순으로 다듬는다. */
function convertBody(bodyLines, lang) {
  const expanded = [];
  for (let i = 0; i < bodyLines.length; i++) {
    const line = codeTags(bodyLines[i]);
    // 1열 표 껍데기면 셀 내용을 꺼내 줄 구조를 되살리고, 구분선은 버린다.
    if (/^\|/.test(line) && SINGLE_COL_SEP_RE.test(bodyLines[i + 1] ?? "")) {
      const inner = line.trim().replace(/^\|/, "").replace(/\|$/, "");
      expanded.push(...layoutElement(inner, lang, true));
      wrappersUnwrapped++;
      i++;
      continue;
    }
    expanded.push(...layoutElement(line, lang, false));
  }
  return nestSublists(expanded.map(convertLine).map((line) => normalizeRolls(line, lang)));
}

// --- 4. 영어 원고 쓰기 ---------------------------------------------------
mkdirSync(EN_DIR, { recursive: true });
mkdirSync(KO_DIR, { recursive: true });

const report = [];
const koFixed = [];
for (const r of RANGES) {
  const body = lines.slice(r.start - 1, r.end);
  while (body.length && body[0].trim() === "") body.shift();
  while (body.length && body[body.length - 1].trim() === "") body.pop();

  const en = rewriteLinks(convertBody(body, "en").join("\n"), r.file);
  writeFileSync(EN_DIR + r.file + ".md", en + "\n");

  // 한국어 원고도 같은 규칙으로 다듬는다(멱등: 이미 다듬은 줄은 그대로).
  const koDataPathExisting = KO_DIR + r.file + ".md";
  if (existsSync(koDataPathExisting)) {
    const before = readFileSync(koDataPathExisting, "utf8");
    const after = convertBody(before.split("\n"), "ko").join("\n");
    if (after !== before) {
      writeFileSync(koDataPathExisting, after);
      koFixed.push(r.file);
    }
  }

  // --- 5. 한국어 원고 옮기기(data/ko 가 없고, 번역된 페이지가 있을 때만) ---
  const koDataPath = KO_DIR + r.file + ".md";
  const pagePath = PAGE_DIR + r.file + ".md";
  let koStatus = existsSync(koDataPath) ? "번역(유지)" : "—";
  if (!existsSync(koDataPath) && existsSync(pagePath)) {
    const page = readFileSync(pagePath, "utf8");
    const bodyStart = page.indexOf("---", 10);
    let pageBody = bodyStart === -1 ? page : page.slice(bodyStart + 3);
    pageBody = pageBody.replace(/<!--\s*split from[\s\S]*?-->\s*/, "").trim();
    if (/[가-힣]/.test(pageBody)) {
      writeFileSync(KO_DIR + r.file + ".md", pageBody + "\n");
      koStatus = "번역";
    } else {
      koStatus = "미번역(영문 페이지)";
    }
  }
  report.push({ file: r.file, lines: r.end - r.start + 1, koStatus });
}

// --- 6. 앵커 맵 저장 (감사·검사용) --------------------------------------
writeFileSync(
  ROOT + "scripts/dw2-beta-linkmap.json",
  JSON.stringify(
    {
      source: "Dungeon World 2 Beta v2.1.md",
      sourceLines: lineCount,
      anchorCount: anchorToFile.size,
      files: Object.fromEntries(RANGES.map((r) => [r.file, { start: r.start, end: r.end }])),
      anchors: Object.fromEntries([...anchorToFile.entries()].sort()),
    },
    null,
    2,
  ) + "\n",
);

// --- 7. 보고 -------------------------------------------------------------
console.log(`원문 ${lineCount}줄 → 영어 원고 ${RANGES.length}개 (src/data/dw2/en/)`);
console.log(`헤딩 앵커 ${anchorsKept}개 보존, 장 대제목 ${headingsDropped}개는 머리말로 이동, 장 간 링크 ${linksRewritten}개 재작성`);
console.log(`시트 줄 ${sheetRowsDemoted}개를 헤딩에서 내림, 체크 항목 ${taskItemsConverted}개를 ☐/☑로 변환, 목록 헤딩 ${listHeadingsFixed}개 정리`);
console.log(`무브를 감싼 1열 가짜 표 ${wrappersUnwrapped}개를 풀어 셀 안 줄 구조를 되살림`);
console.log(`굴림 결과 표기 ${rollsNormalized}개를 목록·문장으로 통일`);
if (koFixed.length) console.log(`한국어 원고 정규화: ${koFixed.join(", ")}`);
console.log("\n장별 상태:");
for (const r of report) console.log(`  ${r.file.padEnd(24)} ${String(r.lines).padStart(5)}줄  ${r.koStatus}`);
if (unmatched.size) {
  console.log(`\n⚠ 매칭 실패한 링크 대상 ${unmatched.size}종:`);
  for (const [t, n] of unmatched) console.log(`  #${t} (${n}회)`);
}
if (problems.length) {
  console.log(`\n⚠ 문제 ${problems.length}건:`);
  for (const p of problems) console.log("  " + p);
} else {
  console.log("\n✅ 범위·앵커 검사 통과");
}
