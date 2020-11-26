<template>
  <div class="message-area">
    <message
      v-for="m in messages"
      :key="m.key"
      :message="m"
      :start="day.start_datetime"
      :is-prologue="isPrologue"
      :is-epilogue="day.epilogue"
    />
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'nuxt-property-decorator'
import message from '~/components/message/message.vue'
import Village from '~/@types/village'
import VillageDay from '~/@types/village-day'
import Message from '~/@types/message'
import { NOONNIGHT_CODE } from '~/consts/consts'

@Component({
  components: { message }
})
export default class Messages extends Vue {
  @Prop({ type: Object })
  private day!: VillageDay

  private get isNight(): boolean {
    return this.day.noon_night.code === 'NIGHT'
  }

  private get isPrologue(): boolean {
    return (
      this.day.day === 1 && this.day.noon_night.code === NOONNIGHT_CODE.NOON
    )
  }

  private get messages(): Message[] {
    if (this.isNight) {
      return this.$store.getters.nightMessages.filter(
        m => m.time.village_day_id === this.day.id
      )
    } else {
      return this.$store.getters.noonMessages.filter(
        m => m.time.village_day_id === this.day.id
      )
    }
  }
}
</script>
