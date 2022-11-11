---
title: 사이퍼 시스템을 플레이하는 법
description: 사이퍼 시스템 규칙의 핵심은 단도직입적이며, 게임 플레이는 모두가 핵심 개념 몇 가지에 기반하여 돌아갑니다.
layout: ../../../layouts/MainLayout.astro
createdAt: "2022-11-11T07:34:17.231Z"
publish: true
---

사이퍼 시스템 규칙의 핵심은 단도직입적이며, 게임 플레이는 모두가 핵심 개념 몇 가지에 기반하여 돌아갑니다.

이 챕터에서는 게임을 어떻게 플레이하는지 간단하게 설명하며, 게임을 배우는데 도움이 될 겁니다. 한 번 기본 개념을 이해하고 나면, 더 깊이 있는 논의가 담긴 *Rules of the Game*을 찾아보고 싶을 겁니다.

사이퍼 시스템은 20면체 주사위(1d20)를 사용하여 대부분의 행동 결과를 판정합니다. 주사위를 굴리라고 하는데 어떤 주사위인지는 안 나와 있다면, d20을 굴리면 됩니다.

마스터는 주어진 일(Task)이 무엇이던 *난이도*(difficulty)를 정합니다. 난이도에는 10 단계가 있습니다. 그래서 일의 난이도는 1부터 10 사이의 척도로 매겨질 수 있습니다.

난이도마다 해당하는 *목표치*(target number)가 있습니다. 목표치는 언제나 일의 난이도에 3을 곱하면 되기에, 난이도 1 일은 3의 목표치를 가지고, 난이도 4 일은 목표치가 12입니다. 일에 성공하려면 목표치와 같거나 더 높아야 합니다. 이게 어떻게 작동하는지 안내가 필요하다면 [*일 난이도 표*](#difficulty-table-title)를 보십시오.

<div class="difficulty-table card">
  <h2 id="difficulty-table-title" class="text-lg font-bold mb-4">
    일 난이도 표
  </h2>
  <table
    class="table table-compact table-zebra"
    aria-labelledby="difficulty-table-title"
  >
    <thead>
      <tr>
        <th>난이도</th><th class="hide-mobile">제목</th><th class="hide-mobile">주사위 요구치</th><th>설명</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>1</td><td class="hide-mobile">간단</td><td class="hide-mobile">3</td><td>대부분의 사람이 할 수 있습니다.</td>
      </tr>
      <tr>
        <td>2</td><td class="hide-mobile">보통</td><td class="hide-mobile">6</td><td>보통의 사람이 할 수 있습니다.</td>
      </tr>
      <tr>
        <td>3</td><td class="hide-mobile">까다로움</td><td class="hide-mobile">9</td><td>대부분의 사람은 반반으로 성공합니다.</td>
      </tr>
      <tr>
        <td>4</td><td class="hide-mobile">어려움</td><td class="hide-mobile">12</td><td>익숙한 사람은 반반으로 성공합니다.</td>
      </tr>
      <tr>
        <td>5</td><td class="hide-mobile">도전적</td><td class="hide-mobile">15</td><td>익숙한 사람들도 종종 실패합니다.</td>
      </tr>
      <tr>
        <td>6</td><td class="hide-mobile">모험적</td><td class="hide-mobile">18</td><td>보통 사람들은 거의 성공하지 못합니다.</td>
      </tr>
      <tr>
        <td>7</td><td class="hide-mobile">압도적</td><td class="hide-mobile">21</td><td>적절한 기술이나 노력 없이는 불가능합니다.</td>
      </tr>
      <tr>
        <td>8</td><td class="hide-mobile">영웅적</td><td class="hide-mobile">24</td><td>여러 해 동안 이야기될 것입니다.</td>
      </tr>
      <tr>
        <td>9</td><td class="hide-mobile">전설적</td><td class="hide-mobile">27</td><td>오랜 시간 전설로 남을 것입니다.</td>
      </tr>
      <tr>
        <td>10</td><td class="hide-mobile">불가능</td><td class="hide-mobile">30</td><td>보통 사람들은 상상조차 하지 못합니다.</td>
      </tr>
    </tbody>
  </table>
</div>

캐릭터의 기능, 우호적인 환경, 혹은 탁월한 장비는 일의 난이도를 낮출 수 있습니다. 예를 들어 한 캐릭터가 등반에 *익숙*(train)하다면, 난이도 6짜리 등반을 난이도 5 등반으로 바꿀 수 있습니다. 이를 *난이도를 한 단계 낮춘다*(easing)고 합니다. 만약 등반에 *능숙*(specilaized)하다면, 난이도 6 등반을 난이도 4로 떨어트릴 수 있습니다. 이는 *난이도를 두 단계 낮춘다* 고 합니다. 어떤 상황은 일의 난이도를 높이거나 *방해*(hinder)할 수도 있습니다. 만약 일이 방해받는다면, 난이도를 한 단계 높입니다.