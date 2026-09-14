#!/usr/bin/env bun
/**
 * 철의 맹세(Ironsworn) 규칙서 → 영/한 대역 원고
 *
 *   bun scripts/ironsworn-extract-rulebook.mjs          # 영어 원고 재생성 + 검사
 *   bun scripts/ironsworn-extract-rulebook.mjs --refresh # pdftotext부터 다시
 *   bun scripts/ironsworn-extract-rulebook.mjs --toc     # 목차 구조만 출력
 *
 * 입출력
 *   Ironsworn-Rulebook.pdf                      원천(루트, git에 넣지 않는다)
 *   .freebuff/ironsworn-rulebook.html           pdftotext -bbox-layout 캐시
 *   scripts/ironsworn-extract-rulebook.mjs      장 경계(RANGES) — 이 파일이 기준
 *   src/data/ironsworn/en/<슬러그>.md            자동 생성. 손대지 않는다
 *   src/data/ironsworn/ko/<슬러그>.md            사람이 쓰는 번역. 이 스크립트는 건드리지 않는다
 *   src/data/ironsworn/chapters.ts              생성물(단위 목록·상태)
 *
 * 왜 -bbox-layout인가: 이 책은 문단 사이에 빈 줄이 없어서 -layout 텍스트만으로는 문단을
 * 가를 수 없다. -bbox-layout은 pdftotext가 잡아낸 <block>마다 좌표를 주는데, 그 block이
 * 곧 문단이다. 좌표가 있으면 들여쓴 무브 상자·측주·글머리 목록·오라클 표·2단 조판까지
 * 구분할 수 있다.
 *
 * 헤딩은 목차(CONTENTS)에서 만든 사전으로 복원한다 — 본문은 절 이름을 대문자로 찍기
 * 때문에 목차 없이는 깊이를 알 수 없다.
 */

import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve(import.meta.dir, "..");
const PDF_FILE = "Ironsworn-Rulebook.pdf";
const PDF_PATH = path.join(ROOT, PDF_FILE);
const CACHE_PATH = path.join(ROOT, ".freebuff", "ironsworn-rulebook.html");
const FRONT_CACHE_PATH = path.join(ROOT, ".freebuff", "ironsworn-front.txt");
const EN_DIR = path.join(ROOT, "src/data/ironsworn/en");
const KO_DIR = path.join(ROOT, "src/data/ironsworn/ko");
const CHAPTERS_FILE = path.join(ROOT, "src/data/ironsworn/chapters.ts");

/** 마지막 단위는 여기서 끝난다(색인은 원고에서 뺀다). */
const DOC_END = "INDEX";

/** 본문 왼쪽 여백에서 이만큼 오른쪽이면 들여쓴 상자(무브·측주·예시)로 본다. */
const BOX_OFFSET = 6;
/** 본문 왼쪽 여백에서 이만큼 오른쪽이면 옆단(오른쪽 칸)으로 본다. */
const COLUMN_OFFSET = 90;
/** 쪽 아래 이만큼은 꼬리글(쪽번호·러닝 헤드)로 본다. */
const FOOTER_MARGIN = 40;

const PARTS = {
  front: "머리말",
  basics: "1장 기초",
  character: "2장 캐릭터",
  moves: "3장 액션",
  world: "4장 세계",
  foes: "5장 적과 조우",
  oracles: "6장 오라클",
  depth: "7장 심화",
};

/**
 * 대역 단위. 문서 순서대로 적는다.
 *
 *   chapter: 이 단위가 속한 장(목차 1단계 제목, 대문자). 머리말은 null.
 *   from:    단위가 시작하는 절(목차 제목, 대소문자 무시). 머리말은 null.
 *   slug:    라우트·파일 이름. 겹치면 안 된다.
 *
 * 다음 단위의 from에서 끝난다. 경계를 찾지 못하거나 순서가 어긋나면 이 스크립트가 실패한다.
 * 절 하나가 여러 단위로 나뉠 때는 두 번째 단위의 from에 소절(3단계) 이름을 적는다.
 */
const RANGES = [
  { slug: "front-matter", titleEn: "Front Matter", titleKo: "머리말", part: PARTS.front, chapter: null, from: null },

  { slug: "playing-ironsworn", titleEn: "Playing Ironsworn", titleKo: "플레이하기", part: PARTS.basics, chapter: "THE BASICS", from: "PLAYING IRONSWORN" },
  { slug: "moves", titleEn: "Moves", titleKo: "액션", part: PARTS.basics, chapter: "THE BASICS", from: "MOVES" },
  { slug: "the-action-roll", titleEn: "The Action Roll", titleKo: "액션 판정", part: PARTS.basics, chapter: "THE BASICS", from: "THE ACTION ROLL" },
  { slug: "momentum", titleEn: "Momentum", titleKo: "모멘텀", part: PARTS.basics, chapter: "THE BASICS", from: "MOMENTUM" },
  { slug: "progress-tracks", titleEn: "Progress Tracks", titleKo: "진행 트랙", part: PARTS.basics, chapter: "THE BASICS", from: "PROGRESS TRACKS" },
  { slug: "harm-and-stress", titleEn: "Harm and Stress", titleKo: "피해와 스트레스", part: PARTS.basics, chapter: "THE BASICS", from: "HARM" },
  { slug: "assets-in-brief", titleEn: "Assets in Brief", titleKo: "애셋 개요", part: PARTS.basics, chapter: "THE BASICS", from: "ASSETS" },
  { slug: "oracles-in-brief", titleEn: "Oracles in Brief", titleKo: "오라클 개요", part: PARTS.basics, chapter: "THE BASICS", from: "ORACLES" },
  { slug: "bonds-and-allies", titleEn: "Bonds and Allies", titleKo: "유대와 동료", part: PARTS.basics, chapter: "THE BASICS", from: "BONDS" },
  { slug: "equipment", titleEn: "Equipment", titleKo: "장비", part: PARTS.basics, chapter: "THE BASICS", from: "EQUIPMENT" },
  { slug: "the-flow-of-play", titleEn: "The Flow of Play", titleKo: "플레이의 흐름", part: PARTS.basics, chapter: "THE BASICS", from: "THE FLOW OF PLAY" },

  { slug: "you-are-ironsworn", titleEn: "You Are Ironsworn", titleKo: "당신은 철의 맹세자", part: PARTS.character, chapter: "YOUR CHARACTER", from: "YOU ARE IRONSWORN" },
  { slug: "character-basics", titleEn: "Character Basics", titleKo: "캐릭터 기초", part: PARTS.character, chapter: "YOUR CHARACTER", from: "CHARACTER BASICS" },
  { slug: "vows-bonds-debilities", titleEn: "Vows, Bonds, and Debilities", titleKo: "맹세와 유대와 결점", part: PARTS.character, chapter: "YOUR CHARACTER", from: "VOWS" },
  { slug: "assets", titleEn: "Assets", titleKo: "애셋", part: PARTS.character, chapter: "YOUR CHARACTER", from: "ASSETS" },
  { slug: "experience-and-equipment", titleEn: "Experience and Equipment", titleKo: "경험과 장비", part: PARTS.character, chapter: "YOUR CHARACTER", from: "EXPERIENCE" },
  { slug: "becoming-ironsworn", titleEn: "Becoming Ironsworn", titleKo: "철의 맹세자가 되기", part: PARTS.character, chapter: "YOUR CHARACTER", from: "BECOMING IRONSWORN" },

  { slug: "making-moves", titleEn: "Making Moves", titleKo: "액션 만들기", part: PARTS.moves, chapter: "MOVES", from: "MAKING MOVES" },
  { slug: "initiative-and-glossary", titleEn: "Initiative and the Move Glossary", titleKo: "주도권과 용어집", part: PARTS.moves, chapter: "MOVES", from: "Initiative" },
  { slug: "adventure-moves", titleEn: "Adventure Moves", titleKo: "모험 액션", part: PARTS.moves, chapter: "MOVES", from: "ADVENTURE MOVES" },
  { slug: "relationship-moves", titleEn: "Relationship Moves", titleKo: "관계 액션", part: PARTS.moves, chapter: "MOVES", from: "RELATIONSHIP MOVES" },
  { slug: "combat-moves", titleEn: "Combat Moves", titleKo: "전투 액션", part: PARTS.moves, chapter: "MOVES", from: "COMBAT MOVES" },
  { slug: "suffer-moves", titleEn: "Suffer Moves", titleKo: "고난 액션", part: PARTS.moves, chapter: "MOVES", from: "SUFFER MOVES" },
  { slug: "quest-moves", titleEn: "Quest Moves", titleKo: "임무 액션", part: PARTS.moves, chapter: "MOVES", from: "QUEST MOVES" },
  { slug: "fate-moves", titleEn: "Fate Moves", titleKo: "운명 액션", part: PARTS.moves, chapter: "MOVES", from: "FATE MOVES" },

  { slug: "welcome-to-the-ironlands", titleEn: "Welcome to the Ironlands", titleKo: "철의 땅에 오신 것을 환영합니다", part: PARTS.world, chapter: "YOUR WORLD", from: "WELCOME TO THE IRONLANDS" },
  { slug: "regions-of-the-ironlands", titleEn: "Regions of the Ironlands", titleKo: "철의 땅의 지역", part: PARTS.world, chapter: "YOUR WORLD", from: "REGIONS OF THE IRONLANDS" },
  { slug: "your-truths", titleEn: "Your Truths", titleKo: "당신의 진실", part: PARTS.world, chapter: "YOUR WORLD", from: "YOUR TRUTHS" },
  { slug: "mapping-your-journeys", titleEn: "Mapping Your Journeys", titleKo: "여정 지도 그리기", part: PARTS.world, chapter: "YOUR WORLD", from: "MAPPING YOUR JOURNEYS" },

  { slug: "npcs-in-the-ironlands", titleEn: "NPCs in the Ironlands", titleKo: "철의 땅의 NPC", part: PARTS.foes, chapter: "FOES AND ENCOUNTERS", from: "NPCs IN THE IRONLANDS" },
  { slug: "ironlanders", titleEn: "Ironlanders", titleKo: "철의 땅 사람들", part: PARTS.foes, chapter: "FOES AND ENCOUNTERS", from: "IRONLANDERS" },
  { slug: "firstborn", titleEn: "Firstborn", titleKo: "선주민", part: PARTS.foes, chapter: "FOES AND ENCOUNTERS", from: "FIRSTBORN" },
  { slug: "animals", titleEn: "Animals", titleKo: "동물", part: PARTS.foes, chapter: "FOES AND ENCOUNTERS", from: "ANIMALS" },
  { slug: "beasts", titleEn: "Beasts", titleKo: "야수", part: PARTS.foes, chapter: "FOES AND ENCOUNTERS", from: "BEASTS" },
  { slug: "horrors", titleEn: "Horrors", titleKo: "공포", part: PARTS.foes, chapter: "FOES AND ENCOUNTERS", from: "HORRORS" },

  { slug: "seeking-inspiration", titleEn: "Seeking Inspiration", titleKo: "영감 구하기", part: PARTS.oracles, chapter: "ORACLES", from: "SEEKING INSPIRATION" },
  { slug: "oracles-in-play", titleEn: "Ironland Oracles", titleKo: "철의 땅 오라클", part: PARTS.oracles, chapter: "ORACLES", from: "IRONLAND ORACLES" },
  { slug: "oracles-action-to-trouble", titleEn: "Oracles 1–9: Action to Settlement Trouble", titleKo: "오라클 1–9: 행동에서 마을 문제까지", part: PARTS.oracles, chapter: "ORACLES", from: "Oracle 1: Action" },
  { slug: "oracles-role-to-rank", titleEn: "Oracles 10–19: Character Role to Challenge Rank", titleKo: "오라클 10–19: 인물 역할에서 도전 등급까지", part: PARTS.oracles, chapter: "ORACLES", from: "Oracle 10: Character Role" },
  { slug: "more-oracles", titleEn: "More Oracles", titleKo: "오라클 더 만들기", part: PARTS.oracles, chapter: "ORACLES", from: "MORE ORACLES" },

  { slug: "starting-your-campaign", titleEn: "Starting Your Campaign", titleKo: "캠페인 시작하기", part: PARTS.depth, chapter: "GAMEPLAY IN DEPTH", from: "STARTING YOUR CAMPAIGN" },
  { slug: "mechanics-and-the-fiction", titleEn: "The Mechanics and the Fiction", titleKo: "기계와 이야기", part: PARTS.depth, chapter: "GAMEPLAY IN DEPTH", from: "THE MECHANICS AND THE FICTION" },
  { slug: "managing-your-quests", titleEn: "Managing Your Quests", titleKo: "임무 관리하기", part: PARTS.depth, chapter: "GAMEPLAY IN DEPTH", from: "MANAGING YOUR QUESTS" },
  { slug: "principles", titleEn: "Principles", titleKo: "원칙", part: PARTS.depth, chapter: "GAMEPLAY IN DEPTH", from: "PRINCIPLES" },
  { slug: "gameplay-options", titleEn: "Gameplay Options", titleKo: "플레이 선택 규칙", part: PARTS.depth, chapter: "GAMEPLAY IN DEPTH", from: "GAMEPLAY OPTIONS" },
  { slug: "hacking-ironsworn", titleEn: "Hacking Ironsworn", titleKo: "철의 맹세 변형하기", part: PARTS.depth, chapter: "GAMEPLAY IN DEPTH", from: "HACKING IRONSWORN" },
  { slug: "extended-example-of-play", titleEn: "Extended Example of Play", titleKo: "확장 플레이 예시", part: PARTS.depth, chapter: "GAMEPLAY IN DEPTH", from: "EXTENDED EXAMPLE OF PLAY" },
];

