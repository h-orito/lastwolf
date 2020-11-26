<template>
  <section class="section">
    <div class="container has-text-left is-size-7">
      <h1 class="title is-5">このサイトは</h1>
      <div class="content">
        <ul>
          <li>LASTWOLFは、オンラインで短期人狼が遊べるサイトです。</li>
          <li>ユーザが自分で好きな設定の村を作成することができます。</li>
        </ul>
      </div>
      <h2 class="title is-5">注意事項</h2>
      <div class="content">
        <ul>
          <li>
            同村しているプレイヤーの画面の向こうにはあなたと同様人間がいます。<br />他者を思いやり、迷惑をかけないプレイを心がけるようお願いします。
          </li>
          <li>
            正常な運営を妨げる行為がなされた場合、管理人の裁量によりアクセス禁止措置等が取られる可能性があります。
          </li>
          <li>
            キャラチップについて
            <ul>
              <li>
                村で各プレイヤーが使用するキャラクターの画像については、著作権は作者様にあります。
              </li>
              <li>
                スクリーンショットのSNSアップロードやキャラ画像のアイコン利用などについては著作権者である作者様の意向に従ってください。
              </li>
              <li>
                「実装国の規約に準ずる」とある場合は、村ログのスクリーンショットのSNSアップロードはOK、キャラ画像のみを利用するのはNGとします。
              </li>
            </ul>
          </li>
          <li>
            参加如何に関わらず、進行中の村の情報を別の場所でやり取りしないでください。
          </li>
          <li>
            決着を迎えるまでは、自身が希望した役職について言及しないでください。
          </li>
          <li>
            勝利を目指してください。
          </li>
        </ul>
      </div>
    </div>
  </section>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
// type

@Component({
  components: {}
})
export default class About extends Vue {
  /** head */
  private head() {
    return { title: ' | このサイトは' }
  }
}
</script>

<style lang="scss" scoped></style>
