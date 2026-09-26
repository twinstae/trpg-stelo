/**
 * 13시대(13th Age) 2판 직업별 캐릭터 시트를 그리기 위한 데이터 구조.
 *
 * 용어는 2013년 한국어 1판 시트를 따른다.
 * 근력·건강·민첩성·지능·통찰·매력(능력치), 장갑·신방·정방(방어),
 * 체력·원기·회복량, 한가지 특별한 것, 표상 관계, 출신, 재능, 특기,
 * 능력과 주문, 마법 물품, 점진적 성장.
 */

/** 능력치 한 칸. */
export interface TaAbility {
  /** 한국어 이름(근력·건강·민첩성·지능·통찰·매력). */
  label: string;
  /** 영문 이름(Strength …). */
  labelEn: string;
  score: number;
  /**
   * 능력 수정치는 적어 두지 않는다. 굴림에 쓰는 값은 시트를 그릴 때
   * `abilityModifier()` 로 점수에서 계산한다.
   */
}

/** 공격 한 줄. */
export interface TaAttack {
  title: string;
  titleEn?: string;
  /** 무기 종류 설명(근접 무기, 가까움·멀리 …). */
  kind: string;
  /** 피해 표기(2d8+4). */
  damage: string;
  /** 평균 피해. 시트 오른쪽 둥근 상자에 적는다. */
  average: number;
  /** 빗나감 피해. */
  miss: number;
  /** 공격 수정치. */
  attack: number;
  /** 굴림을 견주는 방어(장갑 등). */
  target: string;
  note?: string;
}

/** 체력과 원기 상자. */
export interface TaHitPoints {
  /** 최대 체력. */
  max: number;
  /** 휘청 상태가 되는 체력(최대 체력의 절반). */
  staggered: number;
  /** 죽음 기준값(보통 음수). */
  dead: number;
  /** 회복 주사위 표기(2d12+3). */
  recoveryDice: string;
  /** 회복량 평균. */
  recoveryAverage: number;
  /** 회복할 수 있는 최대 원기 수. */
  maxRecoveries: number;
}

/** 장갑·신방·정방과 행동 순서. */
export interface TaDefenses {
  /** 장갑(Armor Class). */
  armorClass: number;
  /** 신방(Physical Defense). */
  physical: number;
  /** 정방(Mental Defense). */
  mental: number;
  /** 행동 순서. */
  initiative: number;
  /** 장갑·신방·정방이 어떻게 나온 값인지 적어 두는 줄들. */
  derivation: string[];
}

/** 사용 제한. 시트 오른쪽 '사용' 상자의 세 열에 대응한다. */
export interface TaUsage {
  /** 상시·재충전 열. */
  atWill?: boolean;
  /** 전투당 열. */
  perBattle?: boolean;
  /** 장(arc)당 열. */
  perArc?: boolean;
}

/** 재능·특기·능력 한 줄. */
export interface TaPower {
  /** 쓰는 행동(Free·Std·Move·Int·Quick 또는 —). */
  action: string;
  title: string;
  titleEn?: string;
  /** 이 능력이 어디에서 오는지(종족 능력·재능·특기·기본 행동 …). */
  tag?: string;
  /** 발동 조건·대상·효과. */
  effect: string;
  /** 원서 쪽수(HH65). */
  page?: string;
  /** 곁가지 선택지면 들여쓰고 행동 표시를 비운다. */
  indent?: boolean;
  usage?: TaUsage;
}

/** 분노와 해골 상자. */
export interface TaRage {
  /** 상자 안에 그대로 적는 규칙 줄. */
  rules: string[];
  /** 분노가 끝나는 조건. */
  ends: string;
  /** 해골 표시 칸 수. */
  skulls: number;
  /** 해골 수에 따라 달라지는 방어 보너스(불굴의 결의). */
  determination: string;
  /** 해골 표시 사이에 인쇄된 표시들. */
  skullMarks: string[];
}