/** 목차에서 들여쓰기가 잘못 찍힌 절들 — 목차 대신 실제 책 구조를 따른다. */
const DEPTH_OVERRIDES = new Map([
  ["OTHER CHARACTERS", 2],
  ["THE MECHANICS AND THE FICTION", 2],
]);

const args = new Set(process.argv.slice(2));
const debugPage = Number([...args].find((arg) => arg.startsWith("--debug-page="))?.split("=")[1] ?? 0);
const wantToc = args.has("--toc");
const wantRefresh = args.has("--refresh");
/** 한국어 원고 없이 원문만 다시 뽑을 때 구조 검사를 건너뛴다. */
const skipKoCheck = args.has("--skip-ko-check");

const rel = (file) => path.relative(ROOT, file);

// ---------------------------------------------------------------------------
// 1. PDF → 좌표 텍스트
// ---------------------------------------------------------------------------

function readBboxHtml() {
  fs.mkdirSync(path.dirname(CACHE_PATH), { recursive: true });
  const fresh =
    !wantRefresh &&
    fs.existsSync(CACHE_PATH) &&
    fs.statSync(CACHE_PATH).mtimeMs > fs.statSync(PDF_PATH).mtimeMs;

  if (!fresh) {
    console.log(`pdftotext -bbox-layout ${PDF_FILE} → ${rel(CACHE_PATH)}`);
    const html = execFileSync("pdftotext", ["-bbox-layout", PDF_PATH, "-"], { maxBuffer: 1 << 30 }).toString();
    fs.writeFileSync(CACHE_PATH, html);
    return html;
  }
  return fs.readFileSync(CACHE_PATH, "utf8");
}

function decode(text) {
  return text
    .replace(/\u0008/g, "")
    .replace(/\u200b/g, "")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, "&");
}

const num = (value) => Number(value);

function parsePages(html) {
  const pages = [];
  const pageRe = /<page width="([\d.]+)" height="([\d.]+)">([\s\S]*?)<\/page>/g;
  for (const page of html.matchAll(pageRe)) {
    const blocks = [];
    const blockRe = /<block xMin="([\d.]+)" yMin="([\d.]+)" xMax="([\d.]+)" yMax="([\d.]+)">([\s\S]*?)<\/block>/g;
    for (const block of page[3].matchAll(blockRe)) {
      const lines = [];
      const lineRe = /<line xMin="([\d.]+)" yMin="([\d.]+)" xMax="([\d.]+)" yMax="([\d.]+)">([\s\S]*?)<\/line>/g;
      for (const line of block[5].matchAll(lineRe)) {
        const words = [];
        const wordRe = /<word xMin="([\d.]+)" yMin="([\d.]+)" xMax="([\d.]+)" yMax="([\d.]+)">([^<]*)<\/word>/g;
        for (const word of line[5].matchAll(wordRe)) {
          words.push({ x: num(word[1]), x2: num(word[3]), text: decode(word[5]) });
        }
        lines.push({ xMin: num(line[1]), yMin: num(line[2]), xMax: num(line[3]), yMax: num(line[4]), words });
      }
      blocks.push({
        xMin: num(block[1]),
        yMin: num(block[2]),
        xMax: num(block[3]),
        yMax: num(block[4]),
        lines,
      });
    }
    pages.push({ number: pages.length + 1, width: num(page[1]), height: num(page[2]), blocks });
  }
  if (!pages.length) throw new Error("PDF에서 쪽 좌표를 읽지 못했습니다.");
  return pages;
}

const lineText = (line) => line.words.map((word) => word.text).join(" ");

const blockLines = (block) => block.lines.map(lineText).map((text) => text.trim()).filter(Boolean);

/** 줄바꿈으로 쪼개진 문장을 붙이고, 줄 끝 하이픈으로 나뉜 단어를 되살린다. */
function joinLines(lines) {
  let out = "";
  for (const raw of lines) {
    const line = raw.trim();
    if (!out) {
      out = line;
      continue;
    }
    if (/-$/.test(out) && /^[a-z]/.test(line)) out = out.replace(/-$/, "") + line;
    else out = `${out} ${line}`;
  }
  return out;
}

/**
 * 조판 찌꺼기를 다듬는다.
 *
 * 두 칸 띄어쓰기·마침표 앞 공백을 없애고, 책이 윙딩스 글리프로 찍은 글머리 기호(사용자 정의 영역
 * 문자나 `{`)를 `•`로 바꿔 준다.
 */
const tidyText = (text) =>
  text
    .replace(/[\uE000-\uF8FF]/g, " • ")
    .replace(/(^|\s)\{(?=\s|$)/g, "$1• ")
    .replace(/(?:•\s*){2,}/g, "• ")
    .replace(/\s+/g, " ")
    .replace(/ +([,.;:!?%\]”])/g, "$1")
    .trim();

