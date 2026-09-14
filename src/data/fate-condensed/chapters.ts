export type FateCondensedStatus = "translated" | "pending";

export type FateCondensedChapterMeta = {
  /** 라우트 슬러그이자 data/fate-condensed/{en,ko}/<slug>.md 파일 이름 */
  slug: string;
  titleEn: string;
  titleKo: string;
  status: FateCondensedStatus;
};

export const FATE_CONDENSED_SOURCE = {
  title: "Fate Condensed",
  titleKo: "압축형 페이트",
  author: "PK Sullivan",
  site: "https://fate-srd.com/fate-condensed",
  license: "CC BY 3.0",
  licenseUrl: "https://creativecommons.org/licenses/by/3.0/",
};

export const FATE_CONDENSED_CHAPTERS: FateCondensedChapterMeta[] = [
  { slug: "introduction", titleEn: "Introduction", titleKo: "소개", status: "translated" },
  { slug: "getting-started", titleEn: "Getting Started", titleKo: "시작하기", status: "translated" },
  {
    slug: "taking-action-rolling-dice",
    titleEn: "Taking Action, Rolling the Dice",
    titleKo: "행동하기, 주사위 굴리기",
    status: "translated",
  },
  {
    slug: "aspects-and-fate-points",
    titleEn: "Aspects and Fate Points",
    titleKo: "면모와 운명점",
    status: "translated",
  },
  {
    slug: "challenges-conflicts-and-contests",
    titleEn: "Challenges, Conflicts, and Contests",
    titleKo: "난관, 경쟁, 대결",
    status: "translated",
  },
  { slug: "advancement", titleEn: "Advancement", titleKo: "성장", status: "translated" },
  {
    slug: "being-game-master",
    titleEn: "Being the Game Master",
    titleKo: "게임 마스터가 되는 법",
    status: "translated",
  },
  { slug: "optional-rules", titleEn: "Optional Rules", titleKo: "선택 규칙", status: "translated" },
];
