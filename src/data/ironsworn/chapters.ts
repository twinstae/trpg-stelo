// 이 파일은 scripts/ironsworn-extract-rulebook.mjs가 생성합니다. 손으로 고치지 마세요.
// 단위 경계는 스크립트의 RANGES, 상태(translated/pending)는 src/data/ironsworn/ko/<슬러그>.md의 존재 여부에서 나옵니다.

export type IronswornChapterStatus = "translated" | "pending";

export type IronswornChapterMeta = {
  /** 라우트 슬러그이자 data/ironsworn/{en,ko}/<slug>.md 파일 이름 */
  slug: string;
  titleEn: string;
  titleKo: string;
  /** 책의 큰 부분 — 색인 페이지에서 묶어 보여 줄 때 쓴다. */
  part: string;
  status: IronswornChapterStatus;
};

export const IRONSWORN_SOURCE = {
  title: "Ironsworn",
  titleKo: "철의 맹세",
  author: "Shawn Tomkin",
  date: "2019-06-09",
  file: "Ironsworn-Rulebook.pdf",
  pageCount: 270,
  license: "CC BY-NC-SA 4.0",
  licenseUrl: "https://creativecommons.org/licenses/by-nc-sa/4.0/",
  site: "https://www.ironswornrpg.com/",
};

