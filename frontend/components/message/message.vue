<template>
  <p class="village-message is-size-7" :class="messageClass">
    <span class="message-speaker">{{
      message.from ? message.from.chara.name.name : 'システム'
    }}</span
    >:&nbsp;
    <span
      class="message-content"
      :class="message.content.strong ? 'message-strong' : ''"
      >{{ message.content.text }}</span
    ><span v-if="messageType" class="message-type">{{ messageType }}</span
    ><span class="message-time">{{ messageTime }}</span>
  </p>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'nuxt-property-decorator'
import dayjs from 'dayjs'
import Message from '~/@types/message'
import { MESSAGE_TYPE } from '~/consts/consts'

@Component({
  components: {}
})
export default class MessageV extends Vue {
  @Prop({ type: Object })
  private message!: Message

  @Prop({ type: String })
  private start!: string

  @Prop({ type: Boolean })
  private isPrologue!: boolean

  @Prop({ type: Boolean })
  private isEpilogue!: boolean

  @Prop({ type: String })
  private color!: string | null

  private get messageTime(): string {
    if (this.isPrologue || this.isEpilogue) {
      return dayjs().format('HH:mm')
    }
    const startDatetime = dayjs(this.start, 'YYYY/MM/DD HH:mm:ss')
    const mesDatetime = dayjs.unix(this.message.time.unix_time_milli / 1000)
    return `${mesDatetime.diff(startDatetime, 'second')}秒` // ミリ秒を秒に変換
  }

  private get messageClass(): string {
    const system = isSystemMessage(this.message) ? 'message-border' : ''
    const wolfMessage = isWolfMessage(this.message) ? ' has-text-danger' : ''
    const masonMessage = isMasonMessage(this.message) ? ' has-text-success' : ''
    const graveMessage = isGraveMessage(this.message) ? ' has-text-info' : ''
    const color = this.color ? ` ${this.color}` : ''
    return system + wolfMessage + masonMessage + graveMessage + color
  }

  private get messageType(): string {
    const code = this.message.content.type.code
    switch (code) {
      case MESSAGE_TYPE.PUBLIC_SYSTEM:
        return ''
      case MESSAGE_TYPE.PRIVATE_ABILITY:
      case MESSAGE_TYPE.MONOLOGUE_SAY:
        return '[独]'
      case MESSAGE_TYPE.PRIVATE_PSYCHIC:
        return '[霊]'
      case MESSAGE_TYPE.PRIVATE_WEREWOLF:
      case MESSAGE_TYPE.WEREWOLF_SAY:
        return '[狼]'
      case MESSAGE_TYPE.PRIVATE_MASON:
      case MESSAGE_TYPE.MASON_SAY:
        return '[共]'
      case MESSAGE_TYPE.GRAVE_SAY:
        return '[墓]'
      default:
        return ''
    }
  }
}

const isSystemMessage = (message: Message): boolean => {
  const messageTypeCode: string = message.content.type.code
  return [
    MESSAGE_TYPE.PUBLIC_SYSTEM,
    MESSAGE_TYPE.PRIVATE_SYSTEM,
    MESSAGE_TYPE.PRIVATE_ABILITY,
    MESSAGE_TYPE.PRIVATE_PSYCHIC,
    MESSAGE_TYPE.PRIVATE_WEREWOLF,
    MESSAGE_TYPE.PRIVATE_MASON,
    MESSAGE_TYPE.PARTICIPANTS
  ].some(code => code === messageTypeCode)
}

const isWolfMessage = (message: Message): boolean => {
  const messageTypeCode: string = message.content.type.code
  return [MESSAGE_TYPE.PRIVATE_WEREWOLF, MESSAGE_TYPE.WEREWOLF_SAY].some(
    code => code === messageTypeCode
  )
}

const isMasonMessage = (message: Message): boolean => {
  const messageTypeCode: string = message.content.type.code
  return [MESSAGE_TYPE.PRIVATE_MASON, MESSAGE_TYPE.MASON_SAY].some(
    code => code === messageTypeCode
  )
}

const isGraveMessage = (message: Message): boolean => {
  return message.content.type.code === MESSAGE_TYPE.GRAVE_SAY
}
</script>
