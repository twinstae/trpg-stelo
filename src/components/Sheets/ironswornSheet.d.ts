/**
 * 철의 맹세(Ironsworn) 캐릭터 시트·액션 레퍼런스·자산 카드를 그리기 위한 자료 구조.
 *
 * 용어는 `src/pages/ko/ironsworn/GLOSSARY.md` 를 따르고, 시트에 인쇄된 표기는 같은
 * 저작자의 《철의 맹세》 플레이킷 한국어판과 맞췄다.
 * 능력치(기민·심지·강철·그림자·지혜), 상태 트랙(건강·정신·보급), 모멘텀,
 * 결점(조건·재앙·부담), 유대, 맹세, 진척.
 */

/** 능력치 한 칸. */
export interface IronswornStat {
  /** 상태 트랙과 함께 쓰는 짧은 열쇠. */
  id: string;
  /** 한국어 이름(기민·심지·강철·그림자·지혜). */
  label: string;
  /** 영문 이름(Edge …). */
  labelEn: string;
}

/** 상태 트랙 하나(건강·정신·보급). */
export interface IronswornStatusTrack {
  id: string;
  label: string;
  labelEn: string;
  /** 시트에 함께 적어 두는 짧은 설명. */
  note: string;
}

/** 결점 하나. */
export interface IronswornDebility {
  id: string;
  label: string;
  labelEn: string;
}

/** 도전 등급 한 줄. */
export interface IronswornRank {
  label: string;
  labelEn: string;
  /** 경유지마다 표시하는 진척(진척 3 / 틱 2 …). */
  progress: string;
}

/** 캐릭터 시트에 인쇄된, 캐릭터와 무관한 고정값. */
export interface IronswornSheetLayout {
  stats: IronswornStat[];
  /** 경험 칸: 줄 수와 줄마다 칸 수. */
  experienceRows: number;
  experiencePerRow: number;
  /** 유대 칸 수. */
  bonds: number;
  /** 맹세 트랙 수와 트랙마다 진척 칸 수. */
  vows: number;
  vowProgress: number;
  ranks: IronswornRank[];
  statusTracks: IronswornStatusTrack[];
  conditions: IronswornDebility[];
  banes: IronswornDebility[];
  burdens: IronswornDebility[];
  /** 모멘텀 트랙에 인쇄된 값(+10 … -6). */
  momentum: number[];
  /** 상태 트랙에 인쇄된 값(+5 … 0). */
  status: number[];
  /** 최대 모멘텀과 모멘텀 초기화의 기본값. */
  maxMomentum: number;
  momentumReset: number;
  /** 시트 아래에 적어 두는 규칙 메모. */
  notes: string[];
}

/**
 * 액션 레퍼런스에 실리는 문단의 갈래.
 *
 * `label` 은 묶음 이름이다(머물기의 「상태 지우기」처럼 글머리 목록을 거느리는 줄).
 */
export type IronswornMoveBlockKind = 'trigger' | 'note' | 'label' | 'strong' | 'weak' | 'miss';

/** 액션 한 문단. `bullets` 가 있으면 문단 아래에 글머리 목록으로 붙는다. */
export interface IronswornMoveBlock {
  kind: IronswornMoveBlockKind;
  /** `**굵게**` 표기를 쓸 수 있다. */
  text: string;
  bullets?: string[];
}

/** 액션 상자 아래에 붙는 굴림 표. */
export interface IronswornMoveTable {
  columns: string[];
  rows: string[][];
}

/** 액션 하나. */
export interface IronswornMove {
  slug: string;
  title: string;
  titleEn: string;
  /** 액션 이름 옆에 붙는 꼬리표(진행 액션 등). */
  tag?: string;
  tagEn?: string;
  blocks: IronswornMoveBlock[];
  table?: IronswornMoveTable;
}

/** 시트 끝에 두는 덧붙임 절(전투 액션의 「싸움 중의 다른 액션」). */
export interface IronswornMoveExtra {
  title: string;
  titleEn: string;
  items: { label: string; labelEn?: string; text: string }[];
}

/** 액션 레퍼런스 한 장. */
export interface IronswornMoveSheet {
  slug: string;
  title: string;
  titleEn: string;
  note: string;
  moves: IronswornMove[];
  extra?: IronswornMoveExtra;
}

/** 자산 종류. 카드 위쪽 띠에 적는다. */
export type IronswornAssetKind = 'companion' | 'path' | 'combat' | 'ritual';

/** 자산 카드의 능력 하나. */
export interface IronswornAssetAbility {
  /** `**굵게**` 표기를 쓸 수 있다. */
  text: string;
  /** 기본 능력은 인쇄된 카드에서 칠해진 동그라미로 나온다. */
  starting?: boolean;
}

/** 동반자 건강처럼 카드 아래에 붙는 트랙. */
export interface IronswornAssetTrack {
  label: string;
  labelEn: string;
  values: string[];
}

/** 자산 카드 한 장. */
export interface IronswornAssetCard {
  slug: string;
  name: string;
  nameEn: string;
  kind: IronswornAssetKind;
  /** 카드가 열리는 조건이나 맛을 내는 한 줄. */
  lead?: string;
  /** 동반자 카드처럼 이름을 적는 줄을 두는지. */
  nameLine?: boolean;
  abilities: IronswornAssetAbility[];
  track?: IronswornAssetTrack;
}
