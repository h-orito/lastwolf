<template>
  <div class="message-area">
    <message
      v-for="m in messages"
      :key="m.key"
      :message="m"
      :start="day.start_datetime"
      :is-prologue="isPrologue"
      :is-epilogue="day.is_epilogue"
      :color="color(m)"
      @filter="filter($event)"
    />
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'nuxt-property-decorator'
import message from '~/components/message/message.vue'
import Village from '~/@types/village'
import VillageDay from '~/@types/village-day'
import Message from '~/@types/message'
import { NOONNIGHT_CODE } from '~/consts/consts'
import { getColorClass } from '~/components/message/message-color'

@Component({
  components: { message }
})
export default class Messages extends Vue {
  @Prop({ type: Object })
  private day!: VillageDay

  @Prop({ type: Number })
  private filteringId!: number | null

  @Prop({ type: Boolean })
  private shouldFilterByStrong!: boolean

  private get isNight(): boolean {
    return this.day.noon_night.code === 'NIGHT'
  }

  private get isPrologue(): boolean {
    return (
      this.day.day === 1 && this.day.noon_night.code === NOONNIGHT_CODE.NOON
    )
  }

  private get messages(): Message[] {
    let messages: Message[] = []
    if (!this.day.is_epilogue && this.isNight) {
      messages = this.$store.getters.nightMessages.filter(
        m => m.time.village_day_id === this.day.id
      )
    } else {
      messages = this.$store.getters.noonMessages.filter(
        m => m.time.village_day_id === this.day.id
      )
    }

    if (this.filteringId != null) {
      messages = messages.filter(
        m => !!m.from && m.from.id === this.filteringId
      )
    }

    if (this.shouldFilterByStrong) {
      messages = messages.filter(m => m.content.strong)
    }

    return messages
  }

  private get village(): Village | null {
    return this.$store.getters.village
  }

  private color(message: Message): string | null {
    // シスメは色をつけない
    if (!message.from) return null
    // エピ以外の夜は色をつけない
    if (!this.day.is_epilogue && this.isNight) return null
    return getColorClass(this.village!, message.from)
  }

  private filter({ participantId }): void {
    this.$emit('filter', {
      participantId
    })
  }
}
</script>
