<template>
  <div class="content">
    <h4 id="ability-overall" class="is-7"><strong>全般</strong></h4>
    <div class="content">
      <ul>
        <li>夜時間に行使でき、行使しなかった場合突然死します。</li>
        <li>対象を選択しない能力の場合、自動で行使されます。（例：霊視）</li>
        <li>一度対象を選択すると、変更することはできません。</li>
      </ul>
    </div>
    <h4 class="is-7" id="divine"><strong>占い</strong></h4>
    <div class="content">
      <ul>
        <li>
          毎晩、生存者1名を選択して占い、人狼かそうでないかを知ることができます。
        </li>
        <li>結果は行使してすぐにチャット欄に表示されます。</li>
        <li>
          妖狐など、占われると死亡する役職を占うと、対象を無惨な死体として死亡させることができます。
        </li>
        <li>
          ダミーキャラが占い師となった場合、ランダムで対象を選択して占いを実行します。
        </li>
      </ul>
    </div>
    <h4 class="is-7" id="psychic"><strong>霊視</strong></h4>
    <div class="content">
      <ul>
        <li>
          突然死、処刑された人が人狼かそうでないかを知ることができます。
        </li>
        <li>結果は夜時間になってすぐにチャット欄に表示されます。</li>
        <li>複数名死亡した場合、全員分知ることができます。</li>
      </ul>
    </div>
    <h4 class="is-7" id="guard"><strong>護衛</strong></h4>
    <div class="content">
      <ul>
        <li>
          初日以外の毎晩、自分以外の生存者1名を人狼の襲撃から護衛することができます。
        </li>
        <li>
          護衛成功してもメッセージが出ることはないため、護衛が成功したか知ることはできません。
        </li>
      </ul>
    </div>
    <h4 class="is-7" id="attack"><strong>襲撃</strong></h4>
    <div class="content">
      <ul>
        <li>毎晩1名を襲撃し、無惨な死体として死亡させられます。</li>
        <li>
          襲撃能力を持つ人が複数いる場合、誰か1人が能力セットすると他の人はセットできなくなります。
        </li>
        <li>
          1日目はダミーキャラしか襲撃対象として選択できません。
        </li>
        <li>「襲撃なし」はありません。</li>
        <li>襲撃結果は昼時間の最初にチャット欄に表示されます。</li>
        <li>
          襲撃に失敗しても、護衛や襲撃耐性など失敗の要因を知ることはできません。
        </li>
      </ul>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'

@Component({
  components: {}
})
export default class RuleAbility extends Vue {}
</script>
