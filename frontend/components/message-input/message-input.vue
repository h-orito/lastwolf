<template>
  <b-field>
    <b-input
      :custom-class="messageBgColorClass"
      :placeholder="placeholder"
      icon="comment"
      icon-pack="fas"
      size="is-small"
      v-model="message"
      :disabled="!canSay"
      expanded
      @keypress.enter.native="keypressEnter"
      @keyup.enter.exact.native="keyupEnter"
      @keyup.enter.shift.native="strongSay"
    >
    </b-input>
    <b-checkbox-button
      v-model="strong"
      size="is-small"
      :disabled="!canSay"
      :native-value="true"
      type="is-primary"
    >
      <b-icon pack="fas" icon="bold"></b-icon>
      <span>強調</span>
    </b-checkbox-button>
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
  private strong: boolean = false

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
    } else if (selectable.some(type => type.code === MESSAGE_TYPE.MASON_SAY)) {
      return MESSAGE_TYPE.MASON_SAY
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

  private get messageBgColorClass(): string {
    const type = this.messageType
    switch (type) {
      case MESSAGE_TYPE.WEREWOLF_SAY:
        return 'werewolf-message-bg'
      case MESSAGE_TYPE.MASON_SAY:
        return 'mason-message-bg'
      case MESSAGE_TYPE.GRAVE_SAY:
        return 'grave-message-bg'
      case MESSAGE_TYPE.MONOLOGUE_SAY:
        return 'monologue-message-bg'
      default:
        return ''
    }
  }

  private get placeholder(): string {
    const type = this.messageType
    switch (type) {
      case MESSAGE_TYPE.WEREWOLF_SAY:
        return '人狼同士にしか聞こえない会話が可能です。'
      case MESSAGE_TYPE.MASON_SAY:
        return '共有者同士にしか聞こえない会話が可能です。'
      case MESSAGE_TYPE.GRAVE_SAY:
        return '死者同士にしか聞こえない会話が可能です。'
      case MESSAGE_TYPE.MONOLOGUE_SAY:
        return '自分にしか見えない発言が可能です。'
      default:
        return 'Enterで発言、Shift+Enterで強調発言できます。'
    }
  }

  private get canSay(): boolean {
    if (!this.situation) return false
    return (
      this.situation.say.available_say &&
      this.situation.say.selectable_message_type_list.length > 0
    )
  }

  private keypressEnter(): void {
    this.canMessageSubmit = true
  }

  private keyupEnter(e: any): void {
    // 日本語確定のEnterはスキップ
    if (!this.canMessageSubmit) {
      return
    }
    this.say()
    e.preventDefault()
  }

  private async strongSay(e: any): Promise<void> {
    // 日本語確定のEnterはスキップ
    if (!this.canMessageSubmit) {
      return
    }
    this.strong = true
    await this.say()
    e.preventDefault()
  }

  private async say(): Promise<void> {
    if (!this.canSubmit) {
      return
    }
    const mes = this.message.trim().substring(0, 200)
    this.canMessageSubmit = false
    this.message = ''
    const isStrong = this.strong
    this.strong = false
    await this.$axios.$post(`/village/${this.villageId}/say`, {
      message: mes,
      message_type: this.messageType,
      strong: isStrong
    })
  }
}
</script>

<style lang="scss">
.werewolf-message-bg {
  background-color: $werewolf-say !important;
}
.mason-message-bg {
  background-color: $mason-say !important;
}
.grave-message-bg {
  background-color: $grave-say !important;
}
.monologue-message-bg {
  background-color: $monologue-say !important;
}
</style>
