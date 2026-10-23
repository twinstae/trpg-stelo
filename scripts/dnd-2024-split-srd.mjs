#!/usr/bin/env bun
/**
 * D&D 2024 SRD 5.2.1 마크다운 → 영/한 대역 원고
 *
 *   bun scripts/dnd-2024-split-srd.mjs            # 영어 원고 재생성 + 검사
 *   bun scripts/dnd-2024-split-srd.mjs --refresh  # 원천 마크다운부터 다시 내려받기
 *   bun scripts/dnd-2024-split-srd.mjs --check    # 파일을 쓰지 않고 한국어 원고 구조만 검사(여럿이 함께 번역할 때)
 *
 * 입출력
 *   github.com/downfallx/dnd-5e-srd-markdown     원천(SOURCE_COMMIT로 고정)
 *   .freebuff/dnd-srd-5.2.1/<파일>.md            내려받은 원천 캐시(git에 넣지 않는다)
 *   scripts/dnd-2024-split-srd.mjs              단위 경계(RANGES) — 이 파일이 기준
 *   src/data/dnd-2024/en/<슬러그>.md             자동 생성. 손대지 않는다
 *   src/data/dnd-2024/ko/<슬러그>.md             사람이 쓰는 번역. 이 스크립트는 건드리지 않는다
 *   src/data/dnd-2024/chapters.ts               생성물(단위 목록·상태)
 *
 * 원천을 그대로 쪼개되 두 가지를 손본다.
 *
 * 1. 속성 없는 단순한 HTML 표(<table><thead>…)는 마크다운 표로 바꾼다. 원천은 표 579개를
 *    모두 HTML로 적어서 원고가 세 배쯤 부풀고 번역하기도 나쁘다. colspan·rowspan이 있거나
 *    머리줄이 없는 표는 HTML 그대로 둔다.
 * 2. 헤딩마다 영어 슬러그로 `<a id="…"></a>`를 심는다. 한국어 원고에 앵커가 없으면 대역
 *    페이지가 영어 쪽 앵커를 id로 쓰므로, 번역해도 `#grappled-condition` 같은 링크가 산다.
 */

import fs from "node:fs";
import path from "node:path";
import GithubSlugger from "github-slugger";

const ROOT = path.resolve(import.meta.dir, "..");
const SOURCE_REPO = "downfallx/dnd-5e-srd-markdown";
const SOURCE_COMMIT = "1b4b99dcb786cdd1a2fb26f8acec1551191f1ca4";
const CACHE_DIR = path.join(ROOT, ".freebuff", "dnd-srd-5.2.1");
const EN_DIR = path.join(ROOT, "src/data/dnd-2024/en");
const KO_DIR = path.join(ROOT, "src/data/dnd-2024/ko");
const CHAPTERS_FILE = path.join(ROOT, "src/data/dnd-2024/chapters.ts");

const refresh = process.argv.includes("--refresh");
const checkOnly = process.argv.includes("--check");

const PARTS = {
  play: "게임 플레이",
  creation: "캐릭터 만들기",
  classes: "클래스",
  origins: "캐릭터 기원",
  feats: "재주",
  equipment: "장비",
  spells: "주문",
  glossary: "규칙 용어집",
  toolbox: "게임 진행 도구",
  magicItems: "마법 물건",
  monsters: "괴물",
  animals: "동물",
};

/**
 * 대역 단위. SRD 5.2.1의 장 순서대로 적는다.
 *
 *   file:     원천 파일 이름(확장자 없이)
 *   from:     단위가 시작하는 헤딩의 글(정확히 일치). null이면 파일 처음(# 장 제목 다음)부터.
 *   tocDepth: 오른쪽 목차에 넣을 헤딩 깊이. 항목이 h4인 목록(주문·마법 물건·용어집)만 4.
 *
 * 같은 파일의 다음 단위가 시작하는 곳에서 끝난다. 한 파일의 첫 단위는 from이 null이어야 한다.
 * 헤딩을 찾지 못하거나 순서가 어긋나면 이 스크립트가 실패한다.
 */