/** 출신 한 줄. 시트에는 빈칸으로 두고 플레이어가 적는다. */
export interface TaBackground {
  title: string;
  /** 시트에 미리 적어 둔 보너스. 없으면 null. */
  bonus: number | null;
}

/** 특기(Feat) 한 줄. */
export interface TaFeat {
  title: string;
  titleEn?: string;
  /** A = 모험가 등급(1~4레벨), C = 투사 등급(5~7), E = 서사시 등급(8~10). */
  tier: 'A' | 'C' | 'E';
  note?: string;
}

/** 장비 한 줄. */
export interface TaGearItem {
  title: string;
  /** 무기·갑옷 같은 종류 표시. */
  kind: string;
}

/** 장비와 기록 상자. */
export interface TaGear {
  /** 입고 있는 갑옷 이름. */
  armor: string;
  /** 갑옷이 주는 기본 장갑. */
  armorBonus: number;
  /** 방패 보너스. */
  shieldBonus: number;
  /** 합계(기본 장갑). */
  baseArmorClass: number;
  /** 금화 칸. */
  gold: string;
  items: TaGearItem[];
}

/** 직업 기본 장갑 표의 한 줄. */
export interface TaArmorRow {
  armor: string;
  baseAc: string;
  penalty: string;
  /** 이번 캐릭터가 쓰는 줄이면 강조한다. */
  active?: boolean;
}

/** 무기 피해/공격 페널티 표의 한 줄. */
export interface TaWeaponRow {
  weapon: string;
  oneHand: string;
  twoHand: string;
  thrown: string;
  bow: string;
  crossbow: string;
  active?: boolean;
}

/** 물약과 룬 한 줄. */
export interface TaPotion {
  title: string;
  effect: string;
}

/** 13시대 사전 제작 캐릭터 한 명. */
export interface ThirteenthAgeCharacter {
  /** 라우트 앵커이자 브라우저 저장 키로 쓰는 슬러그. */
  slug: string;
  /** 빌드 이름(예: 광신자). */
  buildName: string;
  buildNameEn: string;
  /** 직업 이름. */
  className: string;
  classNameEn: string;
  /** 직업 시트의 주 색(시트마다 다르다). */
  accent?: string;
  level: number;
  /** 이름 칸에 미리 적어 둔 값. */
  name: string;
  kin: string;
  kinEn: string;
  /** 설명과 한가지 특별한 것. 비워 두면 빈칸으로 그린다. */
  description: string;
  oneUniqueThing: string;
  abilities: TaAbility[];
  hp: TaHitPoints;
  defenses: TaDefenses;
  /** 격노 공격(치명타 범위·빗나감). */
  ragingAttack: { crit: string; miss: number; note: string };
  meleeAttack: TaAttack;
  rangedAttack: TaAttack;
  rage: TaRage;
  /** 출신을 적는 빈 줄 수. */
  backgroundRows: number;
  backgrounds: TaBackground[];
  /** 기술 판정 상자에 들어가는 설명. */
  skillCheckNote: string;
  /** 전설적 기량처럼 상자 아래 붙는 줄. */
  prowessNote: string;
  /** 표상 관계 줄 수. */
  iconRows: number;
  /** 표상 하나에 찍는 관계 표시 칸 수. */
  iconMarks: number;
  /** 앞면 재능·특기·능력 표. */
  powers: TaPower[];
  /** 뒷면 '더 많은 재능·특기·능력' 표. */
  morePowers: TaPower[];
  /** 마법 물품 최대 각성 수. */
  magicItemAttunement: number;
  potions: TaPotion[];
  /** 기타 특징(장비·무기 규칙 같은 것). */
  miscFeatures: string[];
  gear: TaGear;
  feats: TaFeat[];
  incrementalAdvances: string[];
  armorTable: TaArmorRow[];
  weaponTable: TaWeaponRow[];
  /** 시트에 인쇄된 범례. */
  legend: string[];
  /** 원문 저작권 표시. */
  credit: string;
}
