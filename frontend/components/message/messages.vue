<template>
  <b-message
    type="is-dark"
    size="is-small"
    title="チャット"
    class="messages"
    :closable="false"
  >
    <b-field>
      <b-button
        size="is-small"
        :type="filteringId ? 'is-warning' : 'is-secondary'"
        expanded
        @click="openSelectModal"
        >{{ filterButtonStr }}</b-button
      >
      <b-button
        size="is-small"
        :type="filteringId ? 'is-primary' : 'is-secondary'"
        :disabled="!filteringId"
        @click="refreshFilter"
        >抽出解除</b-button
      >
    </b-field>
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
        <day-messages
          :day="day"
          :filtering-id="filteringId"
          @filter="filteringOrCancel"
        />
      </b-tab-item>
    </b-tabs>
    <b-modal
      :active.sync="isOpenSelectModal"
      has-modal-card
      trap-focus
      aria-role="dialog"
      aria-modal
    >
      <participant-select-modal
        :participants="village ? village.participants.member_list : []"
        @close="closeSelectModal"
        @participant-select="filtering"
      />
    </b-modal>
  </b-message>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import messageInput from '~/components/message-input/message-input.vue'
import dayMessages from '~/components/message/day-messages.vue'
import Village from '~/@types/village'
import VillageDay from '~/@types/village-day'

@Component({
  components: {
    messageInput,
    dayMessages,
    participantSelectModal: () =>
      import('~/components/action/participant-select-modal.vue')
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

  private isOpenSelectModal: boolean = false
  private openSelectModal(): void {
    this.isOpenSelectModal = true
  }

  private closeSelectModal(): void {
    this.isOpenSelectModal = false
  }

  private filteringId: number | null = null
  private get filterButtonStr(): string {
    if (!this.filteringId) return '個人抽出'
    const name = this.village!.participants.member_list.find(
      m => m.id === this.filteringId
    )!.chara.name.name
    return `個人抽出（抽出中: ${name}）`
  }

  private filtering({ participantId }): void {
    this.closeSelectModal()
    this.filteringId = participantId
  }

  private refreshFilter(): void {
    this.filteringId = null
  }

  private filteringOrCancel({ participantId }): void {
    if (this.filteringId === participantId) this.refreshFilter()
    else
      this.filtering({
        participantId
      })
  }
}
</script>