const RANGES = [
  { slug: "rhythm-of-play", titleEn: "Rhythm of Play and the Six Abilities", titleKo: "플레이의 흐름과 여섯 능력치", part: PARTS.play, file: "playing-the-game", from: null },
  { slug: "d20-tests", titleEn: "D20 Tests", titleKo: "d20 판정", part: PARTS.play, file: "playing-the-game", from: "D20 Tests" },
  { slug: "proficiency", titleEn: "Proficiency", titleKo: "숙련", part: PARTS.play, file: "playing-the-game", from: "Proficiency" },
  { slug: "actions", titleEn: "Actions", titleKo: "행동", part: PARTS.play, file: "playing-the-game", from: "Actions" },
  { slug: "social-interaction", titleEn: "Social Interaction", titleKo: "사회적 교류", part: PARTS.play, file: "playing-the-game", from: "Social Interaction" },
  { slug: "exploration", titleEn: "Exploration", titleKo: "탐험", part: PARTS.play, file: "playing-the-game", from: "Exploration" },
  { slug: "combat", titleEn: "Combat", titleKo: "전투", part: PARTS.play, file: "playing-the-game", from: "Combat" },
  { slug: "damage-and-healing", titleEn: "Damage and Healing", titleKo: "피해와 치유", part: PARTS.play, file: "playing-the-game", from: "Damage and Healing" },

  { slug: "creating-a-character", titleEn: "Creating a Character", titleKo: "캐릭터 만들기", part: PARTS.creation, file: "character-creation", from: null },
  { slug: "level-advancement", titleEn: "Level Advancement and Multiclassing", titleKo: "레벨 상승과 멀티클래스", part: PARTS.creation, file: "character-creation", from: "Level Advancement" },
  { slug: "trinkets", titleEn: "Trinkets", titleKo: "잡동사니", part: PARTS.creation, file: "character-creation", from: "Trinkets" },

  { slug: "barbarian", titleEn: "Barbarian", titleKo: "바바리안", part: PARTS.classes, file: "classes", from: null },
  { slug: "bard", titleEn: "Bard", titleKo: "바드", part: PARTS.classes, file: "classes", from: "Bard" },
  { slug: "cleric", titleEn: "Cleric", titleKo: "클레릭", part: PARTS.classes, file: "classes", from: "Cleric" },
  { slug: "druid", titleEn: "Druid", titleKo: "드루이드", part: PARTS.classes, file: "classes", from: "Druid" },
  { slug: "fighter", titleEn: "Fighter", titleKo: "파이터", part: PARTS.classes, file: "classes", from: "Fighter" },
  { slug: "monk", titleEn: "Monk", titleKo: "몽크", part: PARTS.classes, file: "classes", from: "Monk" },
  { slug: "paladin", titleEn: "Paladin", titleKo: "팔라딘", part: PARTS.classes, file: "classes", from: "Paladin" },
  { slug: "ranger", titleEn: "Ranger", titleKo: "레인저", part: PARTS.classes, file: "classes", from: "Ranger" },
  { slug: "rogue", titleEn: "Rogue", titleKo: "로그", part: PARTS.classes, file: "classes", from: "Rogue" },
  { slug: "sorcerer", titleEn: "Sorcerer", titleKo: "소서러", part: PARTS.classes, file: "classes", from: "Sorcerer" },
  { slug: "warlock", titleEn: "Warlock", titleKo: "워락", part: PARTS.classes, file: "classes", from: "Warlock" },
  { slug: "wizard", titleEn: "Wizard", titleKo: "위저드", part: PARTS.classes, file: "classes", from: "Wizard" },

  { slug: "backgrounds", titleEn: "Character Backgrounds", titleKo: "배경", part: PARTS.origins, file: "character-origins", from: null },
  { slug: "species", titleEn: "Character Species", titleKo: "종족", part: PARTS.origins, file: "character-origins", from: "Character Species" },

  { slug: "feats", titleEn: "Feats", titleKo: "재주", part: PARTS.feats, file: "feats", from: null },

  { slug: "coins-and-weapons", titleEn: "Coins and Weapons", titleKo: "동전과 무기", part: PARTS.equipment, file: "equipment", from: null },
  { slug: "armor", titleEn: "Armor", titleKo: "갑옷", part: PARTS.equipment, file: "equipment", from: "Armor" },
  { slug: "tools", titleEn: "Tools", titleKo: "도구", part: PARTS.equipment, file: "equipment", from: "Tools" },
  { slug: "adventuring-gear", titleEn: "Adventuring Gear", titleKo: "모험 장비", part: PARTS.equipment, file: "equipment", from: "Adventuring Gear" },
  { slug: "mounts-and-services", titleEn: "Mounts, Vehicles, and Services", titleKo: "탈것과 생활비, 고용", part: PARTS.equipment, file: "equipment", from: "Mounts and Vehicles" },
  { slug: "magic-items-and-crafting", titleEn: "Magic Items and Crafting", titleKo: "마법 물건과 제작", part: PARTS.equipment, file: "equipment", from: "Magic Items" },

  { slug: "spellcasting", titleEn: "Spellcasting", titleKo: "주문 시전", part: PARTS.spells, file: "spells", from: null },
  { slug: "spells-a", titleEn: "Spells A", titleKo: "주문 A", part: PARTS.spells, file: "spells", from: "Spell Descriptions", tocDepth: 4 },
  { slug: "spells-b-c", titleEn: "Spells B–C", titleKo: "주문 B–C", part: PARTS.spells, file: "spells", from: "Bane", tocDepth: 4 },
  { slug: "spells-d-e", titleEn: "Spells D–E", titleKo: "주문 D–E", part: PARTS.spells, file: "spells", from: "Dancing Lights", tocDepth: 4 },
  { slug: "spells-f-g", titleEn: "Spells F–G", titleKo: "주문 F–G", part: PARTS.spells, file: "spells", from: "Fabricate", tocDepth: 4 },
  { slug: "spells-h-l", titleEn: "Spells H–L", titleKo: "주문 H–L", part: PARTS.spells, file: "spells", from: "Hallow", tocDepth: 4 },
  { slug: "spells-m-o", titleEn: "Spells M–O", titleKo: "주문 M–O", part: PARTS.spells, file: "spells", from: "Mage Armor", tocDepth: 4 },
  { slug: "spells-p-r", titleEn: "Spells P–R", titleKo: "주문 P–R", part: PARTS.spells, file: "spells", from: "Passwall", tocDepth: 4 },
  { slug: "spells-s", titleEn: "Spells S", titleKo: "주문 S", part: PARTS.spells, file: "spells", from: "Sacred Flame", tocDepth: 4 },
  { slug: "spells-t-z", titleEn: "Spells T–Z", titleKo: "주문 T–Z", part: PARTS.spells, file: "spells", from: "Telekinesis", tocDepth: 4 },

  { slug: "glossary-conventions", titleEn: "Glossary Conventions", titleKo: "용어집 표기 규칙", part: PARTS.glossary, file: "rules-glossary", from: null },
  { slug: "glossary-a-c", titleEn: "Rules Definitions A–C", titleKo: "규칙 정의 A–C", part: PARTS.glossary, file: "rules-glossary", from: "Rules Definitions", tocDepth: 4 },
  { slug: "glossary-d-h", titleEn: "Rules Definitions D–H", titleKo: "규칙 정의 D–H", part: PARTS.glossary, file: "rules-glossary", from: "D20 Test", tocDepth: 4 },
  { slug: "glossary-i-r", titleEn: "Rules Definitions I–R", titleKo: "규칙 정의 I–R", part: PARTS.glossary, file: "rules-glossary", from: "Illusions", tocDepth: 4 },
  { slug: "glossary-s-z", titleEn: "Rules Definitions S–Z", titleKo: "규칙 정의 S–Z", part: PARTS.glossary, file: "rules-glossary", from: "Save", tocDepth: 4 },

  { slug: "travel-pace", titleEn: "Travel Pace", titleKo: "여행 속도", part: PARTS.toolbox, file: "gameplay-toolbox", from: null },
  { slug: "creating-a-background", titleEn: "Creating a Background", titleKo: "배경 만들기", part: PARTS.toolbox, file: "gameplay-toolbox", from: "Creating a Background" },
  { slug: "curses-and-contagions", titleEn: "Curses and Magical Contagions", titleKo: "저주와 마법 전염병", part: PARTS.toolbox, file: "gameplay-toolbox", from: "Curses and Magical Contagions" },
  { slug: "environmental-effects", titleEn: "Environmental Effects, Fear, and Mental Stress", titleKo: "환경 효과, 공포, 정신적 스트레스", part: PARTS.toolbox, file: "gameplay-toolbox", from: "Environmental Effects" },
  { slug: "poison", titleEn: "Poison", titleKo: "독", part: PARTS.toolbox, file: "gameplay-toolbox", from: "Poison" },
  { slug: "traps", titleEn: "Traps", titleKo: "함정", part: PARTS.toolbox, file: "gameplay-toolbox", from: "Traps" },
  { slug: "combat-encounters", titleEn: "Combat Encounters", titleKo: "전투 조우", part: PARTS.toolbox, file: "gameplay-toolbox", from: "Combat Encounters" },

  { slug: "magic-item-rules", titleEn: "Magic Item Rules", titleKo: "마법 물건 규칙", part: PARTS.magicItems, file: "magic-items", from: null },
  { slug: "magic-items-a-b", titleEn: "Magic Items A–B", titleKo: "마법 물건 A–B", part: PARTS.magicItems, file: "magic-items", from: "Magic Items A–Z", tocDepth: 4 },
  { slug: "magic-items-c-d", titleEn: "Magic Items C–D", titleKo: "마법 물건 C–D", part: PARTS.magicItems, file: "magic-items", from: "Candle of Invocation", tocDepth: 4 },
  { slug: "magic-items-e-h", titleEn: "Magic Items E–H", titleKo: "마법 물건 E–H", part: PARTS.magicItems, file: "magic-items", from: "Efficient Quiver", tocDepth: 4 },
  { slug: "magic-items-i-o", titleEn: "Magic Items I–O", titleKo: "마법 물건 I–O", part: PARTS.magicItems, file: "magic-items", from: "Immovable Rod", tocDepth: 4 },
  { slug: "magic-items-p-r", titleEn: "Magic Items P–R", titleKo: "마법 물건 P–R", part: PARTS.magicItems, file: "magic-items", from: "Pearl of Power", tocDepth: 4 },
  { slug: "magic-items-s", titleEn: "Magic Items S", titleKo: "마법 물건 S", part: PARTS.magicItems, file: "magic-items", from: "Scarab of Protection", tocDepth: 4 },
  { slug: "magic-items-t-z", titleEn: "Magic Items T–Z", titleKo: "마법 물건 T–Z", part: PARTS.magicItems, file: "magic-items", from: "Talisman of Pure Good", tocDepth: 4 },

  { slug: "stat-blocks", titleEn: "Monsters: Stat Blocks", titleKo: "괴물 자료 상자", part: PARTS.monsters, file: "monsters", from: null },
  { slug: "monsters-a", titleEn: "Monsters A", titleKo: "괴물 A", part: PARTS.monsters, file: "monsters-A-Z", from: null },
  { slug: "monsters-b", titleEn: "Monsters B", titleKo: "괴물 B", part: PARTS.monsters, file: "monsters-A-Z", from: "Balor" },
  { slug: "monsters-c", titleEn: "Monsters C", titleKo: "괴물 C", part: PARTS.monsters, file: "monsters-A-Z", from: "Centaur" },
  { slug: "monsters-d-f", titleEn: "Monsters D–F", titleKo: "괴물 D–F", part: PARTS.monsters, file: "monsters-A-Z", from: "Darkmantle" },
  { slug: "monsters-g", titleEn: "Monsters G", titleKo: "괴물 G", part: PARTS.monsters, file: "monsters-A-Z", from: "Gargoyle" },
  { slug: "monsters-h-l", titleEn: "Monsters H–L", titleKo: "괴물 H–L", part: PARTS.monsters, file: "monsters-A-Z", from: "Half-Dragon" },
  { slug: "monsters-m-o", titleEn: "Monsters M–O", titleKo: "괴물 M–O", part: PARTS.monsters, file: "monsters-A-Z", from: "Mages" },
  { slug: "monsters-p-r", titleEn: "Monsters P–R", titleKo: "괴물 P–R", part: PARTS.monsters, file: "monsters-A-Z", from: "Pegasus" },
  { slug: "monsters-s", titleEn: "Monsters S", titleKo: "괴물 S", part: PARTS.monsters, file: "monsters-A-Z", from: "Sahuagin" },
  { slug: "monsters-t-v", titleEn: "Monsters T–V", titleKo: "괴물 T–V", part: PARTS.monsters, file: "monsters-A-Z", from: "Tarrasque" },
  { slug: "monsters-w-z", titleEn: "Monsters W–Z", titleKo: "괴물 W–Z", part: PARTS.monsters, file: "monsters-A-Z", from: "Warriors" },

  { slug: "animals-a-f", titleEn: "Animals A–F", titleKo: "동물 A–F", part: PARTS.animals, file: "animals", from: null },
  { slug: "animals-g", titleEn: "Animals G", titleKo: "동물 G", part: PARTS.animals, file: "animals", from: "Giant Ape" },
  { slug: "animals-h-r", titleEn: "Animals H–R", titleKo: "동물 H–R", part: PARTS.animals, file: "animals", from: "Hawk" },
  { slug: "animals-s-z", titleEn: "Animals S–Z", titleKo: "동물 S–Z", part: PARTS.animals, file: "animals", from: "Saber-Toothed Tiger" },
];

