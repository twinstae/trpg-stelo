/**
 * 던전월드 2 직업 플레이북을 캐릭터 시트로 그리기 위한 데이터 구조.
 *
 * 원고(`src/data/dw2/ko/<slug>.md`)의 마크다운을 그대로 파싱하지 않고, 시트에 맞게
 * 손으로 정리한 값을 담는다. 설명 문장에서 `**강조**`는 굵게 렌더된다.
 */

/** 굴림 결과(10+ / 7–9 / 6-)처럼 눈에 띄게 보여 줄 항목. */
export interface Dw2PlaybookRoll {
  label: string;
  text: string;
}

/** 줄마다 하나씩 고르는 선택지 묶음(예: 신의 영역·신도·적). */
export interface Dw2PlaybookChoiceRow {
  label: string;
  options: string[];
}

/** 시작 액션, 길 액션 등 시트에 실리는 액션 하나. */
export interface Dw2PlaybookMove {
  title: string;
  /** 시작 액션이면 시트에 이미 표시된 것으로 그린다. */
  starting?: boolean;
  /** 제목 옆에 붙는 작은 항목(예: 쾌락주의자의 “미충족”, “이름 ___”). */
  sideNote?: string;
  /** sideNote를 표시/지우는 동그라미와 함께 그릴지. */
  sideNoteMark?: boolean;
  /** 제목 옆에 붙는 사용 횟수 상자(예: 허세·예비·가면). */
  tracker?: { label: string; boxes: number };
  description?: string;
  /** 목록 앞뒤에 강조해 보여 줄 한 줄(예: “욕망: ___”, “되살아남”). */
  callout?: string;
  /** 줄마다 하나씩 고르는 선택지 묶음. */
  choiceRows?: Dw2PlaybookChoiceRow[];
  /** 굴림 결과 묶음. */
  rolls?: Dw2PlaybookRoll[];
  /** 굴림과 목록 사이에 오는 한 줄(예: “같은 선택지를 여러 번 고르려면…”). */
  note?: string;
  /** 본문에 딸리는 목록(선택지·질문·이익 등). */
  bullets?: string[];
  /**
   * 목록 뒤에 이어지는 문단. `\n`으로 문단을 나누고,
   * `- `로 시작하는 줄은 목록 항목으로 그린다.
   */
  afterword?: string;
}

/** 무기나 장비 선택지 한 줄. `uses`가 있으면 동그라미를 그린다. */
export interface Dw2PlaybookOption {
  name: string;
  /** 사용 횟수 동그라미 개수(모험 도구 ◯◯◯ = 3). */
  uses?: number;
  /** 피해 표기(무기). */
  damage?: string;
  /** `#근접`, `#양손` 같은 꼬리표. */
  tags?: string[];
  /** 방패 사용 칸이 있으면 true. */
  shield?: boolean;
  /** 선택지에 덧붙는 설명. */
  note?: string;
}

/** 기원(혈통·공동체·배경) 항목. `prompt`의 `___`는 빈칸 입력으로 그린다. */
export interface Dw2PlaybookOrigin {
  label: string;
  prompt: string;
  example: string;
}

/** 향상 선택지 한 줄. `boxes`는 앞에 붙는 체크박스 개수. */
export interface Dw2PlaybookAdvanceOption {
  label: string;
  boxes: number;
  /** 체크박스 없이 기울임으로만 표시하는 항목(예: 직업 바꾸기). */
  italic?: boolean;
}

/** 레벨 구간별 향상 목록. */
export interface Dw2PlaybookAdvanceGroup {
  heading?: string;
  options: Dw2PlaybookAdvanceOption[];
}

/** 직업이 열어 주는 길(하위 직업) 하나. */
export interface Dw2PlaybookPath {
  title: string;
  titleEn: string;
  tagline: string;
  moves: Dw2PlaybookMove[];
}

export interface Dw2Playbook {
  /** 라우트 슬러그이자 원고 파일 이름. */
  slug: string;
  titleKo: string;
  titleEn: string;
  tagline: string;
  origins: Dw2PlaybookOrigin[];
  /** 관계를 적는 줄 수. */
  relationshipRows: number;
  relationshipExamples: string[];
  startingMove: Dw2PlaybookMove;
  weaponPrompt: string;
  weapons: Dw2PlaybookOption[];
  equipmentPrompt: string;
  equipment: Dw2PlaybookOption[];
  appearancePrompt: string;
  /** 줄마다 하나씩 고르는 외모 선택지. */
  appearanceRows: string[][];
  nameExamples: string;
  statsNote: string;
  /** 1레벨 최대 HP. */
  hpAtLevelOne: number;
  /** 표시/지울 수 있는 조건 이름들. */
  conditions: string[];
  advancements: {
    trigger: string;
    groups: Dw2PlaybookAdvanceGroup[];
  };
  paths: Dw2PlaybookPath[];
}
