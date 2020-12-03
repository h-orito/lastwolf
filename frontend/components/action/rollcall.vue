<template>
  <div>
    <hr class="m-t-10 m-b-10" />
    <p class="m-b-10"><strong>点呼</strong></p>
    <p v-if="!rollcalling">準備ができたら準備完了を押してください。</p>
    <p v-if="rollcalling">他の方が準備完了するまでお待ちください。</p>
    <b-button type="is-primary" size="is-small" @click="rollcall">{{
      rollcalling ? '準備完了を取り消す' : '準備完了'
    }}</b-button>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import SituationAsParticipant from '~/@types/situation-as-participant'

@Component({
  components: {}
})
export default class Rollcall extends Vue {
  private get situation(): SituationAsParticipant {
    return this.$store.getters.situation
  }

  private get rollcalling(): boolean {
    return this.situation.roll_call.done_roll_call
  }

  private async rollcall(): Promise<void> {
    try {
      const done = !this.rollcalling
      await this.$axios.$post(
        `/village/${this.$store.getters.villageId}/rollcall`,
        {
          rollcall: done
        }
      )
      this.$buefy.toast.open({
        message: done ? '準備完了しました' : '準備完了をキャンセルしました',
        type: 'is-info',
        position: 'is-top'
      })
    } catch (error) {}
  }
}
</script>
