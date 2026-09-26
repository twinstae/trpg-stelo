import type { ThirteenthAgeCharacter } from '../../components/Sheets/thirteenthAgeCharacter';

// 13시대 2판 사전 제작 캐릭터.
//
// 값은 pelgranepress.com 의 "13th Age 2e Pregenerated Character Builds" 연재와
// 그 연재에서 내려받는 직업별 캐릭터 시트(미겔 프리히날 디자인)를 옮긴 것이다.
// 출신·표상 관계·한가지 특별한 것은 원 시트에서도 비워 두므로, 플레이어가 채운다.

/**
 * 광신자 야만전사 (Fanatic Barbarian), 2레벨 하플링.
 *
 * 1레벨: 재능 — 야수 상(Beast Aspect), 회오리(Whirlwind), 불굴(Unstoppable).
 * 특기 — 모험가: 야수 상. 종족 능력 — 재빠른 발(Skitterfoot).
 * 2레벨: 새 특기 — 모험가: 회오리.
 */
export const BARBARIAN_FANATIC: ThirteenthAgeCharacter = {
  slug: 'barbarian-fanatic',
  buildName: '광신자',
  buildNameEn: 'Fanatic',
  className: '야만전사',
  classNameEn: 'Barbarian',
  level: 2,
  name: '하플링',
  kin: '하플링',
  kinEn: 'Halfling',
  description: '',
  oneUniqueThing: '',

  // 시트에 인쇄된 수정치는 +4 / +1 / +3 / +2 / +0 / +2 이며,
  // 모두 (점수 − 10) / 2 를 내림한 값과 같아 그대로 계산해 쓴다.
  abilities: [
    { label: '근력', labelEn: 'Strength', score: 19 },
    { label: '민첩성', labelEn: 'Dexterity', score: 12 },
    { label: '건강', labelEn: 'Constitution', score: 17 },
    { label: '통찰', labelEn: 'Wisdom', score: 14 },
    { label: '지능', labelEn: 'Intelligence', score: 10 },
    { label: '매력', labelEn: 'Charisma', score: 14 },
  ],

  hp: {
    max: 40,
    staggered: 20,
    dead: -20,
    recoveryDice: '2d12+3',
    recoveryAverage: 16,
    maxRecoveries: 8,
  },

  defenses: {
    armorClass: 16,
    physical: 15,
    mental: 14,
    initiative: 3,
    derivation: [
      '장갑 16 = 12(경장 갑옷) + 2(레벨) + 2(민첩성·건강·통찰 수정치의 가운데 값)',
      '신방 15 = 10 + 2(레벨) + 3(근력·민첩성·건강의 가운데 값)',
      '정방 14 = 10 + 2(레벨) + 2(통찰·지능·매력의 가운데 값)',
    ],
  },

  ragingAttack: {
    crit: '16+',
    miss: 4,
    note: '격노 중에는 치명타 범위가 4 넓어지고(16+), 기본 공격 대신 격노 일격·격노 투척을 쓴다.',
  },

  meleeAttack: {
    title: '쌍수 전투도끼',
    titleEn: 'Dual Wielding Battleaxes',
    kind: '근접 무기',
    damage: '2d8+4',
    average: 13,
    miss: 2,
    attack: 6,
    target: '장갑',
  },

  rangedAttack: {
    title: '투척 도끼',
    titleEn: 'Thrown Axe',
    kind: '가까움·멀리 원거리 무기',
    damage: '2d6+4',
    average: 11,
    miss: 3,
    attack: 1,
    target: '장갑',
  },

  rage: {
    rules: [
      '격노 중에는 기본 공격 대신 격노 일격과 격노 투척을 쓴다.',
      '분노를 시작하려면: 턴 시작에 d12 + 에스컬레이션 주사위를 굴려 9 이상이 나오면 시작한다.',
      '분노를 시작하려면: 전투마다 처음으로 적의 공격에 피해를 입었을 때도 시작한다.',
      '한 장에 한 번 쓰는 분노 시작으로 스스로 시작할 수 있다.',
      '한 장에 한 번 쓰는 회오리 모험가 특기로 회오리를 쓰면서 시작할 수도 있다.',
    ],
    ends: '죽음 내성 굴림에 실패하면 분노가 끝난다(다시 시작할 수 있다).',
    skulls: 4,
    determination: '해골이 하나 이상이면 모든 방어에 +1, 둘 이상이면 +2를 받는다.',
    skullMarks: ['방어 +1', '방어 +2', '죽음'],
  },

  backgroundRows: 4,
  backgrounds: [
    { title: '', bonus: null },
    { title: '', bonus: null },
    { title: '', bonus: null },
    { title: '', bonus: null },
  ],

  skillCheckNote: '판정에 쓰는 능력치의 수정치와, 그 일에 해당하는 출신의 보너스를 더한다.',
  prowessNote: '전설적 기량: 근력과 건강 기능 판정을 다시 굴릴 수 있다.',

  iconRows: 4,
  iconMarks: 5,

  powers: [
    {
      action: 'Free',
      title: '분노 시작',
      titleEn: 'Start Rage',
      tag: '특징',
      effect: '곧바로 격노를 시작한다. (다른 방법은 분노와 해골 상자를 보라.)',
      page: 'HH65',
      usage: { perArc: true },
    },
    {
      action: 'Free',
      title: '재빠른 발',
      titleEn: 'Skitterfoot',
      tag: '종족 능력',
      effect:
        '실패한 이탈 판정을 성공으로 바꾼다. 전투가 끝날 때까지 기회 공격에 한 번 +2 장갑 보너스를 받는다.',
      page: 'HH40',
      usage: { perBattle: true },
    },
    {
      action: 'Free',
      title: '야수 상',
      titleEn: 'Beast Aspect',
      tag: '재능',
      effect: '이 장에 아직 쓰지 않은 아래 이득 하나를 고른다.',
      page: 'HH66',
      usage: { perArc: true },
    },
    {
      action: 'Free',
      title: '격분',
      titleEn: 'Anger',
      effect: '격노하지 않은 상태에서 공격을 굴린 뒤, 그 공격의 치명타 범위를 1 넓힌다.',
      indent: true,
      usage: { perArc: true },
    },
    {
      action: 'Free',
      title: '인내',
      titleEn: 'Endurance',
      effect: '격노 중 전투가 끝날 때까지 모든 방어에 +1, 휘청 상태라면 +2를 받는다.',
      indent: true,
      usage: { perArc: true },
    },
    {
      action: 'Free',
      title: '맹렬',
      titleEn: 'Ferocity',
      effect: '적의 근접 공격이 자연 1~3으로 빗나가면, 다음 턴에 추가 표준 행동을 얻는다.',
      indent: true,
      usage: { perArc: true },
    },
    {
      action: 'Free',
      title: '위력',
      titleEn: 'Power',
      effect:
        '전투가 끝날 때까지, 턴을 시작할 때 교전하지 않았던 적에게 하는 근접 공격에 +8 피해를 더한다.',
      indent: true,
      usage: { perArc: true },
    },
    {
      action: 'Free',
      title: '회복',
      titleEn: 'Recovery',
      effect: '원기를 쓸 때 최대치(27)만큼 회복한다.',
      indent: true,
      usage: { perArc: true },
    },
    {
      action: 'Free',
      title: '속도',
      titleEn: 'Speed',
      effect: '행동 순서를 굴린 뒤 +5를 더한다.',
      indent: true,
      usage: { perArc: true },
    },
    {
      action: 'Free',
      title: '생존',
      titleEn: 'Survival',
      effect: '죽음 내성을 +2 보너스를 받고 다시 굴린다.',
      indent: true,
      usage: { perArc: true },
    },
    {
      action: '—',
      title: '불굴의 결의',
      titleEn: 'Grim Determination',
      tag: '특징',
      effect: '해골을 갖고 있으면 방어가 올라간다. (분노와 해골 상자를 보라.)',
      page: 'HH65',
    },
  ],

  morePowers: [
    {
      action: 'Std',
      title: '지원',
      titleEn: 'Assist',
      tag: '기본 행동',
      effect: '전투 중 가까운 동료 하나에게, 다가오는 공격·내성·판정 하나에 +2를 준다.',
      page: 'HH298',
      usage: { atWill: true },
    },
    {
      action: 'Move',
      title: '이탈',
      titleEn: 'Disengage',
      tag: '기본 행동',
      effect:
        '이탈 판정을 굴린다(11+, 이미 교전 중인 적이 하나 늘 때마다 +1). 성공하면 기회 공격을 받지 않고 움직이고, 실패하면 교전한 채로 남는다.',
      page: 'HH294',
      usage: { atWill: true },
    },
    {
      action: 'Int',
      title: '저지',
      titleEn: 'Intercept',
      tag: '기본 행동',
      effect: '교전하지 않은 상태에서, 곁을 지나가는 적과 교전하도록 움직인다.',
      page: 'HH296',
      usage: { atWill: true },
    },
    {
      action: 'Std',
      title: '결집',
      titleEn: 'Rally',
      tag: '기본 행동',
      effect:
        '원기를 하나 써서 회복한다. 이미 썼다면, 빠른 행동으로 일반 내성(11+)을 굴려 다시 쓸 수 있다.',
      page: 'HH298',
      usage: { perBattle: true },
    },
    {
      action: 'Std',
      title: '회오리',
      titleEn: 'Whirlwind',
      tag: '재능',
      effect:
        '최대 3명의 적에게 근접 공격을 한다. 다만 자연 1~3으로 빗나가면, 그 대상이 곧바로 기회 공격을 한다.',
      page: 'HH67',
      usage: { perBattle: true },
    },
    {
      action: 'Free',
      title: '모험가 특기: 회오리',
      titleEn: 'Adventurer Feat',
      tag: '특기',
      effect: '회오리를 쓸 때 격노를 시작한다. (다른 방법은 분노와 해골 상자를 보라.)',
      page: 'HH67',
      usage: { perArc: true },
    },
    {
      action: 'Free',
      title: '불굴',
      titleEn: 'Unstoppable',
      tag: '재능',
      effect: '근접 공격을 하기 전에 선언한다. 공격이 명중하면 원기를 써서 회복한다.',
      page: 'HH67',
      usage: { perBattle: true },
    },
  ],

  magicItemAttunement: 2,

  potions: [
    {
      title: '모험가 치유 물약',
      effect: '회복량만큼 체력을 회복하고 1d8을 더한다(최대 30).',
    },
  ],

  miscFeatures: [
    '쌍수 전투: 한 손에 하나씩 무기를 들고 싸울 때, 공격 굴림에서 자연 2가 나오면 명중으로 친다.',
  ],

  gear: {
    armor: '경장 갑옷',
    armorBonus: 12,
    shieldBonus: 0,
    baseArmorClass: 12,
    gold: '',
    items: [
      { title: '쌍수 전투도끼', kind: '근접 무기' },
      { title: '투척 도끼', kind: '원거리 무기' },
      { title: '경장 갑옷', kind: '기본 장갑 12' },
    ],
  },

  feats: [
    { title: '야수 상', titleEn: 'Beast Aspect', tier: 'A' },
    { title: '회오리', titleEn: 'Whirlwind', tier: 'A', note: '2레벨에 얻음' },
  ],

  incrementalAdvances: [
    '특성치 증가 — 3/6/9레벨에 3개/4개/5개에 +1씩',
    '능력치 배수 — 4/7레벨에 2배/4배',
    '마법 물품 각성 횟수 +1',
    '다음 레벨의 능력 또는 주문 얻기',
    '기능 판정과 행동 순서에 +1',
    '4/7레벨에 다음 레벨의 재능 얻기',
    '최대 체력을 다음 레벨만큼 올리기',
    '다음 레벨의 특기 얻기',
    '신방 +1',
    '정방 +1',
  ],

  armorTable: [
    { armor: '없음', baseAc: '11', penalty: '+0' },
    { armor: '경장', baseAc: '12', penalty: '+0', active: true },
    { armor: '중장', baseAc: '13', penalty: '-2' },
    { armor: '방패', baseAc: '+1', penalty: '+0' },
  ],

  weaponTable: [
    {
      weapon: '소형 (단검, 곤봉, 손 도끼)',
      oneHand: 'd4/+0',
      twoHand: 'd6/+0',
      thrown: 'd4/+0',
      bow: '—',
      crossbow: 'd4/-5',
    },
    {
      weapon: '경장·단순 (워해머, 창, 손도끼, 투창, 단궁, 경석궁)',
      oneHand: 'd6/+0',
      twoHand: 'd8/+0',
      thrown: 'd6/+0',
      bow: 'd6/-5',
      crossbow: 'd6/-5',
    },
    {
      weapon: '중장·군용 (장검, 전투도끼, 대검, 장궁, 중석궁)',
      oneHand: 'd8/+0',
      twoHand: 'd10/+0',
      thrown: '—',
      bow: 'd8/+0',
      crossbow: 'd8/-5',
      active: true,
    },
  ],

  legend: [
    '새 레벨에 바뀌거나 갱신된다',
    '새 레벨 또는 점진적 성장으로 바뀐다',
    '새 장(arc)마다 갱신된다',
    '전투가 끝날 때 갱신된다',
  ],

  credit: '© 2025 Fire Opal Media, Inc. & Pelgrane Press Ltd. 개인적 사용을 위한 복제만 허가됨.',
};

/** 사전 제작 캐릭터 목록. 지금은 야만전사 하나. */
export const THIRTEENTH_AGE_PREGENS: ThirteenthAgeCharacter[] = [BARBARIAN_FANATIC];
