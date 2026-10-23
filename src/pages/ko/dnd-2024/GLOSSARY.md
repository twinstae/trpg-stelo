---
title: "D&D 2024 SRD 용어집"
description: "SRD 5.2.1 영/한 대역에 쓰는 한국어 표기."
layout: ../../../layouts/MainLayout.astro
createdAt: "2026-10-24T12:00:00.000Z"
publish: true
---

이 문서는 **D&D 2024 SRD 5.2.1** 영/한 대역에 쓰는 용어입니다. 표기 규칙과 작업 계획은 [`TRANSLATION-GUIDE.md`](./TRANSLATION-GUIDE.md), 진행 상황은 [목차](/ko/dnd-2024)를 보십시오.

* **기준**: 한국 플레이어가 이미 쓰는 **D&D 5판 베이직 룰 한국어판**(D&D Basic Rules v1.0, 2018년 11월판의 공식 한국어판, 2019) 표기를 따릅니다. 2024년 규칙에서 새로 생긴 용어는 그 어투에 맞춰 새로 짓습니다.
* **근거** 칸
  * `베이직` = 베이직 룰 한국어판에서 확인한 표기(영어 병기 또는 같은 자리의 쓰임으로 대조, 2026-10-24).
  * `신규` = 2024년 규칙에서 새로 생겨 이 대역이 지은 말. _기울임_ 은 아직 잠정.
  * `추정` = 베이직 룰에 나오지 않아 5판 어투로 고른 말. 더 큰 공식 자료(플레이어즈 핸드북 한국어판 등)로 대조하면 고칩니다.
* 베이직 룰 PDF에 영어 병기가 있는 주문·괴물·마법 물건 이름은 각 단계(주문, 마법 물건, 괴물)를 시작할 때 이름 표로 옮겨 옵니다.
* 영어 병기는 **파일마다 첫 등장 한 번**만 합니다: `숙련 보너스(Proficiency Bonus)`.
* 새 용어를 만들거나 바꾸면 **여기에 한 줄 추가**하고, 같은 커밋에서 이미 번역한 원고를 grep해 통일합니다.

## 1. 사람과 게임

| 영어 | 한국어 | 근거 | 비고 |
| --- | --- | --- | --- |
| Dungeons & Dragons, D&D | **던전즈 & 드래곤즈**, D&D | 베이직 | 본문에서는 대개 D&D 그대로 |
| Game Master (GM) | **게임 마스터(GM)** | 추정 | 베이직은 “던전 마스터(DM)”. 2024 원문이 GM으로 바꿨으므로 GM을 따름 |
| player / player character | **플레이어** / **플레이어 캐릭터** | 베이직 | |
| nonplayer character (NPC) | **논플레이어 캐릭터(NPC)** | 베이직 | |
| adventurer | **모험자** | 베이직 | “모험가” 아님 |
| creature | **크리쳐** | 베이직 | “생물” 아님. 베이직 본문 688회 |
| monster | **괴물** | 베이직 | |
| campaign / adventure | **캠페인** / **모험** | 베이직 | |
| game session | **게임 세션** | 추정 | |
| scene | **장면** | 베이직 | |
| social interaction / exploration / combat | **사회적 교류** / **탐험** / **전투** | 베이직 | 플레이의 세 기둥 |
| roleplaying | **역할연기** | 베이직 | “롤플레잉” 아님 |
| active / descriptive approach | **연기적 접근방식** / **서술적 접근방식** | 베이직 | |
| attitude: Friendly / Indifferent / Hostile | **우호적** / **중립적** / **적대적** | 베이직 | “무관심” 아님 |
| the multiverse / planes of existence | **멀티버스** / _존재 차원_ | 베이직 / 추정 | |
| stat block | **자료 상자** | 베이직 | “능력치 상자” 아님 |
| Challenge Rating (CR) | **도전 지수(CR)** | 베이직 | |

## 2. 능력치와 판정

| 영어 | 한국어 | 근거 | 비고 |
| --- | --- | --- | --- |
| ability / the six abilities | **능력치** / **여섯 능력치** | 베이직 | |
| Strength / Dexterity / Constitution | **근력** / **민첩** / **건강** | 베이직 | |
| Intelligence / Wisdom / Charisma | **지능** / **지혜** / **매력** | 베이직 | |
| ability score | **능력치 점수** | 베이직 | “능력 점수”는 장 제목에만 몇 번 나옴. 본문은 “능력치 점수” |
| ability modifier | **능력 수정치** | 베이직 | 짧게 **수정치** |
| D20 Test | **d20 판정** | 신규 | 능력 판정·내성 굴림·명중 굴림을 아우르는 말. 소문자 d |
| ability check | **능력 판정** | 베이직 | 기술과 함께: **근력(운동) 판정** |
| saving throw | **내성 굴림** | 베이직 | |
| attack roll | **명중 굴림** | 베이직 | |
| Difficulty Class (DC) | **난이도(DC)** | 베이직 | 수치 앞에서는 “DC 15” |
| Armor Class (AC) | **방어도(AC)** | 베이직 | |
| Advantage / Disadvantage | **이점** / **불리점** | 베이직 | “이점을 받습니다” |
| proficiency / Proficiency Bonus | **숙련** / **숙련 보너스** | 베이직 | |
| skill | **기술** | 베이직 | |
| Expertise | **숙달** | 베이직 | “전문화” 아님 |
| Inspiration | **고양감** | 베이직 | |
| Heroic Inspiration | _영웅적 고양감_ | 신규 | 베이직의 “고양감”을 이어받음 |
| Passive Perception | **상시 감지** | 베이직 | |
| Initiative | **우선권** | 베이직 | |
| Specific beats general / exception | **특별 규칙이 일반 규칙보다 우선합니다** / **예외** | 베이직 | 2024 곁글 “Exceptions Supersede General Rules”도 이 어투로 |
| round down | **나머지 버림** / **소수점 아래는 버립니다** | 베이직 | 곁글 제목은 “나머지 버림” |

### 2.1 기술

모두 베이직에서 확인했습니다.