const rel = (file) => path.relative(ROOT, file);

// ---------------------------------------------------------------------------
// 1. 원천
// ---------------------------------------------------------------------------

async function loadSource(file) {
  const cachePath = path.join(CACHE_DIR, `${file}.md`);
  if (!refresh && fs.existsSync(cachePath)) return fs.readFileSync(cachePath, "utf8");
  const url = `https://raw.githubusercontent.com/${SOURCE_REPO}/${SOURCE_COMMIT}/${file}.md`;
  const response = await fetch(url);
  if (!response.ok) throw new Error(`${url}을 받지 못했습니다: ${response.status}`);
  const text = await response.text();
  fs.mkdirSync(CACHE_DIR, { recursive: true });
  fs.writeFileSync(cachePath, text);
  console.log(`내려받음: ${rel(cachePath)}`);
  return text;
}

// ---------------------------------------------------------------------------
// 2. HTML 표 → 마크다운 표
// ---------------------------------------------------------------------------

/** 표 칸 안의 HTML을 마크다운 한 줄로. 옮길 수 없는 태그가 있으면 null. */
function cellToMarkdown(inner) {
  let text = inner.replace(/\s*\n\s*/g, " ").trim();
  text = text
    .replace(/<strong>([\s\S]*?)<\/strong>/g, (_m, body) => (body.trim() ? `**${body.trim()}**` : ""))
    .replace(/<em>([\s\S]*?)<\/em>/g, (_m, body) => (body.trim() ? `_${body.trim()}_` : ""));
  if (/<(?!br\s*\/?>)\/?[a-z]/i.test(text)) return null;
  return text.replace(/\|/g, "\\|");
}

