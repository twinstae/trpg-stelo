/**
 * 13시대 캐릭터 시트에서 쓰는 계산.
 *
 * 능력치 수정치는 시트에 적힌 값이 아니라 규칙대로 점수에서 나온다.
 * (점수 − 10) / 2 를 내림한 값이며, 19는 +4, 17은 +3, 12는 +1이 된다.
 * 시트에 인쇄된 값도 모두 이 식과 맞는다.
 */
export function abilityModifier(score: number): number {
  return Math.floor((score - 10) / 2);
}

/** 굴림 수정치처럼 부호를 붙여 쓴다. 0은 +0, −2는 −2. */
export function signed(value: number): string {
  return value >= 0 ? `+${value}` : `−${Math.abs(value)}`;
}

/** 능력치 점수를 수정치 표기(+4)로 바꾼다. 값이 숫자가 아니면 빈칸을 둔다. */
export function modifierLabel(score: number | string): string {
  const parsed = typeof score === 'number' ? score : Number.parseInt(score, 10);
  return Number.isFinite(parsed) ? signed(abilityModifier(parsed)) : '—';
}
