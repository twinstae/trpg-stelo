---
title: "게으른 GM 자료집 용어집"
description: "5e 계열 용어의 한국어 표기와 대역 번역 규칙."
layout: ../../../layouts/MainLayout.astro
createdAt: "2026-09-13T12:00:00.000Z"
publish: true
---

이 문서는 **게으른 GM 자료집** 번역에 쓰는 용어와 규칙입니다. 원문은 [SlyFlourish.com](https://slyflourish.com/lazy_gm_resource_document.html)의 *The Lazy GM's Resource Document*(Michael E. Shea, CC BY 4.0)입니다.

## 0. 원고 파일 구조

| 종류 | 위치 |
| --- | --- |
| 영어 원문 | `src/data/lazy-gm-guide/en/<슬러그>.md` |
| 한국어 번역 | `src/data/lazy-gm-guide/ko/<슬러그>.md` |
| 절 제목·상태 | `src/data/lazy-gm-guide/chapters.ts` |
| 대역 렌더 | `src/pages/ko/lazy-gm-guide/[slug].astro` |

원문과 번역은 **헤딩(`##` 이상) 절 단위로 1:1 짝지어** 나란히 렌더됩니다. 두 원고의 **절 개수와 순서, 헤딩 깊이가 같아야** 하며, 어긋나면 빌드가 어느 절인지 알려 주며 실패합니다.

원문 각 파일은 `# 제목`으로 시작하지만, 페이지 머리말이 제목을 대신하므로 본문에서는 이 줄을 빼고 렌더합니다. **한국어 원고에는 `#` 제목을 쓰지 마십시오.**

## 1. 용어

| 원문 | 한국어 |
| --- | --- |
| GM / game master | GM (첫 등장에 "게임 마스터" 병기) |
| player / PC | 플레이어 / 플레이어 캐릭터 |
| NPC (nonplayer character) | NPC (논플레이어 캐릭터) |
| session | 세션 |
| session zero | 세션 제로 |
| campaign | 캠페인 |
| adventure | 모험 |
| encounter | 조우 |
| strong start | 강한 시작 |
| secrets and clues | 비밀과 단서 |
| fantastic locations | 멋진 장소 |
| challenge rating (CR) | 도전 등급(CR) |
| hit points (HP) | 생명점 |
| armor class (AC) / difficulty class (DC) | AC / DC (그대로) |
| ability check / skill check | 능력치 판정 / 기능 판정 |
| saving throw | 내성 굴림 |
| initiative | 이니셔티브 |
| advantage / disadvantage | 이점(advantage) / 불리(disadvantage) |
| inspiration | 영감(inspiration) |
| passive score | 수동 점수 |
| level / HD | 레벨 / HD |
| magic item | 마법 아이템 |
| dungeon | 던전 |
| horde / minion | 무리 / 졸개 |
| stat block | 스탯 블록 |
| theater of the mind | 머릿속 극장 |
| safety tools | 안전 도구 |
| hard lines / off-screen content | 하드 라인 / 오프스크린 내용 |
| group patron | 단체 후원자 |
| fronts / grim portents | 전선 / 불길한 전조 |
| six truths | 여섯 가지 진실 |
| quest | 퀘스트 |
| one-shot | 단발 게임 |
| fail forward | 앞으로 실패하기(fail forward) |

## 2. 문체

* 종결은 **"~합니다 / ~하십시오"**. 지시하는 목록은 "~하십시오", 규칙 설명은 "~합니다".
* 2인칭은 단수 **당신**, 플레이어 집단은 **여러분**.
* 문장은 짧게 끊고 수동태와 "~하는 것이 가능합니다" 같은 번역투를 피합니다.
* 숫자와 단위는 붙여 씁니다: **피해 2**, **경험치 1**, **HP 12**, **2d6 + 21**.

## 3. 마크다운

* 헤딩은 원문과 개수·순서·깊이를 똑같이 유지합니다. 새 헤딩을 만들거나 합치지 마십시오.
* 문서 안의 링크는 원문 표기(`05-creatingsecrets.md` 같은 파일 이름)를 **그대로 두십시오.** 사이트 경로(`/ko/lazy-gm-guide/...`)로 바꾸는 일은 `[slug].astro`가 자동으로 합니다.
* 목록 기호(`*`), 번호 목록(`1.`), 볼드(`**`), 인용(`>`)은 원문 리듬대로 유지합니다.
* 한글에는 이탤릭(`*…*`)을 쓰지 않습니다. 강조가 필요하면 볼드를 씁니다.
* 인용 안의 출처 표시는 라이선스 요구 사항이므로 영어 원문 그대로 두고, 필요하면 다음 줄에 한국어 풀이를 덧붙입니다.