/** `•`로 나뉜 한 덩어리를 목록 항목으로 푼다(기호가 없으면 null). */
function bulletItems(text) {
  const parts = text
    .split(/\s*•\s*/)
    .map((part) => part.trim())
    .filter(Boolean);
  return parts.length >= 2 ? parts : null;
}

const blockText = (block) => tidyText(joinLines(blockLines(block)));

// ---------------------------------------------------------------------------
// 2. 목차 파싱·헤딩 사전
// ---------------------------------------------------------------------------

/**
 * 목차는 -bbox-layout에서 여러 항목이 한 줄로 뭉개지므로, 앞부분만 -layout으로 다시 뽑아 읽는다
 * (목차는 1장 시작 쪽 앞에 있으니 앞 14쪽이면 충분하다).
 */
function readFrontText() {
  fs.mkdirSync(path.dirname(FRONT_CACHE_PATH), { recursive: true });
  const fresh =
    !wantRefresh &&
    fs.existsSync(FRONT_CACHE_PATH) &&
    fs.statSync(FRONT_CACHE_PATH).mtimeMs > fs.statSync(PDF_PATH).mtimeMs;
  if (fresh) return fs.readFileSync(FRONT_CACHE_PATH, "utf8");

  const text = execFileSync("pdftotext", ["-layout", "-f", "1", "-l", "14", PDF_PATH, "-"], { maxBuffer: 1 << 30 }).toString();
  fs.writeFileSync(FRONT_CACHE_PATH, text);
  return text;
}

function tocEntries(frontText) {
  const lines = frontText.split("\n").map((line) => line.replace(/\u0008/g, "").replace(/\u200b/g, "").replace(/\s+$/, ""));
  const start = lines.findIndex((line) => line.trim() === "CONTENTS");
  const end = lines.findIndex((line, i) => i > start && /^\s*CHAPTER 1\s*$/.test(line));
  if (start < 0 || end < 0) throw new Error("목차(CONTENTS)를 찾지 못했습니다. PDF 판이 바뀌었나요?");

  const entries = [];
  for (let i = start + 1; i < end; i++) {
    const line = lines[i];
    const text = line.trim();
    if (!text) continue;
    const match = text.match(/^(.*?)\s+(\d+)$/);
    if (!match) {
      if (entries.length) entries[entries.length - 1].title += ` ${text}`;
      continue;
    }
    const title = match[1].trim();
    const indent = line.length - line.trimStart().length;
    const depth = /^CHAPTER \d+:/.test(title) ? 1 : indent > 0 ? 3 : 2;
    entries.push({ depth, title, page: Number(match[2]) });
  }
  return entries;
}

function buildHeadings(entries) {
  const byKey = new Map();
  for (const entry of entries) {
    if (entry.depth === 1) continue;
    const key = entry.title.toUpperCase();
    const depth = DEPTH_OVERRIDES.get(key) ?? entry.depth;
    const found = byKey.get(key);
    if (!found || depth < found.depth) byKey.set(key, { depth, title: entry.title });
  }
  return byKey;
}

/**
 * 줄 전체가 목차의 절 이름과 같은가 — 본문은 대문자로 찍지만 ‘NPCs’처럼 예외가 있다.
 * 그림 속 숫자가 한 줄에 섮킨 경우(RESETTING +7 MOMENTUM)도 숫자를 빼고 다시 본다.
 */
function knownHeading(headings, text) {
  if (!text || text.length > 80) return null;
  if (/[.!?:;,]$/.test(text)) return null;
  const direct = headings.get(text.toUpperCase());
  if (direct) return direct;
  const tail = text.match(/^(.*?)\s+[A-Z]$/); // 색인처럼 뒤에 열 문자 하나가 붙은 줄
  if (tail) {
    const found = headings.get(tail[1].toUpperCase());
    if (found) return found;
  }
  const withoutNumbers = text.replace(/\s*[+-]?\d{1,3}\s*/g, " ").trim();
  if (withoutNumbers !== text) return headings.get(withoutNumbers.toUpperCase()) ?? null;
  return null;
}

function chapterNames(entries) {
  const names = new Map();
  for (const entry of entries) {
    if (entry.depth !== 1) continue;
    const match = entry.title.match(/^CHAPTER (\d+):\s*(.+)$/);
    if (match) names.set(Number(match[1]), match[2].trim().toUpperCase());
  }
  return names;
}

/** 3장 ‘… MOVES’ 절 아래의 무브 이름들 — 무브 상자와 그냥 측주를 가른다. */
function buildMoveNames(entries) {
  const MOVE_SECTIONS = new Set(["ADVENTURE MOVES", "RELATIONSHIP MOVES", "COMBAT MOVES", "SUFFER MOVES", "QUEST MOVES", "FATE MOVES"]);
  const names = new Set();
  let inMoves = false;
  for (const entry of entries) {
    if (entry.depth === 2) inMoves = MOVE_SECTIONS.has(entry.title.toUpperCase());
    else if (entry.depth === 3 && inMoves) names.add(entry.title.toUpperCase());
  }
  return names;
}

// ---------------------------------------------------------------------------
// 3. 쪽 → 읽기 순서 항목
// ---------------------------------------------------------------------------

