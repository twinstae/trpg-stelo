---
title: 캐릭터 만들기 [CSRD]
description: 사이퍼 시스템 규칙의 핵심은 단도직입적이며, 게임 플레이는 모두가 핵심 개념 몇 가지에 기반하여 돌아갑니다.
layout: ../../../layouts/MainLayout.astro
createdAt: "2022-11-11T20:34:17.231Z"
publish: false
---

이 섹션에서는 사이퍼 시스템 게임에서 플레이할 캐릭터를 어떻게 만들지 설명하겠습니다. 캐릭터를 조형하기 위해 일련의 결정을 내려야 하기 때문에, 여러분이 플레이하고 싶은 캐릭터가 어떤 종류인지 더 잘 이해할 수록, 캐릭터 만들기는 더 쉬워질 겁니다. 이 과정에서 세 가지 게임의 가 어떤 가치를 가지는지 이해하고 여러분의 캐릭터의 특성치(statistics)를 결정하는 세 가지 면모를 선택해야 합니다.

## 캐릭터 특성치
모든 PC는 세 가지 특성으로 정의하며, 이를 보통 *특성치*(“statistics”) 혹은 줄여서 *스탯*(stat)이라고 부릅니다. 특성치는 *힘*(Might), *속력*(Speed), *지성*(Intellect) 이 있습니다. 이 셋은 넓은 범주라서 다양하지만 연관된 캐릭터의 여러 면모들을 포괄합니다.

### 힘
힘은 캐릭터가 얼마나 강하고 잘 견디는지를 나타냅니다. 근력과 지구력, 체력, 끈질김, 그리고 물리적 용맹함도 모두 이 하나의 특성치로 감싸집니다. 힘은 하지만 크기에 따라 상대적이진 않습니다.; 대신, 절대적인 수치입니다. 코끼리는 가장 강한 강한 호랑이보다 세고, 호랑이는 가장 강한 쥐보다 세고, 쥐는 가장 강한 거미보다 강합니다.[^역주1]

힘은 문을 억지로 여는 것부터 음식 없이 며칠 동안 걷거나, 질병에 저항하는 것까지 관할합니다. 이는 또한 위험한 상황에서 어느 정도 피해를 견딜 수 있는지 결정하는 주된 요인입니다. 몸을 쓰는 캐릭터나 끈질긴(tough) 캐릭터, 그리고 싸움에 흥미가 있는 캐릭터는 힘에 집중해야 합니다.

(힘은 힘/건강(Health)으로 생각해도 좋습니다. 왜냐하면 얼마나 강한지 뿐만 아니라 얼마나 물리적 고문을 견딜 수 있는지도 관할하기 때문입니다.)

### 속력
속력은 캐릭터가 얼마나 빠르고 물리적 균형 감각이 좋은지를 묘사합니다. 이 특성치는 빠름, 움직임, 손재주, 반사신경을 포함합니다. 속력은 공격을 피하거나, 조용히 숨어서 걷거나, 공을 정확하게 던지는 것과 같은 다양한 행동을 관할합니다. 이는 차례에 더 멀리 움직일 수 있는지도 결정합니다. 날쌔고, 빠르거나, 음밀한 캐릭터라면 속력 특성을 원할 것이며, 원거리 전투에 관심 있는 경우도 마찬가지입니다.

(속력은 *속력/민첩*(Agility)으로 생각할 수도 있는데, 왜냐하면 전반적인 빠르기와 반사신경을 관할하기 때문입니다.)

### 지성
이 특성은 캐릭터가 얼마나 똑똑하고, 지적이며, 호감을 사는지를 결정합니다. 이는 지능, 지혜, 카리스마, 교육, 추론, 재치, 의지력, 그리고 매력을 포함합니다. 지성은 퍼즐을 풀거나, 사실을 기억하거나, 믿을만한 거짓말을 하거나, 정신력을 쓰는 것을 관할합니다. 효과적으로 소통하거나, 잘 배운 학자가 되고 싶거나, 초자연적인 힘을 쓰고 싶다면 지성 특성을 강조하는 게 좋습니다.

(지성은 *지성/인격*(Personality)이라고 생각해도 되는데, 왜냐하면 지능과 카리스마를 모두 관할하기 때문입니다.)

