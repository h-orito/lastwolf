<template>
  <b-field>
    <b-input
      placeholder="発言を入力しEnterで送信してください"
      icon="comment"
      icon-pack="fas"
      size="is-small"
      v-model="message"
      :disabled="!canSay"
      @keyup.enter.native="say"
      @keypress.enter.native="setCanMessageSubmit()"
    >
    </b-input>
  </b-field>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import * as actionType from '~/store/action-types'
import Village from '~/@types/village'
import SituationAsParticipant from '~/@types/situation-as-participant'
import VillageDay from '~/@types/village-day'
import { NOONNIGHT_CODE, MESSAGE_TYPE } from '~/consts/consts'

@Component({
  components: {}
})
export default class MessageInput extends Vue {
  private canMessageSubmit: boolean = false
  private message: string = ''

  private setCanMessageSubmit(): void {
    this.canMessageSubmit = true
  }

  private get canSubmit(): boolean {
    const mes = this.message.trim()
    return mes.length > 0 || mes.length <= 200
  }

  private get village(): Village | null {
    return this.$store.getters.village
  }

  private get situation(): SituationAsParticipant | null {
    return this.$store.getters.situation
  }

  private get villageId(): number {
    if (!this.village) return 0
    return this.village!.id
  }

  private get messageType(): string {
    if (!this.village || !this.situation || !this.situation.say.available_say)
      return ''
    const selectable = this.situation.say.selectable_message_type_list
    if (selectable.some(type => type.code === MESSAGE_TYPE.WEREWOLF_SAY)) {
      return MESSAGE_TYPE.WEREWOLF_SAY
    } else if (selectable.some(type => type.code === MESSAGE_TYPE.NORMAL_SAY)) {
      return MESSAGE_TYPE.NORMAL_SAY
    } else if (selectable.some(type => type.code === MESSAGE_TYPE.GRAVE_SAY)) {
      return MESSAGE_TYPE.GRAVE_SAY
    } else if (
      selectable.some(type => type.code === MESSAGE_TYPE.MONOLOGUE_SAY)
    ) {
      return MESSAGE_TYPE.MONOLOGUE_SAY
    }
    return ''
  }

  private get canSay(): boolean {
    if (!this.situation) return false
    return (
      this.situation.say.available_say &&
      this.situation.say.selectable_message_type_list.length > 0
    )
  }

  private async say(): Promise<void> {
    if (!this.canSubmit) {
      return
    }
    const mes = this.message.trim().substring(0, 200)
    if (!this.canMessageSubmit) {
      return
    }
    this.canMessageSubmit = false
    this.message = ''
    await this.$axios.$post(`/village/${this.villageId}/say`, {
      message: mes,
      message_type: this.messageType,
      strong: false
    })
  }
}
</script>

<style lang="scss" scoped></style>