const SENTENCE_END = /[.!?:;”“”"'’)\]%]$/;

function isChapterBanner(text) {
  return /^CHAPTER \d+$/.test(text);
}

function estimateBodyX(blocks) {
  const wide = blocks.filter((block) => block.xMax - block.xMin > 150);
  const pool = wide.length ? wide : blocks;
  return Math.min(...pool.map((block) => block.xMin));
}

/** d100 표의 굴림 칸: 1, 00, 78-85 처럼 숫자 하나나 범위. */
const ROLL_RE = /^(\d{1,3}|00)(\s*[-\u2013\u2014]\s*(\d{1,3}|00))?$/;
/** “2 - Ragged Coast”, “13-24 Ragged Coast”처럼 굴림과 결과가 한 칸에 붙어 있는 표. */
const INLINE_ROLL_RE = /^(\d{1,3}(?:\s*[-\u2013\u2014]\s*\d{1,3})?|00)\s*(?:[-\u2013\u2014]\s*)?(.+)$/;

/**
 * 같은 높이(y)에 여러 칸이 놓인 줄들을 모아 표로 만든다.
 *
 * 줄마다 모양이 다르므로(마지막 줄은 칸이 모자라기도 하고) 셀 모양이 같은 줄끼리만 묶는다.
 * 모양은 셋: ‘굴림 + 결과’(오라클 d100), ‘굴림이 칸 안에 붙은’(지역 표), ‘라벨: 값’(NPC 스탯 상자).
 */
/** 같은 높이(±3pt)에 놓인 칸을 한 줄로 묶는다. */
function groupRows(blocks) {
  const sorted = [...blocks].sort((a, b) => a.yMin - b.yMin || a.xMin - b.xMin);
  const rows = [];
  let current = null;
  for (const block of sorted) {
    if (current && block.yMin - current.y <= 3) {
      current.cells.push(block);
      continue;
    }
    current = { y: block.yMin, cells: [block] };
    rows.push(current);
  }
  return rows;
}

/** “13-24 Ragged Coast”처럼 굴림과 결과가 한 칸에 붙은 칸을 둘로 가른다. */
function expandCells(cells) {
  return cells.flatMap((cell) => {
    // ‘50/50’처럼 빗금으로 나뉜 눈금은 굴림과 결과가 붙은 칸이 아니다.
    if (/^\d+\s*\/\s*\d+$/.test(cell.text)) return [cell];
    const match = cell.text.match(INLINE_ROLL_RE);
    if (!match || ROLL_RE.test(cell.text)) return [cell];
    return [
      { x: cell.x, text: match[1], block: cell.block },
      { x: cell.x, text: match[2].trim(), block: cell.block },
    ];
  });
}

/** 표의 칸 하나가 될 만한 짧은 글(‘1-4’, ‘Bleak-’, ‘Almost Certain’). */
const CELL_TEXT = (text) =>
  text.length > 0 && text.length <= 20 && text.split(/\s+/).length <= 2 && /[0-9A-Za-z]/.test(text) && !/[.!?:;]$/.test(text);

/** 표의 머리줄·이름표로 쓸 만한 글(‘Roll’, ‘Result’, ‘Odds’). 말줄임표(…)로 끝나는 머리글은 문장이 아니라 받아 준다. */
const LABEL_TEXT = (text) => text.length > 0 && text.length <= 42 && !/(?<!\.\.)[.!?:;]$/.test(text) && /[A-Za-z]/.test(text);

function rowClass(rawCells, allowGrid) {
  const cells = rawCells.map((cell) => ({ x: cell.block.xMin, text: blockText(cell.block), block: cell.block }));
  if (cells.length === 2 && /:$/.test(cells[0].text)) return "fields";
  // 굴림 칸이 홀수 자리에 놓인 줄(오라클 d100 표).
  if (cells.length >= 2 && cells.length % 2 === 0 && cells.every((cell, i) => (i % 2 === 0 ? ROLL_RE.test(cell.text) : true)))
    return "roll";
  // “13-24 Ragged Coast”처럼 굴림과 결과가 한 칸에 붙은 줄.
  const expanded = expandCells(cells);
  if (expanded.length >= 2 && expanded.length % 2 === 0 && expanded.every((cell, i) => (i % 2 === 0 ? ROLL_RE.test(cell.text) : true)))
    return "roll";
  // ‘Rank | Amount’, ‘Odds | 11 or greater’, ‘1-4 | Bleak- | -moor’처럼 굴림 없이 칸만 나란한 표.
  if (allowGrid && cells.length >= 2 && cells.every((cell) => LABEL_TEXT(cell.text) || CELL_TEXT(cell.text))) return "grid";
  return null;
}

function readTables(blocks, allowGrid = true) {
  const rows = groupRows(blocks).map((row) => ({
    y: row.y,
    cells: row.cells.map((cell) => ({ x: cell.xMin, text: blockText(cell), block: cell })),
  }));
  const classes = rows.map((row) => rowClass(row.cells, allowGrid));

  const tables = [];
  let run = [];
  let kind = null;
  let header = null;
  let bottom = 0;

  const flush = () => {
    // 눈금만 늘어선 줄은 그림 속 숫자다(이름표가 하나도 없는 ‘표’는 세우지 않는다).
    const lined = run.some((row) => row.cells.some((cell) => /[A-Za-z]/.test(cell.text)));
    if (run.length >= 2 && (kind !== "grid" || lined)) {
      tables.push({
        kind,
        header,
        // 굴림 표만 칸을 (굴림, 결과) 짝으로 가른다. 다른 표는 칸을 그대로 쓴다.
        rows: run.map((row) => ({ y: row.y, cells: kind === "roll" ? expandCells(row.cells) : row.cells })),
        blocks: [
          ...(header ? header.cells.map((cell) => cell.block) : []),
          ...run.flatMap((row) => row.cells.map((cell) => cell.block)),
        ].filter(Boolean),
      });
    }
    run = [];
    kind = null;
    header = null;
  };

  rows.forEach((row, index) => {
    const current = classes[index];
    if (!current) {
      flush();
      return;
    }
    if (kind && current !== kind) flush();
    // 줄 간격은 칸 높이를 빼고 본다(한 칸이 여러 줄인 표는 줄 사이가 벌어져 보인다).
    const maxGap = current === "fields" ? 60 : 34;
    if (run.length && row.y - bottom > maxGap) flush();
    // 표 첫 줄 앞에 머리줄(‘Roll | Result’, ‘Odds | The answer is…’)이 있으면 표에 붙인다.
    if (!run.length && !header && index > 0 && current !== "fields") {
      if (classes[index - 1] === "grid") {
        const above = rows[index - 1];
        const aboveCells = above.cells;
        const hereCells = row.cells;
        // 굴림 칸(‘1-4’)에는 머리글을 찍지 않는 표도 있어서, 한 칸 모자란 머리줄도 받아 준다.
        const fits = aboveCells.length === hereCells.length || (aboveCells.length === hereCells.length - 1 && ROLL_RE.test(hereCells[0].text));
        if (fits && row.y - above.y <= 30 && LABEL_TEXT(aboveCells[0].text)) {
          header = above;
          classes[index - 1] = null;
        }
      } else if (
        // 머리줄 칸 하나가 길어 두 줄로 접히면(‘Odds’ / ‘The answer is “yes” if you roll…’), 짧은 칸이
        // 옆 칸의 아랫줄 높이에 맞춰 뚝 떨어진 별개 줄로 잡힌다 — 칸 하나짜리 줄 두 개를 머리줄로 합친다.
        current === "grid" &&
        index > 1 &&
        classes[index - 1] === null &&
        classes[index - 2] === null &&
        rows[index - 1].cells.length === 1 &&
        rows[index - 2].cells.length === 1 &&
        rows[index - 1].y - rows[index - 2].y <= 15
      ) {
        const a = rows[index - 2].cells[0];
        const b = rows[index - 1].cells[0];
        const [left, right] = a.x <= b.x ? [a, b] : [b, a];
        if (row.cells.length === 2 && LABEL_TEXT(left.text) && LABEL_TEXT(right.text)) {
          header = { cells: [left, right] };
          classes[index - 1] = null;
          classes[index - 2] = null;
        }
      }
    }
    kind = current;
    run.push(row);
    bottom = Math.max(...row.cells.map((cell) => cell.block.yMax ?? row.y));
  });
  flush();
  return tables;
}

// ---------------------------------------------------------------------------
// 2b. 좌표가 뭉갠 표 칸 되살리기
// ---------------------------------------------------------------------------

/** 줄 하나를 블록 하나로 만든다(표의 칸 하나가 한 줄일 때). */
function lineBlock(line) {
  return { xMin: line.xMin, yMin: line.yMin, xMax: line.xMax, yMax: line.yMax, lines: [line] };
}

/**
 * 짧은 낱줄이 세로로 쌓인 블록은 표의 칸이 한 줄씩 늘어선 자리다.
 *
 * 이 책의 오라클 표는 칸 사이에 선이 없어서, pdftotext가 열 전체를 문단 하나로 묶어 버린다.
 * (예: ‘69-70 / 71-72 …’ 열, ‘Prefix / Bleak- / Green- …’ 열.)
 */
function splitStackedCells(block) {
  const lines = block.lines.filter((line) => lineText(line).trim());
  if (lines.length < 4) return null;
  if (!lines.every((line) => CELL_TEXT(lineText(line).trim()))) return null;
  const xs = lines.map((line) => line.xMin);
  if (Math.max(...xs) - Math.min(...xs) > 1) return null;
  if (block.xMax - block.xMin > 120) return null;
  const gaps = lines.slice(1).map((line, index) => line.yMin - lines[index].yMin);
  if (Math.max(...gaps) - Math.min(...gaps) > 2) return null;
  return lines.map(lineBlock);
}

/** 짧은 낱줄만 늘어선 칸은 표의 자가 된다(왼쪽 굴림 칸·‘Odds’ 칸). */
function rulerLines(blocks) {
  const lines = blocks.flatMap((block) => block.lines.filter((line) => lineText(line).trim()));
  if (lines.length < 3) return null;
  return lines.every((line) => CELL_TEXT(lineText(line).trim())) ? lines : null;
}

/**
 * 옆 칸의 눈금에 맞춰, 여러 줄로 뭉갠 칸을 줄마다 떼어 놓는다.
 * (‘1-10 | The harm is mortal. Face Death.’처럼 한 칸이 여러 줄인 표를 되살린다.)
 */
function splitByRuler(block, marks) {
  const lines = block.lines.filter((line) => lineText(line).trim());
  if (lines.length < 4) return null;
  const within = marks
    .filter((mark) => mark.yMin > block.yMin - 3 && mark.yMin < block.yMax + 3)
    .sort((a, b) => a.yMin - b.yMin);
  if (within.length < 3) return null;
  // 자의 눈금이 이 칸의 줄과 맞아떨어져야 표로 본다(두 칸 조판의 문단과 가른다).
  if (within.filter((mark) => lines.some((line) => Math.abs(line.yMin - mark.yMin) <= 8)).length < 3) return null;

  const groups = [];
  for (const line of lines) {
    const start = within.filter((mark) => mark.yMin <= line.yMin + 5).pop() ?? null;
    const last = groups[groups.length - 1];
    if (last && last.start === start) last.lines.push(line);
    else groups.push({ start, lines: [line] });
  }
  if (groups.length < 3) return null;
  return groups.map((group) => ({
    xMin: Math.min(...group.lines.map((line) => line.xMin)),
    // 칸은 눈금이 놓인 줄에서 시작한다(칸 안 첫 줄은 눈금보다 조금 위에 찍히기도 한다).
    yMin: group.start ? group.start.yMin : group.lines[0].yMin,
    xMax: Math.max(...group.lines.map((line) => line.xMax)),
    yMax: group.lines[group.lines.length - 1].yMax,
    lines: group.lines,
  }));
}

/** 쪽의 블록을 표 칸 단위로 다시 쪼갠다. */
function rebuildCellStacks(pages) {
  for (const page of pages) {
    // 캐릭터 시트처럼 그림이 쪽을 채운 자리에 흘린 글자는 표가 아니다.
    if (looksLikeSheet(page.blocks)) continue;
    const stacked = page.blocks.flatMap((block) => splitStackedCells(block) ?? [block]);
    const rulers = clusterByX(stacked, 2)
      .map((parts) => rulerLines(parts))
      .filter(Boolean);
    // 자로 삼은 칸도 한 줄씩 떼어 놓는다(그 칸은 이미 짧은 낱줄만 모인 자리다).
    const marks = new Set(rulers.flat());
    const exploded = stacked.flatMap((block) => {
      const lines = block.lines.filter((line) => lineText(line).trim());
      return lines.length > 1 && lines.every((line) => marks.has(line)) ? lines.map(lineBlock) : [block];
    });
    page.blocks = exploded.flatMap((block) => {
      for (const marks of rulers) {
        if (marks.some((mark) => Math.abs(mark.xMin - block.xMin) <= 24)) continue;
        const split = splitByRuler(block, marks);
        if (split) return split;
      }
      return [block];
    });
  }
}

/** 그림 속 눈금(+9, 8)처럼 숫자만 있는 블록. */
const FIGURE_LABEL = /^[+-]?\d{1,2}$/;
/** 기호만 있는 블록(=, +, —). */
const LONE_SYMBOL = /^[=+×\-–—:;/·•]+$/;
/** 줄 앞머리에 따로 놓인 목록 번호(1, 2 …). */
const LIST_MARKER = /^\d{1,2}[.)]?$/;

function isFigureNoise(text) {
  const bare = text.trim();
  if (!bare) return true;
  return FIGURE_LABEL.test(bare) || LONE_SYMBOL.test(bare);
}

