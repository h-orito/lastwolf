<template>
  <div>
    <hr class="m-t-10 m-b-10" />
    <p class="m-b-10"><strong>能力行使</strong></p>
    <p class="m-b-10">
      <span v-for="messageLine in abilityMessage" :key="messageLine.id">
        <span v-html="messageLine"></span><br />
      </span>
    </p>
    <b-field label="対象" label-position="on-border">
      <b-select v-model="participantId" expanded size="is-small">
        <option :value="null">選択してください</option>
        <option
          v-for="participant in targetList"
          :value="participant.id"
          :key="participant.id"
          >{{ participant.chara.name.name }}</option
        >
      </b-select>
      <p class="control">
        <button class="button is-primary is-small" @click="openSelectModal">
          画像で選択
        </button>
      </p>
    </b-field>
    <b-button
      :disabled="!canSubmit || submitting"
      @click="confirmSetAbility"
      type="is-primary"
      size="is-small"
      >{{ abilityButtonString }}</b-button
    >
    <b-modal
      :active.sync="isOpenSelectModal"
      has-modal-card
      trap-focus
      aria-role="dialog"
      aria-modal
    >
      <participant-select-modal
        :participants="targetList"
        @close="closeSelectModal"
        @participant-select="selectParticipant"
      />
    </b-modal>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'nuxt-property-decorator'
import Village from '~/@types/village'
import VillageParticipant from '~/@types/village-participant'
import SituationAsParticipant from '~/@types/situation-as-participant'

@Component({
  components: {
    participantSelectModal: () =>
      import('~/components/action/participant-select-modal.vue')
  }
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
    if (
      type === 'GUARD' &&
      !this.village.setting.rules.available_same_target_guard
    ) {
      message +=
        '\nまた、この村では、2日連続同じ対象を護衛できないため注意してください。'
    }
    if (type === 'ATTACK') {
      message += '\n襲撃は誰か1人が行使すると他の人は操作不可能になります。\n'
    }
    message +=
      '\n能力行使しなかった場合突然死するため、必ず能力を行使してください。'
    if (type === 'ATTACK') {
      message += '\n襲撃は誰か1人が行使すれば全員突然死しません。'
    }

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

  private selectParticipant({ participantId }): void {
    this.participantId = participantId
    this.closeSelectModal()
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

  private isOpenSelectModal: boolean = false
  private openSelectModal(): void {
    this.isOpenSelectModal = true
  }

  private closeSelectModal(): void {
    this.isOpenSelectModal = false
  }
}
</script>
