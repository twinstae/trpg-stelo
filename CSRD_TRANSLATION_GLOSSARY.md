# CSRD Translation Glossary (KO)

This glossary defines canonical terminology for `src/pages/ko/cypher-open/` and related Korean CSRD pages.

## 1) Character Framework

| English                            | Korean (Preferred) | Notes                                                               |
| ---------------------------------- | ------------------ | ------------------------------------------------------------------- |
| Descriptor                         | 수식어             | First mention can be `수식어(Descriptor)`.                          |
| Type                               | 유형               | Keep as `유형`; avoid mixing with `클래스` except explanatory note. |
| Focus                              | 특징               | First mention in each file: `특징(Focus)`, then `특징`.             |
| Flavor / Flavors                   | 플레이버           | Use `플레이버`; do not use `풍미` in body text.                     |
| Connection / Background Connection | 배경 연결          | Use `배경 연결` for section headers/tables.                         |
| Character Arc                      | 캐릭터 아크        | Keep as transliterated canonical term.                              |

## 2) Core Mechanics

| English                | Korean (Preferred) | Notes                                           |
| ---------------------- | ------------------ | ----------------------------------------------- |
| Stat / Statistic       | 특성치 / 스탯      | `특성치` first, `스탯` optional in explanation. |
| Might                  | 힘                 |                                                 |
| Speed                  | 속력               |                                                 |
| Intellect              | 지성               |                                                 |
| Pool / Stat Pool       | 역량 / 특성치 역량 | Use `역량` as default.                          |
| Edge                   | 재능               |                                                 |
| Effort                 | 분발               |                                                 |
| Tier                   | 등급               | e.g. `1등급`.                                   |
| XP / Experience Points | XP / 경험치        | `XP` allowed with `경험치` in prose.            |
| Recovery Roll          | 회복 굴림          |                                                 |
| Task                   | 일 / 과제          | Keep consistent within section (prefer `일`).   |
| Difficulty             | 난이도             |                                                 |
| Target Number          | 목표치             |                                                 |
| Eased / Ease           | 완화 / 완화된다    |                                                 |
| Hindered / Hinder      | 방해 / 방해된다    |                                                 |
| Trained                | 익숙               |                                                 |
| Specialized            | 능숙               |                                                 |
| Inability              | 무능               |                                                 |
| Asset                  | 보탬               | In examples: `보탬으로 친다`.                   |
| Weakness               | 약점               | Opposite of Edge.                               |
| Damage Track (Object)  | 사물 부상 트랙     |                                                 |
| Minor Effect           | 작은 이득          |                                                 |
| Major Effect           | 큰 이득            |                                                 |

## 3) Action Economy and Rules Tags

| English               | Korean (Preferred)         | Notes                                                                |
| --------------------- | -------------------------- | -------------------------------------------------------------------- |
| Action (ability tag)  | 행동                       | Ability tag at end of entry.                                         |
| Enabler (ability tag) | 강화                       | Ability tag at end of entry.                                         |
| Turn                  | 차례                       |                                                                      |
| Round                 | 라운드                     |                                                                      |
| Encounter             | 초점 장면 / 장면           | In core procedures, prefer `초점 장면`; use `장면` in natural prose. |
| Initiative            | 행동 순서 / 행동 순서 판정 | Use `행동 순서 판정` in procedures.                                  |
| Range                 | 사거리                     |                                                                      |
| Immediate range       | 지근거리                   |                                                                      |
| Short range           | 단거리                     |                                                                      |
| Long range            | 장거리                     |                                                                      |
| Very long range       | 초장거리                   |                                                                      |

## 4) System Terms

| English                  | Korean (Preferred) | Notes                                                 |
| ------------------------ | ------------------ | ----------------------------------------------------- |
| Cypher                   | 사이퍼             |                                                       |
| Cypher Limit             | 사이퍼 제한        |                                                       |
| Artifact                 | 아티팩트           |                                                       |
| GM                       | 마스터             | Keep `마스터`; avoid `GM`-only prose.                 |
| GM Intrusion / Intrusion | 마스터 개입 / 개입 | `개입` alone allowed after established context.       |
| Player Intrusion         | 플레이어 개입      |                                                       |
| PC                       | PC                 | Keep acronym + Korean explanation in prose as needed. |
| NPC                      | NPC                | Keep acronym.                                         |
| Creature                 | 생물               |                                                       |

## 5) Character-Type Canonical Names

| English  | Korean (Preferred) | Notes                                               |
| -------- | ------------------ | --------------------------------------------------- |
| Warrior  | 전사               | Do not use `워리어` in Korean body text/tables.     |
| Adept    | 어뎁트             |                                                     |
| Explorer | 탐험가             | Do not use `익스플로러` in Korean body text/tables. |
| Speaker  | 스피커             |                                                     |

- Character-type labels in Korean docs should follow `src/pages/ko/cypher-open/character-types.md`.
- If English role names must appear for reference, use mixed form once: `전사(Warrior)`, `탐험가(Explorer)`.

## 6) Translation Policy for Ability Names

- Keep ability names in bullet lists in English unless the user explicitly requests localization.
- In example prose, optional mixed form is allowed when helpful: `한국어(English)`.
- Do not invent new Korean names for abilities that are currently standardized in English list form.

## 7) Markdown and Formatting Rules (Critical)

- Preserve markdown structure exactly (headings, lists, tables, links, blockquotes, footnotes).
- Keep mechanics exact (costs, ranges, tiers, options, numbers, limits).
- Korean bold spacing rule: write particles outside bold.
  - Correct: `**재능 강화** 를`
  - Wrong: `**재능 강화**를`
- Never insert spaces inside bold markers.
  - Wrong: `** 재능 강화**`, `**재능 강화 **`

## 8) Consistency Notes

- Prefer one canonical term per concept in a section (avoid unnecessary synonyms).
- Keep section header patterns consistent:
  - `<유형> 플레이어 개입`
  - `<유형> 역량 시작값`
  - `<유형> 배경 연결`
  - `N등급 <유형>`
- When uncertain, align with existing usage in:
  - `src/pages/ko/cypher-open/creating-your-character.md`
  - `src/pages/ko/cypher-open/character-types.md`
  - `src/pages/ko/numenera/how-to-play-numenera.md`