/** 짧고 마침표가 없는 줄 — 그림 속 이름표일 수 있다. */
function isLabelish(text) {
  return text.length > 0 && text.length < 30 && !SENTENCE_END.test(text);
}

/**
 * 그림 속 이름표를 버린다.
 *
 * 목차에 있는 절 이름은 건드리지 않는다. 이름표가 이웃에 둘 이상 붙어 있으면 그림 속 글자로 본다.
 */
/** 이만큼 이름표가 빽빽하면 쪽을 그림(캐릭터 시트)이 채운 것으로 본다. */
const SHEET_LABELS = 30;
/** 눈금 조각이 이만큼 있으면 그림이 쪽을 채운 것으로 본다. */
const SHEET_NOISE = 10;

/** 그림(캐릭터 시트)이 쪽을 채운 자리인가 — 이름표와 눈금 조각이 빽빽하다. */
function looksLikeSheet(blocks) {
  const labels = blocks.filter((block) => isLabelish(blockText(block).trim())).length;
  const noise = blocks.filter((block) => isFigureNoise(blockText(block).trim())).length;
  return labels >= SHEET_LABELS && noise >= SHEET_NOISE;
}

function dropFigureLabels(blocks, headings, bodyX, sheet) {
  const labelish = blocks.filter((block) => {
    const text = blockText(block).trim();
    // 본문 여백에 놓인 줄은 절 이름이다. 들여쓴 자리에 짧게 붙은 글자가 그림 속 이름표다.
    if (block.xMin <= bodyX + BOX_OFFSET) return false;
    if (text.length === 0 || text.length >= 60 || SENTENCE_END.test(text)) return false;
    // 목차에 있는 절 이름은 건드리지 않는다. 다만 그림이 쪽을 채운 자리에서는 그 글자도 시트에 찍힌 것이다.
    return sheet || !knownHeading(headings, text);
  });
  const drop = new Set();
  for (const block of labelish) {
    const text = blockText(block).trim();
    // 대문자 이름표는 삽화에 붙은 글자라 조금 멀리 있는 이름표까지 이웃으로 본다.
    const reach = text === text.toUpperCase() ? 60 : 30;
    const neighbours = labelish.filter((other) => other !== block && Math.abs(other.yMin - block.yMin) <= reach);
    if (neighbours.length >= 1) drop.add(block);
  }
  return blocks.filter((block) => !drop.has(block));
}

/** 나란한 칸의 이름표가 되는 짧은 줄(‘Strong Hit’ 같은). */
function isColumnLabel(text) {
  return text.length > 0 && text.length <= 42 && !SENTENCE_END.test(text) && /[A-Za-z]/.test(text) && !isFigureNoise(text);
}

/** x 좌표가 가까운 블록끼리 묶는다(왼쪽부터, 각 묶음은 위에서 아래로). */
function clusterByX(blocks, tolerance) {
  const clusters = [];
  for (const block of [...blocks].sort((a, b) => a.xMin - b.xMin)) {
    const last = clusters[clusters.length - 1];
    if (last && block.xMin - last.center <= tolerance) {
      last.blocks.push(block);
      last.center = last.blocks.reduce((sum, item) => sum + item.xMin, 0) / last.blocks.length;
      continue;
    }
    clusters.push({ center: block.xMin, blocks: [block] });
  }
  return clusters.map((cluster) => cluster.blocks.sort((a, b) => a.yMin - b.yMin));
}

/**
 * 같은 높이에 나란히 놓인 짧은 이름표 줄을 읽는다.
 *
 * 이 책은 ‘Strong Hit / Weak Hit / Miss’처럼 칸을 나란히 두고 견주는 자리가 있다. 위에서 아래로만
 * 읽으면 이름표가 남의 본문 사이에 끼어들므로, 이름표가 있는 줄은 이름표와 그 아래 본문을 한 칸씩 묶어 준다.
 */
function readColumnRows(blocks) {
  const taken = new Set();
  const rows = [];
  // 쪽 맨 위에 놓인 줄은 절 이름이다(INDEX, MOMENTUM 처럼 그림 옆에 나란히 찍혀도 건드리지 않는다).
  const top = Math.min(...blocks.map((block) => block.yMin));
  const usable = (block) => Math.abs(block.yMin - top) > 0.5;
  for (const anchor of [...blocks].sort((a, b) => a.yMin - b.yMin || a.xMin - b.xMin)) {
    if (taken.has(anchor) || !usable(anchor) || !isColumnLabel(blockText(anchor).trim())) continue;
    const band = blocks.filter(
      (block) =>
        usable(block) && !taken.has(block) && Math.abs(block.yMin - anchor.yMin) <= 3 && isColumnLabel(blockText(block).trim()),
    );
    const clusters = clusterByX(band, 34);
    if (clusters.length < 2) continue;

    const cells = clusters.map((cluster) => {
      const label = cluster[0];
      const body = [];
      let bottom = label.yMax;
      // 본문은 이름표 줄에서 같은 x 자리에 이어지는 긴 줄이다(다른 이름표는 본문으로 치지 않는다).
      for (const block of blocks.filter((block) => block.yMin > label.yMin).sort((a, b) => a.yMin - b.yMin)) {
        if (taken.has(block) || block === label) continue;
        if (Math.abs(block.xMin - label.xMin) > 30) continue;
        if (isColumnLabel(blockText(block).trim())) continue;
        if (block.yMin - bottom > 14) break;
        body.push(block);
        bottom = Math.max(bottom, block.yMax);
      }
      return { label, body };
    });

    // 어느 칸에도 본문이 없고 이름표가 모두 대문자면 그림 속 글자다(주사위 삽화의 “CHALLENGE DICE”).
    const hasBody = cells.every((cell) => cell.body.length);
    // 본문이 없는 줄은 소문자가 섞인 이름표일 때만 뜻이 있다(삽화의 “CHALLENGE DICE”는 버린다).
    const hasLower = cells.some((cell) => /[a-z]/.test(blockText(cell.label).trim()));
    if (!hasBody && !hasLower) continue;

    for (const cell of cells) {
      taken.add(cell.label);
      for (const block of cell.body) taken.add(block);
    }
    rows.push(cells);
  }
  return rows;
}

/** 번호 블록을 제 항목 본문과 짝지어 준다(번호는 본문보다 조금 아래에 찍혀 나온다). */
function readOrderedItems(blocks) {
  const pairs = [];
  for (const marker of blocks) {
    if (!LIST_MARKER.test(blockText(marker).trim())) continue;
    const value = blockText(marker).trim().replace(/[.)]$/, "");
    let best = null;
    for (const block of blocks) {
      if (block === marker || LIST_MARKER.test(blockText(block).trim())) continue;
      if (block.xMin <= marker.xMin + 2) continue;
      const delta = block.yMin - marker.yMin;
      if (delta < -16 || delta > 16) continue;
      if (!best || Math.abs(delta) < Math.abs(best.delta)) best = { block, delta };
    }
    if (best) pairs.push({ marker, value, block: best.block });
  }
  return pairs.sort((a, b) => a.block.yMin - b.block.yMin);
}

/** 이어지는 번호 항목끼리 묶는다(한 줄짜리 번호는 목록으로 보지 않는다). */
function orderedRuns(pairs) {
  const runs = [];
  for (const pair of pairs) {
    const last = runs[runs.length - 1];
    const previous = last?.[last.length - 1];
    if (previous && pair.block.yMin - previous.block.yMax <= 40) last.push(pair);
    else runs.push([pair]);
  }
  // 번호가 붙은 항목은 문장처럼 긴 줄이어야 한다(시트에 흘린 숫자와 이름표를 번호 목록으로 오해하지 않게).
  return runs.filter((run) => run.length >= 2 && run.every((pair) => blockText(pair.block).trim().length >= 25));
}

/** 이름표·번호 목록을 문단 하나처럼 실어 나르는 가짜 블록. */
function syntheticBlock(item, holder, index) {
  return {
    xMin: holder.x,
    yMin: holder.y + index * 0.01,
    xMax: holder.x + 1,
    yMax: holder.y + index * 0.01 + 1,
    lines: [{ words: [{ text: item.text }] }],
    synthetic: item,
  };
}

/**
 * 한 쪽을 읽기 순서 항목 열로 바꾼다.
 * item = { kind: 'paragraph'|'heading'|'list'|'box'|'table'|'chapter', ... }
 */