function rowsOf(html) {
  return [...html.matchAll(/<tr>([\s\S]*?)<\/tr>/g)].map((row) =>
    [...row[1].matchAll(/<(th|td)>([\s\S]*?)<\/\1>/g)].map((cell) => cellToMarkdown(cell[2])),
  );
}

/** 머리줄 하나에 속성 없는 칸만 있는 표만 옮긴다. 아니면 null(HTML 그대로). */
function tableToMarkdown(html) {
  if ((html.match(/<table/g) ?? []).length !== 1) return null;
  if (/<t[hdr]\s[^>]*>/.test(html)) return null;
  const head = html.match(/<thead>([\s\S]*?)<\/thead>/)?.[1];
  const body = html.match(/<tbody>([\s\S]*?)<\/tbody>/)?.[1];
  if (head === undefined || body === undefined) return null;
  const headRows = rowsOf(head);
  const bodyRows = rowsOf(body);
  if (headRows.length !== 1) return null;
  const rows = [headRows[0], ...bodyRows];
  const width = headRows[0].length;
  if (rows.some((row) => row.length !== width || row.includes(null))) return null;
  const line = (cells) => `| ${cells.join(" | ")} |`;
  return [line(rows[0]), line(rows[0].map(() => "---")), ...bodyRows.map(line)].join("\n");
}

