export type ChapterStatus = "translated" | "pending";

export type ChapterMeta = {
  slug: string;
  titleEn: string;
  titleKo: string;
  status: ChapterStatus;
};

export const CYPHER_SRD_CHAPTERS: ChapterMeta[] = [
  { slug: "creating-your-character", titleEn: "Creating Your Character", titleKo: "캐릭터 만들기", status: "translated" },
  { slug: "core-character", titleEn: "The Core Character", titleKo: "핵심 캐릭터", status: "translated" },
  { slug: "skills", titleEn: "Skills", titleKo: "기능", status: "translated" },
  { slug: "descriptors", titleEn: "Descriptors", titleKo: "수식어", status: "translated" },
  { slug: "real-world-genre", titleEn: "The Real World Genre", titleKo: "현실 세계 장르", status: "translated" },
  {
    slug: "genre-abilities",
    titleEn: "Genre Character Abilities from Types and Foci",
    titleKo: "유형과 특징의 캐릭터 능력",
    status: "translated",
  },
  { slug: "fantasy-genre", titleEn: "Fantasy Genre", titleKo: "판타지 장르", status: "translated" },
  { slug: "science-fiction-genre", titleEn: "Science Fiction Genre", titleKo: "SF 장르", status: "translated" },
  { slug: "superheroes-genre", titleEn: "Superheroes Genre", titleKo: "슈퍼히어로 장르", status: "translated" },
  { slug: "foci", titleEn: "Foci", titleKo: "특징", status: "translated" },
  { slug: "equipment", titleEn: "Equipment", titleKo: "장비", status: "translated" },
  { slug: "cyphers", titleEn: "Cyphers", titleKo: "사이퍼", status: "translated" },
  { slug: "rules-of-the-game", titleEn: "Rules of the Game", titleKo: "게임의 규칙", status: "translated" },
  { slug: "advancing-your-character", titleEn: "Advancing Your Character", titleKo: "캐릭터 성장시키기", status: "translated" },
  { slug: "credits", titleEn: "Credits", titleKo: "크레딧", status: "translated" },
];
