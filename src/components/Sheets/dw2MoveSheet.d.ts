/**
 * 던전월드 2 액션 참조 시트를 그리기 위한 데이터 구조.
 *
 * 원고(`src/data/dw2/ko/{core,extra}-moves.md`)의 마크다운을 그대로 파싱하지 않고,
 * 시트에 맞게 손으로 정리한 값을 담는다. 설명 문장의 `**강조**`는 굵게, `*기울임*`은
 * 이탤릭으로 렌더한다.
 */

/** 굴림 결과(10+ / 7–9 / 6-) 묶음. */
export interface Dw2MoveRoll {
  label: string;
  text: string;
}

/** 액션 하나. */
export interface Dw2MoveEntry {
  /** 액션 이름. */
  title: string;
  /** 영문 이름(제목 옆에 작게 붙인다). */
  titleEn?: string;
  /** 괄호 안에 붙는 능력치 표기(+근, +혜 등). 없으면 생략. */
  stat?: string;
  /** 액션 발동 조건 문장. */
  description: string;
  /** 본문에 딸리는 목록. */
  bullets?: string[];
  /** 목록 앞뒤에 강조해 보여 줄 한 줄(예: 위력 표, 의식 요구 조건). */
  callout?: string;
  /** 굴림 결과 묶음. */
  rolls?: Dw2MoveRoll[];
  /** 목록 뒤에 이어지는 문단(빈 줄로 문단을 나눈다). */
  afterword?: string;
}

/** 시트 한 장에 실리는 액션 묶음(핵심 액션, 추가 액션, 위력 등). */
export interface Dw2MoveSheetGroup {
  /** 시트 머리말에 크게 찍는 이름. */
  titleKo: string;
  titleEn: string;
  /** 라우트 슬러그이자 저장 키. */
  slug: string;
  /** 묶음 서두에 붙는 한 줄 설명. */
  intro?: string;
  moves: Dw2MoveEntry[];
}