| 영어 | 한국어 | 영어 | 한국어 |
| --- | --- | --- | --- |
| Acrobatics | **곡예** | Medicine | **의학** |
| Animal Handling | **동물 조련** | Nature | **자연** |
| Arcana | **비전학** | Perception | **감지** |
| Athletics | **운동** | Performance | **공연** |
| Deception | **기만** | Persuasion | **설득** |
| History | **역사** | Religion | **종교** |
| Insight | **통찰** | Sleight of Hand | **손속임** |
| Intimidation | **위협** | Stealth | **은신** |
| Investigation | **수사** | Survival | **생존** |

## 3. 행동과 전투

| 영어 | 한국어 | 근거 | 비고 |
| --- | --- | --- | --- |
| action | **행동** | 베이직 | |
| Bonus Action | **추가 행동** | 베이직 | |
| Reaction | **반응행동** | 베이직 | 붙여 씀 |
| turn / round | **턴** / **라운드** | 베이직 | “차례” 아님. “자기 턴에” |
| Attack [Action] | **공격** | 베이직 | |
| Dash | **질주** | 베이직 | |
| Disengage | **퇴각** | 베이직 | “이탈” 아님 |
| Dodge | **회피** | 베이직 | |
| Help | **원호** | 베이직 | “돕기” 아님 |
| Hide | **은신** | 베이직 | 기술 이름과 같음 |
| Ready | **대기** | 베이직 | |
| Search | **수색** | 베이직 | |
| Influence | _영향력 행사_ | 신규 | |
| Magic [Action] | _마법_ | 신규 | 베이직의 “주문 시전(Cast a Spell)” 행동을 넓힌 것 |
| Study | _연구_ | 신규 | |
| Utilize | _사용_ | 신규 | 베이직의 “물건 사용(Use an Object)”을 넓힌 것 |
| Opportunity Attack | **기회공격** | 베이직 | |
| Surprise | **기습** | 베이직 | |
| Hit Points (HP) | **히트 포인트(HP)** | 베이직 | |
| Temporary Hit Points | **임시 히트 포인트** | 베이직 | |
| Hit Point Dice (Hit Dice) | **히트 다이스(HD)** | 베이직 | |
| Bloodied | _빈사_ | 신규 | 잠정 |
| Critical Hit | **치명타** | 베이직 | |
| Death Saving Throw | **죽음 내성 굴림** | 베이직 | |
| stabilize | **안정화** | 베이직 | |
| Resistance / Vulnerability / Immunity | **저항** / **취약성** / **면역** | 베이직 | |
| damage type | **피해 종류** | 베이직 | |
| Cover (Half / Three-Quarters / Total) | **엄폐** (**절반 / 3/4 / 완전 엄폐**) | 베이직 | |
| Difficult Terrain | **어려운 지형** | 베이직 | “험지” 아님 |
| Speed | **이동속도** | 베이직 | 붙여 씀 |
| Travel Pace | **여행 속도** | 베이직 | |
| Lightly / Heavily Obscured | **가볍게 가려진** / **심하게 가려진** | 베이직 | |
| Bright Light / Dim Light / Darkness | **밝은 빛** / **약한 빛** / **어둠** | 베이직 | |
| Short Rest / Long Rest | **짧은 휴식** / **긴 휴식** | 베이직 | |
| reach / range | **간격** / **사거리** | 베이직 | |
| melee / ranged | **근접** / **장거리** | 베이직 | “원거리” 아님 |
| Unarmed Strike | **비무장 공격** | 베이직 | “맨손 타격” 아님 |
| natural 20 / natural 1 | _“자연 20”_ / _“자연 1”_ | 추정 | 베이직은 “d20에서 20이 나오면”처럼 풀어 씀. 원문이 따옴표로 이름 붙인 곳에서만 씀 |
| first aid | _응급 처치_ | 추정 | |

### 3.1 상태 (Conditions)

모두 베이직에서 확인했습니다(“장님 상태(Blinded)”처럼 병기). 문장에서는 **○○ 상태**로 씁니다: “has the Grappled condition” → **붙잡힘 상태가 됩니다**.

| 영어 | 한국어 | 영어 | 한국어 |
| --- | --- | --- | --- |
| Blinded | **장님** | Invisible | **투명** |
| Charmed | **매혹** | Paralyzed | **마비** |
| Deafened | **귀머거리** | Petrified | **석화** |
| Exhaustion | **탈진** | Poisoned | **중독** |
| Frightened | **공포** | Prone | **넘어짐** |
| Grappled | **붙잡힘** | Restrained | **포박** |
| Incapacitated | **행동불능** | Stunned | **충격** |
| | | Unconscious | **무의식** |

용어집의 꼬리표 `[Condition]`, `[Action]`, `[Area of Effect]`, `[Hazard]`, `[Attitude]`는 `[상태]`, `[행동]`, `[효과 범위]`, `[위험]`, `[태도]`(효과 범위는 베이직, 나머지는 추정).

### 3.2 피해 종류

모두 베이직에서 확인했습니다. “10 (3d6) Fire damage” → **10(3d6)점의 화염 피해** (베이직 어투).

| 영어 | 한국어 | 영어 | 한국어 |
| --- | --- | --- | --- |
| Acid | **산성** | Necrotic | **사령** |
| Bludgeoning | **타격** | Piercing | **관통** |
| Cold | **냉기** | Poison | **독** |
| Fire | **화염** | Psychic | **정신** |
| Force | **역장** | Radiant | **광휘** |
| Lightning | **번개** | Slashing | **참격** |
| | | Thunder | **천둥** |

## 4. 캐릭터