function convertTables(markdown, stats) {
  return markdown.replace(/<table>[\s\S]*?<\/table>/g, (html) => {
    const converted = tableToMarkdown(html);
    if (converted === null) stats.kept += 1;
    else stats.converted += 1;
    return converted ?? html;
  });
}

/**
 * 원천 변환본의 능력치 표가 깨진 곳. 칸이 밀리거나 값 두 개가 한 칸에 붙어 있어, 같은 표의 값으로
 * 복원한다(SRD 5.2.1 PDF와 같은 값). 표를 마크다운으로 바꾼 뒤의 줄을 통째로 바꾼다.
 */
const ERRATA = {
  "monsters-A-Z": [
    // Ancient Red Dragon
    ["| **STR** | 30 | +10 +10 | DEX | **DEX** | 10 +0 | +7 | CON 29 | **CON** | 29 | +9 +9 | INT |", "| **STR** | 30 | +10 | +10 | **DEX** | 10 | +0 | +7 | **CON** | 29 | +9 | +9 |"],
    ["| **INT** | 18 | +4 +4 | WIS | **WIS** | 15 +2 | +9 | CHA 27 | **CHA** | 27 | +8 +8 | +8 +8 |", "| **INT** | 18 | +4 | +4 | **WIS** | 15 | +2 | +9 | **CHA** | 27 | +8 | +8 |"],
    // Remorhaz
    ["| **STR** | 24 | +7 +7 | DEX | **DEX** | 13 +1 | +1 | CON 21 | **CON** | 21 | +5 +5 | INT |", "| **STR** | 24 | +7 | +7 | **DEX** | 13 | +1 | +1 | **CON** | 21 | +5 | +5 |"],
    ["| **INT** | 4 | −3 −3 | WIS | **WIS** | 10 +0 | +0 | CHA 5 | **CHA** | 5 | −3 −3 | −3 −3 |", "| **INT** | 4 | −3 | −3 | **WIS** | 10 | +0 | +0 | **CHA** | 5 | −3 | −3 |"],
    // Young White Dragon
    ["| **INT** | 6 | −2 | 2 | **WIS** | 11 | +0 | +3 | **CHA** | 12 | +1 | +1 |", "| **INT** | 6 | −2 | −2 | **WIS** | 11 | +0 | +3 | **CHA** | 12 | +1 | +1 |"],
    // Will-o'-Wisp
    ["| **STR** | -5 | -5 | DEX | **DEX** | 28 | +9 | +9 | **CON** | 10 | +0 | +0 |", "| **STR** | 1 | −5 | −5 | **DEX** | 28 | +9 | +9 | **CON** | 10 | +0 | +0 |"],
  ],
};