function pageItems(page, headings, chapterTitles) {
  const belowFooter = page.blocks.filter((block) => block.yMin < page.height - FOOTER_MARGIN);
  if (!belowFooter.length) return [];

  // 그림이 쪽을 채운 자리인지 먼저 가른다(그런 쪽에서는 이름표를 표로 묶지 않는다).
  const sheet = looksLikeSheet(belowFooter);
  // 표를 먼저 읽는다(굴림 번호도 표의 칸이라, 눈금·이름표를 걸러 내기 전에 묶어야 한다).
  const tables = readTables(belowFooter, !sheet);
  const consumed = new Set(tables.flatMap((table) => table.blocks));
  // 번호 목록은 눈금(+1, 8)과 모양이 같아서, 눈금을 걸러 내기 전에 먼저 읽는다.
  const afterTables = belowFooter.filter((block) => !consumed.has(block));
  const ordered = orderedRuns(readOrderedItems(afterTables));
  const numbered = new Set(ordered.flatMap((run) => run.flatMap((pair) => [pair.marker, pair.block])));

  const candidates = afterTables.filter((block) => !numbered.has(block));

  // 나란한 이름표 줄(‘강타/약타/실패’)은 그림 속 이름표를 버리기 전에 읽는다.
  const rows = sheet ? [] : readColumnRows(candidates);
  const rowBlocks = new Set(rows.flatMap((cells) => cells.flatMap((cell) => [cell.label, ...cell.body])));

  // 남은 것에서 그림 속 눈금·기호 조각과 그림 속 이름표를 버린다.
  const kept = afterTables.filter(
    (block) => !numbered.has(block) && !rowBlocks.has(block) && !isFigureNoise(blockText(block).trim()),
  );
  const bodyX = estimateBodyX(kept.length ? kept : belowFooter);
  const flow = dropFigureLabels(kept, headings, bodyX, sheet);
  if (!flow.length && !tables.length && !rows.length && !ordered.length) return [];

  const holders = [];
  for (const cells of rows) {
    const items = [];
    const blocks = [];
    for (const cell of cells) {
      items.push({ kind: "p", lead: true, text: blockText(cell.label).trim() });
      blocks.push(cell.label);
      for (const block of cell.body) {
        items.push({ kind: "p", text: blockText(block).trim() });
        blocks.push(block);
      }
    }
    holders.push({ x: cells[0].label.xMin, y: cells[0].label.yMin, items, blocks });
  }
  for (const run of ordered) {
    holders.push({
      x: run[0].block.xMin,
      y: run[0].block.yMin,
      items: run.map((pair) => ({ kind: "oli", marker: pair.value, text: blockText(pair.block).trim() })),
      blocks: run.flatMap((pair) => [pair.marker, pair.block]),
    });
  }

  const hoisted = new Set([...numbered, ...rowBlocks, ...holders.flatMap((holder) => holder.blocks)]);

  // 표와 문단을 한 줄기로 다시 세워 읽기 순서를 만든다(표가 자기 자리에 들어가게).
  const loose = flow.filter((block) => !hoisted.has(block));
  if (!loose.length && !tables.length && !holders.length) return [];
  const elements = [
    ...tables.map((table) => ({
      kind: "table",
      variant: table.kind,
      header: table.header,
      rows: table.rows,
      column: 0,
      y: table.rows[0].y,
      x: Math.min(...table.rows.flatMap((row) => row.cells.map((cell) => cell.x))),
    })),
    ...holders.flatMap((holder) =>
      holder.items.map((item, index) => ({
        kind: "block",
        block: syntheticBlock(item, holder, index),
        column: holder.x > bodyX + COLUMN_OFFSET ? 1 : 0,
        y: holder.y + index * 0.01,
        x: holder.x,
      })),
    ),
    ...loose.map((block) => ({ kind: "block", block, column: block.xMin > bodyX + COLUMN_OFFSET ? 1 : 0, y: block.yMin, x: block.xMin })),
  ].sort((a, b) => a.column - b.column || a.y - b.y || a.x - b.x);

  const items = [];
  const blockAt = (index) => (elements[index]?.kind === "block" ? elements[index].block : null);

  // 절 이름은 위아래로 숨을 넓게 줘 가른다 — 줄 간격이면 예시 상자 속 무브 이름이다.
  let previousBottom = null;

  let i = 0;
  while (i < elements.length) {
    const element = elements[i];
    if (element.kind === "table") {
      items.push({ kind: "table", variant: element.variant, header: element.header, rows: element.rows });
      i++;
      continue;
    }

    const { block, column } = element;
    const text = blockText(block);
    if (!text) {
      i++;
      continue;
    }
    const spaced = previousBottom === null || block.yMin - previousBottom >= 7;
    previousBottom = Math.max(previousBottom ?? 0, block.yMax);

    if (block.synthetic) {
      items.push({ kind: "synthetic", item: block.synthetic });
      i++;
      continue;
    }

    if (column === 0 && isChapterBanner(text)) {
      const number = Number(text.split(" ")[1]);
      const expected = chapterTitles.get(number) ?? null;
      let joined = "";
      let next = i + 1;
      while (next < elements.length && elements[next].column === 0 && blockAt(next)) {
        const candidate = blockText(blockAt(next));
        if (!candidate) break;
        const trial = joined ? `${joined} ${candidate}` : candidate;
        if (expected && !expected.startsWith(trial)) break;
        joined = trial;
        next++;
        if (expected && joined === expected) break;
      }
      if (!joined) throw new Error(`CHAPTER ${number} 다음에서 장 제목을 찾지 못했습니다.`);
      items.push({ kind: "chapter", number, title: joined });
      i = next;
      continue;
    }

    const heading = column === 0 && spaced ? knownHeading(headings, text) : null;
    if (heading) {
      items.push({ kind: "heading", depth: heading.depth, text: heading.title, y: block.yMin });
      i++;
      continue;
    }

    if (/^[•◦·]/.test(text)) {
      const list = [];
      while (i < elements.length && blockAt(i) && /^[•◦·]/.test(blockText(blockAt(i)))) {
        list.push(blockText(blockAt(i)).replace(/^[•◦·]\s*/, ""));
        i++;
      }
      items.push({ kind: "list", items: list });
      continue;
    }

    if (block.xMin > bodyX + BOX_OFFSET) {
      const box = [];
      while (i < elements.length && blockAt(i) && elements[i].block.xMin > bodyX + BOX_OFFSET) {
        const entry = elements[i].block;
        // 그림 속 눈금·기호 조각은 상자 안에도 넣지 않는다.
        if (entry.synthetic || !isFigureNoise(blockText(entry).trim())) box.push(entry);
        i++;
      }
      if (box.length) items.push({ kind: "box", blocks: box });
      continue;
    }

    items.push({ kind: "paragraph", text, spaced });
    i++;
  }

  if (debugPage === page.number) {
    for (const item of items) {
      const body = item.text ?? item.title ?? item.items ?? item.rows ?? item.name ?? "";
      const head = item.kind === "table" ? ` head=${JSON.stringify(item.header?.cells?.map((cell) => cell.text))}` : "";
      console.log(`[${page.number}] ${item.kind}${item.variant ? `/${item.variant}` : ""}${head} ${JSON.stringify(body).slice(0, 140)}`);
    }
  }
  return items;
}

// ---------------------------------------------------------------------------
// 4. 항목 → 블록
// ---------------------------------------------------------------------------

const BREAK_BEFORE =
  /^(On an? (?:strong|weak) hit|On a miss|On a match|When you|If you|Also,|Then,|Otherwise|Choose|Take|Mark|Suffer|Add|Reduce|Roll|Write|Envision|Gain|Lose|Sacrifice|Alternatively)/;

const SMALL_WORDS = new Set(["a", "an", "and", "as", "at", "but", "by", "for", "from", "in", "into", "of", "on", "or", "the", "to", "with"]);
const KEEP_UPPER = new Set(["GM", "NPC", "RPG", "XP"]);

/** 대문자로 찍힌 절 이름을 책의 표기에 가깝게 되돌린다(목차 표기·두문자어는 살린다). */
function titleCase(text) {
  const words = text.split(/\s+/);
  return words
    .map((word, index) => {
      if (word !== word.toUpperCase()) return word; // 목차에서 온 표기는 그대로 둔다
      const bare = word.replace(/[^A-Za-z]/g, "").toUpperCase();
      const acronym = bare.replace(/S$/, "");
      if (KEEP_UPPER.has(bare) || KEEP_UPPER.has(acronym)) {
        return word.replace(/[A-Za-z]+/, () => acronym + (bare.endsWith("S") ? "s" : ""));
      }
      const lower = word.toLowerCase();
      const plain = lower.replace(/[^a-z]/g, "");
      if (index > 0 && index < words.length - 1 && SMALL_WORDS.has(plain)) return lower;
      return lower.replace(/[a-z]/, (character) => character.toUpperCase());
    })
    .join(" ");
}

function isCapsHeading(text) {
  if (!text || text.length > 52) return false;
  if (/[.!?]$/.test(text)) return false;
  const bare = text.replace(/[“”"'"’‘]/g, "");
  if (!/[A-Z]/.test(bare)) return false;
  return bare === bare.toUpperCase();
}

/**
 * 무브·측주 안쪽 문단을 “On a strong hit,” 같은 머리말과 글머리표에서 끊는다.
 * 반환값은 { kind: 'p'|'li', text } 열이다.
 */
function boxItems(blocks) {
  const items = [];
  let current = [];
  const flush = () => {
    if (!current.length) return;
    const text = tidyText(joinLines(current));
    const bullets = bulletItems(text);
    if (bullets) for (const bullet of bullets) items.push({ kind: "li", text: bullet });
    else items.push({ kind: "p", text });
    current = [];
  };
  for (const block of blocks) {
    if (block.synthetic) {
      flush();
      items.push(block.synthetic);
      continue;
    }
    for (const line of blockLines(block)) {
      if (/^[•◦·]/.test(line)) {
        flush();
        // 한 줄에 글머리 기호가 여럿 붙어 있으면 항목으로 가른다(마지막 항목은 다음 줄을 이어 받는다).
        const bare = tidyText(line.replace(/^[•◦·]\s*/, ""));
        const bullets = bulletItems(bare) ?? [bare];
        for (const bullet of bullets) items.push({ kind: "li", text: bullet });
        continue;
      }
      const last = items[items.length - 1];
      // 글머리 항목이 줄바꿈된 줄은 그 항목에 이어 붙인다.
      if (!current.length && last?.kind === "li" && !BREAK_BEFORE.test(line)) {
        last.text = tidyText(`${last.text} ${line}`);
        continue;
      }
      // “-거나”처럼 앞 줄이 문장을 맺지 않았으면 머리말처럼 보여도 이어 붙인다.
      const dangling = current.length && !SENTENCE_END.test(current[current.length - 1].trim());
      if (current.length && BREAK_BEFORE.test(line) && !dangling) flush();
      current.push(line);
    }
  }
  flush();
  return items;
}