| 영어 | 한국어 | 근거 | 비고 |
| --- | --- | --- | --- |
| character sheet | **캐릭터 시트** | 베이직 | |
| class / class feature | **클래스** / **클래스 요소** | 베이직 | |
| Cunning Action | **교활한 행동** | 베이직 | 베이직의 클래스 요소 이름은 그대로 이어받음 |
| subclass | _하위클래스_ | 신규 | 베이직은 클래스마다 “무예 아키타입”, “신성 권역” 등. 2024는 subclass로 통일 |
| level | **레벨** | 베이직 | “3레벨” |
| Experience Points (XP) | **경험치(XP)** | 베이직 | |
| background / background feature | **배경** / **배경 요소** | 베이직 | |
| species | **종족** | 베이직 | 원문은 race → species로 바뀌었지만 한국어는 “종족” 그대로 |
| species trait | **종족 특성** | 베이직 | |
| origin | _기원_ | 신규 | 배경 + 종족 |
| feat / Origin feat | **재주** / _기원 재주_ | 베이직 / 신규 | |
| Epic Boon | _서사적 은혜_ | 신규 | |
| multiclassing | **멀티클래스** | 베이직 | |
| trinket | **잡동사니** | 베이직 | |
| alignment | **성향** | 베이직 | 질서 선, 혼돈 악, 성향 없음(Unaligned) … |
| personality traits / ideals / bonds / flaws | **인격 특성** / **이상** / **유대** / **단점** | 베이직 | |

### 4.1 클래스

베이직처럼 **음역**합니다. (톨러스 대역은 “전사·마법사”처럼 풀어 썼지만, 이 대역은 규칙 문서이므로 공식 표기를 따릅니다.) 베이직에 실린 클래스는 클레릭·파이터·로그·위저드뿐이고 나머지는 같은 방식으로 음역했습니다.

| 영어 | 한국어 | 영어 | 한국어 |
| --- | --- | --- | --- |
| Barbarian | **바바리안** | Paladin | **팔라딘** |
| Bard | **바드** | Ranger | **레인저** |
| Cleric | **클레릭** | Rogue | **로그** |
| Druid | **드루이드** | Sorcerer | **소서러** |
| Fighter | **파이터** | Warlock | **워락** |
| Monk | **몽크** | Wizard | **위저드** |

## 5. 마법

| 영어 | 한국어 | 근거 | 비고 |
| --- | --- | --- | --- |
| spell / cast a spell | **주문** / **주문을 시전합니다** | 베이직 | |
| spellcasting / spellcasting ability | **주문시전** / **주문시전 능력치** | 베이직 | |
| spell save DC | **주문 내성 DC** | 베이직 | |
| spellcaster | **주문시전자** / 시전자 | 베이직 | |
| holy symbol | **성표** | 베이직 | |
| Cantrip | **소마법** | 베이직 | |
| spell slot | **주문 슬롯** | 베이직 | |
| Level 1 spell | **1레벨 주문** | 베이직 | |
| prepared spell | **준비된 주문** | 베이직 | |
| Ritual / Concentration | **의식** / **집중** | 베이직 | |
| Verbal / Somatic / Material (V, S, M) | **음성 / 동작 / 물질 (V, S, M)** | 베이직 | |
| area of effect | **효과 범위** | 베이직 | |
| Cone / Cube / Cylinder / Line / Sphere | **원뿔형 / 입방체형 / 원통형 / 직선형 / 구체형** | 베이직 | |
| Emanation | _발산형_ | 신규 | 다른 효과 범위와 같은 “-형” |
| magic item | **마법 물건** | 베이직 | “마법 물품” 아님 |
| attunement | **조율** | 베이직 | |

### 5.1 마법 학파

모두 베이직에서 확인했습니다. 학파 이름은 **-계**, “School of Evocation”처럼 학파 자체를 가리키면 **방출학파**.

| 영어 | 한국어 | 영어 | 한국어 |
| --- | --- | --- | --- |
| Abjuration | **방호계** | Evocation | **방출계** |
| Conjuration | **조형계** | Illusion | **환영계** |
| Divination | **예지계** | Necromancy | **사령계** |
| Enchantment | **환혹계** | Transmutation | **변환계** |

## 6. 단위와 숫자

베이직은 영미 단위를 약자 그대로 숫자에 붙여 씁니다.

| 영어 | 한국어 | 근거 | 비고 |
| --- | --- | --- | --- |
| 30 feet, 30 ft. | **30ft** | 베이직 | “피트”로 풀지 않음 |
| 5-foot-radius | **반경 5ft** | 베이직 | |
| 10 lb. | **10lbs** | 베이직 | |
| 1 mile | **1마일** | 베이직 | |
| GP / SP / CP / EP / PP | **gp / sp / cp / ep / pp** | 베이직 | 소문자, “12gp”처럼 붙여 씀 |
| 2d6 + 3 | **2d6 + 3** | | 주사위 식은 원문 그대로 |
| −5, +3 | **−5, +3** | | 원문의 수학 기호(−)를 그대로 둠 |
| Recharge 5–6 / 1/Day | **재충전 5–6** / _하루 1회_ | 베이직 / 추정 | |

## 7. 무기 속성

베이직에서 확인한 것: Finesse **교묘함**, Light **경량**, Heavy **중량형**, Two-Handed **양손**, Thrown **투척**, Reach **간격**, Loading **장전**, Versatile **다용도**. 나머지(Ammunition 등)와 2024 무기 숙달(Mastery) 속성은 4단계(장비)에서 정합니다.

## 8. 괴물 자료 상자

| 영어 | 한국어 | 근거 | 비고 |
| --- | --- | --- | --- |
| AC / HP | **방어도** / **히트 포인트** | 베이직 | 베이직 자료 상자는 한국어로 풀어 씀 |
| CR / XP / PB | **도전 지수** / XP / PB | 베이직 / 그대로 | |
| Initiative | **우선권** | 베이직 | |
| Speed / Burrow / Climb / Fly / Swim | **이동속도 / 굴착 / 등반 / 비행 / 수영** | 추정 | |
| MOD / SAVE | _수정치 / 내성_ | 신규 | 2024 능력치 표 머리 |
| Skills / Senses / Languages | **기술 / 감각 / 언어** | 추정 | |
| Darkvision / Blindsight / Tremorsense / Truesight | **암시야 / 맹안시야 / 진동감지 / 진시야** | 베이직 | |
| Traits / Actions / Bonus Actions / Reactions / Legendary Actions | **특징 / 행동 / 추가 행동 / 반응행동 / 전설적 행동** | 추정 / 베이직 | “특징”만 추정 |
| Melee / Ranged Attack Roll | **근접 / 장거리 명중 굴림** | 신규 | 베이직은 “근접 무기 공격:”. 2024 원문이 Attack Roll로 바뀜 |
| Hit: | **명중시:** | 베이직 | |
| Failure: / Success: | _실패시:_ / _성공시:_ | 신규 | “명중시:”에 맞춤 |
| Tiny / Small / Medium / Large / Huge / Gargantuan | **초소형 / 소형 / 중형 / 대형 / 거대형 / 초대형** | 베이직 | |

