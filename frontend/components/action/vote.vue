<template>
  <div>
    <hr class="m-t-10 m-b-10" />
    <p class="m-b-10"><strong>投票</strong></p>
    <p class="m-b-10">
      投票対象を選択してください。<br />全員が投票する前なら投票し直す事もできます。<br />投票しないと突然死するため、必ず投票してください。
    </p>
    <p class="m-b-10" v-if="currentVoteTarget">
      <strong class="is-size-6">{{ currentVoteTarget }}</strong>
      に投票しています。
    </p>
    <b-field label="対象" label-position="on-border">
      <b-select v-model="participantId" expanded size="is-small">
        <option
          v-for="participant in targetList"
          :value="participant.id"
          :key="participant.id"
          >{{ participant.chara.name.name }}</option
        >
      </b-select>
    </b-field>
    <b-button
      :disabled="!canSubmit || submitting"
      @click="setVote"
      type="is-primary"
      size="is-small"
      >投票する</b-button
    >
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'nuxt-property-decorator'
import Village from '~/@types/village'
import VillageParticipant from '~/@types/village-participant'
import SituationAsParticipant from '~/@types/situation-as-participant'

@Component({
  components: {}
})
export default class VoteV extends Vue {
  private submitting: boolean = false
  private participantId: number | null = this.situation.vote.target
    ? this.situation.vote.target.id
    : null

  private get situation(): SituationAsParticipant {
    return this.$store.getters.situation
  }

  private get targetList(): VillageParticipant[] {
    return this.situation.vote.target_list
  }

  private get villageId(): number {
    return this.$store.getters.villageId
  }

  private get village(): Village {
    return this.$store.getters.village
  }

  private get currentVoteTarget(): string {
    if (!this.situation.vote.target) return ''
    return this.situation.vote.target.chara.name.name
  }

  // 参加ボタンを押下できるか
  private get canSubmit(): boolean {
    return this.participantId != null
  }

  private async setVote(): Promise<void> {
    this.submitting = true
    try {
      await this.$axios.$post(`/village/${this.villageId}/vote`, {
        target_id: this.participantId
      })
      this.submitting = false
    } catch (error) {
      const code = parseInt(error.response && error.response.status)
      if (code === 404 && error.response.data.status === 499) {
        this.$buefy.toast.open({
          message: error.response.data.message,
          type: 'is-danger',
          position: 'is-top'
        })
      }
      this.submitting = false
    }
  }
}
</script>
