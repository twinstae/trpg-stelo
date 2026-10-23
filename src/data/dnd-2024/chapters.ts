// 이 파일은 scripts/dnd-2024-split-srd.mjs가 생성합니다. 손으로 고치지 마세요.
// 단위 경계는 스크립트의 RANGES, 상태(translated/pending)는 src/data/dnd-2024/ko/<슬러그>.md의 존재 여부에서 나옵니다.

export type Dnd2024ChapterStatus = "translated" | "pending";

export type Dnd2024ChapterMeta = {
  /** 라우트 슬러그이자 data/dnd-2024/{en,ko}/<slug>.md 파일 이름 */
  slug: string;
  titleEn: string;
  titleKo: string;
  /** SRD의 장 — 사이드바와 목차에서 섹션으로 묶는다. */
  part: string;
  status: Dnd2024ChapterStatus;
  /** 오른쪽 목차에 넣을 헤딩 깊이. 없으면 3. */
  tocDepth?: number;
};

export const DND_2024_SOURCE = {
  title: "System Reference Document 5.2.1",
  titleKo: "D&D 2024 SRD 5.2.1",
  publisher: "Wizards of the Coast",
  year: "2025",
  license: "CC BY 4.0",
  licenseUrl: "https://creativecommons.org/licenses/by/4.0/legalcode",
  url: "https://www.dndbeyond.com/srd",
  markdownUrl: "https://github.com/downfallx/dnd-5e-srd-markdown/tree/1b4b99dcb786cdd1a2fb26f8acec1551191f1ca4",
};