### 7.1 크리쳐 종류

모두 베이직에서 확인했습니다. 2024 원문은 단수형(Aberration)이지만 같은 말을 씁니다.

| 영어 | 한국어 | 영어 | 한국어 |
| --- | --- | --- | --- |
| Aberration | **기괴체** | Giant | **거인** |
| Beast | **야수** | Humanoid | **인간형** |
| Celestial | **천상체** | Monstrosity | **괴물류** |
| Construct | **구조물** | Ooze | **점액류** |
| Dragon | **용족** | Plant | **식물류** |
| Elemental | **원소** | Undead | **언데드** |
| Fey | **요정** | Fiend | **악마** |

## 9. 1–3단계 번역에서 정한 말

여러 번역자가 따로 고른 말을 베이직과 대조해 하나로 정했습니다(2026-10-24). 이미 번역한 원고는 이 표기로 통일했습니다.

| 영어 | 한국어 | 근거 | 비고 |
| --- | --- | --- | --- |
| target | **목표** | 베이직 | “대상” 아님 |
| telepathy | **정신감응** | 베이직 | |
| jumping / long jump / high jump | **도약** / **멀리뛰기** / **높이뛰기** | 베이직 | |
| crawling | **포복** | 베이직 | |
| falling | **추락** | 베이직 | |
| Hit Point maximum | **최대 히트 포인트** | 베이직 | |
| object | **물체** | 베이직 | 규칙 용어. 일상적인 “물건 사용” 등은 **물건** |
| Breaking Objects | _물체 부수기_ | 신규 | |
| Damage Threshold | _피해 임계치_ | 신규 | |
| Burning / Dehydration / Malnutrition / Suffocation | _연소_ / _탈수_ / _영양실조_ / **질식** | 신규 / 베이직 | |
| Instant Death / Knocking Out a Creature | **즉사** / **크리쳐 기절시키기** | 베이직 | |
| armor / Light, Medium, Heavy Armor | **갑옷** / **경장·평장·중장 갑옷** | 베이직 | “방어구” 아님 |
| Armor Training | **갑옷 훈련** | 베이직 | |
| Simple / Martial weapons | **단순 무기** / **군용 무기** | 베이직 | |
| Improvised weapons | **임기응변 무기** | 베이직 | |
| Spellcasting Focus | **주문시전 매개체** | 베이직 | |
| Thieves' Tools | **도둑 도구** | 베이직 | |
| Sneak Attack / Extra Attack | **암습 공격** / **추가 공격** | 베이직 | |
| tier (of play) | _단계_ | 추정 | “1단계(1–4레벨)” |
| See also | _함께 보기_ | 신규 | 용어집 항목 끝의 `_See also_` |

### 9.1 언어

