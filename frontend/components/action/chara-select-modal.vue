<template>
  <div class="modal-card" style="width: auto">
    <header class="modal-card-head">
      <p class="modal-card-title">画像から選択</p>
    </header>
    <section class="modal-card-body">
      <div class="chara-select-content">
        <div
          v-for="chara in charaList"
          :key="chara.id"
          class="has-text-centered chara-select-box"
          @click="selected(chara.id)"
        >
          <img
            :src="chara.image.image_url"
            :alt="chara.name.name"
            :width="chara.image.width"
            :height="chara.image.height"
          />
          <p class="is-size-7">{{ chara.name.name }}</p>
        </div>
      </div>
    </section>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'nuxt-property-decorator'
import Chara from '~/@types/chara'

@Component({
  components: {}
})
export default class CharaSelectModal extends Vue {
  @Prop({ type: Array })
  private charaList!: Chara[]

  private selected(charaId: number): void {
    this.$emit('chara-select', { charaId })
  }
}
</script>

<style lang="scss" scoped>
.chara-select-content {
  display: flex;
  flex-wrap: wrap;

  .chara-select-box {
    border: 1px solid #cccccc;
    border-radius: 16px;
    padding: 5px;
    margin: 5px auto;
    width: 160px;
  }
  .chara-select-box:hover {
    cursor: pointer;
    border: 1px solid $primary;
    font-weight: 700;
  }
}
</style>
