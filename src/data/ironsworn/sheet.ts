import type { IronswornSheetLayout } from '../../components/Sheets/ironswornSheet';

// 철의 맹세 캐릭터 시트에 인쇄된 고정값.
//
// 시트 생김새와 값은 숀 톰킨의 《철의 맹세》 플레이킷(CC BY-NC-SA 4.0) 한국어판을
// 따랐고, 능력치·상태 트랙·결점 이름은 GLOSSARY.md 와 맞췄다.

export const IRONSWORN_SHEET: IronswornSheetLayout = {
  stats: [
    { id: 'edge', label: '기민', labelEn: 'Edge' },
    { id: 'heart', label: '심장', labelEn: 'Heart' },
    { id: 'iron', label: '강철', labelEn: 'Iron' },
    { id: 'shadow', label: '그림자', labelEn: 'Shadow' },
    { id: 'wits', label: '지혜', labelEn: 'Wits' },
  ],

  experienceRows: 2,
  experiencePerRow: 10,

  bonds: 10,

  vows: 5,
  vowProgress: 10,

  ranks: [
    { label: '성가신', labelEn: 'Troublesome', progress: '경유지마다 진척 3' },
    { label: '위험한', labelEn: 'Dangerous', progress: '경유지마다 진척 2' },
    { label: '막강한', labelEn: 'Formidable', progress: '경유지마다 진척 1' },
    { label: '극한', labelEn: 'Extreme', progress: '경유지마다 틱 2' },
    { label: '서사', labelEn: 'Epic', progress: '경유지마다 틱 1' },
  ],

  statusTracks: [
    {
      id: 'health',
      label: '건강',
      labelEn: 'Health',
      note: '피해 견디기로 줄고, 쉬기·치유하기로 늘어납니다.',
    },
    {
      id: 'spirit',
      label: '정신',
      labelEn: 'Spirit',
      note: '스트레스 견디기로 줄고, 야영하기·유대 맺기로 늘어납니다.',
    },
    {
      id: 'supply',
      label: '보급',
      labelEn: 'Supply',
      note: '일행이 함께 쓰는 값입니다. 여정에서 줄고 보급하기로 늘어납니다.',
    },
  ],

  conditions: [
    { id: 'wounded', label: '부상', labelEn: 'Wounded' },
    { id: 'shaken', label: '동요', labelEn: 'Shaken' },
    { id: 'unprepared', label: '준비 부족', labelEn: 'Unprepared' },
    { id: 'encumbered', label: '과적', labelEn: 'Encumbered' },
  ],

  banes: [
    { id: 'maimed', label: '불구', labelEn: 'Maimed' },
    { id: 'corrupted', label: '부패', labelEn: 'Corrupted' },
  ],

  burdens: [
    { id: 'cursed', label: '저주', labelEn: 'Cursed' },
    { id: 'tormented', label: '고뇌', labelEn: 'Tormented' },
  ],

  momentum: [10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0, -1, -2, -3, -4, -5, -6],
  status: [5, 4, 3, 2, 1, 0],

  maxMomentum: 10,
  momentumReset: 2,

  notes: [
    '능력치는 3·2·2·1·1을 원하는 순서로 배치하고, 상태 트랙은 모두 +5에서 시작합니다.',
    '결점을 하나 표시할 때마다 최대 모멘텀과 초기화 값이 1씩 줄어듭니다.',
    '모멘텀을 불태우면 모멘텀 초기화 값에 맞추고, 다음 굴림에 그 값을 씁니다.',
    '진척을 표시한 뒤 진행 액션을 하면 이 굴림에서는 모멘텀을 무시합니다.',
  ],
};