function applyErrata(file, markdown) {
  return (ERRATA[file] ?? []).reduce((text, [broken, fixed]) => {
    if (!text.includes(broken)) throw new Error(`[${file}] 보정할 줄을 찾지 못했습니다: ${broken}`);
    return text.replace(broken, fixed);
  }, markdown);
}

// ---------------------------------------------------------------------------
// 3. 단위로 나누기
// ---------------------------------------------------------------------------

const HEADING_RE = /^(#{2,6}) (.+)$/;

function splitFile(file, lines, ranges) {
  if (ranges[0].from !== null) throw new Error(`[${file}] 첫 단위(${ranges[0].slug})의 from은 null이어야 합니다`);
  const starts = [];
  let cursor = 0;
  for (const range of ranges) {
    if (range.from === null) {
      starts.push(0);
      continue;
    }
    const index = lines.findIndex((line, i) => i > cursor && line.match(HEADING_RE)?.[2] === range.from);
    if (index === -1) throw new Error(`[${file}] ${range.slug}: "${range.from}" 헤딩을 앞 단위 뒤에서 찾지 못했습니다`);
    starts.push(index);
    cursor = index;
  }
  return ranges.map((range, i) => ({ range, lines: lines.slice(starts[i], starts[i + 1] ?? lines.length) }));
}

/**
 * `**Casting Time:** Action` 처럼 굵은 이름표로 시작하는 줄이 이어지면 원천은 줄바꿈 없이 적어서
 * 마크다운에서 한 문단으로 붙어 버린다. 마지막 줄을 빼고 `<br>`을 붙여 줄을 지킨다(괴물 자료 상자와 같은 방식).
 */
const LABEL_LINE_RE = /^\*\*[^*]+:\*\* /;

function keepLabelLines(lines) {
  return lines.map((line, i) => {
    const next = lines[i + 1];
    if (!LABEL_LINE_RE.test(line) || next === undefined || !LABEL_LINE_RE.test(next)) return line;
    return /<br>\s*$/.test(line) ? line : `${line}<br>`;
  });
}

/** 헤딩 앞에 영어 슬러그 앵커를 심는다. 같은 단위 안에서 겹치면 -1, -2가 붙는다. */
function addAnchors(lines) {
  const slugger = new GithubSlugger();
  return lines.map((line) => {
    const match = line.match(HEADING_RE);
    if (!match) return line;
    return `${match[1]} <a id="${slugger.slug(match[2])}"></a>${match[2]}`;
  });
}

// ---------------------------------------------------------------------------
// 4. 검사·산출물
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
  const body = rows.map((row) => {
    const tocDepth = row.tocDepth ? `, tocDepth: ${row.tocDepth}` : "";
    return `  { slug: ${JSON.stringify(row.slug)}, titleEn: ${JSON.stringify(row.titleEn)}, titleKo: ${JSON.stringify(row.titleKo)}, part: ${JSON.stringify(row.part)}, status: ${JSON.stringify(row.translated ? "translated" : "pending")}${tocDepth} },`;
  });
  const file = [
    "// 이 파일은 scripts/dnd-2024-split-srd.mjs가 생성합니다. 손으로 고치지 마세요.",
    "// 단위 경계는 스크립트의 RANGES, 상태(translated/pending)는 src/data/dnd-2024/ko/<슬러그>.md의 존재 여부에서 나옵니다.",
    "",
    'export type Dnd2024ChapterStatus = "translated" | "pending";',
    "",
    "export type Dnd2024ChapterMeta = {",
    "  /** 라우트 슬러그이자 data/dnd-2024/{en,ko}/<slug>.md 파일 이름 */",
    "  slug: string;",
    "  titleEn: string;",
    "  titleKo: string;",
    "  /** SRD의 장 — 사이드바와 목차에서 섹션으로 묶는다. */",
    "  part: string;",
    "  status: Dnd2024ChapterStatus;",
    "  /** 오른쪽 목차에 넣을 헤딩 깊이. 없으면 3. */",
    "  tocDepth?: number;",
    "};",
    "",
    "export const DND_2024_SOURCE = {",
    '  title: "System Reference Document 5.2.1",',
    '  titleKo: "D&D 2024 SRD 5.2.1",',
    '  publisher: "Wizards of the Coast",',
    '  year: "2025",',
    '  license: "CC BY 4.0",',
    '  licenseUrl: "https://creativecommons.org/licenses/by/4.0/legalcode",',
    '  url: "https://www.dndbeyond.com/srd",',
    `  markdownUrl: "https://github.com/${SOURCE_REPO}/tree/${SOURCE_COMMIT}",`,
    "};",
    "",
    "export const DND_2024_CHAPTERS: Dnd2024ChapterMeta[] = [",
    ...body,
    "];",
    "",
  ].join("\n");
  fs.writeFileSync(CHAPTERS_FILE, file);
}

