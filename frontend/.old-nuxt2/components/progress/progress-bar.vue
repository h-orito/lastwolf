<template>
  <div v-if="village && isProgress" class="progress-bar">
    <strong>{{ timeName }}</strong>
    <b-progress
      size="is-small"
      :type="
        isSilentTime
          ? 'is-secondary'
          : left > 60
          ? 'is-success'
          : left > 30
          ? 'is-warning'
          : 'is-danger'
      "
      :value="left"
      :max="interval"
      show-value
      >残り{{ left }}秒</b-progress
    >
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import dayjs from 'dayjs'
import Village from '~/@types/village'
import { VILLAGE_STATUS, NOONNIGHT_CODE } from '~/consts/consts'
import SituationAsParticipant from '~/@types/situation-as-participant'

@Component({
  components: {}
})
export default class Progress extends Vue {
  private interval: number = 0
  private left: number = 0
  private isSilentTime: boolean = false

  private get village(): Village | null {
    return this.$store.getters.village
  }

  private get isProgress(): boolean {
    return (
      !!this.village && this.village.status.code === VILLAGE_STATUS.PROGRESS
    )
  }

  private get timeName(): string {
    if (!this.village) return ''
    const code = this.$store.getters.latestDay.noon_night.code
    if (code === NOONNIGHT_CODE.NOON) {
      return this.isSilentTime ? '議論時間（沈黙時間中）' : '議論時間'
    } else if (code === NOONNIGHT_CODE.NIGHT) {
      return '夜時間'
    } else {
      return '投票時間'
    }
  }

  private refreshTimer(): void {
    if (!this.village || !this.isProgress) return

    const latestDay = this.$store.getters.latestDay!!
    const start = dayjs(latestDay.start_datetime, 'YYYY/MM/DD HH:mm:ss')
    const end = dayjs(latestDay.end_datetime, 'YYYY/MM/DD HH:mm:ss')
    this.interval = end.diff(start, 'second') // ミリ秒を秒に変換

    const now = dayjs()
    const diff = end.diff(now, 'second') // ミリ秒を秒に変換
    this.left = diff < 0 ? 0 : diff

    this.isSilentTime = false
    const silentSeconds = this.village.setting.rules.silent_seconds
    if (
      silentSeconds != null &&
      latestDay.noon_night.code === NOONNIGHT_CODE.NOON
    ) {
      const silentEnd = start.add(silentSeconds, 'second')
      this.isSilentTime = now.isBefore(silentEnd)
    }

    // 残り0秒を切っていたら定期的に更新チェック
    this.checkDaychangeIfNeeded(diff)
  }

  // 残り0秒を切っていたら定期的に更新チェック
  // [何番目の参加者か] === [mod(過ぎた秒数,参加人数)]のときにAPIを叩く
  private checkDaychangeIfNeeded(diff: number): void {
    if (diff >= 0 || !this.situation || !this.situation.participate.myself)
      return
    // 何番目の参加者か
    const index = this.village!.participants.member_list.findIndex(
      p => p.id === this.situation!.participate.myself!.id
    )
    const mod = (-1 * diff) % this.village!.participants.count
    if (index !== mod) return
    this.$axios.$post(`/village/${this.village!.id}/daychange-check`)
  }

  private get situation(): SituationAsParticipant | null {
    return this.$store.getters.situation
  }
}
</script>
