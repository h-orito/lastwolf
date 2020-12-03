<template>
  <div>
    <hr class="m-t-10 m-b-10" />
    <p class="m-b-10"><strong>参加</strong></p>
    <p class="m-b-10">あなたはこの村に参加できます。</p>
    <b-field label="キャラクター" label-position="on-border">
      <b-select v-model="charaId" expanded size="is-small">
        <option
          v-for="chara in situation.participate.selectable_chara_list"
          :value="chara.id.toString()"
          :key="chara.id.toString()"
          >{{ chara.name.name }}</option
        >
      </b-select>
      <p class="control">
        <button class="button is-primary is-small" @click="openModal">
          画像で選択
        </button>
      </p>
    </b-field>
    <b-field
      v-if="situation.skill_request.available_skill_request"
      label="役職第1希望"
      label-position="on-border"
      custom-class="is-small"
    >
      <b-select v-model="firstRequestSkillCode" expanded size="is-small">
        <option
          v-for="skill in situation.skill_request.selectable_skill_list"
          :value="skill.code"
          :key="skill.code"
          >{{ skill.name }}</option
        >
      </b-select>
    </b-field>
    <b-field
      v-if="situation.skill_request.available_skill_request"
      custom-class="is-small"
      label="役職第2希望"
      label-position="on-border"
    >
      <b-select v-model="secondRequestSkillCode" expanded size="is-small">
        <option
          v-for="skill in situation.skill_request.selectable_skill_list"
          :value="skill.code"
          :key="skill.code"
          >{{ skill.name }}</option
        >
      </b-select>
    </b-field>
    <b-field
      custom-class="is-small"
      label="入村パスワード"
      label-position="on-border"
      v-if="requiredJoinPassword"
    >
      <b-input v-model="joinPassword" type="text" size="is-small" />
    </b-field>
    <b-button
      :disabled="!canSubmit || submitting"
      @click="participate"
      type="is-primary"
      size="is-small"
      >入村する</b-button
    >
    <b-modal
      :active.sync="isCharaSelectModalOpen"
      has-modal-card
      trap-focus
      aria-role="dialog"
      aria-modal
    >
      <chara-select-modal
        :chara-list="situation.participate.selectable_chara_list"
        @chara-select="charaSelect($event)"
      />
    </b-modal>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import Village from '~/@types/village'
import SituationAsParticipant from '~/@types/situation-as-participant'

@Component({
  components: {
    charaSelectModal: () => import('~/components/action/chara-select-modal.vue')
  }
})
export default class Participate extends Vue {
  private submitting: boolean = false
  private charaId: number | null = null
  private firstRequestSkillCode: string | null =
    this.situation.skill_request.skill_request == null
      ? 'LEFTOVER'
      : this.situation.skill_request.skill_request.first.code

  private secondRequestSkillCode: string | null =
    this.situation.skill_request.skill_request == null
      ? 'LEFTOVER'
      : this.situation.skill_request.skill_request.second.code

  private joinPassword: string = ''

  private isCharaSelectModalOpen = false

  private get situation(): SituationAsParticipant {
    return this.$store.getters.situation
  }

  private get villageId(): number {
    return this.$store.getters.villageId
  }

  private get village(): Village {
    return this.$store.getters.village
  }

  private get requiredJoinPassword(): boolean {
    return this.village.setting.password.join_password_required
  }

  // 参加ボタンを押下できるか
  private get canSubmit(): boolean {
    return (
      this.charaId != null &&
      this.firstRequestSkillCode != null &&
      this.secondRequestSkillCode != null
    )
  }

  private async participate(): Promise<void> {
    this.submitting = true
    try {
      await this.$axios.$post(`/village/${this.villageId}/participate`, {
        chara_id: this.charaId,
        first_request_skill: this.firstRequestSkillCode!,
        second_request_skill: this.secondRequestSkillCode!,
        join_password: this.joinPassword
      })
      this.submitting = false
      location.reload()
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

  private openModal(): void {
    this.isCharaSelectModalOpen = true
  }

  private charaSelect({ charaId }): void {
    this.charaId = charaId
    this.isCharaSelectModalOpen = false
  }
}
</script>
