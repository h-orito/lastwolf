<template>
  <div
    class="participant has-text-centered m-b-10"
    :style="isDispPlayer ? 'width: 100%' : ''"
  >
    <div v-if="isDispPlayer" style="display: flex;">
      <div class="m-r-10">
        <img
          :src="participant.chara.image.image_url"
          :alt="participant.chara.name.name"
          :class="participant.dead ? 'dead' : ''"
        />
      </div>
      <div style="display: 1;" class="has-text-left">
        <div style="display: flex;">
          <p :class="charaNameClass">
            {{ participant.chara.name.name }}
          </p>
          <p v-if="participant.skill" class="m-l-5">
            {{ participant.skill.name }}
          </p>
          <p v-if="participant.dead" class="has-text-danger m-l-5">
            {{
              `${participant.dead.village_day.day}d${participant.dead.reason}`
            }}
          </p>
          <p v-if="isFirstVictim" class="m-l-5">ダミー</p>
        </div>
        <p>
          {{
            `${participant.player.nickname}@${participant.player.twitter_user_name}`
          }}
        </p>
        <div class="m-t-5">
          <b-button
            tag="nuxt-link"
            :to="{
              path: '/player-record',
              query: { id: participant.player.id }
            }"
            target="_blank"
            size="is-small"
            icon-pack="fas"
            icon-left="chart-bar"
            type="is-primary"
            >戦績</b-button
          >
          <b-button
            tag="a"
            :href="
              `https://twitter.com/${participant.player.twitter_user_name}`
            "
            target="_blank"
            size="is-small"
            icon-pack="fab"
            icon-left="twitter"
            type="is-primary"
            >Twitter</b-button
          >
        </div>
      </div>
    </div>
    <div v-else>
      <img
        :src="participant.chara.image.image_url"
        :alt="participant.chara.name.name"
        :class="participant.dead ? 'dead' : ''"
      />
      <p :class="charaNameClass">{{ participant.chara.name.name }}</p>
      <p v-if="participant.skill">
        {{ participant.skill.name }}
      </p>
      <p class="has-text-info" v-if="participant.co">
        {{ participant.co + 'CO' }}
      </p>
      <p v-if="participant.dead" class="has-text-danger">
        {{ `${participant.dead.village_day.day}d${participant.dead.reason}` }}
      </p>
      <p v-if="doneRollcall" class="has-text-info">準備完了</p>
      <p v-if="isFirstVictim">ダミー</p>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'nuxt-property-decorator'
import VillageParticipant from '~/@types/village-participant'
import Village from '~/@types/village'
import SituationAsParticipant from '~/@types/situation-as-participant'
import { VILLAGE_STATUS } from '~/consts/consts'
import { getColorClass } from '~/components/message/message-color'

@Component({
  components: {}
})
export default class ParticipantV extends Vue {
  @Prop({ type: Object })
  private participant!: VillageParticipant

  @Prop({ type: Boolean })
  private isDispPlayer!: boolean

  private get village(): Village {
    return this.$store.getters.village
  }

  private get isMyself(): boolean {
    const situation: SituationAsParticipant | null = this.$store.getters
      .situation
    if (!situation || !situation.participate.myself) return false
    return situation.participate.myself.id === this.participant.id
  }

  private get isFirstVictim(): boolean {
    const dummyCharaId = this.village.setting.charachip.dummy_chara_id
    return this.participant.chara.id === dummyCharaId
  }

  private get doneRollcall(): boolean {
    return (
      this.village.status.code === VILLAGE_STATUS.ROLLCALLING &&
      this.participant.done_roll_call
    )
  }

  private get charaNameClass(): string {
    const bold = this.isMyself ? 'bold' : ''
    const color = getColorClass(this.village, this.participant)
    return `${bold} ${color || ''}`
  }
}
</script>
