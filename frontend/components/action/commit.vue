<template>
  <div>
    <hr class="m-t-10 m-b-10" />
    <p class="m-b-10"><strong>時短希望</strong></p>
    <p class="m-b-5">
      全員が時短希望すると残り時間が残っていても{{
        nextNoonnight
      }}に進行できます。<br />
      全員が時短希望する前なら取り消す事もできます。<br />
    </p>
    <p class="m-b-10">
      あなたは時短を希望
      <strong class="is-size-6">{{
        isCurrentCommitting ? 'しています' : 'していません'
      }}</strong>
      。
    </p>
    <b-button
      :disabled="submitting"
      @click="setCommit"
      type="is-primary"
      size="is-small"
      >{{
        isCurrentCommitting ? '時短希望を取り消す' : '時短希望する'
      }}</b-button
    >
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'nuxt-property-decorator'
import Village from '~/@types/village'
import VillageParticipant from '~/@types/village-participant'
import VillageDay from '~/@types/village-day'
import SituationAsParticipant from '~/@types/situation-as-participant'
import { NOONNIGHT_CODE } from '~/consts/consts'

@Component({
  components: {}
})
export default class CommitV extends Vue {
  private submitting: boolean = false

  private get situation(): SituationAsParticipant {
    return this.$store.getters.situation
  }

  private get villageId(): number {
    return this.$store.getters.villageId
  }

  private get village(): Village {
    return this.$store.getters.village
  }

  private get nextNoonnight(): string {
    const latestDay: VillageDay = this.$store.getters.latestDay
    return latestDay.noon_night.code === NOONNIGHT_CODE.NOON
      ? '投票時間'
      : '議論時間'
  }

  private get isCurrentCommitting(): boolean {
    return this.situation.commit.committing
  }

  private async setCommit(): Promise<void> {
    this.submitting = true
    try {
      await this.$axios.$post(`/village/${this.villageId}/commit`, {
        commit: !this.isCurrentCommitting
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
