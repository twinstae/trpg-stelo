/**
 * 던전월드 2 작은 모험(시나리오) 시트를 그리기 위한 데이터 구조.
 *
 * 원고(`src/data/dw2/ko/the-stolen-children.md`)를 시트 배치에 맞게 손으로 정리한 값을 담는다.
 * 설명 문자열의 `**강조**`는 굵게, `*기울임*`은 이탤릭, `☐`는 체크박스로 렌더한다.
 */

/** 라벨과 본문이 한 줄로 붙는 항목(동기/자원/저항/피해). */
export interface Dw2ScenarioLine {
  label: string;
  text: string;
}

/** NPC 능력치 블록. */
export interface Dw2ScenarioNpc {
  /** NPC 이름(괄호 표기 포함). */
  title: string;
  /** 한 줄 소개(이탤릭). */
  description: string;
  /** 동기/자원/저항/피해 줄. */
  lines: Dw2ScenarioLine[];
  /** 조건과 격화 목록(☐ 표시). */
  conditions: string[];
}

/** 장소 블록. */
export interface Dw2ScenarioLocation {
  title: string;
  /** `[성격, 성격]` 괄호 표기. */
  traits?: string;
  /** 한 줄 소개(이탤릭). */
  description: string;
  /** 특징 목록(◆). */
  features: string[];
  /** 관련 장소와 NPC 목록(◆). */
  related: string[];
}

/** 마법 아이템/보상 블록. */
export interface Dw2ScenarioItem {
  title: string;
  /** 한 줄 설명(이탤릭). */
  description: string;
  /** 테두리 상자 안의 규칙 본문. */
  rules: string[];
}

export type Dw2ScenarioBlock =
  | { kind: 'heading'; text: string; level?: 1 | 2 | 3 }
  | { kind: 'prose'; text: string; italic?: boolean }
  | { kind: 'list'; items: string[]; check?: boolean; note?: string }
  | { kind: 'npc'; npc: Dw2ScenarioNpc }
  | { kind: 'location'; location: Dw2ScenarioLocation }
  | { kind: 'item'; item: Dw2ScenarioItem };

/** 시나리오 시트 한 장. */
export interface Dw2ScenarioSheet {
  /** 라우트 슬러그이자 저장 키. */
  slug: string;
  titleKo: string;
  titleEn: string;
  /** 시트 서두의 이탤릭 소개문. */
  intro?: string;
  /** 내용 경고 등 서두 주석. */
  note?: string;
  blocks: Dw2ScenarioBlock[];
}
