export type LazyGmGuideStatus = "translated" | "pending";

export type LazyGmGuideChapterMeta = {
  /** 라우트 슬러그이자 data/lazy-gm-guide/{en,ko}/<slug>.md 파일 이름 */
  slug: string;
  /** 원문 저장소(crit-tech/LGMRD) markdown_separate의 파일 접두사. 문서 안의 NN-이름.md 링크를 사이트 경로로 바꿀 때 쓴다. */
  source: string;
  titleEn: string;
  titleKo: string;
  status: LazyGmGuideStatus;
};

export const LAZY_GM_GUIDE_SOURCE = {
  title: "The Lazy GM's Resource Document",
  titleKo: "게으른 GM 자료집",
  author: "Michael E. Shea",
  site: "https://slyflourish.com",
  url: "https://slyflourish.com/lazy_gm_resource_document.html",
  updated: "2024-12-24",
  license: "CC BY 4.0",
  licenseUrl: "https://creativecommons.org/licenses/by/4.0/",
  repo: "https://github.com/crit-tech/LGMRD",
};

export const LAZY_GM_GUIDE_CHAPTERS: LazyGmGuideChapterMeta[] = [
  { slug: "front-matter", source: "01-index", titleEn: "Front Matter", titleKo: "머리말", status: "translated" },
  {
    slug: "eight-steps-of-lazy-rpg-prep",
    source: "02-eightsteps",
    titleEn: "The Eight Steps of Lazy RPG Prep",
    titleKo: "게으른 RPG 준비의 여덟 단계",
    status: "translated",
  },
  {
    slug: "the-lazy-rpg-preparation-process",
    source: "03-prepprocess",
    titleEn: "The Lazy RPG Preparation Process",
    titleKo: "게으른 RPG 준비 과정",
    status: "translated",
  },
  {
    slug: "example-strong-starts",
    source: "04-strongstarts",
    titleEn: "Example Strong Starts",
    titleKo: "강한 시작 예시",
    status: "translated",
  },
  {
    slug: "creating-secrets-and-clues",
    source: "05-creatingsecrets",
    titleEn: "Creating Secrets and Clues",
    titleKo: "비밀과 단서 만들기",
    status: "translated",
  },
  {
    slug: "building-an-rpg-group",
    source: "06-buildingagroup",
    titleEn: "Building an RPG Group",
    titleKo: "RPG 모임 만들기",
    status: "translated",
  },
  {
    slug: "session-zero-checklist",
    source: "07-sessionzerochecklist",
    titleEn: "Session Zero Checklist",
    titleKo: "세션 제로 체크리스트",
    status: "translated",
  },
  { slug: "safety-tools", source: "08-safetytools", titleEn: "Safety Tools", titleKo: "안전 도구", status: "translated" },
  {
    slug: "connecting-characters",
    source: "09-connectingcharacters",
    titleEn: "Connecting Characters",
    titleKo: "캐릭터 연결하기",
    status: "translated",
  },
  {
    slug: "spiral-campaign-development",
    source: "10-spiralcampaigns",
    titleEn: "Spiral Campaign Development",
    titleKo: "나선형 캠페인 개발",
    status: "translated",
  },
  { slug: "quest-templates", source: "11-questtemplates", titleEn: "Quest Templates", titleKo: "퀘스트 템플릿", status: "translated" },
  {
    slug: "tools-for-5e-improvisation",
    source: "12-toolsforimprov",
    titleEn: "Tools for 5e Improvisation",
    titleKo: "5e 즉흥 진행 도구",
    status: "translated",
  },
  {
    slug: "quick-tricks-for-lazier-5e-games",
    source: "13-quicktricks",
    titleEn: "Quick Tricks for Lazier 5e Games",
    titleKo: "더 게으른 5e 게임을 위한 잔요령",
    status: "translated",
  },
  {
    slug: "5e-quick-encounter-building",
    source: "14-quickencounterbuilding",
    titleEn: "5e Quick Encounter Building",
    titleKo: "5e 빠른 조우 구성",
    status: "translated",
  },
  {
    slug: "lazy-combat-encounter-building-for-5e",
    source: "15-lazycombatencounterbuilding",
    titleEn: "Lazy Combat Encounter Building for 5e",
    titleKo: "5e 게으른 전투 조우 구성",
    status: "translated",
  },
  {
    slug: "theater-of-the-mind-guidelines-extended",
    source: "16-totmguidelines1",
    titleEn: "Theater of the Mind Guidelines (Extended)",
    titleKo: "머릿속 극장 지침(상세)",
    status: "translated",
  },
  {
    slug: "theater-of-the-mind-guidelines-abbreviated",
    source: "17-totm2",
    titleEn: "Theater of the Mind Guidelines (Abbreviated)",
    titleKo: "머릿속 극장 지침(요약)",
    status: "translated",
  },
  { slug: "zone-based-combat", source: "18-zonebasedcombat", titleEn: "Zone-Based Combat", titleKo: "구역 기반 전투", status: "translated" },
  {
    slug: "monster-difficulty-dials",
    source: "19-monsterdifficultydials",
    titleEn: "Monster Difficulty Dials",
    titleKo: "괴물 난이도 다이얼",
    status: "translated",
  },
  { slug: "monster-templates", source: "20-monstertemplates", titleEn: "Monster Templates", titleKo: "괴물 템플릿", status: "translated" },
  { slug: "undead-templates", source: "21-undeadtemplates", titleEn: "Undead Templates", titleKo: "언데드 템플릿", status: "translated" },
  { slug: "running-hordes", source: "22-runninghordes", titleEn: "Running Hordes", titleKo: "무리 운영하기", status: "translated" },
  { slug: "stress-effects", source: "23-stresseffects", titleEn: "Stress Effects", titleKo: "스트레스 효과", status: "translated" },
  {
    slug: "core-adventure-generators",
    source: "24-coreadventuregenerators",
    titleEn: "Core Adventure Generators",
    titleKo: "핵심 모험 생성기",
    status: "translated",
  },
  { slug: "npc-generator", source: "25-npcgenerator", titleEn: "NPC Generator", titleKo: "NPC 생성기", status: "translated" },
  { slug: "treasure-generator", source: "26-treasuregenerator", titleEn: "Treasure Generator", titleKo: "보물 생성기", status: "translated" },
  { slug: "random-traps", source: "27-randomtraps", titleEn: "Random Traps", titleKo: "무작위 덫", status: "translated" },
  { slug: "random-monuments", source: "28-randommonuments", titleEn: "Random Monuments", titleKo: "무작위 기념물", status: "translated" },
  {
    slug: "wilderness-travel-and-exploration",
    source: "29-wildernesstravel",
    titleEn: "Wilderness Travel and Exploration",
    titleKo: "황야 여행과 탐험",
    status: "translated",
  },
  { slug: "random-chambers", source: "30-randomchambers", titleEn: "Random Chambers", titleKo: "무작위 방", status: "translated" },
  {
    slug: "random-underground-connectors",
    source: "31-randomconnectors",
    titleEn: "Random Underground Connectors",
    titleKo: "무작위 지하 연결 통로",
    status: "translated",
  },
  { slug: "random-items", source: "32-randomitems", titleEn: "Random Items", titleKo: "무작위 아이템", status: "translated" },
  { slug: "random-town-events", source: "33-randomtownevents", titleEn: "Random Town Events", titleKo: "무작위 마을 사건", status: "translated" },
  {
    slug: "random-dungeon-monsters",
    source: "34-randomdungeonmonsters",
    titleEn: "Random Dungeon Monsters",
    titleKo: "무작위 던전 괴물",
    status: "translated",
  },
  { slug: "lazy-solo-5e", source: "35-lazysolo5e", titleEn: "Lazy Solo 5e", titleKo: "게으른 솔로 5e", status: "translated" },
  {
    slug: "the-village-of-whitesparrow",
    source: "36-villageofwhitesparrow",
    titleEn: "The Village of Whitesparrow",
    titleKo: "화이트스패로우 마을",
    status: "translated",
  },
  { slug: "the-night-blade", source: "37-thenightblade", titleEn: "The Night Blade", titleKo: "밤의 칼날", status: "translated" },
];
