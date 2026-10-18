export type PtolusStatus = "translated" | "pending";

export type PtolusChapterMeta = {
  /** 라우트 슬러그이자 data/ptolus/{en,ko}/<slug>.md 파일 이름 */
  slug: string;
  titleEn: string;
  titleKo: string;
  /** 책에서 묶이는 큰 부분. 사이드바와 목차에서 섹션으로 묶는다. */
  part: string;
  status: PtolusStatus;
};

export const PTOLUS_SOURCE = {
  title: "A Player's Guide to Ptolus",
  titleKo: "톨러스 플레이어 가이드",
  author: "Monte Cook",
  publisher: "Monte Cook Games",
  year: "2006–2021",
  pageCount: 34,
  url: "https://www.montecookgames.com/store/product/ptolus-monte-cooks-city-by-the-spire/",
  note: "Ptolus: Monte Cook's City by the Spire의 무료 플레이어 가이드(2021-03-30판, 34쪽)를 장별로 나눠 대역으로 옮긴 것입니다.",
};

export const PTOLUS_CHAPTERS: PtolusChapterMeta[] = [
  {
    slug: "introduction",
    titleEn: "Introduction",
    titleKo: "서론",
    part: "들어가며",
    status: "translated",
  },
  {
    slug: "welcome-to-the-city",
    titleEn: "Welcome to the City",
    titleKo: "도시에 온 것을 환영합니다",
    part: "톨러스 시",
    status: "translated",
  },
  {
    slug: "campaign-feel",
    titleEn: "Campaign Feel",
    titleKo: "캠페인의 분위기",
    part: "톨러스 시",
    status: "translated",
  },
  {
    slug: "the-city-of-ptolus",
    titleEn: "The City of Ptolus",
    titleKo: "톨러스 시",
    part: "톨러스 시",
    status: "translated",
  },
  {
    slug: "districts-of-the-city",
    titleEn: "Districts of the City",
    titleKo: "도시의 구역들",
    part: "톨러스 시",
    status: "translated",
  },
  {
    slug: "organizations",
    titleEn: "Organizations",
    titleKo: "조직들",
    part: "톨러스 시",
    status: "translated",
  },
  {
    slug: "religion",
    titleEn: "Religion",
    titleKo: "종교",
    part: "톨러스 시",
    status: "translated",
  },
  {
    slug: "important-individuals",
    titleEn: "Important Individuals in Ptolus",
    titleKo: "톨러스의 주요 인물들",
    part: "톨러스 시",
    status: "translated",
  },
  {
    slug: "the-world-and-beyond",
    titleEn: "The World (and Beyond)",
    titleKo: "세계와 그 너머",
    part: "세계와 역사",
    status: "translated",
  },
  {
    slug: "history",
    titleEn: "History",
    titleKo: "역사",
    part: "세계와 역사",
    status: "translated",
  },
  {
    slug: "creating-a-character",
    titleEn: "Creating a Character for a Ptolus Campaign",
    titleKo: "톨러스 캠페인을 위한 캐릭터 만들기",
    part: "캐릭터",
    status: "translated",
  },
  {
    slug: "names",
    titleEn: "Names",
    titleKo: "이름",
    part: "캐릭터",
    status: "translated",
  },
  {
    slug: "character-background",
    titleEn: "Character Background",
    titleKo: "캐릭터 배경",
    part: "캐릭터",
    status: "translated",
  },
  {
    slug: "character-classes",
    titleEn: "Character Classes",
    titleKo: "캐릭터 클래스",
    part: "캐릭터",
    status: "translated",
  },
  {
    slug: "magic",
    titleEn: "Magic",
    titleKo: "마법",
    part: "캐릭터",
    status: "translated",
  },
  {
    slug: "equipment",
    titleEn: "Equipment",
    titleKo: "장비",
    part: "캐릭터",
    status: "translated",
  },
  {
    slug: "living-in-ptolus",
    titleEn: "Living in Ptolus",
    titleKo: "톨러스에서 살아가기",
    part: "캐릭터",
    status: "translated",
  },
  {
    slug: "city-map",
    titleEn: "City Map",
    titleKo: "도시 지도",
    part: "부록",
    status: "translated",
  },
  {
    slug: "character-sheets",
    titleEn: "Character Sheets",
    titleKo: "캐릭터 시트",
    part: "부록",
    status: "translated",
  },
  {
    slug: "license",
    titleEn: "License",
    titleKo: "라이선스",
    part: "부록",
    status: "translated",
  },
];
