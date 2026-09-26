/**
 * 철의 맹세(Ironsworn) 《당신의 세계 — 진실 워크북》을 그리기 위한 자료 구조.
 *
 * 규칙서 4장 「당신의 진실」에 딸린 별책 워크북(ironswornrpg.com)을 옮긴 것으로,
 * 갈래마다 인쇄된 진실 세 가지와 직접 써 넣을 빈 칸을 담는다. 용어는
 * `src/pages/ko/ironsworn/GLOSSARY.md`, 문구는 `src/data/ironsworn/ko/your-truths.md` 를 따른다.
 */

/** 진실 하나. 인쇄된 워크북에서 동그라미를 채워 고르는 선택지다. */
export interface IronswornTruthOption {
  /** 진실 문장. `**굵게**` 표기를 쓸 수 있다. */
  text: string;
  /** 그 진실에 붙은 임무 씨앗. 시트에서는 「임무 씨앗」으로 표시한다. */
  quest: string;
}

/** 진실 갈래 하나(옛 세계·철·유산 …). */
export interface IronswornTruthCategory {
  /** 쪽 안에서 겹치지 않는 짧은 열쇠. */
  slug: string;
  /** 갈래 이름(옛 세계 …). */
  label: string;
  /** 영문 이름(The Old World …). */
  labelEn: string;
  /** 인쇄된 진실 세 가지. */
  options: IronswornTruthOption[];
  /** 갈래 끝에 두는 빈 진실 칸 수. 없으면 두 칸을 둔다. */
  blanks?: number;
}

/** 워크북 한 쪽. 인쇄본은 한 쪽에 갈래 둘을 담는다. */
export interface IronswornTruthsPage {
  /** 쪽 번호. 인쇄본의 쪽 번호와 맞춘다. */
  page: number;
  categories: IronswornTruthCategory[];
  /** 쪽 끝에 자유 메모 칸을 두는지. 워크북 마지막 쪽에만 참이다. */
  notes?: boolean;
}

/** 워크북 마지막 쪽의 자유 메모 칸. */
export interface IronswornTruthsNotes {
  label: string;
  labelEn: string;
  /** 빈 줄 수. */
  lines: number;
}