## 역량, 재능, 분발
세 가지 각 특성치는 두 가지 요소를 가지고 있습니다: *역량*(Pool)과 *재능*(Edge)입니다. 역량은 날 것의, 내적인 능력을 나타내며, 재능은 당신이 가진 것을 어떻게 쓸지 아는 걸 나타냅니다. 세 번째 요소는 다음 개념과 연관이 있습니다: *분발*(Effort). 캐릭터가 정말로 일을 해내야만 할 때, 분발을 합니다.

(특성치 역량은, 분발과 재능과 마찬가지로, 여러분이 고른 캐릭터 유형과 수식어, 특징에 따라 정해집니다. 이 지침 안에는, 하지만, 여러분의 캐릭터를 발전시켜 나가는데 유연한 여지도 많이 남겨두었습니다.)

### 역량
Your Pool is the most basic measurement of a stat. Comparing the Pools of two creatures will give you a general sense of which creature is superior in that stat. For example, a character who has a Might Pool of 16 is stronger (in a basic sense) than a character who has a Might Pool of 12. Most characters start with a Pool of 9 to 12 in most stats—that’s the average range.

When your character is injured, sickened, or attacked, you temporarily lose points from one of your stat Pools. The nature of the attack determines which Pool loses points. For example, physical damage from a sword reduces your Might Pool, a poison that makes you clumsy reduces your Speed Pool, and a psionic blast reduces your Intellect Pool. You can also spend points from one of your stat Pools to decrease a task’s difficulty (see Effort, below). You can rest to recover lost points from a stat Pool, and some special abilities or cyphers might allow you to recover lost points quickly.

### 재능
Although your Pool is the basic measurement of a stat, your Edge is also important. When something requires you to spend points from a stat Pool, your Edge for that stat reduces the cost. It also reduces the cost of applying Effort to a roll.

For example, let’s say you have a mental blast ability, and activating it costs 1 point from your Intellect Pool. Subtract your Intellect Edge from the activation cost, and the result is how many points you must spend to use the mental blast. If using your Edge reduces the cost to 0, you can use the ability for free.

Your Edge can be different for each stat. For example, you could have a Might Edge of 1, a Speed Edge of 1, and an Intellect Edge of 0. You’ll always have an Edge of at least 1 in one stat. Your Edge for a stat reduces the cost of spending points from that stat Pool, but not from other Pools. Your Might Edge reduces the cost of spending points from your Might Pool, but it doesn’t affect your Speed Pool or Intellect Pool. Once a stat’s Edge reaches 3, you can apply one level of Effort for free.

A character who has a low Might Pool but a high Might Edge has the potential to perform Might actions consistently better than a character who has a Might Edge of 0. The high Edge will let them reduce the cost of spending points from the Pool, which means they’ll have more points available to spend on applying Effort.

### 분발
When your character really needs to accomplish a task, you can apply Effort. For a beginning character, applying Effort requires spending 3 points from the stat Pool appropriate to the action. Thus, if your character tries to dodge an attack (a Speed roll) and wants to increase the chance for success, you can apply Effort by spending 3 points from your Speed Pool. Effort eases the task by one step. This is called applying one level of Effort.

You don’t have to apply Effort if you don’t want to. If you choose to apply Effort to a task, you must do it before you attempt the roll—you can’t roll first and then decide to apply Effort if you rolled poorly.

Applying more Effort can lower a task’s difficulty further: each additional level of Effort eases the task by another step. Applying one level of Effort eases the task by one step, applying two levels eases the task by two steps, and so on. However, each level of Effort after the first costs only 2 points from the stat Pool instead of 3. So applying two levels of Effort costs 5 points (3 for the first level plus 2 for the second level), applying three levels costs 7 points (3 plus 2 plus 2), and so on.

Every character has an Effort score, which indicates the maximum number of levels of Effort that can be applied to a roll. A beginning (first-tier) character has an Effort of 1, meaning you can apply only one level of Effort to a roll. A more experienced character has a higher Effort score and can apply more levels of Effort to a roll. For example, a character who has an Effort of 3 can apply up to three levels of Effort to reduce a task’s difficulty.

When you apply Effort, subtract your relevant Edge from the total cost of applying Effort. For example, let’s say you need to make a Speed roll. To increase your chance for success, you decide to apply one level of Effort, which will ease the task. Normally, that would cost 3 points from your Speed Pool. However, you have a Speed Edge of 2, so you subtract that from the cost. Thus, applying Effort to the roll costs only 1 point from your Speed Pool.

