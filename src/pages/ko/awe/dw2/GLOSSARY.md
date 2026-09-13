---
title: "던전월드 2 용어집"
description: "2.1 베타 영한 용어와 1판 공개판 정렬."
layout: ../../../../layouts/MainLayout.astro
createdAt: "2026-03-29T12:00:00.000Z"
publish: true
---

**던전월드 2 Beta v2.1** 번역의 영한 용어집입니다. 문체·표기·마크다운 규칙은 [`TRANSLATION-GUIDE.md`](./TRANSLATION-GUIDE.md)를 보십시오. 진행 상황은 저장소 루트의 `DW2_BETA_TRANSLATION_CHECKLIST.md`에 있습니다.

* **굵게** = 확정 표기.
* _기울임_ = 파일럿 리뷰에서 확정할 잠정 표기.
* 정렬 기준: [던전월드 한국어 공개판](https://sites.google.com/view/dwtemporary)(1판).
* 새 용어를 만들면 **여기에 한 줄 추가**하고, 같은 커밋에서 기존 파일을 grep해 통일합니다.

---

## 0. 이야기 속 현실 (the fiction)

영어권에서는 *fiction*을 규칙 논의에서 흔히 쓰지만, 1판 공개판은 고정 합성어보다 **“이야기 속 …”** 구문을 씁니다.

| English | 한국어 | 병기 규칙 |
| --- | --- | --- |
| the fiction / fiction | **이야기 속 현실**(개념 정의·첫 도입) / 문맥에 따라 **이야기 속에서**, **이야기 속의 상황**, **이야기 속의 세계** | 개념을 명시적으로 소개할 때만 **이야기 속 현실(the fiction)**. 파일당 첫 등장 한 번 |
| narrative | **이야기** / **내러티브** | 흐름·서사는 **이야기** 우선. 규칙 용어로 강조할 때만 첫 등장에 **내러티브(narrative)** |
| Fictional positioning | **이야기 속 위치** | 파일당 첫 등장 **이야기 속 위치(Fictional positioning)**, 이후 풀어 써도 됨 |

1판 예: “여기서 ‘이야기 속’이라는 말은, 액션을 일으키는 일도 액션의 효과도 **캐릭터들이 사는 세상에서** 일어나는 일이라는 뜻입니다.”

**픽션**은 기본 표기로 쓰지 않습니다.

---

## A. 사람과 역할

| English | 한국어 | 비고 |
| --- | --- | --- |
| Game Master (GM) | **마스터** / GM | 1판 본문은 “마스터”. 괄호로 GM 병기 가능 |
| Player | **플레이어** | |
| Player character (PC) | **플레이어 캐릭터** / **PC** | |
| Participant | **참가자** | 안전 도구 등 메타 논의에서 플레이어·마스터 포함 |
| NPC | **NPC** | 필요 시 “NPC(비플레이어 인물)” |
| The play group (table) | **팀** | 실제 플레이 집단. 이야기 속 **일행**과 구분 |
| The adventuring party | **일행** | 캐릭터들의 무리 |

---

## B. 핵심 개념

| English | 한국어 | 비고 |
| --- | --- | --- |
| Move | **액션** | 병기: “액션(Move)”. 1판 표준 |
| Core Moves | **핵심 액션** | |
| Extra Moves | **추가 액션** | |
| Campaign Moves | **캠페인 액션** | |
| Class | **직업** | |
| Character sheet | **캐릭터 시트** | |
| Level / Level up | **레벨** / **레벨업** | |
| Experience (XP) | **경험치** / XP | |
| Roll | **판정** | “+근 판정을 합니다” 식이 1판 표준 |
| Trigger | **발동** / **발동 조건** | 무브 첫 줄 “When you…” → “~할 때” |
| Advantage / Disadvantage | **유리(adv)** / **불리(dis)** | 파일 첫 등장만 영어 병기 |
| Path / Path Move | **길(Path)** / **상급 액션** | |
| Advancements | _향상_ (대안: 발전) | 파일럿에서 확정. 알파 직업 파일은 “발전”을 썼음 |
| Multiclass | **다중 직업** | |
| Prep | **예비(Prep)** | 2.1에는 Hold가 없으므로 예비는 Prep 전용 |

---

## C. 능력치 (2.1은 다섯)

| English | 한국어 | 비고 |
| --- | --- | --- |
| Strength (STR) | **근력(STR)** | |
| Dexterity (DEX) | **민첩성(DEX)** | 1판 **민첩성** |
| Intelligence (INT) | **지능(INT)** | |
| Wisdom (WIS) | **지혜(WIS)** | |
| Charisma (CHA) | **매력(CHA)** | |
| Constitution (CON) | — | 2.1 기본 능력치 아님 |

판정 표기는 **+근 판정**, **+민 판정**, **+지 판정**, **+혜 판정**, **+매 판정**. 풀표기(2d6+근력)는 주사위 설명 절에서만.

---

## D. 조건과 상태

2.1의 PC 조건은 **다섯**입니다. 알파 시트의 다섯 조건과 그대로 이어집니다.

| English | 한국어 | 페널티 |
| --- | --- | --- |
| Angry | **분노** | +지 판정에 불리 |
| Distracted | **산만** | +혜 판정에 불리 |
| Exhausted | **지침** | +근 판정에 불리 |
| Frightened | **겁먹음** | +민 판정에 불리 |
| Insecure | **불안** | +매 판정에 불리 |
| Unsatisfied | **미충족** | 야만인 쾌락주의자 길의 추가 조건 |

| English | 한국어 | 비고 |
| --- | --- | --- |
| Clear / Marked / Locked | **지워짐 / 표시됨 / 잠김** | 동사는 지웁니다·표시합니다·**잠급니다** |
| Bloodied | **피투성이** | 2.1에서는 조건이 아니라 **HP가 최대치 절반 이하인 상태** |
| Helpless | _무방비_ (대안: 속수무책) | HP 0 상태. 파일럿에서 확정 |
| HP | **HP** / 히트포인트 | 첫 등장 병기 가능 |
| Damage (dmg) | **피해** | 최소 피해 / 최대 피해 |
| Damage dice size | **피해 주사위 단계** | |
| Armor | **장갑** | |
| Shield | **방패** | |
| Resistance / Resist | **저항(한다)** / **저항** | 피해 감소가 아니라 이야기 속 위치를 바꾸는 것 |
| Heal / healing | **치유** | |
| Uses | **사용**(◯) | 식량·독 등 회분 단위는 **회분** |

### 장비 태그

| English | 한국어 | English | 한국어 |
| --- | --- | --- | --- |
| `\#hand` | **손** | `\#piercing` | **관통** |
| `\#close` | **근접** | `\#precise` | **정밀** |
| `\#near` | **가까움** | `\#reload` | **재장전** |
| `\#far` | **멀리** | `\#two-handed` | **양손** |
| `\#ammo` | **탄약** | `\#concealed` | **은닉** |
| `\#area` | **범위** | `\#distinctive` | **눈에 띔** |
| `\#forceful` | **강타** | `\#holy` | **신성** |
| `\#light` | **경량** | `\#versatile` | **양용** (원문 태그 설명에만 등장) |

---

## E. 액션 (2.1 확정안)

제목 형식은 **`한글(English)`**, 영어 병기는 파일당 첫 등장 한 번.

### 핵심 액션

| English | 한국어 | 비고 |
| --- | --- | --- |
| Aid a PC | **동료 돕기** | 1판 “협조 또는 방해” 계열. 알파 표기 유지 |
| Cast a Spell | **주문 시전** | 1판 명칭 그대로 |
| Comfort or Support | **위로와 격려** | |
| Defy Danger | **위험 돌파** | 1판 그대로 |
| Pull Strings | _마음 움직이기_ | 대안: 줄을 당기다 / 협상. 속임·설득·협박 3갈래를 아우름 |
| Sense Motive | **속뜻 읽기** | |
| Sneak Past | **몰래 지나가기** | |
| Spout Lore | **지식 더듬기** | 1판 명칭 복귀 (2.0 알파의 Recall Lore와 같은 한글) |
| Trade Blows | _주고받기_ | 대안: 맞붙기 / 격돌. 1판 접근전·사격의 자리를 잇는 이름 |
| Unearth Secrets | **비밀을 파헤치다** | |

### 추가 액션

| English | 한국어 |
| --- | --- |
| End the Session | **세션을 마친다** |
| Face Death | **황천길**(Face Death) |
| Level Up | **레벨업** |
| Make Camp | **야영** |
| Perform a Ritual | **의식을 행한다** |
| Reach Your Limit | **한계에 다다른다** |
| Undertake a Perilous Journey | **험난한 여정**(Undertake a Perilous Journey) |

### 캠페인 액션

| English | 한국어 |
| --- | --- |
| Enjoy Downtime | **휴식을 즐긴다** |
| Forge a Bond | **유대를 맺는다** |
| Reveal Your Struggle | **갈등을 드러낸다** |

### 1판 대응

| 1판 | English (DW1) | 2.1 |
| --- | --- | --- |
| 접근전 · 사격 | Hack and slash, Volley | **주고받기(Trade Blows)** 로 통합 |
| 위험 돌파 | Defy Danger | **위험 돌파** (동일) |
| 지식 더듬기 | Spout lore | **지식 더듬기(Spout Lore)** |
| 협상 | Parley | **마음 움직이기(Pull Strings)** / 맥락상 **협상** |
| 협조 또는 방해 | Aid or interfere | **동료 돕기(Aid a PC)** |
| 황천길 | Last breath | **황천길(Face Death)** |
| 야영 · 파수 | Make camp, Take watch | **야영** / 파수는 서술로 |
| 험난한 여정 | Undertake a journey | **험난한 여정** |

---

## F. 캐릭터 관계 (2.1 모델)

| English | 한국어 | 비고 |
| --- | --- | --- |
| Relationship | **관계** | PC 사이의 믿음·사건·감정. 시트에서 개별 관리 |
| Depth | **깊이(Depth)** | 관계마다 쌓이는 수치 |
| Bond | **유대** | 두 PC가 함께 쓰는 미니 플레이북. 1판 **인연**과 구분해 첫 등장 **유대(Bond)** |
| Bondmate | **유대 상대** | 같은 유대를 함께 쓰는 다른 PC |
| Panache | **허세** | 음유시인·허풍선이. 매력만큼 회복되는 자원 |
| Struggle | _갈등_ (대안: 고난) | 2.0 알파의 Conflicts=갈등을 이어받음 |
| Benefit / Drawback | **이익(+) / 대가(-)** | 갈등이 주는 것 |
| Domain (deity) | **영역** | 사제. 공예·법·빛·자연·여행·생명·지식·전쟁 |
| Drive | **동기** | NPC 특성 |
| Resource | **자원** | NPC 특성 |
| Escalation | **격화** | NPC가 조건을 표시하고 판을 키우는 동작 |
| Debt | **빚** | 음유시인·외교관. NPC가 PC에게 진 것 |
| Luck | **운** | 도적·털이꾼. 지혜만큼 얻는 자원 |
| Mask | **가면** | 도적·첩자. 변장의 내구도 |
| Worshipper | **신도** | 사제의 신을 따르는 이들 |
| Arcane focus | **비전의 매개체** | 마법사가 주문을 시전할 때 드는 도구 |
| Phylactery | **혼령 그릇** | 리치의 영혼 그릇. *마법 아이템* 참조 |
| Roguish Skill | **도적 솜씨** | 도적의 숨은 솜씨. 소리 탐지·덫 찾기/해체·그림자에 숨기 등 |
| undead / undying | **언데드** | 사령술사 |

---

## G. 마법

| English | 한국어 | 비고 |
| --- | --- | --- |
| Magnitude (mag) | **위력(Mag)** | 2.0 알파 `magic.md` 표기 그대로 |
| verb / substance | **동사 / 재료** | 마법사 `비전 엮기`: 계열마다 동사와 재료가 정해져 있다 |
| Prepared School | **준비한 계열** | 야영하면 바꿀 수 있다. 전술가의 예비(Prep)와 구분 |
| Casting Stat | **시전 능력치** | |
| School (of magic) | **계열** | 마법사 |
| Abjuration | **방호** | 재료: 마법 자체 |
| Conjuration | **소환** | 재료: 물건이나 외부 존재 |
| Divination | **예지** | 재료: 과거·현재·미래의 환영 |
| Enchantment | **매혹** | 재료: 지성 있는 존재 |
| Evocation | **정령술** | 재료: 원소 에너지. 길 이름 정령술사와 같은 어근 |
| Illusion | **환영** | 재료: 시야나 소리 |
| Necromancy | **사령술** | 재료: 불사 |
| Transmutation | **변환** | 재료: 물질 |
| Cast a Spell | **주문 시전** | |
| Perform a Ritual | **의식을 행한다** | 모든 PC 가능 |
| Font of power | **힘의 원천** | |

---

## H. 마스터

| English | 한국어 | 비고 |
| --- | --- | --- |
| Agenda | **강령** | |
| Principle | **원칙** | |
| GM Move | **마스터 액션** | |
| Soft move / Hard move | **약한 액션** / **강한 액션** | |
| GM Class Moves | **직업별 마스터 액션** | |
| Play Order Flowchart | **진행 순서 흐름도** | |
| Threat | **위협** | |
| Development | **전개** | |
| Rewards | **보상** | |
| Major NPC | **주요 NPC** | |
| Conditions / Drives / Escalations / Resources / Resists | **조건 / 동기 / 격화 / 자원 / 저항** | NPC 특성 5종 |
| Strong Start | **강한 첫 장면** | |
| Prep (session) | **준비** | 세션 준비 |
| Spotlight | **조명** | “PC에게 조명을 비추다” |

**강령 세 줄**: 플레이어 캐릭터의 삶을 모험으로 채운다 / **무슨 일이 일어나는지 보려고 플레이한다** / 의미 있는 판타지 세계를 그려 낸다.

---

## I. 캠페인 모드

| English | 한국어 | 비고 |
| --- | --- | --- |
| Treasure | **재물** | 추상화된 화폐 단위. “1 재물”, “3 재물” |
| treasure (in-fiction) | **보물** | 이야기 속 물건으로서의 보물 |
| Wealth | **부**(Wealth) | 살 수 있는 것과 신경 쓸 지출의 정도 |
| Wealth Standing | **부 등급** | |
| Broke / Poor / Modest / Comfortable / Rich / Aristocratic | **무일푼 / 가난 / 보통 / 넉넉 / 부유 / 귀족** | |
| Treasure Track | **재물 트랙** | |
| Campaign Mode | **캠페인 모드** | |

---

## J. 직업

| English | 한국어 |
| --- | --- |
| Barbarian | **야만인** |
| Bard | **음유시인** |
| Cleric | **사제** |
| Fighter | **파이터** |
| Rogue | **도적** |
| Wizard | **마법사** |

2.1에 없는 직업: 드루이드, 성기사, 레인저 (2.0 알파 번역에만 존재).

### 길(Path)

| 직업 | English | 한국어 |
| --- | --- | --- |
| 야만인 | Berserker / Outlander / Hedonist | **광전사 / 외지인 / 쾌락주의자** |
| 음유시인 | Dabbler / Diplomat / Swashbuckler | **견습생 / 외교관 / 허풍선이** |
| 사제 | Caregiver / Oracle / Warpriest | **돌보는 이 / 예언자 / 전쟁사제** |
| 파이터 | Bulwark / Weaponmaster / Tactician | **방벽 / 무기 대가 / 전술가** |
| 도적 | Assassin / Burglar / Spy | **암살자 / 털이꾼 / 첩자** |
| 마법사 | Evoker / Illusionist / Necromancer | **정령술사 / 환영술사 / 사령술사** |

### 직업 시작 액션·길(Path) 액션

| English | 한국어 | 직업 |
| --- | --- | --- |
| Rage! | **격노(Rage)!** | 야만인 |
| Trance-Like Fury / Red Nails / Spine-Chilling Countenance / The Beast Within / When It Earns Me | **황홀한 격노 / 붉은 손톱 / 오싹한 얼굴 / 내면의 짐승 / 그럴 자격이 될 때** | 야만인·광전사 |
| Where I Come From… / Pack Reader / Sacrificial Rite / Tread the Jeweled Thrones / Unerring Intuition | **내가 온 곳은… / 무리 읽기 / 제물 의식 / 보석 왕좌를 밟다 / 틀리지 않는 직감** | 야만인·외지인 |
| Herculean Appetite / Basking in Victory / Forthright Speech / Insatiable / Strong as a Bull | **엄청난 욕망 / 승리에 젖기 / 거침없는 말 / 채워지지 않는 / 소처럼 강하게** | 야만인·쾌락주의자 |
| Perform Your Art | **예술 펼치기** | 음유시인 |
| Bardic Lore / A Kind of Magic / A Knave, a Rascal / Artisan's Apprentice / Virtuoso's Mind | **음유 지식 / 일종의 마법 / 건달, 악당 / 장인의 도제 / 거장의 머리** | 음유시인·견습생 |
| The Oldest Game / Cards on the Table / Countercharm / Friends in High Places / Parley! | **가장 오래된 게임 / 패를 드러내다 / 주문 되받기 / 높은 곳의 친구들 / 협상!** | 음유시인·외교관 |
| Style Is Everything / Fly Into the Face of Danger / *I* Am Not Left-Handed! / Very Intricate Backstory / Watch Me Shine | **멋이 전부다 / 위험에 뛰어들기 / *나는* 왼손잡이가 아니다! / 더 빈틈없는 배경 이야기 / 빛나는 나를 봐** | 음유시인·허풍선이 |
| The Greatest Miracle / Awake! The Shadow Is Gone / Face of an Angel / I'll Carry it For You / Mass Cure Wounds | **가장 큰 기적 / 깨어라! 그림자는 사라졌다 / 천사의 얼굴 / 내가 대신 짊어지겠다 / 대규모 상처 치유** | 사제·돌보는 이 |
| Visions From Above / A Moth to the Sacred Flame / Haruspication / Sacred Truth / True Colors | **위로부터의 계시 / 성스러운 불꽃에 이끌리는 나방 / 내장 점 / 성스러운 진실 / 본색** | 사제·예언자 |
| Punishment Divine / Divine Intuition / Drink From the Cup of Wrath / Not the End / Spiritual Weapon | **신의 응징 / 신성한 직감 / 분노의 잔을 들이켜다 / 끝이 아니다 / 영적 무기** | 사제·전쟁사제 |
| Signature Weapon | **전용 무기** | 파이터 |
| Stalwart Protector / Armiger / Second Wind / Silent Protector / Taunting Shout | **굳건한 수호자 / 갑주지기 / 재기 / 말없는 수호자 / 도발의 함성** | 파이터·방벽 |
| The Blade Reforged / Advanced Fighting Styles / Boot Knife / Secret Weapon / Snap the Blade | **다시 벼려진 칼날 / 상급 전투 양식 / 장화 속 칼 / 비장의 무기 / 칼날 부러뜨리기** | 파이터·무기 대가 |
| Plans Within Plans / Eye for Destruction / Honed Instincts / Old Comrades & Former Foes / Veteran of a Hundred Battles | **예비 전술 / 파괴의 눈 / 벼려진 본능 / 옛 전우와 옛 적 / 백전노장** | 파이터·전술가. **예비(Prep)** 자원을 쓴다 |
| Dirty Deeds / Always a Way Out / Backstab / Poisoncraft / Stalker in Shadows | **더러운 일 / 빠져나갈 길은 있다 / 뒤치기 / 독 조제 / 그림자 속의 추적자** | 도적·암살자 |
| Expert Treasure-hunter / Better Lucky Than Good / Breaking & Entering / Quick on the Draw / Vanishing Act | **노련한 보물 사냥꾼 / 실력보다 운 / 침입과 잠입 / 빠른 손놀림 / 사라지기** | 도적·털이꾼 |
| The One for the Job / Hand Trick / Maven Saboteur / Underworld Connections / You Know My Name | **적임자 / 손버릇 / 파괴공작의 대가 / 암시장 인맥 / 내 이름을 아는군** | 도적·첩자 |
| Weave the Arcane | **비전 엮기** | 마법사 |
| Evocation Magic / Contingency / Elemental Cloak / Instant Fireball! / Power Weapon | **정령술 마법 / 대비책 / 원소 망토 / 즉석 화염구! / 힘의 무기** | 마법사·정령술사 |
| Illusion Magic / Alter Perception / Fool Me Once… / Mirror Image / The Mirror Stares Back | **환영 마법 / 인식 바꾸기 / 한 번 속으면… / 분신 / 거울이 되돌아본다** | 마법사·환영술사 |
| Necromantic Magic / A Ghost at the Feast / Lifeforce Is a Resource / Sanctum to Unlife / Shed this Mortal Coil | **사령술 마법 / 잔치의 유령 / 생명력도 자원이다 / 불사의 성소 / 이 필멸의 껍질을 벗어던지다** | 마법사·사령술사 |
| Invoke the Divine | **신의 뜻 청하기** | 사제 |
| Fighting Styles / Plans Within Plans | **전투 양식 / 예비 전술** | 파이터 |
| Tricks of the Trade / Roguish Skills | **숨은 솜씨 / 도적 솜씨** | 도적 |
| Weave the Arcane | **비전 엮기** | 마법사 |

### 장갑

**경장갑**(Light) / **중간 장갑**(Medium) / **중장갑**(Heavy). 피해 감소는 각각 1·2·3이며, 요구 근력은 +1·+2·+3입니다.

### 갈등(Struggle) 이름 — 2.0 알파 번역 재사용

2.0 알파 `conflicts.md`의 번역을 그대로 잇습니다: 기억 상실(Amnesia), 겁쟁이(Coward), 어둠의 속삭임(Dark Whisperer), 환멸(Disillusioned), 사냥감(Hunted), 빚쟁이(Indebted), 불길한 꿈(Ominous Dreams), 천덕꾸러기(Pariah), 개심한 악당(Reformed), 배신당한 전우(Betrayed), 고독한 방랑자(Loner), 보물 집착(Treasure Obsession) 등.

### 유대(Bond) 이름

Champions **용사들**, Comrades in Arms **전우**, Enthusiasts **동호인**, Mentor & Ward **스승과 제자**, Rivals **라이벌**, Siblings **형제자매**, True Lovers **진실한 연인**.

---

## K. 예시 문장 (톤 기준)

1판:

> “근거리 전투에서 적을 공격하면 +근 판정을 합니다. 10+이면 적에게 피해를 주고 자기는 공격을 피합니다.”

2.1 번역:

> “전투에서 적과 맞붙을 때, 근거리면 **+근 판정**, 원거리면 **+민 판정**을 합니다. **10+** 이면 아래 하나를 고릅니다.”

> “액션이 끝나면 앞으로의 **이야기 속 현실(the fiction)** 에 무엇이 바뀌었는지 반영합니다.”

---

## L. 마스터부·캠페인·모험에서 새로 정한 말

### 위협(Threat)

| English | 한국어 | 비고 |
| --- | --- | --- |
| Goal | **목표** | 위협이 세상을 더 나쁘게 바꾸는 방식 |
| Assets | **자산** | 위협이 이미 지닌 이점. 훼손하면 전개·반응이 흔들린다 |
| Developments | **전개** | 목표로 가는 단계. 순서대로 일어난다 |
| Reactions | **반응** | PC를 방해할 때 취하는 마스터 액션 |
| Scenes / Secrets | **장면 / 비밀** | 위협에 딸린 요소(선택) |
| Local / Regional / World Threat | **국지적 / 지역 / 세계적 위협** | 전개 2~3 / 4~6 / 7~10개 |

### 캠페인·유대·갈등

| English | 한국어 | 비고 |
| --- | --- | --- |
| Bond Advanced Move | **유대 상급 액션** | 유대를 맺거나 더 단단히 하며 해금 |
| Upper Hand | **우세** | 라이벌 유대의 승부 표시. 둘 중 하나만 지닌다 |
| Miniaturized Adventure | **작은 모험** | 한 장짜리로 압축한 모험 형식 |
| Starting Move | **시작 액션** | 직업·유대의 첫 액션 |
| Drives / Escalations | **동기 / 격화** | NPC 특성. 조건을 표시하면 격화한다 |

### 갈등(Struggle) 트랙 이름

| English | 한국어 | 쓰는 갈등 |
| --- | --- | --- |
| Memories | **기억** | 기억 상실 |
| Whispers | **속삭임** | 어둠의 속삭임 |
| Doom | **파멸** | 파멸할 운명 |
| Guilt | **죄책감** | 개심한 악당 |
| Fame | **명성** | 명망 |
| Leads | **단서** | 보물 집착 |
| Heat | **추격** | 사냥감 |
| Wyrd | **예지** | 불길한 꿈 |

### 갈등 이름 (2.1 신규)

보호자(Caretaker), 파멸할 운명(Doomed), 마음의 상처(Emotionally Scarred), 민중의 영웅(Folk Hero), 금지된 사랑(Forbidden Romance), 순수한 이(Innocent), 잃어버린 혈통(Lost Heritage), 명망(Renowned), 비밀 정체(Secret Identity), 복수심(Vengeful). 기존 12종(기억 상실, 겁쟁이, 어둠의 속삭임, 배신당한 전우, 환멸, 사냥감, 빚쟁이, 불길한 꿈, 천덕꾸러기, 개심한 악당, 고독한 방랑자, 보물 집착)은 그대로 잇는다.

### 마법 아이템 태그

`#cursed` **저주받음**, `#consumable` **소모품**, `#hidden` **숨김**, `#warded` **보호됨**, `#incorporeal` **비물질**, `#poisoned` **중독**, `#fire` **불**, `#afraid` → 조건 **겁먹음**.

### 작은 모험 「빼앗긴 아이들」 고유명

글렌카르(Glen-kar), 슬루스 숲(Sleuth Wood), 뒤덮인 궁전(The Shrouded Palace), 잎사귀 섬(Leafy Island), 속삭이는 나무 숲(Grove of Murmuring Trees), 노래의 전당(Hall of Song), 서 있는 돌(Standing Stones), 그림자실 잣는 이(Spinster of Shadows’ Threads), 침묵의 불협화음(Cacophony of Silence), 야생의 심장(Wildheart Willingly Tamed), 울타리 수호대(Hedge Guard), 깨어난 나무(Awakened Trees), 폐허 거두기 의식(The Ruinreap Ritual), 키엘라 데르 리아딘(Kiela der Liadin), 리리 그랜드브랜드(Riri Grandbrand), 본린 허도바(Bonlyn Herdovar), 모스본즈(Mossbones), 카리온(Carrion), 미레이(Myrrei), 렉심(Wrexim).

추가로 정한 것: 대의(Cause), 혼령 그릇(Phylactery), 높은 곳의 친구 등 유대 액션 이름은 `src/data/dw2/ko/bonds.md` 참고.

_이 용어집은 [`TRANSLATION-GUIDE.md`](./TRANSLATION-GUIDE.md)와 함께 갱신합니다._