export const DND_2024_CHAPTERS: Dnd2024ChapterMeta[] = [
  { slug: "rhythm-of-play", titleEn: "Rhythm of Play and the Six Abilities", titleKo: "플레이의 흐름과 여섯 능력치", part: "게임 플레이", status: "translated" },
  { slug: "d20-tests", titleEn: "D20 Tests", titleKo: "d20 판정", part: "게임 플레이", status: "translated" },
  { slug: "proficiency", titleEn: "Proficiency", titleKo: "숙련", part: "게임 플레이", status: "translated" },
  { slug: "actions", titleEn: "Actions", titleKo: "행동", part: "게임 플레이", status: "translated" },
  { slug: "social-interaction", titleEn: "Social Interaction", titleKo: "사회적 교류", part: "게임 플레이", status: "translated" },
  { slug: "exploration", titleEn: "Exploration", titleKo: "탐험", part: "게임 플레이", status: "translated" },
  { slug: "combat", titleEn: "Combat", titleKo: "전투", part: "게임 플레이", status: "translated" },
  { slug: "damage-and-healing", titleEn: "Damage and Healing", titleKo: "피해와 치유", part: "게임 플레이", status: "translated" },
  { slug: "creating-a-character", titleEn: "Creating a Character", titleKo: "캐릭터 만들기", part: "캐릭터 만들기", status: "translated" },
  { slug: "level-advancement", titleEn: "Level Advancement and Multiclassing", titleKo: "레벨 상승과 멀티클래스", part: "캐릭터 만들기", status: "translated" },
  { slug: "trinkets", titleEn: "Trinkets", titleKo: "잡동사니", part: "캐릭터 만들기", status: "translated" },
  { slug: "barbarian", titleEn: "Barbarian", titleKo: "바바리안", part: "클래스", status: "translated" },
  { slug: "bard", titleEn: "Bard", titleKo: "바드", part: "클래스", status: "translated" },
  { slug: "cleric", titleEn: "Cleric", titleKo: "클레릭", part: "클래스", status: "translated" },
  { slug: "druid", titleEn: "Druid", titleKo: "드루이드", part: "클래스", status: "translated" },
  { slug: "fighter", titleEn: "Fighter", titleKo: "파이터", part: "클래스", status: "translated" },
  { slug: "monk", titleEn: "Monk", titleKo: "몽크", part: "클래스", status: "translated" },
  { slug: "paladin", titleEn: "Paladin", titleKo: "팔라딘", part: "클래스", status: "translated" },
  { slug: "ranger", titleEn: "Ranger", titleKo: "레인저", part: "클래스", status: "translated" },
  { slug: "rogue", titleEn: "Rogue", titleKo: "로그", part: "클래스", status: "translated" },
  { slug: "sorcerer", titleEn: "Sorcerer", titleKo: "소서러", part: "클래스", status: "translated" },
  { slug: "warlock", titleEn: "Warlock", titleKo: "워락", part: "클래스", status: "translated" },
  { slug: "wizard", titleEn: "Wizard", titleKo: "위저드", part: "클래스", status: "translated" },
  { slug: "backgrounds", titleEn: "Character Backgrounds", titleKo: "배경", part: "캐릭터 기원", status: "translated" },
  { slug: "species", titleEn: "Character Species", titleKo: "종족", part: "캐릭터 기원", status: "translated" },
  { slug: "feats", titleEn: "Feats", titleKo: "재주", part: "재주", status: "translated" },
  { slug: "coins-and-weapons", titleEn: "Coins and Weapons", titleKo: "동전과 무기", part: "장비", status: "translated" },
  { slug: "armor", titleEn: "Armor", titleKo: "갑옷", part: "장비", status: "translated" },
  { slug: "tools", titleEn: "Tools", titleKo: "도구", part: "장비", status: "translated" },
  { slug: "adventuring-gear", titleEn: "Adventuring Gear", titleKo: "모험 장비", part: "장비", status: "translated" },
  { slug: "mounts-and-services", titleEn: "Mounts, Vehicles, and Services", titleKo: "탈것과 생활비, 고용", part: "장비", status: "translated" },
  { slug: "magic-items-and-crafting", titleEn: "Magic Items and Crafting", titleKo: "마법 물건과 제작", part: "장비", status: "translated" },
  { slug: "spellcasting", titleEn: "Spellcasting", titleKo: "주문 시전", part: "주문", status: "pending" },
  { slug: "spells-a", titleEn: "Spells A", titleKo: "주문 A", part: "주문", status: "pending", tocDepth: 4 },
  { slug: "spells-b-c", titleEn: "Spells B–C", titleKo: "주문 B–C", part: "주문", status: "pending", tocDepth: 4 },
  { slug: "spells-d-e", titleEn: "Spells D–E", titleKo: "주문 D–E", part: "주문", status: "pending", tocDepth: 4 },
  { slug: "spells-f-g", titleEn: "Spells F–G", titleKo: "주문 F–G", part: "주문", status: "pending", tocDepth: 4 },
  { slug: "spells-h-l", titleEn: "Spells H–L", titleKo: "주문 H–L", part: "주문", status: "pending", tocDepth: 4 },
  { slug: "spells-m-o", titleEn: "Spells M–O", titleKo: "주문 M–O", part: "주문", status: "pending", tocDepth: 4 },
  { slug: "spells-p-r", titleEn: "Spells P–R", titleKo: "주문 P–R", part: "주문", status: "pending", tocDepth: 4 },
  { slug: "spells-s", titleEn: "Spells S", titleKo: "주문 S", part: "주문", status: "pending", tocDepth: 4 },
  { slug: "spells-t-z", titleEn: "Spells T–Z", titleKo: "주문 T–Z", part: "주문", status: "pending", tocDepth: 4 },
  { slug: "glossary-conventions", titleEn: "Glossary Conventions", titleKo: "용어집 표기 규칙", part: "규칙 용어집", status: "translated" },
  { slug: "glossary-a-c", titleEn: "Rules Definitions A–C", titleKo: "규칙 정의 A–C", part: "규칙 용어집", status: "translated", tocDepth: 4 },
  { slug: "glossary-d-h", titleEn: "Rules Definitions D–H", titleKo: "규칙 정의 D–H", part: "규칙 용어집", status: "translated", tocDepth: 4 },
  { slug: "glossary-i-r", titleEn: "Rules Definitions I–R", titleKo: "규칙 정의 I–R", part: "규칙 용어집", status: "translated", tocDepth: 4 },
  { slug: "glossary-s-z", titleEn: "Rules Definitions S–Z", titleKo: "규칙 정의 S–Z", part: "규칙 용어집", status: "translated", tocDepth: 4 },
  { slug: "travel-pace", titleEn: "Travel Pace", titleKo: "여행 속도", part: "게임 진행 도구", status: "pending" },
  { slug: "creating-a-background", titleEn: "Creating a Background", titleKo: "배경 만들기", part: "게임 진행 도구", status: "pending" },
  { slug: "curses-and-contagions", titleEn: "Curses and Magical Contagions", titleKo: "저주와 마법 전염병", part: "게임 진행 도구", status: "pending" },
  { slug: "environmental-effects", titleEn: "Environmental Effects, Fear, and Mental Stress", titleKo: "환경 효과, 공포, 정신적 스트레스", part: "게임 진행 도구", status: "pending" },
  { slug: "poison", titleEn: "Poison", titleKo: "독", part: "게임 진행 도구", status: "pending" },
  { slug: "traps", titleEn: "Traps", titleKo: "함정", part: "게임 진행 도구", status: "pending" },
  { slug: "combat-encounters", titleEn: "Combat Encounters", titleKo: "전투 조우", part: "게임 진행 도구", status: "pending" },
  { slug: "magic-item-rules", titleEn: "Magic Item Rules", titleKo: "마법 물건 규칙", part: "마법 물건", status: "pending" },
  { slug: "magic-items-a-b", titleEn: "Magic Items A–B", titleKo: "마법 물건 A–B", part: "마법 물건", status: "pending", tocDepth: 4 },
  { slug: "magic-items-c-d", titleEn: "Magic Items C–D", titleKo: "마법 물건 C–D", part: "마법 물건", status: "pending", tocDepth: 4 },
  { slug: "magic-items-e-h", titleEn: "Magic Items E–H", titleKo: "마법 물건 E–H", part: "마법 물건", status: "pending", tocDepth: 4 },
  { slug: "magic-items-i-o", titleEn: "Magic Items I–O", titleKo: "마법 물건 I–O", part: "마법 물건", status: "pending", tocDepth: 4 },
  { slug: "magic-items-p-r", titleEn: "Magic Items P–R", titleKo: "마법 물건 P–R", part: "마법 물건", status: "pending", tocDepth: 4 },
  { slug: "magic-items-s", titleEn: "Magic Items S", titleKo: "마법 물건 S", part: "마법 물건", status: "pending", tocDepth: 4 },
  { slug: "magic-items-t-z", titleEn: "Magic Items T–Z", titleKo: "마법 물건 T–Z", part: "마법 물건", status: "pending", tocDepth: 4 },
  { slug: "stat-blocks", titleEn: "Monsters: Stat Blocks", titleKo: "괴물 자료 상자", part: "괴물", status: "pending" },
  { slug: "monsters-a", titleEn: "Monsters A", titleKo: "괴물 A", part: "괴물", status: "pending" },
  { slug: "monsters-b", titleEn: "Monsters B", titleKo: "괴물 B", part: "괴물", status: "pending" },
  { slug: "monsters-c", titleEn: "Monsters C", titleKo: "괴물 C", part: "괴물", status: "pending" },
  { slug: "monsters-d-f", titleEn: "Monsters D–F", titleKo: "괴물 D–F", part: "괴물", status: "pending" },
  { slug: "monsters-g", titleEn: "Monsters G", titleKo: "괴물 G", part: "괴물", status: "pending" },
  { slug: "monsters-h-l", titleEn: "Monsters H–L", titleKo: "괴물 H–L", part: "괴물", status: "pending" },
  { slug: "monsters-m-o", titleEn: "Monsters M–O", titleKo: "괴물 M–O", part: "괴물", status: "pending" },
  { slug: "monsters-p-r", titleEn: "Monsters P–R", titleKo: "괴물 P–R", part: "괴물", status: "pending" },
  { slug: "monsters-s", titleEn: "Monsters S", titleKo: "괴물 S", part: "괴물", status: "pending" },
  { slug: "monsters-t-v", titleEn: "Monsters T–V", titleKo: "괴물 T–V", part: "괴물", status: "pending" },
  { slug: "monsters-w-z", titleEn: "Monsters W–Z", titleKo: "괴물 W–Z", part: "괴물", status: "pending" },
  { slug: "animals-a-f", titleEn: "Animals A–F", titleKo: "동물 A–F", part: "동물", status: "pending" },
  { slug: "animals-g", titleEn: "Animals G", titleKo: "동물 G", part: "동물", status: "pending" },
  { slug: "animals-h-r", titleEn: "Animals H–R", titleKo: "동물 H–R", part: "동물", status: "pending" },
  { slug: "animals-s-z", titleEn: "Animals S–Z", titleKo: "동물 S–Z", part: "동물", status: "pending" },
];