What if you applied two levels of Effort to the Speed roll instead of just one? That would ease the task by two steps. Normally, it would cost 5 points from your Speed Pool, but after subtracting your Speed Edge of 2, it costs only 3 points.

Once a stat’s Edge reaches 3, you can apply one level of Effort for free. For example, if you have a Speed Edge of 3 and you apply one level of Effort to a Speed roll, it costs you 0 points from your Speed Pool. (Normally, applying one level of Effort would cost 3 points, but you subtract your Speed Edge from that cost, reducing it to 0.)

Skills and other advantages also ease a task, and you can use them in conjunction with Effort. In addition, your character might have special abilities or equipment that allow you to apply Effort to accomplish a special effect, such as knocking down a foe with an attack or affecting multiple targets with a power that normally affects only one.

(When applying Effort to melee attacks, you have the option of spending points from either your Might Pool or your Speed Pool. When making ranged attacks, you may spend points only from your Speed Pool. This reflects that with melee you sometimes use brute force and sometimes use finesse, but with ranged attacks, it’s always about careful targeting.)

### 분발과 피해
Instead of applying Effort to ease your attack, you can apply Effort to increase the amount of damage you inflict with an attack. For each level of Effort you apply in this way, you inflict 3 additional points of damage. This works for any kind of attack that inflicts damage, whether a sword, a crossbow, a mind blast, or something else.

When using Effort to increase the damage of an area attack, such as the explosion created by an Adept’s Concussion ability, you inflict 2 additional points of damage instead of 3 points. However, the additional points are dealt to all targets in the area. Further, even if one or more of the targets resist the attack, they still take 1 point of damage.

### 분발과 재능을 함께 쓰기
If your Effort is 2 or higher, you can apply Effort to multiple aspects of a single action. For example, if you make an attack, you can apply Effort to your attack roll and apply Effort to increase the damage.

The total amount of Effort you apply can’t be higher than your Effort score. For example, if your Effort is 2, you can apply up to two levels of Effort. You could apply one level to an attack roll and one level to its damage, two levels to the attack and no levels to the damage, or no levels to the attack and two levels to the damage.

You can use Edge for a particular stat only once per action. For example, if you apply Effort to a Might attack roll and to your damage, you can use your Might Edge to reduce the cost of one of those uses of Effort, not both. If you spend 1 Intellect point to activate your mind blast and one level of Effort to ease the attack roll, you can use your Intellect Edge to reduce the cost of one of those things, not both.

## 특성치 예시
A beginning character is fighting a giant rat. The PC stabs their spear at the rat, which is a level 2 creature and thus has a target number of 6. The character stands atop a boulder and strikes downward at the beast, and the GM rules that this helpful tactic is an asset that eases the attack by one step (to difficulty 1). That lowers the target number to 3. Attacking with a spear is a Might action; the character has a Might Pool of 11 and a Might Edge of 0. Before making the roll, they decide to apply a level of Effort to ease the attack. That costs 3 points from their Might Pool, reducing the Pool to 8. But the points are well spent. Applying the Effort lowers the difficulty from 1 to 0, so no roll is needed—the attack automatically succeeds.

Another character is attempting to convince a guard to let them into a private office to speak to an influential noble. The GM rules that this is an Intellect action. The character is third tier and has an Effort of 3, an Intellect Pool of 13, and an Intellect Edge of 1. Before making the roll, they must decide whether to apply Effort. They can choose to apply one, two, or three levels of Effort, or apply none at all. This action is important to them, so they decide to apply two levels of Effort, easing the task by two steps. Thanks to their Intellect Edge, applying the Effort costs only 4 points from their Intellect Pool (3 points for the first level of Effort plus 2 points for the second level minus 1 point for their Edge). Spending those points reduces their Intellect Pool to 9. The GM decides that convincing the guard is a difficulty 3 (demanding) task with a target number of 9; applying two levels of Effort reduces the difficulty to 1 (simple) and the target number to 3. The player rolls a d20 and gets an 8. Because this result is at least equal to the target number of the task, they succeed. However, if they had not applied some Effort, they would have failed because their roll (8) would have been less than the task’s original target number (9).


## 캐릭터 등급(Tier)
Every character starts the game at the first tier. Tier is a measurement of power, toughness, and ability. Characters can advance up to the sixth tier. As your character advances to higher tiers, you gain more abilities, increase your Effort, and can improve a stat’s Edge or increase a stat. Generally speaking, even first-tier characters are already quite capable. It’s safe to assume that they’ve already got some experience under their belt. This is not a “zero to hero” progression, but rather an instance of competent people refining and honing their capabilities and knowledge. Advancing to higher tiers is not really the goal of Cypher System characters, but rather a representation of how characters progress in a story.

