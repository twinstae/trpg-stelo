import type { IronswornMoveSheet } from '../../components/Sheets/ironswornSheet';
import { buildMoveSheet } from '../../utils/ironswornMoveSheet';

// 철의 맹세 액션 레퍼런스.
//
// 문구는 대역 원고(`ko/<슬러그>.md`와 `en/<슬러그>.md`)에서 그대로 뽑아 온다.
// 액션 이름과 결과 문구를 고치려면 원고를 고치면 되고, 시트는 따라온다.

import koAdventure from './ko/adventure-moves.md?raw';
import enAdventure from './en/adventure-moves.md?raw';
import koRelationship from './ko/relationship-moves.md?raw';
import enRelationship from './en/relationship-moves.md?raw';
import koCombat from './ko/combat-moves.md?raw';
import enCombat from './en/combat-moves.md?raw';
import koSuffer from './ko/suffer-moves.md?raw';
import enSuffer from './en/suffer-moves.md?raw';
import koQuest from './ko/quest-moves.md?raw';
import enQuest from './en/quest-moves.md?raw';
import koFate from './ko/fate-moves.md?raw';
import enFate from './en/fate-moves.md?raw';

export const IRONSWORN_MOVE_SHEETS: IronswornMoveSheet[] = [
  buildMoveSheet({
    slug: 'adventure',
    title: '모험 액션',
    titleEn: 'Adventure Moves',
    ko: koAdventure,
    en: enAdventure,
  }),
  buildMoveSheet({
    slug: 'relationship',
    title: '관계 액션',
    titleEn: 'Relationship Moves',
    ko: koRelationship,
    en: enRelationship,
  }),
  buildMoveSheet({
    slug: 'combat',
    title: '전투 액션',
    titleEn: 'Combat Moves',
    ko: koCombat,
    en: enCombat,
    // 인쇄용 시트처럼 끝에 「싸움 중의 다른 액션」을 붙인다.
    extraTitle: '싸움 중의 다른 액션',
  }),
  buildMoveSheet({
    slug: 'suffer',
    title: '고난 액션',
    titleEn: 'Suffer Moves',
    ko: koSuffer,
    en: enSuffer,
  }),
  buildMoveSheet({
    slug: 'quest',
    title: '임무 액션',
    titleEn: 'Quest Moves',
    ko: koQuest,
    en: enQuest,
  }),
  buildMoveSheet({
    slug: 'fate',
    title: '운명 액션',
    titleEn: 'Fate Moves',
    ko: koFate,
    en: enFate,
  }),
];