베이직 표기: **공용어**, **용언**(Draconic), **드워프어**, **엘프어**, **거인어**, **노움어**, **고블린어**, **하플링어**, **오크어**, **심연어**(Abyssal), **천상어**(Celestial), **지저어**(Deep Speech), **하계어**(Infernal), **원시어**(Primordial), **삼림어**(Sylvan), **지하공용어**(Undercommon), **도둑의 속어**(Thieves' Cant). 신규: _공용 수화_(Common Sign Language), _드루이드어_(Druidic).

### 9.2 배경·종족·재주

* 배경(베이직): **복사**(Acolyte), **범죄자**(Criminal), **학자**(Sage), **군인**(Soldier).
* 종족 특성(베이직): **드워프의 탄성**(Dwarven Resilience), **드워프의 끈기**(Dwarven Toughness), **돌의 꾀**(Stonecunning), **요정 선조**(Fey Ancestry), **예리한 감각**(Keen Senses), **망아상태**(Trance), **용감함**(Brave), **하플링의 기민함**(Halfling Nimbleness), **자연스러운 은신**(Naturally Stealthy).
* 기원 재주(신규): _경계_(Alert), _마법 입문_(Magic Initiate), _야만적 공격자_(Savage Attacker), _숙련가_(Skilled; 인간의 “다재다능(Versatile)”과 겹치지 않게).

### 9.3 이미 쓴 주문·물건 이름

베이직 표기: **화염구**(Fireball), **번개**(Lightning Bolt), **사자 소생**(Raise Dead), **재활성화**(Revivify), **상처 치료**(Cure Wounds), **타오르는 손길**(Burning Hands), **춤추는 빛**(Dancing Lights), **요술**(Prestidigitation), **마법 탐지**(Detect Magic), **인간형 포박**(Hold Person), **단순마술**(Thaumaturgy), **하급 환영**(Minor Illusion), **안개 걸음**(Misty Step), **독 분사**(Poison Spray), **화염 화살**(Fire Bolt), **저주 해제**(Remove Curse), **상급 회복**(Greater Restoration), **치유의 물약**(Potion of Healing). 주문 단계(6단계)에서 나머지를 표로 만듭니다.

## 10. 장비와 클래스 (4–5단계 시작 전)

베이직 룰 한국어판 본문 텍스트는 저장소 밖 `.freebuff/dnd-basic-ko.txt`(git에 넣지 않음)에 있습니다. 이름이 의심스러우면 `grep "영어 이름" .freebuff/dnd-basic-ko.txt`로 공식 표기를 먼저 찾으십시오. 베이직은 대개 `한국어 English` 순서로 병기합니다.

### 10.1 무기·갑옷

* 무기는 **음역**합니다(베이직): 클럽, 대거, 그레이트클럽, 핸드액스, 자벨린, 라이트 해머, 메이스, 쿼터스태프, 시클, 스피어, 다트, 라이트 크로스보우, 숏보우, 슬링, 배틀액스, 플레일, 글레이브, 그레이트액스, 그레이트소드, 할버드, 랜스, 롱소드, 마울, 모닝스타, 파이크, 레이피어, 시미터, 숏소드, 트라이던트, 워 픽, 워해머, 윕, 블로우건, 핸드 크로스보우, 헤비 크로스보우, 롱보우, 넷.
* 갑옷도 음역합니다(베이직): 패디드, 레더, 스터디드 레더, 하이드, 체인 셔츠, 스케일 메일, 브레스트플레이트, 하프 플레이트, 링 메일, 체인 메일, 스플린트, 플레이트, 방패. 글에서는 “레더 아머”, “체인 메일”처럼 씁니다.
* 무기 속성(베이직): Ammunition **탄환**, Finesse **교묘함**, Heavy **중량형**, Light **경량**, Loading **장전**, Range **사거리**, Reach **간격**, Thrown **투척**, Two-Handed **양손**, Versatile **다용도**.
* Weapon Mastery는 _무기 통달_(신규; 베이직의 Spell Mastery **주문 통달**에 맞춤. Expertise **숙달**과 겹치지 않게). 통달 속성(신규): Cleave _가르기_, Graze _스치기_, Nick _연속 타격_, Push _밀쳐내기_, Sap _기력 빼앗기_, Slow _둔화_, Topple _넘어뜨리기_, Vex _괴롭히기_.
* 꾸러미·도구(베이직): Burglar's Pack **도둑의 꾸러미**, Dungeoneer's Pack **던전 탐색자의 꾸러미**, Explorer's Pack **탐험가의 꾸러미**, Scholar's Pack **학자의 꾸러미**, Component Pouch **구성요소 주머니**, Arcane Focus **비전 매개체**, Holy Symbol **성표**, Spellbook **주문책**, Crowbar **쇠지렛대**. 나머지는 베이직을 grep해 보고, 없으면 쉬운 우리말로.

### 10.2 클래스 공통

| 영어 | 한국어 | 근거 |
| --- | --- | --- |
| Core [Class] Traits | **[클래스] 핵심 특성** | 신규 |
| Primary Ability | _주 능력치_ | 신규 |
| Hit Point Die | **히트 다이스** | 베이직 |
| Becoming a [Class] … / As a Level 1 Character / As a Multiclass Character | _[클래스]가 되려면 … / 1레벨 캐릭터라면 / 멀티클래스 캐릭터라면_ | 신규 |
| [Class] Class Features | **[클래스] 클래스 요소** | 베이직 |
| Level 1: Rage (요소 헤딩) | **1레벨: 격노** | 형식 |
| [Class] Subclass: X | **[클래스] 하위클래스: X** | 신규 |
| Ability Score Improvement | **능력치 점수 상승** | 베이직 |
| Epic Boon | _서사적 은혜_ | 신규 |
| Extra Attack | **추가 공격** | 베이직 |
| Fighting Style / Additional Fighting Style | **전투 유파** / **추가 전투 유파** | 베이직 |
| Spellcasting / Spell List | **주문시전** / **주문 목록** | 베이직 |
| Evasion | **회피기동** | 베이직 |
| Unarmored Defense | _비무장 방어_ | 신규(바바리안·몽크 공통) |
| Expertise | **숙달** | 베이직 |

### 10.3 베이직에 있는 클래스 요소

* 파이터: Second Wind **재기의 바람**, Action Surge **행동 연쇄**, Indomitable **불요불굴**, Champion **챔피언**, Improved Critical **향상된 치명타**, Remarkable Athlete **뛰어난 운동능력**, Superior Critical **우월한 치명타**, Survivor **생존의 대가**, Fighting Styles: Archery **궁술**, Defense **방어술**, Dueling **결투술**, Great Weapon Fighting **대형 무기 전투술**, Protection **보호술**, Two-Weapon Fighting **쌍수 전투술**.
* 로그: Sneak Attack **암습 공격**, Thieves' Cant **도둑의 속어**, Cunning Action **교활한 행동**, Uncanny Dodge **놀라운 회피**, Reliable Talent **믿음직한 재능**, Elusive **회피본능**, Slippery Mind **유연한 마음가짐**, Stroke of Luck **행운의 한 방**, Thief **시프**, Fast Hands **빠른 손놀림**, Second Story Work **오르내리기**, Supreme Sneak **뛰어난 은신술**, Use Magic Device **마법 도구 사용**, Thief's Reflexes **도둑의 반사신경**.
* 클레릭: Channel Divinity **신성 변환**, Turn Undead **언데드 퇴치**, Destroy Undead **언데드 파괴**, Divine Intervention **신의 간섭**, Divine Strike **신성한 일격**, Divine Domain **신성 권역**, Domain Spells **권역 주문**, Life Domain **생명 권역**, Disciple of Life **생명의 사도**, Preserve Life **생명 보존**, Blessed Healer **축복받은 치유사**, Supreme Healing **최상의 치유력**.
* 위저드: Arcane Recovery **비전 회복**, Arcane Tradition **비전 전통**, Spell Mastery **주문 통달**, Signature Spells **대표 주문**, School of Evocation **방출학파**, Evocation Savant **방출계 전공**, Sculpt Spells **주문 조정**, Potent Cantrip **강화된 소마법**, Empowered Evocation **강화된 방출**, Overchannel **과전환**.
* 바바리안(5판 관례): Rage _격노_, Reckless Attack _무모한 공격_, Danger Sense _위험 감지_, Path of the Berserker _광전사의 길_, Frenzy _광란_.

### 10.4 탈것과 고용인 (2사이클에서 정함)

* **탈것**(mount)과 **승용물**(vehicle)을 구분합니다. 근거는 베이직의 절 제목 “탈것과 승용물”과 그 본문(“좋은 탈것이 있으면 …”, “승용물 (지상 혹은 수상용)”). 2사이클 초고에서 둘을 거꾸로 썼으므로 원고를 바로잡았습니다.
  * mount **탈것**(탈것에 타다, 탈것 조종하기), 타고 다니는 동물은 **탈것 동물**.
  * vehicle **승용물**(대형 승용물, 마구·마갑·끄는 승용물, 수상 승용물).
* 마갑은 **마갑**(Barding, 베이직), 안장은 **안장**(군용 / 특수 / 승마용).
* 고용인: Skilled hireling **숙련된 고용인**, Unskilled hireling **비숙련 고용인**(베이직).
* Lifestyle Expenses **생활수준 지출**, Wretched/Squalid/Poor/Modest/Comfortable/Wealthy/Noble **극빈층 / 누추함 / 가난함 / 평범함 / 편안함 / 부유함 / 귀족적**(베이직).
* Calligrapher's Supplies **서예가의 도구**(베이직에 없어 “서예 도구”로 쓰던 배경 원고도 함께 통일). Artisan's Tools **장인의 도구**, Tool Proficiency **도구 숙련**, Utilize **사용 행동**.
* 복사·학자 배경의 “서예가의 도구”처럼 도구 이름은 **○○의 도구** 꼴을 지킵니다.

## 11. 주문시전 클래스 (3사이클에서 정함)

베이직 룰에 실린 클래스는 클레릭·파이터·로그·위저드뿐이라, 나머지 8개 클래스의 요소 이름은 여기서 새로 정했습니다. 같은 꼴을 지키도록 몇 가지 규칙을 둡니다.

* 클래스 요소는 **짧은 명사구**로 짓고, `1레벨: ○○` 꼴의 헤딩과 본문에서 같은 말을 씁니다.
* `Channel Divinity` **신성 변환**, `Divine Intervention` **신의 간섭**, `Unarmored Defense` **비무장 방어**, `Ability Score Improvement` **능력치 점수 상승**, `Epic Boon` **서사적 은혜**는 클래스가 달라도 같은 말을 씁니다.
* `Spellcasting` **주문시전**, `Spell Slots` **주문 슬롯**, `Slot Level` **슬롯 레벨**, `Cantrips` **소마법**, `Prepared Spells` **준비된 주문**.
* 클래스마다 “X Features” 표는 **X 요소**, “Core X Traits”는 **X 핵심 특성**.
* 요소 선택지가 둘인 곳(`Divine Order`, `Primal Order`, `Blessed Strikes`, `Elemental Fury`, `Hunter's Prey`, `Defensive Tactics`)은 원문처럼 `_선택지._ 설명` 꼴의 기울임 머리로 나눕니다.

### 11.1 바드

Bardic Inspiration **바드의 영감**, Bardic Die **영감 주사위**, Jack of All Trades **만능꾼**, Font of Inspiration **영감의 원천**, Countercharm **마법 방해**, Magical Secrets **마법의 비밀**, Superior Inspiration **뛰어난 영감**, Words of Creation **창조의 말씀**, College of Lore **지식의 전당**, Cutting Words **깎아내리는 말**, Magical Discoveries **마법의 발견**, Peerless Skill **비할 데 없는 솜씨**.

### 11.2 클레릭

Divine Order **신성 계율**(Protector **수호자** / Thaumaturge **기적술사**), Divine Spark **신성한 불씨**, Sear Undead **언데드 소각**, Blessed Strikes **축복받은 일격**(Divine Strike **신성한 일격** / Potent Spellcasting **강력한 주문시전**), Improved Blessed Strikes **향상된 축복받은 일격**, Greater Divine Intervention **상급 신의 간섭**, Life Domain **생명 권역**.

### 11.3 드루이드

Primal Order **원초의 계율**(Magician **마법사** / Warden **수호자**), Druidic **드루이드어**, Wild Shape **야생 변신**(Known Forms **아는 형상**, Beast Shapes **야수 형상**), Wild Companion **야생의 동반자**, Wild Resurgence **야생의 부활**, Elemental Fury **원소의 분노**(Primal Strike **원초의 일격**), Beast Spells **야수 주문**, Archdruid **대드루이드**, Circle of the Land **대지의 서클**(서클 주문, 대지의 도움, 자연 회복, 자연의 수호, 자연의 성역).

### 11.4 팔라딘

Lay On Hands **손을 얹기**, Paladin's Smite **팔라딘의 강타**, Faithful Steed **충실한 탈것**, Aura of Protection **보호의 오오라**, Abjure Foes **적 퇴치**, Aura of Courage **용기의 오오라**, Radiant Strikes **광휘의 일격**, Restoring Touch **회복의 손길**, Aura Expansion **오오라 확장**, Oath of Devotion **헌신의 맹세**, Sacred Weapon **신성한 무기**, Aura of Devotion **헌신의 오오라**, Smite of Protection **보호의 강타**, Holy Nimbus **거룩한 후광**, Divine Sense **신성 감지**, Blessed Warrior **축복받은 전사**.

### 11.5 레인저

Favored Enemy **천적**, Deft Explorer **노련한 탐험가**, Roving **방랑**, Tireless **지치지 않는 몸**, Relentless Hunter **집요한 사냥꾼**, Nature's Veil **자연의 장막**, Precise Hunter **정확한 사냥꾼**, Feral Senses **야성의 감각**, Foe Slayer **적 처단자**, Hunter **사냥꾼**, Hunter's Lore **사냥꾼의 지식**, Hunter's Prey **사냥꾼의 먹잇감**(Colossus Slayer **거상 사냥꾼** / Horde Breaker **무리 격파**), Defensive Tactics **방어 전술**(Escape the Horde **무리에서 벗어나기** / Multiattack Defense **연속 공격 방어**), Druidic Warrior **드루이드 전사**.

### 11.6 소서러

Sorcery Points **마법 점수**, Innate Sorcery **타고난 마법**, Font of Magic **마법의 원천**, Metamagic **초마법**, Sorcerous Restoration **마법 회복**, Sorcery Incarnate **마법의 화신**, Arcane Apotheosis **비전의 신격**, Draconic Sorcery **용의 마법**, Draconic Resilience **용의 회복력**, Elemental Affinity **원소 친화**, Dragon Wings **용의 날개**, Dragon Companion **용의 동반자**.

초마법 선택지: Careful **신중한**, Distant **거리 확장**, Empowered **강화된**, Extended **시간 연장**, Heightened **고양된**, Quickened **신속한**, Seeking **추적하는**, Subtle **미묘한**, Transmuted **변환된**, Twinned **쌍둥이** + 주문.

### 11.7 워락

Eldritch Invocations **섬뜩한 계시**(Eldritch **섬뜩한**으로 통일: 섬뜩한 폭발·강타·창·정신), Pact Magic **계약 마법**, Magical Cunning **마법의 교활함**, Contact Patron **후견인과 접촉**, Mystic Arcanum **신비의 비급**, Eldritch Master **섬뜩한 대가**, Fiend Patron **악마 후견인**, Book of Shadows **그림자의 책**, pact weapon **계약 무기**, Lower Planes **하계**, Dark One's Blessing **어둠의 존재의 축복**, Fiendish Resilience **악마의 회복력**, Hurl Through Hell **지옥으로 내던지기**, Recharge 제한 **재충전 5–6**.

계시 선택지: Agonizing **고통스러운**, Repelling **밀어내는**, Eldritch **섬뜩한** + 폭발 / Armor of Shadows **그림자 갑옷** / Ascendant Step **승천의 걸음** / Devil's Sight **악마의 시야** / Devouring Blade **삼키는 칼날** / Fiendish Vigor **악마의 활력** / Gaze of Two Minds **두 정신의 눈길** / Gift of the Depths **심연의 선물** / Gift of the Protectors **수호자의 선물** / Investment of the Chain Master **사슬 군주의 투자** / Lessons of the First Ones **태초의 교훈** / Lifedrinker **생명을 마시는 자** / Mask of Many Faces **만 가지 얼굴의 가면** / Master of Myriad Forms **무수한 형상의 대가** / Misty Visions **안개 같은 환영** / One with Shadows **그림자와 하나 되기** / Otherworldly Leap **저세상의 도약** / Thirsting Blade **목마른 칼날** / Visions of Distant Realms **먼 영역의 환상** / Whispers of the Grave **무덤의 속삭임** / Witch Sight **마녀의 시야** / Pact of the Blade **칼날의 계약**, of the Chain **사슬의 계약**, of the Tome **책의 계약**.
* 3레벨 사슬의 계약에 나오는 괴물 이름(임프, 슈도드래곤, 콰지트, 스켈레톤, 경이의 스핑크스, 스프라이트, 독사)은 괴물 단계에서 이름 표로 확정합니다.

### 11.8 위저드

Ritual Adept **의식의 달인**, Arcane Recovery **비전 회복**, Scholar **박학**(배경 “학자(Sage)”와 겹치지 않게), Memorize Spell **주문 암기**, Spell Mastery **주문 통달**, Signature Spells **대표 주문**, Evoker **방출술사**, Evocation Savant **방출계 전공**.

### 11.9 주문 목록 표

각 클래스의 주문 목록은 `| 주문 | 학파 | 특수 |` 세 칸으로 옮기고, 학파는 **○○계**(예: 환혹계), 특수는 원문 기호 **C / R / M** 을 그대로 둡니다. 목록의 주문 이름은 반드시 [`SPELL-NAMES.md`](./SPELL-NAMES.md) 표기를 씁니다.

## 11. 괴물 자료 상자 번역 견본 (7단계 시작 전)

괴물·동물 단위는 자료 상자 330개가 같은 틀을 되풀이합니다. 아래 라벨과 견본을 **그대로** 따르십시오. 괴물 이름과 자주 나오는 특징·행동 이름은 [괴물 이름 표](./MONSTER-NAMES.md)에 있습니다. 베이직 자료 상자는 “감각능력”, “다중공격”, “전설적 저항력 (3/일)”, “피해 면역·상태 면역”처럼 씁니다.

### 11.1 라벨

| 원문 | 한국어 | 비고 |
| --- | --- | --- |
| `**AC**` / `**Initiative**` / `**HP**` / `**Speed**` | `**방어도**` / `**우선권**` / `**히트 포인트**` / `**이동속도**` | 베이직 |
| `**Skills**` / `**Senses**` / `**Languages**` / `**Gear**` | `**기술**` / `**감각능력**` / `**언어**` / `**장비**` | 베이직(감각능력) |
| `**Resistances**` / `**Vulnerabilities**` / `**Immunities**` | `**저항**` / `**취약성**` / `**면역**` | 2024는 피해·상태 면역을 한 줄에 씀 |
| `**CR**` | `**도전 지수**` | `(XP 5,900, 둥지에서는 7,200; PB +4)` |
| 표 머리 `MOD` / `SAVE`, 칸 `**STR**` … `**CHA**` | `수정치` / `내성`, `**근력**` `**민첩**` `**건강**` `**지능**` `**지혜**` `**매력**` | 표 모양·숫자·`−` 그대로 |
| Burrow / Climb / Fly / Swim, (hover) | 굴착 / 등반 / 비행 / 수영, (공중 정지) | `10ft, 수영 40ft` |
| `_Melee Attack Roll:_` / `_Ranged Attack Roll:_` / `_Melee or Ranged Attack Roll:_` | `_근접 명중 굴림:_` / `_장거리 명중 굴림:_` / `_근접 또는 장거리 명중 굴림:_` | |
| `_Hit:_` / `_Hit or Miss:_` | `_명중시:_` / `_명중 또는 빗나감:_` | 베이직 “명중시” |
| `_Strength Saving Throw:_` … | `_근력 내성 굴림:_` … | |
| `_Failure:_` / `_Success:_` / `_Failure or Success:_` | `_실패시:_` / `_성공시:_` / `_실패시 또는 성공시:_` | |
| `_First Failure:_` / `_Second Failure:_` / `_Subsequent Failures:_` | `_첫 실패시:_` / `_두 번째 실패시:_` / `_이후 실패시:_` | |
| `_Trigger:_` / `_Response:_` | `_계기:_` / `_대응:_` | 반응행동 |
| `(2/Day)`, `(Recharge 5–6)`, `(3/Day, or 4/Day in Lair)` | `(하루 2회)`, `(재충전 5–6)`, `(하루 3회, 둥지에서는 하루 4회)` | lair = **둥지** |
| `reach 15 ft.` / `range 80/320 ft.` | `간격 15ft` / `사거리 80/320ft` | |
| `12 (2d6 + 5) Bludgeoning damage` | `12(2d6 + 5)점의 타격 피해` | 베이직 어투 |
| `has the Grappled condition (escape DC 14)` | `붙잡힘 상태가 됩니다(탈출 DC 14)` | |
| `Half damage.` | `절반 피해.` | |

* `<br>`, 줄 첫머리의 `&emsp;`, 절 아래 `<hr>`은 **한 글자도 바꾸지 않고** 그대로 둡니다. 카드 레이아웃이 이 모양에 기댑니다.
* 괴물을 가리키는 “the aboleth”는 **이름**으로 받습니다(“아볼레스는”). “it”은 문맥에 따라 이름이나 “그 크리쳐”로 씁니다.
* 굵은기울임 이름 `**_Tentacle._**`, 기울임 라벨은 모양을 바꾸지 않고 글만 옮깁니다.

### 11.2 견본: 아볼레스(Aboleth) 자료 상자

```markdown
### 아볼레스

_대형 기괴체, 질서 악_

**방어도** 17 **우선권** +7 (17) <br>
**히트 포인트** 150 (20d10 + 40) <br>
**이동속도** 10ft, 수영 40ft <br>

|  |  | 수정치 | 내성 |  |  | 수정치 | 내성 |  |  | 수정치 | 내성 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| **근력** | 21 | +5 | +5 | **민첩** | 9 | −1 | +3 | **건강** | 15 | +2 | +6 |
| **지능** | 18 | +4 | +8 | **지혜** | 15 | +2 | +6 | **매력** | 18 | +4 | +4 |

**기술** 역사 +12, 감지 +10<br>
**감각능력** 암시야 120ft; 상시 감지 20<br>
**언어** 지저어; 정신감응 120ft<br>
**도전 지수** 10 (XP 5,900, 둥지에서는 7,200; PB +4)

#### 특징

<hr>

**_수륙양용._** 아볼레스는 공기와 물 모두로 숨 쉴 수 있습니다.

**_섬뜩한 복원._** 아볼레스가 파괴되면 5d10일 뒤 새 몸을 얻어, 히트 포인트를 모두 회복한 채 머나먼 영역이나 GM이 고른 다른 장소에서 되살아납니다.

**_전설적 저항력 (하루 3회, 둥지에서는 하루 4회)._** 아볼레스가 내성 굴림에 실패하면, 대신 성공하기로 할 수 있습니다.

**_점액 구름._** 물속에 있는 동안 아볼레스는 점액에 둘러싸여 있습니다. _건강 내성 굴림:_ DC 14, 아볼레스의 턴이 끝날 때 아볼레스를 기점으로 한 5ft 발산형 안의 모든 크리쳐. _실패시:_ 목표는 저주를 받습니다. 저주가 끝날 때까지 목표의 피부는 미끈거리게 변하고, 목표는 공기와 물 모두로 숨 쉴 수 있으며, 물속에 있지 않으면 히트 포인트를 회복할 수 없습니다. <br>
&emsp;저주받은 크리쳐가 물 밖에 있는 동안, 그 크리쳐는 10분이 끝날 때마다 6(1d12)점의 산성 피해를 받습니다. 단, 그 10분이 지나기 전에 피부에 물기를 적셔 주면 피해를 받지 않습니다.

**_탐색하는 정신감응._** 아볼레스가 볼 수 있는 크리쳐가 아볼레스와 정신감응으로 소통하면, 아볼레스는 그 크리쳐의 가장 큰 욕망을 알게 됩니다.

#### 행동

<hr>

**_다중공격._** 아볼레스는 촉수 공격을 두 번 하고, 쓸 수 있다면 기억 삼키기나 정신 지배 중 하나를 사용합니다.

**_촉수._** _근접 명중 굴림:_ +9, 간격 15ft. _명중시:_ 12(2d6 + 5)점의 타격 피해. 목표가 대형 이하의 크리쳐라면, 네 촉수 중 하나에 붙잡힘 상태가 됩니다(탈출 DC 14).

**_기억 삼키기._** _지능 내성 굴림:_ DC 16, 아볼레스에게서 30ft 이내에 있으며 아볼레스에게 매혹 상태이거나 붙잡힘 상태인 크리쳐 하나. _실패시:_ 10(3d6)점의 정신 피해. <br>
&emsp;_성공시:_ 절반 피해. _실패시 또는 성공시:_ 목표가 인간형이고 이 행동으로 히트 포인트가 0이 되면, 아볼레스는 목표의 기억을 얻습니다.

**_정신 지배 (하루 2회)._** _지혜 내성 굴림:_ DC 16, 아볼레스가 볼 수 있는 30ft 이내의 크리쳐 하나. _실패시:_ 아볼레스가 죽거나 목표와 다른 세계에 있게 될 때까지 목표는 매혹 상태가 됩니다. 매혹 상태인 동안 목표는 아볼레스의 아군으로 행동하며, 아볼레스에게서 60ft 이내에 있는 동안 아볼레스의 통제를 받습니다. 또한 아볼레스와 목표는 거리에 상관없이 정신감응으로 서로 소통할 수 있습니다. <br>
&emsp;목표는 피해를 받을 때마다, 그리고 아볼레스에게서 1마일 이상 떨어진 곳에서 24시간을 보낼 때마다 내성 굴림을 다시 하며, 성공하면 자신에게 걸린 효과를 끝냅니다.

#### 전설적 행동

<hr>

_전설적 행동 사용 횟수: 3 (둥지에서는 4). 다른 크리쳐의 턴이 끝난 직후, 아볼레스는 사용 횟수 하나를 소모해 아래 행동 중 하나를 할 수 있습니다. 아볼레스는 자기 턴이 시작될 때마다 소모한 사용 횟수를 모두 되찾습니다._

**_채찍질._** 아볼레스는 촉수 공격을 한 번 합니다.

**_정신 흡수._** 아볼레스에게 매혹 상태이거나 붙잡힘 상태인 크리쳐가 하나 이상 있으면, 아볼레스는 기억 삼키기를 사용하고 5(1d10)점의 히트 포인트를 회복합니다.
```
