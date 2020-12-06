<template>
  <section>
    <b-input
      size="is-small"
      type="textarea"
      rows="5"
      :value="value"
      @input="$emit('input', $event)"
      custom-class="creator-say"
    ></b-input>
    <p class="has-text-right" v-html="lengthCount"></p>
  </section>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'nuxt-property-decorator'
import Village from '~/@types/village'
import { MESSAGE_TYPE } from '~/consts/consts'

@Component({
  components: {}
})
export default class CreatorMessageInput extends Vue {
  @Prop({ type: String })
  private value!: string

  private get lengthCount(): string {
    const max = 400
    const current = this.value.length - this.value.split('\n').length + 1
    if (current > max) {
      return `文字数: <span class="has-text-danger">${current.toString()}/${max.toString()}</span>`
    } else {
      return `文字数: ${current.toString()}/${max.toString()}`
    }
  }

  private get isLengthOver(): boolean {
    const max = 400
    const current = this.value.length - this.value.split('\n').length + 1
    return current > max
  }
}
</script>

<style lang="scss" scoped>
.textarea {
  font-family: sans-serif;
}
</style>
