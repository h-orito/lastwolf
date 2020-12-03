<template>
  <form-select
    class="m-b-20"
    rules="required"
    label-message="キャラチップ"
    :input-value.sync="inputValueModel"
    :options="charachips"
  />
</template>
<script lang="ts">
import { Component, Vue, Prop } from 'nuxt-property-decorator'
import FormOption from '~/components/form/validation/option'

@Component({
  components: {
    formSelect: () => import('~/components/form/validation/form-select.vue')
  }
})
export default class Charachip extends Vue {
  @Prop({ type: String, required: true })
  private inputValue!: string

  @Prop({ type: Array, required: true })
  private charachips!: FormOption[]

  private get inputValueModel(): string {
    return this.inputValue
  }

  private set inputValueModel(val: string) {
    this.$emit('update:inputValue', val)
    this.$emit('load-charas', { participantId: val })
  }
}
</script>
