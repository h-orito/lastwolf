<template>
  <section class="section">
    <div class="container" v-if="!loadingRecords && playerRecords">
      <h1 class="title is-5 m-b-30" v-if="playerName">{{ playerName }}</h1>
      <div class="content m-b-30">
        <h2 class="title is-size-6">総合戦績</h2>
        <p class="is-size-7">{{ wholeResult }}</p>
      </div>
      <div class="content m-b-30">
        <h2 class="title is-size-6">陣営戦績</h2>
        <camp-records :camp-records="playerRecords.camp_record_list" />
      </div>
      <div class="content m-b-30">
        <h2 class="title is-size-6">役職戦績</h2>
        <skill-records :skill-records="playerRecords.skill_record_list" />
      </div>
      <div class="content m-b-30">
        <h2 class="title is-size-5">参加した村</h2>
        <participate-village-list
          :participate-village-list="playerRecords.participate_village_list"
        />
      </div>
    </div>
    <div class="column is-6"></div>
  </section>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
// components
// type
import PlayerRecords from '~/@types/player-records'
import CampRecord from '~/@types/camp-record'
import SkillRecord from '~/@types/skill-record'
import ParticipateVillage from '~/@types/participate-village'
import MyselfPlayer from '~/@types/myself-player'

@Component({
  components: {
    campRecords: () => import('~/components/record/camp-records.vue'),
    skillRecords: () => import('~/components/record/skill-records.vue'),
    participateVillageList: () =>
      import('~/components/record/participate-village-list.vue')
  },
  asyncData({ query }) {
    return { playerId: query.id }
  }
})
export default class extends Vue {
  /** head */
  private head() {
    return { title: ' | 戦績' }
  }

  /** data */
  private playerId: number = 0
  private playerRecords: PlayerRecords | null = null
  private loadingRecords: boolean = false

  /** computed */
  private get playerName(): string {
    if (this.loadingRecords || !this.playerRecords) return ''
    const player = this.playerRecords.player
    return `${player.nickname}@${player.twitter_user_name}`
  }

  private get wholeResult(): string {
    if (!this.playerRecords) return ''
    const record = this.playerRecords.whole_record
    return `${record.win_count}勝 ${record.lose_count}負 ${
      record.draw_count
    }分 (${record.win_rate * 100}%/${record.lose_rate *
      100}%/${record.draw_rate * 100}%)`
  }

  /** created */
  private async created(): Promise<any> {
    await this.loadRecord()
  }

  /** methods */
  private async loadRecord(): Promise<void> {
    this.loadingRecords = true
    try {
      this.playerRecords = await this.$axios.$get(
        `/player/${this.playerId}/record`
      )
    } catch (error) {}
    this.loadingRecords = false
  }
}
</script>

<style lang="scss" scoped>
.chart-container {
  position: relative;
}
.b-table {
  overflow: auto;
  white-space: nowrap;
}
</style>