// ---------------------------------------------------------------------------
// 5. 실행
// ---------------------------------------------------------------------------

const slugs = new Set();
for (const range of RANGES) {
  if (slugs.has(range.slug)) throw new Error(`슬러그가 겹칩니다: ${range.slug}`);
  slugs.add(range.slug);
}

const files = [...new Set(RANGES.map((range) => range.file))];
const stats = { converted: 0, kept: 0 };
const units = new Map();

for (const file of files) {
  const source = (await loadSource(file)).replace(/\r\n/g, "\n");
  // 장 제목(# …)은 대역 페이지 머리말이 대신한다.
  const body = applyErrata(file, convertTables(source.replace(/^# .*\n+/, ""), stats));
  const lines = body.split("\n");
  for (const { range, lines: unitLines } of splitFile(file, lines, RANGES.filter((r) => r.file === file))) {
    units.set(range.slug, `${addAnchors(keepLabelLines(unitLines)).join("\n").trim()}\n`);
  }
}

if (!checkOnly) {
  fs.mkdirSync(EN_DIR, { recursive: true });
  fs.mkdirSync(KO_DIR, { recursive: true });
}

const report = [];
// 여럿이 함께 번역하는 중이면 쓰다 만 원고가 있다. 영어 원고는 끝까지 쓰고, 한국어 구조 오류는 모아서 마지막에 알린다.
const koErrors = [];
for (const range of RANGES) {
  const markdown = units.get(range.slug);
  if (!checkOnly) fs.writeFileSync(path.join(EN_DIR, `${range.slug}.md`), markdown);
  const koPath = path.join(KO_DIR, `${range.slug}.md`);
  const ko = fs.existsSync(koPath) ? fs.readFileSync(koPath, "utf8") : null;
  if (ko !== null) {
    try {
      checkKoStructure(range.slug, markdown, ko);
    } catch (error) {
      koErrors.push(error.message);
    }
  }
  report.push({
    ...range,
    headingCount: headingDepths(markdown).length,
    kb: Math.round(Buffer.byteLength(markdown) / 1024),
    translated: ko !== null,
  });
}

for (const stale of fs.readdirSync(EN_DIR)) {
  if (!slugs.has(stale.replace(/\.md$/, ""))) console.warn(`경고: RANGES에 없는 영어 원고 ${rel(path.join(EN_DIR, stale))}`);
}

if (koErrors.length > 0) {
  console.error(`\n한국어 원고 구조 오류 ${koErrors.length}개 (chapters.ts는 갱신하지 않음):`);
  for (const message of koErrors) console.error(`  ${message}`);
  process.exit(1);
}

if (!checkOnly) writeChaptersFile(report);

const width = Math.max(...report.map((row) => row.slug.length));
console.log(`\n단위 ${report.length}개 · 영어 원고 ${rel(EN_DIR)}/ · 표 ${stats.converted}개를 마크다운으로, ${stats.kept}개는 HTML 그대로`);
for (const row of report) {
  console.log(
    `  ${row.slug.padEnd(width)}  ${String(row.headingCount).padStart(3)}헤딩  ${String(row.kb).padStart(3)}KB  ${row.translated ? "번역 있음" : "원문만"}`,
  );
}
const done = report.filter((row) => row.translated).length;
console.log(`\n한국어 원고: ${done}/${report.length}개 · 나머지 단위는 사이트가 영어 원문만 보여 줍니다.`);
