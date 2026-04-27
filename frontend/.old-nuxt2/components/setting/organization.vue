<template>
  <form-input
    :rules="validationRules"
    label-message="編成"
    max-length="999"
    input-type="text"
    place-holder-message="編成"
    :input-value.sync="inputValueModel"
  />
</template>
<script lang="ts">
import { Component, Vue, Prop } from 'nuxt-property-decorator'
import Skill from '~/@types/skill'
import { contain_skills } from '~/components/form/validation/organization-rules'
const formInput = () => import('~/components/form/validation/form-input.vue')

@Component({
  components: { formInput }
})
export default class Organization extends Vue {
  @Prop({ type: String, required: true })
  private inputValue!: string

  @Prop({ type: Boolean, required: true })
  private availableDummySkill!: boolean

  @Prop({ type: Array, required: true })
  private skills!: Skill[]

  private get inputValueModel(): string {
    return this.inputValue
  }

  private set inputValueModel(val: string) {
    this.$emit('update:inputValue', val)
  }

  private get validationRules(): Object {
    return {
      required: true,
      max: 999,
      contain_skills: this.skills,
      dummy_skill: this.availableDummySkill ? 1 : 0,
      person_minmax: true
    }
  }
}
</script>
