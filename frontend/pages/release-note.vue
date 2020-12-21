<template>
  <section class="section">
    <div class="container">
      <h1 class="title is-5">更新情報</h1>
      <div class="content">
        <ul class="has-text-left is-size-7">
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
