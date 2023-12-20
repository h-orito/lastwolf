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
        <alive-participants
          @filter="filteringOrCancel"
          :day="day"
          :filtering-id="filteringId"
        />
        <div>
          <form-switch
            rules="required"
            label-message=""
            description="強調発言のみ表示"
            :input-value.sync="shouldFilterByStrong"
          />
        </div>
        <hr class="m-t-10 m-b-10" />
        <message-input />
        <day-messages
          :day="day"
          :filtering-id="filteringId"
          :should-filter-by-strong="shouldFilterByStrong"
          @filter="filteringOrCancel"
        />
      </b-tab-item>
    </b-tabs>
  </b-message>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import messageInput from '~/components/message-input/message-input.vue'
import dayMessages from '~/components/message/day-messages.vue'
import aliveParticipants from '~/components/message/alive-participants.vue'
import Village from '~/@types/village'
import VillageDay from '~/@types/village-day'

@Component({
  components: {
    messageInput,
    dayMessages,
    aliveParticipants,
    formSwitch: () => import('~/components/form/validation/form-switch.vue')
  }
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
    if (day.is_epilogue) return 'エピローグ'
    if (!!this.village && this.village.days.list.some(d => d.is_epilogue)) {
      const epilogueDayId = this.village.days.list.find(d => d.is_epilogue)!!.id
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

  private filteringId: number | null = null
  private shouldFilterByStrong: boolean = false
  private filtering({ participantId }): void {
    this.filteringId = participantId
  }

  private filteringOrCancel({ participantId }): void {
    if (this.filteringId === participantId) this.filteringId = null
    else
      this.filtering({
        participantId
      })
  }
}
</script>
