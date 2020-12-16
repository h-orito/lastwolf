<template>
  <p v-if="village">
    <span
      v-for="messageLine in currentSituationDescription"
      :key="messageLine.id"
    >
      <span v-html="messageLine"></span><br />
    </span>
  </p>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import dayjs from 'dayjs'
import Village from '~/@types/village'
import VillageDay from '~/@types/village-day'
import { VILLAGE_STATUS, NOONNIGHT_CODE } from '~/consts/consts'

@Component({
  components: {}
})
export default class Progress extends Vue {
  private get village(): Village | null {
    return this.$store.getters.village
  }

  private get currentSituationDescription(): string[] {
    if (!!this.village && isProgress(this.village)) {
      return (
        this.currentDay +
        createCurrentDescription(this.village, this.$store.getters.latestDay)
      )
        .replace(/\n/gm, '<br>')
        .split('<br>')
    } else {
      return createCurrentDescription(
        this.village,
        this.$store.getters.latestDay
      )
        .replace(/\n/gm, '<br>')
        .split('<br>')
    }
  }

  private get currentDay(): string {
    if (!this.village) return ''
    const latestDay: VillageDay = this.$store.getters.latestDay!!
    if (latestDay.epilogue) {
      return `現在 <strong class="is-size-6"> エピローグ </strong>です。\n`
    } else {
      return `現在 <strong class="is-size-6"> ${latestDay.day}日目${latestDay.noon_night.name} </strong>です。\n`
    }
  }
}

const createCurrentDescription = (
  village: Village | null,
  latestDay: VillageDay
): string => {
  if (!village) return ''
  const daychangeDatetime = latestDay.end_datetime
  if (isPrologue(village) && !isFullMember(village)) {
    return `参加者を募集しています。\n参加する方はトップページからログインして参加してください。\n${daychangeDatetime}開始予定です。`
  } else if (isPrologue(village) && isFullMember(village)) {
    return `参加者が集まりました。\n村建てが点呼を開始するまでお待ちください。\n${daychangeDatetime}開始予定です。`
  } else if (isRollcalling(village) && !isAllRollcall(village)) {
    return `点呼中です。\n参加者は準備完了ボタンを押してお待ちください。\n${daychangeDatetime}開始予定です。`
  } else if (isRollcalling(village) && isAllRollcall(village)) {
    return `全員準備が完了しました。\n村建てが村を開始するまでお待ちください。\n${daychangeDatetime}開始予定です。`
  } else if (isProgress(village) && isNight(latestDay)) {
    return '夜時間です。\n能力者は能力を行使してください。\n残り時間がなくなったら夜が明けます。'
  } else if (isProgress(village) && isNoon(latestDay)) {
    return `昼時間です。\n議論で怪しい人を見つけましょう。\n残り時間がなくなったら投票に移ります。`
  } else if (isProgress(village) && isFirstVote(latestDay)) {
    return `投票時間です。\n人狼と思わしき人に投票しましょう。\n全員が投票すると夜に移ります。`
  } else if (isProgress(village) && isSecondVote(latestDay)) {
    return `2回目の投票です。\n人狼と思わしき人に投票しましょう。\n全員が投票すると夜に移ります。`
  } else if (isProgress(village) && isLastVote(latestDay)) {
    return `3回目の投票です。\n人狼と思わしき人に投票しましょう。\nこの投票で処刑者が決定しないと引き分けとなります。`
  } else if (isEpilogue(village)) {
    return `決着がつきました。感想等を語り合いましょう。\n${daychangeDatetime}に村が終了します。`
  } else if (isComplete(village)) {
    return `この村は終了しました。`
  } else if (isCanceled(village)) {
    return `この村は廃村しました。`
  } else {
    return ''
  }
}

const isPrologue = (village: Village): boolean =>
  village.status.code === VILLAGE_STATUS.PROLOGUE

const isRollcalling = (village: Village): boolean =>
  village.status.code === VILLAGE_STATUS.ROLLCALLING

const isProgress = (village: Village): boolean =>
  village.status.code === VILLAGE_STATUS.PROGRESS

const isEpilogue = (village: Village): boolean =>
  village.status.code === VILLAGE_STATUS.EPILOGUE

const isComplete = (village: Village): boolean =>
  village.status.code === VILLAGE_STATUS.COMPLETE

const isCanceled = (village: Village): boolean =>
  village.status.code === VILLAGE_STATUS.CANCEL

const isNoon = (villageDay: VillageDay): boolean =>
  villageDay.noon_night.code === NOONNIGHT_CODE.NOON

const isNight = (villageDay: VillageDay): boolean =>
  villageDay.noon_night.code === NOONNIGHT_CODE.NIGHT

const isFirstVote = (villageDay: VillageDay): boolean =>
  villageDay.noon_night.code === NOONNIGHT_CODE.VOTE_FIRST

const isSecondVote = (villageDay: VillageDay): boolean =>
  villageDay.noon_night.code === NOONNIGHT_CODE.VOTE_SECOND

const isLastVote = (villageDay: VillageDay): boolean =>
  villageDay.noon_night.code === NOONNIGHT_CODE.VOTE_THIRD

const isFullMember = (village: Village): boolean => {
  const min = village.setting.capacity.min
  return min === village.participants.count
}

const isAllRollcall = (village: Village): boolean => {
  if (!village) return false
  return (
    village.participants.member_list.filter(p => p.done_roll_call).length >=
    village.participants.count - 1
  )
}
</script>