To progress to the next tier, characters earn experience points (XP) by pursuing character arcs, going on adventures, and discovering new things—the system is about both discovery and exploration, as well as achieving personal goals. Experience points have many uses, and one use is to purchase character benefits. After your character purchases four character benefits, they advance to the next tier. Each benefit costs 4 XP, and you can purchase them in any order, but you must purchase one of each kind of benefit (and then advance to the next tier) before you can purchase the same benefit again. The four character benefits are as follows.

**Increasing Capabilities**: You gain 4 points to add to your stat Pools. You can allocate the points among the Pools however you wish.

**Moving Toward Perfection**: You add 1 to your Might Edge, your Speed Edge, or your Intellect Edge (your choice).

**Extra Effort**: Your Effort score increases by 1.

**Skills**: You become trained in one skill of your choice, other than attacks or defense. As described in Rules of the Game, a character trained in a skill treats the difficulty of a related task as one step lower than normal. The skill you choose for this benefit can be anything you wish, such as climbing, jumping, persuading, or sneaking. You can also choose to be knowledgeable in a certain area of lore, such as history or geology. You can even choose a skill based on your character’s special abilities. For example, if your character can make an Intellect roll to blast an enemy with mental force, you can become trained in using that ability, easing the task of using it. If you choose a skill that you are already trained in, you become specialized in that skill, easing related tasks by two steps instead of one.

(Skills are a broad category of things your character can learn and accomplish. For a list of sample skills, see below.)

**Other Options**: Players can also spend 4 XP to purchase other special options in lieu of gaining a new skill. Selecting any of these options counts as the skill benefit necessary to advance to the next tier. The special options are as follows:

Reduce the cost for wearing armor. This option lowers the Speed cost for wearing armor by 1.

Add 2 to your recovery rolls.

Select a new type-based ability from your tier or a lower tier.



## 캐릭터 수식어, 유형, 특징
To create your character, you build a simple statement that describes them. The statement takes this form: “I am a [fill in an adjective here] [fill in a noun here] who [fill in a verb here].”

Thus: “I am an adjective noun who verbs.” For example, you might say, “I am a Rugged Warrior who Controls Beasts” or “I am a Charming Explorer who Focuses Mind Over Matter.”

In this sentence, the adjective is called your descriptor.

The noun is your character type.

The verb is called your focus.

Even though character type is in the middle of the sentence, that’s where we’ll start this discussion. (Just as in a sentence, the noun provides the foundation.)

Your character type is the core of your character. In some roleplaying games, it might be called your character class. Your type helps determine your character’s place in the world and relationship with other people in the setting. It’s the noun of the sentence “I am an adjective noun who verbs.”

You can choose from four character types: Warriors, Adepts, Explorers, and Speakers.

Your descriptor defines your character—it colors everything you do. Your descriptor places your character in the situation (the first adventure, which starts the campaign) and helps provide motivation. It’s the adjective of the sentence “I am an adjective noun who verbs.”

Unless your GM says otherwise, you can choose from any of the character descriptors.

Focus is what your character does best. Focus gives your character specificity and provides interesting new abilities that might come in handy. Your focus also helps you understand how you relate with the other player characters in your group. It’s the verb of the sentence “I am an adjective noun who verbs.”

There are many character foci. The ones you choose from will probably depend on the setting and genre of your game.

(You can use the Flavors chapter to slightly modify character types to customize them for different genres.)


## 특수 능력
Character types and foci grant PCs special abilities at each new tier. Using these abilities usually costs points from your stat Pools; the cost is listed in parentheses after the ability name. Your Edge in the appropriate stat can reduce the cost of the ability, but remember that you can apply Edge only once per action. For example, let’s say an Adept with an Intellect Edge of 2 wants to use their Onslaught ability to create a bolt of force, which costs 1 Intellect point. They also want to increase the damage from the attack by using a level of Effort, which costs 3 Intellect points. The total cost for their action is 2 points from their Intellect Pool (1 point for the bolt of force, plus 3 points for using Effort, minus 2 points from their Edge).

Sometimes the point cost for an ability has a + sign after the number. For example, the cost might be given as “2+ Intellect points.” That means you can spend more points or more levels of Effort to improve the ability further, as explained in the ability description.