/** 상자 안쪽을 인용문으로 그린다(글머리·번호 항목은 붙여서). */
function renderBox(items) {
  const out = [];
  let previous = null;
  for (const item of items) {
    if (item.kind === "li") {
      if (previous !== "li" && out.length) out.push(">");
      out.push(`> - ${item.text}`);
    } else if (item.kind === "oli") {
      if (previous !== "oli" && out.length) out.push(">");
      out.push(`> ${item.marker}. ${item.text}`);
    } else {
      if (out.length) out.push(">");
      out.push(`> ${item.lead ? `**${item.text}**` : emphasizeLead(item.text)}`);
    }
    previous = item.kind;
  }
  return out;
}

/** “On a strong hit,” 같은 머리말을 굵게. */
function emphasizeLead(paragraph) {
  const match = paragraph.match(/^(On an? (?:strong|weak) hit(?: with a match)?|On a miss(?: with a match)?|Miss:|Strong hit:|Weak hit:)([,.])?/);
  if (!match) return paragraph;
  const lead = match[0].replace(/[.,]$/, "");
  const rest = paragraph.slice(match[0].length).trim();
  return `**${lead}**${match[0].endsWith(",") ? "," : ""} ${rest}`;
}

/** 가까운 값끼리 묶어 중심값을 돌려준다(표의 열 위치 찾기). */
function cluster(values, tolerance) {
  const sorted = [...values].sort((a, b) => a - b);
  const centers = [];
  let bucket = [];
  for (const value of sorted) {
    if (bucket.length && value - bucket[bucket.length - 1] > tolerance) {
      centers.push(bucket.reduce((sum, item) => sum + item, 0) / bucket.length);
      bucket = [];
    }
    bucket.push(value);
  }
  if (bucket.length) centers.push(bucket.reduce((sum, item) => sum + item, 0) / bucket.length);
  return centers;
}

/**
 * 문단 하나가 <block> 하나다. 다만 쪽을 넘어가며 문장이 이어지는 경우만 붙이고,
 * 그림 속 눈금(+9, 8 같은)은 문장 사이에 끼어들지 않도록 버린다.
 */
