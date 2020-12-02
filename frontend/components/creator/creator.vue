<template>
  <b-message
    type="is-dark"
    size="is-small"
    title="村建て機能"
    class="creator"
    :closable="false"
  >
    <div v-if="isPrologue" class="m-b-10">
      <strong>設定変更</strong><br />
      <b-field>
        <p class="control has-text-right">
          <b-button
            :to="{ path: '/village-setting', query: { id: village.id } }"
            tag="nuxt-link"
            type="is-primary"
            size="is-small"
          >
            村の設定を変更する
          </b-button>
        </p>
      </b-field>
    </div>
    <div v-if="isPrologue" class="m-b-10">
      <strong>キック</strong><br />
      <b-field>
        <b-select
          v-model="participantId"
          :disabled="!canKick"
          expanded
          size="is-small"
        >
          <option
            v-for="participant in participants"
            :value="participant.id"
            :key="participant.id"
            >{{ participant.chara.name.name }}</option
          >
        </b-select>
        <p class="control">
          <b-button
            type="is-danger"
            size="is-small"
            :disabled="!canKick"
            @click="confirmKick"
            >退村させる</b-button
          >
        </p>
      </b-field>
    </div>
    <div class="m-b-10" v-if="isPrologue || isRollcalling">
      <strong>点呼</strong><br />
      <p>点呼を開始し、全員が点呼すると村を開始することができます。</p>
      <b-button
        type="is-primary"
        size="is-small"
        :disabled="!canStartRollcall"
        @click="startRollcall"
        >点呼を開始する</b-button
      ><b-button
        type="is-danger"
        size="is-small"
        :disabled="!canCancelRollcall"
        @click="cancelRollcall"
        >点呼を中止する</b-button
      >
    </div>
    <div v-if="isPrologue || isRollcalling">
      <strong>村の開始/廃村</strong><br />
      <p v-if="isRollcalling">{{ currentDoneRollcallCount }}</p>
      <b-button
        type="is-primary"
        size="is-small"
        :disabled="!canStartVillage"
        @click="startVillage"
        >村を開始する</b-button
      ><b-button
        type="is-danger"
        size="is-small"
        :disabled="!canCancelVillage"
        @click="confirmCancelVillage"
        >廃村する（確認）</b-button
      >
    </div>
  </b-message>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import Village from '~/@types/village'
import VillageParticipant from '~/@types/village-participant'
import SituationAsParticipant from '~/@types/situation-as-participant'
import { VILLAGE_STATUS } from '~/consts/consts'

@Component({
  components: {}
})
export default class Creator extends Vue {
  private submitting: boolean = false
  private participantId: number | null = null

  private get villageId(): number {
    const villageId = this.$store.getters.villageId
    return !villageId ? 0 : villageId
  }

  private get village(): Village | null {
    return this.$store.getters.village
  }

  private get isPrologue(): boolean {
    return (
      !!this.village && this.village.status.code === VILLAGE_STATUS.PROLOGUE
    )
  }

  private get isRollcalling(): boolean {
    return (
      !!this.village && this.village.status.code === VILLAGE_STATUS.ROLLCALLING
    )
  }

  private get situation(): SituationAsParticipant | null {
    return this.$store.getters.situation
  }

  private get participants(): VillageParticipant[] {
    if (!this.village) return []
    const dummyCharaId = this.village.setting.charachip.dummy_chara_id
    return this.village.participants.member_list.filter(
      p => p.chara.id !== dummyCharaId
    )
  }

  private get canKick(): boolean {
    return (
      !!this.participantId &&
      !!this.situation &&
      this.situation.creator.available_kick
    )
  }

  private get canStartRollcall(): boolean {
    return (
      !this.submitting &&
      !!this.situation &&
      this.situation.creator.available_start_roll_call
    )
  }

  private get canCancelRollcall(): boolean {
    return (
      !this.submitting &&
      !!this.situation &&
      this.situation.creator.available_cancel_roll_call
    )
  }

  private get canStartVillage(): boolean {
    return (
      !this.submitting &&
      !!this.situation &&
      this.situation.creator.available_start_village
    )
  }

  private get canCancelVillage(): boolean {
    return (
      !this.submitting &&
      !!this.situation &&
      this.situation.creator.available_cancel_village
    )
  }

  private get currentDoneRollcallCount(): string {
    const max = this.village!.participants.count - 1
    const done = this.village!.participants.member_list.filter(
      p => p.done_roll_call
    ).length
    return `点呼済み ${done}/${max}`
  }

  private confirmKick(): void {
    const self = this
    this.$buefy.dialog.confirm({
      title: 'キック確認',
      message: '本当に退村させますか？',
      confirmText: 'キックする',
      type: 'is-danger',
      hasIcon: false,
      iconPack: 'fas',
      onConfirm: async () => {
        await self.kick()
      },
      size: 'is-small',
      cancelText: 'キャンセル'
    })
  }

  private async kick(): Promise<void> {
    this.submitting = true
    try {
      await this.$axios.$post(`/creator/village/${this.villageId}/kick`, {
        target_id: this.participantId
      })
    } catch (error) {
      const code = parseInt(error.response && error.response.status)
      if (code === 404 && error.response.data.status === 499) {
        this.$buefy.toast.open({
          message: error.response.data.message,
          type: 'is-danger',
          position: 'is-top'
        })
      }
    }
    this.submitting = false
  }

  private async startRollcall(): Promise<void> {
    this.submitting = true
    try {
      await this.$axios.$post(
        `/creator/village/${this.villageId}/start-rollcall`
      )
    } catch (error) {
      const code = parseInt(error.response && error.response.status)
      if (code === 404 && error.response.data.status === 499) {
        this.$buefy.toast.open({
          message: error.response.data.message,
          type: 'is-danger',
          position: 'is-top'
        })
      }
    }
    this.submitting = false
  }

  private async cancelRollcall(): Promise<void> {
    this.submitting = true
    try {
      await this.$axios.$post(
        `/creator/village/${this.villageId}/cancel-rollcall`
      )
    } catch (error) {
      const code = parseInt(error.response && error.response.status)
      if (code === 404 && error.response.data.status === 499) {
        this.$buefy.toast.open({
          message: error.response.data.message,
          type: 'is-danger',
          position: 'is-top'
        })
      }
    }
    this.submitting = false
  }

  private async startVillage(): Promise<void> {
    this.submitting = true
    try {
      await this.$axios.$post(
        `/creator/village/${this.villageId}/start-village`
      )
    } catch (error) {
      const code = parseInt(error.response && error.response.status)
      if (code === 404 && error.response.data.status === 499) {
        this.$buefy.toast.open({
          message: error.response.data.message,
          type: 'is-danger',
          position: 'is-top'
        })
      }
    }
    this.submitting = false
  }

  private confirmCancelVillage(): void {
    const self = this
    this.$buefy.dialog.confirm({
      title: '廃村確認',
      message: '本当に廃村しますか？',
      confirmText: '廃村する',
      type: 'is-danger',
      hasIcon: false,
      iconPack: 'fas',
      onConfirm: async () => {
        await self.cancelVillage()
      },
      size: 'is-small',
      cancelText: 'キャンセル'
    })
  }

  private async cancelVillage(): Promise<void> {
    this.submitting = true
    try {
      await this.$axios.$post(`/creator/village/${this.villageId}/cancel`)
    } catch (error) {
      const code = parseInt(error.response && error.response.status)
      if (code === 404 && error.response.data.status === 499) {
        this.$buefy.toast.open({
          message: error.response.data.message,
          type: 'is-danger',
          position: 'is-top'
        })
      }
    }
    this.submitting = false
  }
}
</script>