Many special abilities grant a character the option to perform an action that they couldn’t normally do, such as projecting rays of cold or attacking multiple foes at once. Using one of these abilities is an action unto itself, and the end of the ability’s description says “Action” to remind you. It also might provide more information about when or how you perform the action.

Some special abilities allow you to perform a familiar action—one that you can already do—in a different way. For example, an ability might let you wear heavy armor, reduce the difficulty of Speed defense rolls, or add 2 points of fire damage to your weapon damage. These abilities are called enablers. Using one of these abilities is not considered an action. Enablers either function constantly (such as being able to wear heavy armor, which isn’t an action) or happen as part of another action (such as adding fire damage to your weapon damage, which happens as part of your attack action). If a special ability is an enabler, the end of the ability’s description says “Enabler” to remind you.

Some abilities specify a duration, but you can always end one of your own abilities anytime you wish.

(Because the Cypher System covers so many genres, not all of the descriptors, types, and foci might be available for players. The GM will decide what’s available in their particular game and whether anything is modified, and they’ll let the players know.)


## 기능(Skills)
Sometimes your character gains training in a specific skill or task. For example, your focus might mean that you’re trained in sneaking, in climbing and jumping, or in social interactions. Other times, your character can choose a skill to become trained in, and you can pick a skill that relates to any task you think you might face.
The Cypher System has no definitive list of skills. However, the following list offers ideas:

|           |        |           |        |           |        |
| --------- | ------ | --------- | ------ | --------- | ------ |
| 가죽 공예 | 감각   | 균형 잡기 | 기계   | 금속 공예 | 등반   |
| 도약      | 물리학 | 목공      | 부수기 | 변장      | 식물   |
| 생물학    | 속임수 | 설득      | 수리   | 소매치기  | 수영   |
| 우선권    | 운전   | 운반      | 역사   | 위협      | 자물쇠 |
| 잠입      | 지리   | 지질학    | 천문학 | 철학      | 치유   |
| 컴퓨터    | 타기   | 탈출      | 파일럿 | 판별      | 훔치기 |

You could choose a skill that incorporates more than one of these areas (interacting might include deceiving, intimidation, and persuasion) or that is a more specific version of one (hiding might be sneaking when you’re not moving). You could also make up more general professional skills, such as baker, sailor, or lumberjack. If you want to choose a skill that’s not on this list, it’s probably best to run it past the GM first, but in general, the most important thing is to choose skills that are appropriate to your character.

Remember that if you gain a skill that you’re already trained in, you become specialized in that skill. Because skill descriptions can be nebulous, determining whether you’re trained or specialized might take some thinking. For example, if you’re trained in lying and later gain an ability that grants you skill with all social interactions, you become specialized in lying and trained in all other types of interactions. Being trained three times in a skill is no better than being trained twice (in other words, specialized is as good as it gets).

Only skills gained through character type abilities or other rare instances allow you to become skilled with attack or defense tasks.

If you gain a special ability through your type, your focus, or some other aspect of your character, you can choose it in place of a skill and become trained or specialized in that ability. For example, if you have a mind blast, when it’s time to choose a skill to be trained in, you can select your mind blast as your skill. That would ease the attack every time you used it. Each ability you have counts as a separate skill for this purpose. You can’t select “all mind powers” or “all spells” as one skill and become trained or specialized in such a broad category.

In most campaigns, fluency in a language is considered a skill. So if you want to speak French, that’s the same as being trained in biology or swimming.

## 방어 행동
Defense tasks are when a player makes a roll to keep something undesirable from happening to their PC. The type of defense task matters when using Effort.

**Might defense**: Used for resisting poison, disease, and anything else that can be overcome with strength and health.

**Speed defense**: Used for dodging attacks and escaping danger. This is by far the most commonly used defense task.

**Intellect defense**: Used for fending off mental attacks or anything that might affect or influence one’s mind.

[^역주1]: 역주1. 예를 들어 코끼리와 자그마한 생쥐가 있다면. 똑같이 힘이 10일 수는 없습니다. 힘이 상대적인 수치라면 힘이 10인 쥐보다 힘이 10인 코끼리가 훨씬 강할 겁니다. 하지만 힘은 절대적이기 때문에, 코끼리랑 같은 힘을 가진 쥐는 존재하지 않을 겁니다. (물론 물리법칙을 무시하는 마법과 유전자 조작이 없다면...)