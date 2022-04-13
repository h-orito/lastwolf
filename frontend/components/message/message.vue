<template>
  <div class="village-message message-border" :class="messageClass">
    <div v-if="image" class="message-image-area" @click="filter">
      <img :src="imgUrl" :width="imgWidth" :height="imgHeight" />
    </div>
    <div class="message-content-area">
      <div class="message-speaker-time-area">
        <span class="message-speaker">{{ fromName }}</span
        ><span v-if="messageType" class="message-type">{{ messageType }}</span
        ><span class="message-time">{{ messageTime }}</span>
      </div>
      <div class="message-text-area">
        <span
          class="message-content"
          :class="message.content.strong ? 'message-strong' : ''"
          >{{ message.content.text }}</span
        >
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'nuxt-property-decorator'
import device from '@nuxtjs/device'
import dayjs from 'dayjs'
import Message from '~/@types/message'
import { MESSAGE_TYPE } from '~/consts/consts'
import CharaImage from '~/@types/chara-image'

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

  private get fromName(): string {
    if (this.message.from) return this.message.from.chara.name.name
    if (this.message.content.type.code === MESSAGE_TYPE.CREATOR_SAY)
      return '村建て'
    return 'システム'
  }

  private get messageTime(): string {
    if (this.isPrologue || this.isEpilogue) {
      return dayjs
        .unix(this.message.time.unix_time_milli / 1000)
        .format('HH:mm')
    }
    const startDatetime = dayjs(this.start, 'YYYY/MM/DD HH:mm:ss')
    const mesDatetime = dayjs.unix(this.message.time.unix_time_milli / 1000)
    return `${mesDatetime.diff(startDatetime, 'second')}秒` // ミリ秒を秒に変換
  }

  private get messageClass(): string[] {
    const classNames: string[] = []
    if (isWolfMessage(this.message)) classNames.push('has-text-danger')
    else if (isMasonMessage(this.message)) classNames.push('has-text-success')
    else if (isGraveMessage(this.message)) classNames.push('has-text-info')
    else if (isCreatorMessage(this.message)) classNames.push('message-black')
    if (this.color) classNames.push(this.color)
    if (this.$device.isDesktopOrTablet) classNames.push('is-size-6')
    return classNames
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
      case MESSAGE_TYPE.PRIVATE_FOX:
        return '[狐]'
      case MESSAGE_TYPE.GRAVE_SAY:
        return '[墓]'
      default:
        return ''
    }
  }

  private get image(): CharaImage | null {
    const map: Map<number, CharaImage> = this.$store.getters.participantIdImgMap
    if (!this.message.from) return null
    return map.get(this.message.from.id) || null
  }

  private get imgUrl(): string {
    return this.image!.image_url
  }

  private get imgWidth(): number {
    if (this.$device.isMobile) return this.image!.width / 2
    else return this.image!.width
  }

  private get imgHeight(): number {
    if (this.$device.isMobile) return this.image!.height / 2
    else return this.image!.height
  }

  private filter(): void {
    this.$emit('filter', {
      participantId: this.message.from?.id
    })
  }
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

const isCreatorMessage = (message: Message): boolean => {
  return message.content.type.code === MESSAGE_TYPE.CREATOR_SAY
}
</script>
