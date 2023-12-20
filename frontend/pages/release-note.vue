<template>
  <section class="section">
    <div class="container">
      <h1 class="title is-5">更新情報</h1>
      <div class="content">
        <ul class="has-text-left is-size-7">
          <li>2023/12/20 強調発言のみ表示する機能を追加</li>
          <li>2023/12/20 スマホは残り時間を画面上部に表示するよう変更</li>
          <li>2023/12/20 役職「C国狂人」「狂信者」を追加</li>
          <li>
            2021/02/11
            死亡後リロードするまで過去の墓ログを見られなかった不具合を修正
          </li>
          <li>2021/02/11 発言の顔アイコンで抽出/解除できるよう変更</li>
          <li>2021/02/11 発言のレイアウトを変更</li>
          <li>
            2021/02/11 iPhoneX以降で残り時間が正しく表示されない不具合を修正
          </li>
          <li>2020/12/21 村設定「初日白通知」「連続護衛」を追加</li>
          <li>2020/12/16 公開</li>
          <li>2020/12/07 テストプレイ開始</li>
        </ul>
      </div>
    </div>
  </section>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
// component
// type

@Component({
  components: {}
})
export default class extends Vue {
  /** head */
  private head() {
    return { title: ' | 更新情報' }
  }
}
</script>