export const IRONSWORN_CHAPTERS: IronswornChapterMeta[] = [
  { slug: "front-matter", titleEn: "Front Matter", titleKo: "머리말", part: "머리말", status: "translated" },
  { slug: "playing-ironsworn", titleEn: "Playing Ironsworn", titleKo: "플레이하기", part: "1장 기초", status: "translated" },
  { slug: "moves", titleEn: "Moves", titleKo: "액션", part: "1장 기초", status: "translated" },
  { slug: "the-action-roll", titleEn: "The Action Roll", titleKo: "액션 판정", part: "1장 기초", status: "translated" },
  { slug: "momentum", titleEn: "Momentum", titleKo: "모멘텀", part: "1장 기초", status: "translated" },
  { slug: "progress-tracks", titleEn: "Progress Tracks", titleKo: "진행 트랙", part: "1장 기초", status: "translated" },
  { slug: "harm-and-stress", titleEn: "Harm and Stress", titleKo: "피해와 스트레스", part: "1장 기초", status: "translated" },
  { slug: "assets-in-brief", titleEn: "Assets in Brief", titleKo: "애셋 개요", part: "1장 기초", status: "translated" },
  { slug: "oracles-in-brief", titleEn: "Oracles in Brief", titleKo: "오라클 개요", part: "1장 기초", status: "translated" },
  { slug: "bonds-and-allies", titleEn: "Bonds and Allies", titleKo: "유대와 동료", part: "1장 기초", status: "translated" },
  { slug: "equipment", titleEn: "Equipment", titleKo: "장비", part: "1장 기초", status: "translated" },
  { slug: "the-flow-of-play", titleEn: "The Flow of Play", titleKo: "플레이의 흐름", part: "1장 기초", status: "translated" },
  { slug: "you-are-ironsworn", titleEn: "You Are Ironsworn", titleKo: "당신은 철의 맹세자", part: "2장 캐릭터", status: "translated" },
  { slug: "character-basics", titleEn: "Character Basics", titleKo: "캐릭터 기초", part: "2장 캐릭터", status: "translated" },
  { slug: "vows-bonds-debilities", titleEn: "Vows, Bonds, and Debilities", titleKo: "맹세와 유대와 결점", part: "2장 캐릭터", status: "translated" },
  { slug: "assets", titleEn: "Assets", titleKo: "애셋", part: "2장 캐릭터", status: "translated" },
  { slug: "experience-and-equipment", titleEn: "Experience and Equipment", titleKo: "경험과 장비", part: "2장 캐릭터", status: "translated" },
  { slug: "becoming-ironsworn", titleEn: "Becoming Ironsworn", titleKo: "철의 맹세자가 되기", part: "2장 캐릭터", status: "translated" },
  { slug: "making-moves", titleEn: "Making Moves", titleKo: "액션 만들기", part: "3장 액션", status: "translated" },
  { slug: "initiative-and-glossary", titleEn: "Initiative and the Move Glossary", titleKo: "주도권과 용어집", part: "3장 액션", status: "translated" },
  { slug: "adventure-moves", titleEn: "Adventure Moves", titleKo: "모험 액션", part: "3장 액션", status: "translated" },
  { slug: "relationship-moves", titleEn: "Relationship Moves", titleKo: "관계 액션", part: "3장 액션", status: "translated" },
  { slug: "combat-moves", titleEn: "Combat Moves", titleKo: "전투 액션", part: "3장 액션", status: "translated" },
  { slug: "suffer-moves", titleEn: "Suffer Moves", titleKo: "고난 액션", part: "3장 액션", status: "translated" },
  { slug: "quest-moves", titleEn: "Quest Moves", titleKo: "임무 액션", part: "3장 액션", status: "translated" },
  { slug: "fate-moves", titleEn: "Fate Moves", titleKo: "운명 액션", part: "3장 액션", status: "translated" },
  { slug: "welcome-to-the-ironlands", titleEn: "Welcome to the Ironlands", titleKo: "철의 땅에 오신 것을 환영합니다", part: "4장 세계", status: "translated" },
  { slug: "regions-of-the-ironlands", titleEn: "Regions of the Ironlands", titleKo: "철의 땅의 지역", part: "4장 세계", status: "translated" },
  { slug: "your-truths", titleEn: "Your Truths", titleKo: "당신의 진실", part: "4장 세계", status: "translated" },
  { slug: "mapping-your-journeys", titleEn: "Mapping Your Journeys", titleKo: "여정 지도 그리기", part: "4장 세계", status: "translated" },
  { slug: "npcs-in-the-ironlands", titleEn: "NPCs in the Ironlands", titleKo: "철의 땅의 NPC", part: "5장 적과 조우", status: "translated" },
  { slug: "ironlanders", titleEn: "Ironlanders", titleKo: "철의 땅 사람들", part: "5장 적과 조우", status: "translated" },
  { slug: "firstborn", titleEn: "Firstborn", titleKo: "선주민", part: "5장 적과 조우", status: "translated" },
  { slug: "animals", titleEn: "Animals", titleKo: "동물", part: "5장 적과 조우", status: "translated" },
  { slug: "beasts", titleEn: "Beasts", titleKo: "야수", part: "5장 적과 조우", status: "translated" },
  { slug: "horrors", titleEn: "Horrors", titleKo: "공포", part: "5장 적과 조우", status: "translated" },
  { slug: "seeking-inspiration", titleEn: "Seeking Inspiration", titleKo: "영감 구하기", part: "6장 오라클", status: "translated" },
  { slug: "oracles-in-play", titleEn: "Ironland Oracles", titleKo: "철의 땅 오라클", part: "6장 오라클", status: "translated" },
  { slug: "oracles-action-to-trouble", titleEn: "Oracles 1–9: Action to Settlement Trouble", titleKo: "오라클 1–9: 행동에서 마을 문제까지", part: "6장 오라클", status: "translated" },
  { slug: "oracles-role-to-rank", titleEn: "Oracles 10–19: Character Role to Challenge Rank", titleKo: "오라클 10–19: 인물 역할에서 도전 등급까지", part: "6장 오라클", status: "translated" },
  { slug: "more-oracles", titleEn: "More Oracles", titleKo: "오라클 더 만들기", part: "6장 오라클", status: "translated" },
  { slug: "starting-your-campaign", titleEn: "Starting Your Campaign", titleKo: "캠페인 시작하기", part: "7장 심화", status: "translated" },
  { slug: "mechanics-and-the-fiction", titleEn: "The Mechanics and the Fiction", titleKo: "규칙과 이야기 속 현실", part: "7장 심화", status: "translated" },
  { slug: "managing-your-quests", titleEn: "Managing Your Quests", titleKo: "임무 관리하기", part: "7장 심화", status: "translated" },
  { slug: "principles", titleEn: "Principles", titleKo: "원칙", part: "7장 심화", status: "translated" },
  { slug: "gameplay-options", titleEn: "Gameplay Options", titleKo: "플레이 선택 규칙", part: "7장 심화", status: "translated" },
  { slug: "hacking-ironsworn", titleEn: "Hacking Ironsworn", titleKo: "철의 맹세 변형하기", part: "7장 심화", status: "translated" },
  { slug: "extended-example-of-play", titleEn: "Extended Example of Play", titleKo: "확장 플레이 예시", part: "7장 심화", status: "translated" },
];
