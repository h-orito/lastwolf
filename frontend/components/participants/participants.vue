<template>
  <b-message
    type="is-dark"
    size="is-small"
    title="参加者"
    class="participants"
    :closable="false"
  >
    <participant
      v-for="p in participants"
      :key="p.id"
      :participant="p"
      :is-disp-player="isDispPlayer"
    />
    <div v-if="isSolved">
      <hr class="m-t-10 m-b-10" />
      <b-button
        type="is-primary"
        size="is-small"
        @click="toggleDisplayPlayer"
        >{{ toggleDisplayButtonMessage }}</b-button
      >
    </div>
  </b-message>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import participant from '~/components/participants/participant.vue'
import Village from '~/@types/village'
import VillageParticipant from '~/@types/village-participant'
import { VILLAGE_STATUS } from '~/consts/consts'

interface Participant {
  name: string
  url: string
  co?: string
  is_dead: boolean
  dead_day?: number
  dead_reason?: string
}

@Component({
  components: { participant }
})
export default class Participants extends Vue {
  private isDispPlayer: boolean = false

  private get village(): Village | null {
    return this.$store.getters.village
  }

  private get participants(): VillageParticipant[] {
    if (!this.village) return []
    return this.village.participants.member_list.slice().sort(compare)
  }

  private get isSolved(): boolean {
    return (
      !!this.village &&
      [
        VILLAGE_STATUS.EPILOGUE,
        VILLAGE_STATUS.COMPLETE,
        VILLAGE_STATUS.CANCEL
      ].some(s => s === this.village!!.status.code)
    )
  }

  private get toggleDisplayButtonMessage(): string {
    return this.isDispPlayer
      ? 'プレイヤー情報を表示しない'
      : 'プレイヤー情報を表示する'
  }

  private toggleDisplayPlayer(): void {
    this.isDispPlayer = !this.isDispPlayer
  }
}

const compare = (p1: VillageParticipant, p2: VillageParticipant): number => {
  // 死んだ方が右
  if (p1.dead && !p2.dead) return 1
  if (!p1.dead && p2.dead) return -1
  if (p1.dead && p2.dead) {
    // 先に死んだ方が右
    if (p1.dead.village_day.day < p2.dead.village_day.day) return 1
    if (p1.dead.village_day.day > p2.dead.village_day.day) return -1
    if (deadReasonPriority(p1.dead.reason) > deadReasonPriority(p2.dead.reason))
      return 1
    if (deadReasonPriority(p1.dead.reason) < deadReasonPriority(p2.dead.reason))
      return -1
  }
  return p2.id - p1.id
}

const deadReasonPriority = (reason: string): number => {
  switch (reason) {
    case 'ATTACK':
    case 'DIVINED':
    case 'MISRABLE':
      return 2
    case 'EXECUTE':
    case 'SUDDEN':
      return 1
    default:
      return 0
  }
}
</script>
