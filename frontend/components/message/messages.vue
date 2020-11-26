<template>
  <b-message
    type="is-dark"
    size="is-small"
    title="チャット"
    class="messages"
    :closable="false"
  >
    <b-tabs
      size="is-small"
      type="is-toggle"
      expanded
      multiline
      v-model="tabId"
      :animated="false"
    >
      <b-tab-item
        v-for="day in days"
        :key="day.id"
        :value="day.id"
        :label="dayLabel(day)"
        :icon="dayIcon(day)"
        icon-pack="fas"
      >
        <message-input />
        <hr class="m-t-5 m-b-5" />
        <day-messages :day="day" />
      </b-tab-item>
    </b-tabs>
  </b-message>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import messageInput from '~/components/message-input/message-input.vue'
import dayMessages from '~/components/message/day-messages.vue'
import Village from '~/@types/village'
import VillageDay from '~/@types/village-day'

@Component({
  components: { messageInput, dayMessages }
})
export default class Messages extends Vue {
  private tabId: number =
    this.days.length === 0 ? 0 : this.days[this.days.length - 1].id

  private get village(): Village | null {
    return this.$store.getters.village
  }

  private get days(): VillageDay[] {
    if (!this.village) return []
    return this.village.days.list.filter(
      d => !d.noon_night.code.startsWith('VOTE')
    )
  }

  private dayLabel(day: VillageDay): string {
    if (day.epilogue) return 'エピローグ'
    if (!!this.village && this.village.days.list.some(d => d.epilogue)) {
      const epilogueDayId = this.village.days.list.find(d => d.epilogue)!!.id
      if (day.id > epilogueDayId) return '終了'
    }

    const noonNight = day.noon_night.name
    const dayNum = day.day
    return `${dayNum}日目${noonNight}`
  }

  private dayIcon(day: VillageDay): string {
    return day.noon_night.code === 'NOON' ? 'sun' : 'moon'
  }

  private openLatestday(): void {
    this.tabId = this.days[this.days.length - 1].id
  }
}
</script>
