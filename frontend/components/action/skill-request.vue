<template>
  <div>
    <hr class="m-t-10 m-b-10" />
    <p class="m-b-10"><strong>役職希望</strong></p>
    <p class="m-b-10">
      役職希望を変更することができます。<br />現在の希望は<strong>
        {{ currentRequest }} </strong
      >です。
    </p>
    <b-field
      v-if="situation.skill_request.available_skill_request"
      label="役職第1希望"
      label-position="on-border"
      custom-class="is-small"
    >
      <b-select v-model="firstRequestSkillCode" expanded size="is-small">
        <option
          v-for="skill in situation.skill_request.selectable_skill_list"
          :value="skill.code"
          :key="skill.code"
          >{{ skill.name }}</option
        >
      </b-select>
    </b-field>
    <b-field
      v-if="situation.skill_request.available_skill_request"
      custom-class="is-small"
      label="役職第2希望"
      label-position="on-border"
    >
      <b-select v-model="secondRequestSkillCode" expanded size="is-small">
        <option
          v-for="skill in situation.skill_request.selectable_skill_list"
          :value="skill.code"
          :key="skill.code"
          >{{ skill.name }}</option
        >
      </b-select>
    </b-field>
    <b-button
      :disabled="!canSubmit || submitting"
      @click="change"
      type="is-primary"
      size="is-small"
      >変更する</b-button
    >
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import Village from '~/@types/village'
import SituationAsParticipant from '~/@types/situation-as-participant'

@Component({
  components: {}
})
export default class SkillRequest extends Vue {
  private submitting: boolean = false
  private charaId: number | null = null
  private firstRequestSkillCode: string | null =
    this.situation.skill_request.skill_request == null
      ? 'LEFTOVER'
      : this.situation.skill_request.skill_request.first.code

  private secondRequestSkillCode: string | null =
    this.situation.skill_request.skill_request == null
      ? 'LEFTOVER'
      : this.situation.skill_request.skill_request.second.code

  private get situation(): SituationAsParticipant {
    return this.$store.getters.situation
  }

  private get villageId(): number {
    return this.$store.getters.villageId
  }

  private get village(): Village {
    return this.$store.getters.village
  }

  // 参加ボタンを押下できるか
  private get canSubmit(): boolean {
    return (
      this.firstRequestSkillCode != null && this.secondRequestSkillCode != null
    )
  }

  private get currentRequest(): string {
    const first = this.situation.skill_request.skill_request!.first.name
    const second = this.situation.skill_request.skill_request!.second.name
    return `${first} / ${second}`
  }

  private async change(): Promise<void> {
    this.submitting = true
    try {
      await this.$axios.$post(`/village/${this.villageId}/change-skill`, {
        first_request_skill: this.firstRequestSkillCode!,
        second_request_skill: this.secondRequestSkillCode!
      })
      location.reload()
    } catch (error) {}
    this.submitting = false
  }
}
</script>
