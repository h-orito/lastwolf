<template>
  <div>
    <hr class="m-t-10 m-b-10" />
    <p class="m-b-10">
      <span v-for="messageLine in abilityMessage" :key="messageLine.id">
        <span v-html="messageLine"></span><br />
      </span>
    </p>
    <b-field label="対象" label-position="on-border">
      <b-select v-model="participantId" expanded size="is-small">
        <option
          v-for="participant in targetList"
          :value="participant.id"
          :key="participant.id"
          >{{ participant.chara.name.name }}</option
        >
      </b-select>
    </b-field>
    <b-button
      :disabled="!canSubmit || submitting"
      @click="confirmSetAbility"
      type="is-primary"
      size="is-small"
      >{{ abilityButtonString }}</b-button
    >
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'nuxt-property-decorator'
import Village from '~/@types/village'
import VillageParticipant from '~/@types/village-participant'
import SituationAsParticipant from '~/@types/situation-as-participant'

@Component({
  components: {}
})
export default class Ability extends Vue {
  @Prop({ type: String })
  private abilityType!: string

  private submitting: boolean = false
  private participantId: number | null = null

  private get situation(): SituationAsParticipant {
    return this.$store.getters.situation
  }

  private get targetList(): VillageParticipant[] {
    return this.situation.ability.list.find(
      a => a.type.code === this.abilityType
    )!!.target_list
  }

  private get villageId(): number {
    return this.$store.getters.villageId
  }

  private get village(): Village {
    return this.$store.getters.village
  }

  // 参加ボタンを押下できるか
  private get canSubmit(): boolean {
    return this.participantId != null
  }

  private get abilityMessage(): string[] {
    let message = ''
    const type = this.abilityType
    if (type === 'ATTACK') {
      message = '襲撃対象を選択してください。'
    } else if (type === 'DIVINE') {
      message = '占う対象を選択してください。'
    } else if (type === 'GUARD') {
      message = '護衛対象を選択してください。'
    }
    message += '\n一度決定すると取り消すことができないため注意してください。'
    if (type === 'ATTACK') {
      message += '（誰か1人が選択すると他の人は操作不可能になります。）'
    }
    message +=
      '\n能力行使しなかった場合突然死するため、必ず能力を行使してください。'
    return message.replace(/\n/gm, '<br>').split('<br>')
  }

  private get abilityButtonString(): string {
    const type = this.abilityType
    if (type === 'ATTACK') {
      return '襲う'
    } else if (type === 'DIVINE') {
      return '占う'
    } else if (type === 'GUARD') {
      return '護衛する'
    } else {
      return '決定'
    }
  }

  private confirmSetAbility(): void {
    const self = this
    const target: VillageParticipant = this.targetList.find(
      p => p.id === self.participantId
    )!!
    this.$buefy.dialog.confirm({
      title: '確認',
      message: `対象は${target.chara.name.name}でよろしいですか？`,
      confirmText: `${this.abilityButtonString}`,
      type: 'is-primary',
      hasIcon: false,
      iconPack: 'fas',
      onConfirm: async () => {
        await self.setAbility()
      },
      size: 'is-small',
      cancelText: 'キャンセル'
    })
  }

  private async setAbility(): Promise<void> {
    this.submitting = true
    try {
      await this.$axios.$post(`/village/${this.villageId}/ability`, {
        target_id: this.participantId,
        ability_type: this.abilityType
      })
      this.submitting = false
    } catch (error) {
      const code = parseInt(error.response && error.response.status)
      if (code === 404 && error.response.data.status === 499) {
        this.$buefy.toast.open({
          message: error.response.data.message,
          type: 'is-danger',
          position: 'is-top'
        })
      }
      this.submitting = false
    }
  }
}
</script>
