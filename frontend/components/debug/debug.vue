<template>
  <b-message
    type="is-dark"
    size="is-small"
    title="デバッグ"
    class="debug"
    :closable="false"
  >
    <b-field>
      <b-button type="is-primary" size="is-small" @click="fetchDebugVillage"
        >村取得</b-button
      >
    </b-field>
    <b-field label="ダミーログイン" label-position="on-border">
      <b-select
        v-model="playerId"
        :disabled="!village"
        expanded
        size="is-small"
      >
        <option
          v-for="player in playerList"
          :value="player.player_id"
          :key="player.player_id"
          >{{ player.name }}</option
        >
      </b-select>
      <p class="control">
        <button
          class="button is-primary is-small"
          :disabled="!village"
          @click="dummyLogin"
        >
          でログインする
        </button>
      </p>
    </b-field>
    <b-field label="参加させる" label-position="on-border">
      <b-select
        v-model="participateCharaNum"
        :disabled="!isPrologue"
        expanded
        size="is-small"
      >
        <option
          v-for="num in participateMemberNumList"
          :value="num"
          :key="num"
          >{{ `${num}人` }}</option
        >
      </b-select>
      <p class="control">
        <button
          :disabled="!isPrologue"
          class="button is-primary is-small"
          @click="debugParticipate"
        >
          参加させる
        </button>
      </p>
    </b-field>
    <b-field>
      <b-button
        type="is-primary"
        size="is-small"
        :disabled="!village"
        @click="allRollcall"
        >全員点呼</b-button
      >
    </b-field>
    <b-field>
      <b-button
        type="is-primary"
        size="is-small"
        :disabled="!village"
        @click="changeDay"
        >残り30秒にする</b-button
      >
    </b-field>
    <b-field>
      <b-button
        type="is-primary"
        size="is-small"
        class="m-t-10"
        :disabled="!isVoteTime"
        @click="allDrawVote"
        >引分投票</b-button
      >
      <b-button
        type="is-primary"
        size="is-small"
        class="m-l-10 m-t-10"
        :disabled="!isVoteTime"
        @click="allRandomVote"
        >ランダム投票</b-button
      >
    </b-field>
    <b-field>
      <b-button
        type="is-danger"
        size="is-small"
        class="m-t-10"
        @click="allDelete"
        >メッセージ削除</b-button
      >
    </b-field>
  </b-message>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import Village from '~/@types/village'
import DebugVillage from '~/@types/debug-village'
import VillageParticipant from '~/@types/village-participant'
import { VILLAGE_STATUS } from '~/consts/consts'
import * as actionType from '~/store/action-types'

@Component({
  components: {}
})
export default class Debug extends Vue {
  private village: DebugVillage | null = null
  private playerId: number = 0
  private participateCharaNum: number = 0

  private get isPrologue(): boolean {
    if (!this.village) return false
    return this.village.status.code === VILLAGE_STATUS.PROLOGUE
  }

  private async fetchDebugVillage(): Promise<void> {
    const villageId = this.$store.getters.villageId
    this.village = await this.$axios.$get(`/admin/village/${villageId}`)
    this.playerId = this.playerList[0].player_id
    this.participateCharaNum = this.participateMemberNumList[0]
  }

  private get playerList(): Array<Player> {
    if (!this.village) return []
    const list: Player[] = []
    for (let i = 1; i <= 18; i++) {
      const participant = this.village.participants.member_list.find(
        p => p.player!.id === i
      )
      list.push({
        name: participant
          ? this.dummyLoginCharaName(participant)
          : `未参加: player_id: ${i}`,
        player_id: i
      })
    }
    return list
  }

  private get participateMemberNumList(): Array<number> {
    if (!this.village) return []
    const min = this.village.setting.capacity.min - 1
    const max = this.village.setting.capacity.max - 1
    const list: number[] = []
    for (let i = min; i <= max; i++) {
      list.push(i)
    }
    return list
  }

  /** キャラ名と、開始後は役職名 */
  private dummyLoginCharaName(participant: VillageParticipant): string {
    if (participant.skill == null) {
      return participant.chara.name.full_name
    } else {
      return `${participant.chara.name.full_name}: ${participant.skill.name}`
    }
  }

  /** 選択したキャラでログインして表示 */
  private async dummyLogin(): Promise<void> {
    await this.$axios.$post(`/admin/village/${this.village!.id}/dummy-login`, {
      target_id: this.playerId
    })
    location.reload()
  }

  /** N名参加させる */
  private async debugParticipate(): Promise<void> {
    await this.$axios.$post(`/admin/village/${this.village!.id}/participate`, {
      participate_count: this.participateCharaNum
    })
  }

  private async allRollcall(): Promise<void> {
    await this.$axios.$post(`/admin/village/${this.village!.id}/all-rollcall`)
  }

  private async changeDay(): Promise<void> {
    await this.$axios.$post(`/admin/village/${this.village!.id}/change-day`)
  }

  private allDelete() {
    this.$store.dispatch(actionType.DELETE_MESSAGE, {
      villageId: 1
    })
  }

  private async allDrawVote(): Promise<void> {
    await this.$axios.$post(`/admin/village/${this.village!.id}/all-draw-vote`)
  }

  private async allRandomVote(): Promise<void> {
    await this.$axios.$post(
      `/admin/village/${this.village!.id}/all-random-vote`
    )
  }

  private get isVoteTime(): boolean {
    return (
      !!this.village &&
      this.village.days.list[
        this.village.days.list.length - 1
      ].noon_night.code.startsWith('VOTE')
    )
  }
}

interface Player {
  name: string
  player_id: number
}
</script>

<style lang="scss" scoped></style>