function mergeParagraphs(blocks) {
  const out = [];
  for (const block of blocks) {
    if (block.kind === "p" && FIGURE_LABEL.test(block.text.trim())) continue;
    const prev = out[out.length - 1];
    if (
      prev &&
      prev.kind === "p" &&
      block.kind === "p" &&
      !SENTENCE_END.test(prev.text.trim()) &&
      /^[a-z(]/.test(block.text.trim())
    ) {
      prev.text = `${prev.text} ${block.text.trim()}`;
      continue;
    }
    out.push(block);
  }
  return out;
}

function toBlocks(items, headings, moveNames) {
  const blocks = [];
  for (const item of items) {
    switch (item.kind) {
      case "chapter":
        blocks.push({ kind: "chapter", title: item.title });
        break;
      case "heading":
        blocks.push({ kind: "heading", depth: item.depth, text: item.text, y: item.y });
        break;
      case "list":
        blocks.push({ kind: "li", items: item.items });
        break;
      case "table": {
        if (item.variant === "fields") {
          blocks.push({ kind: "fields", rows: item.rows.map((row) => [row.cells[0].text, row.cells[1].text]) });
          break;
        }

        const headerCells = item.header ? item.header.cells : null;

        // 한 쪽에 표가 나란히 놓이기도 하므로, 굴림 칸(또는 첫 칸)의 x 좌표로 표마다 가른다.
        const entries = [];
        if (item.variant === "roll") {
          // (굴림, 결과) 짝으로 묶는다 — 한 줄에 짝이 여럿이면 표도 여럿이다.
          for (const row of item.rows) {
            const cells = expandCells(row.cells);
            for (let c = 0; c + 1 < cells.length; c += 2)
              entries.push({ x: cells[c].x, cells: [{ text: cells[c].text }, { text: cells[c + 1].text }] });
          }
        } else {
          for (const row of item.rows) entries.push({ x: row.cells[0].x, cells: row.cells });
        }

        const lead = (entry) => entry.cells[0].x ?? entry.x;
        const centers = cluster([...entries.map((entry) => lead(entry)), ...(headerCells ? [lead({ cells: headerCells })] : [])], 20);
        const nearest = (x) => {
          let best = 0;
          centers.forEach((center, g) => {
            if (Math.abs(x - center) < Math.abs(x - centers[best])) best = g;
          });
          return best;
        };

        const groups = centers.map(() => []);
        for (const entry of entries) groups[nearest(lead(entry))].push(entry);
        const headerGroup = headerCells ? nearest(lead({ cells: headerCells })) : -1;

        groups.forEach((group, g) => {
          if (!group.length) return;
          const table = group.map((entry) => entry.cells.map((cell) => cell.text.trim()));
          const head = headerGroup === g && headerCells ? headerCells.map((cell) => cell.text.trim()) : null;
          // 머리줄에 굴림 칸 이름이 없으면(‘Prefix | Suffix’) 첫 칸 이름을 지어 준다.
          if (head && head.length === table[0].length - 1) head.unshift("d100");
          if (head) {
            blocks.push({ kind: "table", header: head, rows: table });
            return;
          }
          // 굴림 칸이 없는 표는 첫 줄이 머리줄이다(‘Rank | Amount’). 굴림으로 시작하면 이름을 지어 준다.
          if (item.variant === "grid" && !ROLL_RE.test(table[0][0])) {
            blocks.push({ kind: "table", header: table.shift(), rows: table });
            return;
          }
          const width = Math.max(...table.map((row) => row.length), 2);
          const head2 = Array.from({ length: width }, (_, i) => (i === 0 ? "d100" : "Result"));
          blocks.push({ kind: "table", header: head2, rows: table });
        });
        break;
      }
      case "box": {
        const head = item.blocks[0];
        const name = blockText(head);
        const move = moveNames.has(name.toUpperCase()) ? name.toUpperCase() : null;
        if (move) {
          blocks.push({ kind: "move", name: headings.get(move)?.title ?? move, body: item.blocks.slice(1) });
        } else {
          if (/^[+\-\d\s]+$/.test(name)) break; // 그림 속 눈금
          const titled = head.lines.length === 1 && isCapsHeading(name);
          blocks.push({ kind: "quote", title: titled ? name : null, body: titled ? item.blocks.slice(1) : item.blocks });
        }
        break;
      }
      case "synthetic": {
        const entry = item.item;
        if (entry.kind === "oli") blocks.push({ kind: "oli", marker: entry.marker, text: entry.text });
        else blocks.push({ kind: "p", text: entry.lead ? `**${entry.text}**` : entry.text });
        break;
      }
      default: {
        const text = item.text.trim();
        if (!text) break;
        const bullets = bulletItems(text);
        if (bullets) {
          blocks.push({ kind: "li", items: bullets });
        } else if (item.spaced && isCapsHeading(text) && blocks.length && !knownHeading(headings, text)) {
          blocks.push({ kind: "heading", depth: 4, text });
        } else {
          blocks.push({ kind: "p", text });
        }
      }
    }
  }

  // 어느 길로 왔든 `•`로 나뉜 문단은 목록으로 푼다(지역·애셋 카드의 글머리 목록).
  const expanded = [];
  for (const block of blocks) {
    const bullets = block.kind === "p" ? bulletItems(block.text) : null;
    if (bullets) expanded.push({ kind: "li", items: bullets });
    else expanded.push(block);
  }
  return mergeParagraphs(expanded);
}

// ---------------------------------------------------------------------------
// 5. 블록 → 마크다운
// ---------------------------------------------------------------------------

function renderBlocks(blocks) {
  const chunks = [];
  let previousKind = null;
  for (const block of blocks) {
    const kind = block.kind;
    switch (block.kind) {
      case "chapter":
        break;
      case "heading":
        chunks.push(`${"#".repeat(Math.min(block.depth, 6))} ${titleCase(block.text)}`);
        break;
      case "move": {
        chunks.push(`### ${titleCase(block.name)}`);
        chunks.push(renderBox(boxItems(block.body)).join("\n"));
        break;
      }
      case "quote": {
        const body = [];
        if (block.title) body.push(`> **${titleCase(block.title)}**`, ">");
        body.push(...renderBox(boxItems(block.body)));
        chunks.push(body.join("\n"));
        break;
      }
      case "table": {
        const width = Math.max(block.header.length, ...block.rows.map((row) => row.length));
        const cell = (value) => String(value ?? "").replace(/\|/g, "\\|");
        const line = (row) => `| ${[...row, ...Array(width - row.length).fill("")].map(cell).join(" | ")} |`;
        chunks.push(
          [
            line(block.header),
            `| ${Array.from({ length: width }, () => "---").join(" | ")} |`,
            ...block.rows.map(line),
          ].join("\n"),
        );
        break;
      }
      case "fields":
        chunks.push(block.rows.map((row) => `- **${row[0]}** ${row[1]}`).join("\n"));
        break;
      case "li":
        chunks.push(block.items.map((item) => `- ${item}`).join("\n"));
        break;
      case "oli": {
        // 이어지는 번호 항목은 빈 줄로 끊지 않고 한 목록으로 묶는다(마크다운이 목록 하나로 보게).
        const line = `${block.marker}. ${block.text}`;
        if (previousKind === "oli") chunks[chunks.length - 1] += `\n${line}`;
        else chunks.push(line);
        break;
      }
      default:
        chunks.push(block.text);
    }
    previousKind = kind;
  }
  return `${chunks.filter(Boolean).join("\n\n")}\n`;
}

// ---------------------------------------------------------------------------
// 6. 단위로 자르기
// ---------------------------------------------------------------------------

function sliceUnits(blocks) {
  if (!RANGES.length) throw new Error("RANGES가 비어 있습니다. --toc로 목차를 확인하고 경계를 적어 주세요.");
  if (RANGES[0].chapter !== null || RANGES[0].from !== null) {
    throw new Error("첫 단위는 머리말이어야 합니다(chapter: null, from: null).");
  }

  const starts = [0];
  let cursor = 0;
  let chapter = null;

  for (let r = 1; r < RANGES.length; r++) {
    const range = RANGES[r];
    let found = -1;
    for (let i = cursor; i < blocks.length; i++) {
      const block = blocks[i];
      if (block.kind === "chapter") {
        chapter = block.title;
        continue;
      }
      if (block.kind !== "heading") continue;
      if (block.text.toUpperCase() !== range.from.toUpperCase()) continue;
      if (range.chapter && chapter !== range.chapter.toUpperCase()) {
        throw new Error(`[${range.slug}] "${range.from}" 절을 ${range.chapter} 장에서 찾지 못했습니다(현재 장: ${chapter}).`);
      }
      found = i;
      break;
    }
    if (found < 0) throw new Error(`[${range.slug}] "${range.from}" 경계를 찾지 못했습니다.`);
    starts.push(found);
    cursor = found;
  }

  const endIndex = blocks.findIndex((block, i) => i >= cursor && block.kind === "heading" && block.text.toUpperCase() === DOC_END);
  if (endIndex < 0) throw new Error(`문서 끝(${DOC_END})을 찾지 못했습니다.`);

  return RANGES.map((range, i) => ({
    range,
    blocks: blocks.slice(starts[i], i + 1 < starts.length ? starts[i + 1] : endIndex),
  }));
}

// ---------------------------------------------------------------------------
// 7. 실행
// ---------------------------------------------------------------------------

const pages = parsePages(readBboxHtml());
rebuildCellStacks(pages);
const entries = tocEntries(readFrontText());
const headings = buildHeadings(entries);
const moveNames = buildMoveNames(entries);
const chapterTitles = chapterNames(entries);

if (wantToc) {
  for (const entry of entries) console.log(`${"  ".repeat(entry.depth - 1)}${entry.title}  (p.${entry.page})`);
  console.log(`\n헤딩 사전 ${headings.size}개 · 무브 ${moveNames.size}개`);
  process.exit(0);
}

// 목차 쪽은 원고에서 뺀다(장 목록은 chapters.ts가 맡는다).
let sawContents = false;
let contentsDone = false;
const items = [];
for (const page of pages) {
  const pageText = page.blocks.map((block) => blockText(block)).join("\n");
  const hasContents = /(^|\n)CONTENTS(\n|$)/.test(pageText);
  const hasChapterOne = /(^|\n)CHAPTER 1(\n|$)/.test(pageText);
  if (hasContents) sawContents = true;
  if (sawContents && !contentsDone) {
    if (hasChapterOne) {
      contentsDone = true;
    } else {
      continue;
    }
  }
  items.push(...pageItems(page, headings, chapterTitles));
}

const blocks = toBlocks(items, headings, moveNames);
const units = sliceUnits(blocks);

fs.mkdirSync(EN_DIR, { recursive: true });
fs.mkdirSync(KO_DIR, { recursive: true });

const seen = new Set();
const report = [];

for (const { range, blocks: unitBlocks } of units) {
  if (seen.has(range.slug)) throw new Error(`[${range.slug}] 슬러그가 겹칩니다.`);
  seen.add(range.slug);

  const markdown = renderBlocks(unitBlocks);
  const headingCount = unitBlocks.filter((block) => block.kind === "heading" || block.kind === "move").length;
  const words = markdown.split(/\s+/).filter(Boolean).length;

  if (!markdown.trim()) throw new Error(`[${range.slug}] 원고가 비었습니다.`);
  if (/\uFFFD/.test(markdown)) throw new Error(`[${range.slug}] 대체문자(U+FFFD)가 있습니다.`);

  fs.writeFileSync(path.join(EN_DIR, `${range.slug}.md`), markdown);

  const koPath = path.join(KO_DIR, `${range.slug}.md`);
  const ko = fs.existsSync(koPath) ? fs.readFileSync(koPath, "utf8") : null;
  if (ko !== null && !skipKoCheck) checkKoStructure(range.slug, markdown, ko);

  report.push({ ...range, headingCount, words, translated: ko !== null });
}

writeChaptersFile(report);

const width = Math.max(...report.map((row) => row.slug.length));
console.log(`\n단위 ${report.length}개 · 영어 원고 ${rel(EN_DIR)}/`);
for (const row of report) {
  console.log(
    `  ${row.slug.padEnd(width)}  ${String(row.headingCount).padStart(2)}헤딩  ${String(row.words).padStart(5)}단어  ${row.translated ? "번역 있음" : "원문만"}`,
  );
}
const done = report.filter((row) => row.translated).length;
console.log(`\n한국어 원고: ${done}/${report.length}개 · 나머지 단위는 사이트가 영어 원문만 보여 줍니다.`);

// ---------------------------------------------------------------------------
// 8. 검사·산출물
// ---------------------------------------------------------------------------

function headingDepths(markdown) {
  return markdown
    .split("\n")
    .map((line) => line.match(/^(#{2,6}) /))
    .filter(Boolean)
    .map((match) => match[1].length);
}

/** 한국어 원고가 영어 원고와 같은 헤딩 구조인지 먼저 본다(빌드 전에 걸러 내려고). */
function checkKoStructure(slug, enMarkdown, koMarkdown) {
  if (/^---\r?\n/.test(koMarkdown)) {
    throw new Error(`[${slug}] 한국어 원고에 frontmatter가 있습니다. 본문만 쓰세요.`);
  }
  const en = headingDepths(enMarkdown);
  const ko = headingDepths(koMarkdown);
  if (en.length !== ko.length) {
    throw new Error(`[${slug}] 헤딩 개수가 다릅니다: EN ${en.length}개, KO ${ko.length}개. 원문 구조를 그대로 옮기세요.`);
  }
  en.forEach((depth, index) => {
    if (depth !== ko[index]) {
      throw new Error(`[${slug}] ${index + 1}번째 헤딩 깊이가 다릅니다: EN h${depth}, KO h${ko[index]}`);
    }
  });
}

function writeChaptersFile(rows) {
  const body = rows.map(
    (row) =>
      `  { slug: ${JSON.stringify(row.slug)}, titleEn: ${JSON.stringify(row.titleEn)}, titleKo: ${JSON.stringify(row.titleKo)}, part: ${JSON.stringify(row.part)}, status: ${JSON.stringify(row.translated ? "translated" : "pending")} },`,
  );
  const file = [
    "// 이 파일은 scripts/ironsworn-extract-rulebook.mjs가 생성합니다. 손으로 고치지 마세요.",
    "// 단위 경계는 스크립트의 RANGES, 상태(translated/pending)는 src/data/ironsworn/ko/<슬러그>.md의 존재 여부에서 나옵니다.",
    "",
    'export type IronswornChapterStatus = "translated" | "pending";',
    "",
    "export type IronswornChapterMeta = {",
    "  /** 라우트 슬러그이자 data/ironsworn/{en,ko}/<slug>.md 파일 이름 */",
    "  slug: string;",
    "  titleEn: string;",
    "  titleKo: string;",
    "  /** 책의 큰 부분 — 색인 페이지에서 묶어 보여 줄 때 쓴다. */",
    "  part: string;",
    "  status: IronswornChapterStatus;",
    "};",
    "",
    "export const IRONSWORN_SOURCE = {",
    '  title: "Ironsworn",',
    '  titleKo: "철의 맹세",',
    '  author: "Shawn Tomkin",',
    '  date: "2019-06-09",',
    '  file: "Ironsworn-Rulebook.pdf",',
    "  pageCount: 270,",
    '  license: "CC BY-NC-SA 4.0",',
    '  licenseUrl: "https://creativecommons.org/licenses/by-nc-sa/4.0/",',
    '  site: "https://www.ironswornrpg.com/",',
    "};",
    "",
    "export const IRONSWORN_CHAPTERS: IronswornChapterMeta[] = [",
    ...body,
    "];",
    "",
  ].join("\n");
  fs.writeFileSync(CHAPTERS_FILE, file);
}
