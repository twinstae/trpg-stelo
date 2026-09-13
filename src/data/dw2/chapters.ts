export type Dw2ChapterStatus = "translated" | "pending";

export type Dw2ChapterMeta = {
  /** 라우트 슬러그이자 data/dw2/{en,ko}/<slug>.md 파일 이름 */
  slug: string;
  titleEn: string;
  titleKo: string;
  /** 책의 큰 부분 — 색인 페이지에서 묶어 보여 줄 때 쓴다. */
  part: string;
  status: Dw2ChapterStatus;
};

export const DW2_SOURCE = {
  title: "Dungeon World 2 Beta v2.1",
  date: "2026-09-08",
  file: "Dungeon World 2 Beta v2.1.md",
  lineCount: 3655,
};

export const DW2_CHAPTERS: Dw2ChapterMeta[] = [
  { slug: "00-front-matter", titleEn: "Front Matter", titleKo: "머리말", part: "머리말", status: "translated" },
  { slug: "introduction", titleEn: "Introduction", titleKo: "소개", part: "소개", status: "translated" },
  { slug: "playing-the-game", titleEn: "Playing the Game", titleKo: "게임 플레이", part: "소개", status: "translated" },
  { slug: "session-zero", titleEn: "Session Zero", titleKo: "세션 제로", part: "소개", status: "translated" },
  { slug: "moves-crash-course", titleEn: "Crash Course in Moves", titleKo: "액션 강좌", part: "소개", status: "translated" },
  { slug: "character-creation", titleEn: "Character Creation", titleKo: "캐릭터 만들기", part: "캐릭터", status: "translated" },
  { slug: "core-moves", titleEn: "Core Moves", titleKo: "핵심 액션", part: "액션", status: "translated" },
  { slug: "extra-moves", titleEn: "Extra Moves", titleKo: "추가 액션", part: "액션", status: "translated" },
  { slug: "the-barbarian", titleEn: "The Barbarian", titleKo: "야만인", part: "직업", status: "translated" },
  { slug: "the-bard", titleEn: "The Bard", titleKo: "음유시인", part: "직업", status: "translated" },
  { slug: "the-cleric", titleEn: "The Cleric", titleKo: "사제", part: "직업", status: "translated" },
  { slug: "the-fighter", titleEn: "The Fighter", titleKo: "파이터", part: "직업", status: "translated" },
  { slug: "the-rogue", titleEn: "The Rogue", titleKo: "도적", part: "직업", status: "translated" },
  { slug: "the-wizard", titleEn: "The Wizard", titleKo: "마법사", part: "직업", status: "translated" },
  { slug: "behind-the-screen", titleEn: "Behind the Screen", titleKo: "화면 뒤에서", part: "마스터", status: "translated" },
  { slug: "agenda-and-principles", titleEn: "Agenda & Principles", titleKo: "강령과 원칙", part: "마스터", status: "translated" },
  { slug: "gm-moves", titleEn: "GM Moves", titleKo: "마스터 액션", part: "마스터", status: "translated" },
  { slug: "preparing-a-session", titleEn: "Preparing a Session", titleKo: "세션 준비", part: "마스터", status: "translated" },
  { slug: "major-npcs", titleEn: "Major NPCs", titleKo: "주요 NPC", part: "마스터", status: "translated" },
  { slug: "npc-traits", titleEn: "NPC Traits", titleKo: "NPC 특성 예시", part: "마스터", status: "translated" },
  { slug: "threats", titleEn: "Threats", titleKo: "위협", part: "마스터", status: "translated" },
  { slug: "magic-items", titleEn: "Magic Items", titleKo: "마법 아이템", part: "마스터", status: "translated" },
  { slug: "example-magic-items", titleEn: "Example Magic Items", titleKo: "마법 아이템 예시", part: "마스터", status: "translated" },
  { slug: "campaign-moves", titleEn: "Campaign Moves", titleKo: "캠페인 액션", part: "캠페인", status: "translated" },
  { slug: "bonds", titleEn: "Bonds", titleKo: "유대", part: "캠페인", status: "translated" },
  { slug: "struggles", titleEn: "Struggles", titleKo: "갈등", part: "캠페인", status: "translated" },
  { slug: "example-struggles", titleEn: "Example Struggles", titleKo: "갈등 예시", part: "캠페인", status: "translated" },
  { slug: "treasure-and-wealth", titleEn: "Treasure & Wealth", titleKo: "재물과 부", part: "캠페인", status: "translated" },
  { slug: "the-stolen-children", titleEn: "The Stolen Children", titleKo: "빼앗긴 아이들", part: "작은 모험", status: "translated" },
];
