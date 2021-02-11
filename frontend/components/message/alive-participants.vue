<template>
  <div class="alive-participants">
    <strong>{{ filteringStr }}</strong
    ><br />
    <div
      class="alive-participant"
      v-for="participant in aliveParticipants"
      :key="participant.id"
      @click="filter(participant.id)"
    >
      <img
        :src="participant.chara.image.image_url"
        :width="participant.chara.image.width * 0.67"
        :height="participant.chara.image.height * 0.67"
      />
      <p>{{ `${messageCount(participant)}回` }}</p>
    </div>
    <hr class="m-t-10 m-b-10" />
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'nuxt-property-decorator'
import Village from '~/@types/village'
import VillageParticipant from '~/@types/village-participant'
import VillageDay from '~/@types/village-day'
import Message from '~/@types/message'

@Component({
  components: {}
})
export default class AliveParticipantsV extends Vue {
  @Prop({ type: Object })
  private day!: VillageDay

  @Prop({ type: Number })
  private filteringId!: number | null

  private get village(): Village | null {
    return this.$store.getters.village
  }

  private get aliveParticipants(): VillageParticipant[] {
    if (!this.village) return []
    if (this.filteringId) {
      return this.village.participants.member_list.filter(p => {
        return p.id === this.filteringId
      })
    }
    if (this.day.epilogue) {
      // エピローグは全員
      return this.village.participants.member_list
    }
    return this.village.participants.member_list.filter(p => {
      return !p.dead || p.dead.village_day.id > this.day.id
    })
  }

  private get filteringStr(): string {
    if (!this.filteringId) return '個人抽出'
    const name = this.village!.participants.member_list.find(
      m => m.id === this.filteringId
    )!.chara.name.name
    return `個人抽出（抽出中: ${name}）（再クリックで解除）`
  }

  private get dayMessages(): Message[] {
    let messages: Message[] = []
    if (!this.day.epilogue && this.isNight) {
      messages = this.$store.getters.nightMessages.filter(
        m => m.time.village_day_id === this.day.id
      )
    } else {
      messages = this.$store.getters.noonMessages.filter(
        m => m.time.village_day_id === this.day.id
      )
    }

    return messages
  }

  private get isNight(): boolean {
    return this.day.noon_night.code === 'NIGHT'
  }

  private messageCount(participant: VillageParticipant): number {
    return this.dayMessages.filter(m => m.from?.id === participant.id).length
  }

  private filter(participantId: number): void {
    this.$emit('filter', {
      participantId
    })
  }
}
</script>
