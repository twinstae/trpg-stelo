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
