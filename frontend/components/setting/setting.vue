<template>
  <div>
    <b-notification
      v-if="errors"
      type="is-danger"
      :closable="false"
      class="is-size-7"
    >
      <ul>
        <li v-for="err in errors.split('\n')" :key="err">{{ err }}</li>
      </ul>
    </b-notification>
    <validation-observer
      ref="observer"
      v-slot="{ invalid }"
      tag="form"
      class="is-size-7"
    >
      <village-name :input-value.sync="villageNameModel" />
      <hr />
      <h2 class="title is-6">時間</h2>
      <notification :closable="false">
        <li>
          開始は村建てによる操作でしか行えないため、開始予定日時は参加者への案内用です。
        </li>
      </notification>
      <start-datetime :input-value.sync="startDatetimeModel" />
      <form-number
        rules="required|max_value:3600|min_value:180"
        label-message="昼時間（秒）"
        max="3600"
        min="180"
        step="1"
        :input-value.sync="noonSecondsModel"
        class="m-b-5"
      />
      <form-number
        rules="required|max_value:600|min_value:60"
        label-message="投票時間（秒）"
        max="600"
        min="60"
        step="1"
        :input-value.sync="voteSecondsModel"
        class="m-b-5"
      />
      <form-number
        rules="required|max_value:1200|min_value:120"
        label-message="夜時間（秒）"
        max="1200"
        min="120"
        step="1"
        :input-value.sync="nightSecondsModel"
        class="m-b-5"
      />
      <hr />
      <div v-if="modifiableChara">
        <h2 class="title is-6">キャラチップ</h2>
        <charachip
          :input-value.sync="charachipIdModel"
          :charachips="charachips"
          @load-charas="loadCharasByCharachipId($event.participantId)"
        />
        <dummy-chara
          :input-value.sync="dummyCharaIdModel"
          :charas="charas"
          @chara-select="charaSelect($event)"
        />
        <hr />
      </div>
      <h2 class="title is-6">編成</h2>
      <notification>
        <li>
          役職1文字略称は<nuxt-link
            :to="{ path: '/rule#skill' }"
            target="_blank"
            >仕様</nuxt-link
          >を参照してください。
        </li>
        <li>ダミー役欠けなしの場合、村人を1名以上含めてください。</li>
        <li>
          ダミー役欠けありの場合、噛まれて死亡する役職を1名以上含めてください。
        </li>
        <li>狼系役職を1名以上含めてください。</li>
        <li>狼系役職が過半数を超えないようにしてください。</li>
        <li>最小で5人、最大で999人設定することができます。</li>
      </notification>
      <organization
        :input-value.sync="organizationModel"
        :available-dummy-skill="availableDummySkill"
        :skills="skills"
      />
      <form-switch
        rules="required"
        label-message="役欠け"
        description="ダミー役欠けをありにする"
        :input-value.sync="availableDummySkillModel"
      />
      <form-switch
        rules="required"
        label-message="役職希望"
        description="役職希望ありにする"
        :input-value.sync="availableSkillRequestModel"
      />
      <hr />
      <h2 class="title is-6">詳細ルール</h2>
      <notification>
        <li>
          初日白通知の場合、初日の占いのみ人狼と妖狐以外の役職からランダムで対象が選ばれます。
        </li>
      </notification>
      <form-switch
        rules="required"
        label-message="連続護衛"
        :description="
          `${
            availableSameTargetGuardModel
              ? '2日連続同一対象を護衛可能'
              : '前日護衛した人は護衛できない'
          }`
        "
        :input-value.sync="availableSameTargetGuardModel"
      />
      <form-switch
        rules="required"
        label-message="初日白通知"
        :description="
          `${
            firstDivineNowolfModel
              ? '初日ランダム白占い'
              : '初日から占い対象を選択'
          }`
        "
        :input-value.sync="firstDivineNowolfModel"
      />
      <form-number
        rules="max_value:20|min_value:0"
        label-message="昼沈黙時間（秒）"
        max="20"
        min="0"
        step="1"
        :input-value.sync="silentSecondsModel"
        class="m-b-5"
      />
      <hr />
      <h2 class="title is-6">参加パスワード</h2>
      <join-password :input-value.sync="joinPasswordModel" />
      <hr />
      <b-field class="has-text-right">
        <b-button
          :disabled="confirming || invalid"
          size="is-small"
          @click="confirm"
          type="is-primary"
          >確認画面へ</b-button
        >
      </b-field>
      <modal-confirm
        :param="registerParam"
        :charachip-name="charachipName"
        :dummy-chara-name="dummyCharaName"
        :is-open="isOpenConfirmModal"
        :save-label="saveLabel"
        @close="isOpenConfirmModal = false"
        @create="save"
      />
    </validation-observer>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'nuxt-property-decorator'
import dayjs from 'dayjs'
// type
import Charachips from '~/@types/charachips'
import Charachip from '~/@types/charachip'
import Charas from '~/@types/charas'
import Chara from '~/@types/chara'
import Skills from '~/@types/skills'
import Skill from '~/@types/skill'
import FormOption from '~/components/form/validation/option'
// component
import organization from '~/components/setting/organization.vue'
import toast from '~/components/parts/toast'

@Component({
  components: {
    formNumber: () => import('~/components/form/validation/form-number.vue'),
    formSwitch: () => import('~/components/form/validation/form-switch.vue'),
    notification: () => import('~/components/setting/notification.vue'),
    villageName: () => import('~/components/setting/village-name.vue'),
    startDatetime: () => import('~/components/setting/start-datetime.vue'),
    charachip: () => import('~/components/setting/charachip.vue'),
    dummyChara: () => import('~/components/setting/dummy-chara.vue'),
    organization,
    joinPassword: () => import('~/components/setting/join-password.vue'),
    modalConfirm: () => import('~/components/setting/modal-confirm.vue')
  }
})
export default class Setting extends Vue {
  // form data ------------------------------------

  /** villageName */
  @Prop({ type: String, required: true })
  private villageName!: string

  private get villageNameModel(): string {
    return this.villageName
  }

  private set villageNameModel(val: string) {
    this.$emit('update:villageName', val)
  }

  /** startDatetime */
  @Prop({ type: Date, required: true })
  private startDatetime!: Date

  private get startDatetimeModel(): Date {
    return this.startDatetime
  }

  private set startDatetimeModel(val: Date) {
    this.$emit('update:startDatetime', val)
  }

  /** noonSeconds */
  @Prop({ type: String, required: true })
  private noonSeconds!: string

  private get noonSecondsModel(): string {
    return this.noonSeconds
  }

  private set noonSecondsModel(val: string) {
    this.$emit('update:noonSeconds', val)
  }

  /** voteSeconds */
  @Prop({ type: String, required: true })
  private voteSeconds!: string

  private get voteSecondsModel(): string {
    return this.voteSeconds
  }

  private set voteSecondsModel(val: string) {
    this.$emit('update:voteSeconds', val)
  }

  /** nightSeconds */
  @Prop({ type: String, required: true })
  private nightSeconds!: string

  private get nightSecondsModel(): string {
    return this.nightSeconds
  }

  private set nightSecondsModel(val: string) {
    this.$emit('update:nightSeconds', val)
  }

  /** charachipId */
  @Prop({ type: String, required: true })
  private charachipId!: string

  private get charachipIdModel(): string {
    return this.charachipId
  }

  private set charachipIdModel(val: string) {
    this.$emit('update:charachipId', val)
  }

  /** dummyCharaId */
  @Prop({ type: String, required: true })
  private dummyCharaId!: string

  private get dummyCharaIdModel(): string {
    return this.dummyCharaId
  }

  private set dummyCharaIdModel(val: string) {
    this.$emit('update:dummyCharaId', val)
  }

  /** organization */
  @Prop({ type: String, required: true })
  private organization!: string

  private get organizationModel(): string {
    return this.organization
  }

  private set organizationModel(val: string) {
    this.$emit('update:organization', val)
  }

  /** availableDummySkill */
  @Prop({ type: Boolean, required: true })
  private availableDummySkill!: boolean

  private get availableDummySkillModel(): boolean {
    return this.availableDummySkill
  }

  private set availableDummySkillModel(val: boolean) {
    this.$emit('update:availableDummySkill', val)
  }

  /** availableSkillRequest */
  @Prop({ type: Boolean, required: true })
  private availableSkillRequest!: boolean

  private get availableSkillRequestModel(): boolean {
    return this.availableSkillRequest
  }

  private set availableSkillRequestModel(val: boolean) {
    this.$emit('update:availableSkillRequest', val)
  }

  /** availableSameTargetGuard */
  @Prop({ type: Boolean, required: true })
  private availableSameTargetGuard!: boolean

  private get availableSameTargetGuardModel(): boolean {
    return this.availableSameTargetGuard
  }

  private set availableSameTargetGuardModel(val: boolean) {
    this.$emit('update:availableSameTargetGuard', val)
  }

  /** firstDivineNowolf */
  @Prop({ type: Boolean, required: true })
  private firstDivineNowolf!: boolean

  private get firstDivineNowolfModel(): boolean {
    return this.firstDivineNowolf
  }

  private set firstDivineNowolfModel(val: boolean) {
    this.$emit('update:firstDivineNowolf', val)
  }

  /** silentSeconds */
  @Prop({ type: String, required: false })
  private silentSeconds!: string

  private get silentSecondsModel(): string {
    return this.silentSeconds
  }

  private set silentSecondsModel(val: string) {
    this.$emit('update:silentSeconds', val)
  }

  /** joinPassword */
  @Prop({ type: String, required: true })
  private joinPassword!: string

  private get joinPasswordModel(): string {
    return this.joinPassword
  }

  private set joinPasswordModel(val: string) {
    this.$emit('update:joinPassword', val)
  }

  @Prop({ type: String, required: true })
  private saveLabel!: string

  @Prop({ type: Boolean, required: false, default: true })
  private modifiableChara!: boolean

  /** data */
  private errors: string = ''
  private confirming: boolean = false
  private isOpenConfirmModal: boolean = false
  private charachips: FormOption[] = []
  private charas: Chara[] = []
  private skills: Skill[] = []

  /** computed */
  private get charachipName(): string {
    const charachip = this.charachips.find(c => c.value === this.charachipId)
    return charachip ? charachip.label : ''
  }

  private get dummyCharaName(): string {
    const chara = this.charas.find(c => c.id.toString() === this.dummyCharaId)
    return chara ? chara.name.name : ''
  }

  /** methods */
  private async loadCharachips(): Promise<void> {
    const charachips: Charachips = await this.$axios.$get('/charachip/list')
    this.charachips = charachips.list.map((charachip: Charachip) => ({
      key: charachip.id.toString(),
      label: charachip.name,
      value: charachip.id.toString()
    }))
  }

  private loadCharas(): void {
    this.loadCharasByCharachipId(this.charachipId)
  }

  private async loadCharasByCharachipId(charachipId: string): Promise<void> {
    const charachip: Charachip = await this.$axios.$get(
      `/charachip/${charachipId}`
    )
    this.charas = charachip.chara_list
    this.dummyCharaIdModel = charachip.chara_list[0].id.toString()
  }

  private async loadSkills(): Promise<void> {
    const skills: Skills = await this.$axios.$get('/skill/list')
    this.skills = skills.list
  }

  private charaSelect({ charaId }): void {
    this.dummyCharaIdModel = charaId.toString()
  }

  private async confirm() {
    this.confirming = true
    this.errors = ''
    const self = this
    await this.$emit('confirm', {
      param: this.registerParam,
      errCb: err => {
        toast.danger(self, 'エラーが発生しました。設定を確認してください。')
        if (self.isBusinessError(err)) {
          self.errors = err.response.data.message
          window.scrollTo({
            top: 0,
            behavior: 'smooth'
          })
        }
        self.confirming = false
      },
      successCb: () => {
        self.isOpenConfirmModal = true
        self.confirming = false
      }
    })
  }

  private async save() {
    const self = this
    await this.$emit('save', {
      param: this.registerParam,
      errCb: err => {
        toast.danger(self, 'エラーが発生しました。設定を確認してください。')
        console.log(err)
      }
    })
  }

  private isBusinessError(err: any): boolean {
    const code = parseInt(err.response && err.response.status)
    return (
      code === 404 &&
      err.response.data.status === 499 &&
      err.response.data.message &&
      err.response.data.message.length > 0
    )
  }

  private get registerParam(): Object {
    // @ts-ignore
    const startDatetime = this.$dayjs(this.startDatetime).format(
      'YYYY-MM-DDTHH:mm:ss'
    )

    return {
      village_name: this.villageName,
      setting: {
        time: {
          start_datetime: startDatetime,
          noon_seconds: this.noonSeconds,
          vote_seconds: this.voteSeconds,
          night_seconds: this.nightSeconds
        },
        organization: {
          organization: this.organization
        },
        charachip: {
          dummy_chara_id: parseInt(this.dummyCharaId),
          charachip_id: parseInt(this.charachipId)
        },
        rule: {
          open_vote: true, // 固定
          available_skill_request: this.availableSkillRequest,
          open_skill_in_grave: false, // 固定
          visible_grave_message: false, // 固定
          available_suddenly_death: true,
          available_commit: true, // 固定
          available_dummy_skill: this.availableDummySkill,
          available_same_target_guard: this.availableSameTargetGuard,
          first_divine_nowolf: this.firstDivineNowolf,
          silent_seconds:
            this.silentSeconds === '0' ? null : parseInt(this.silentSeconds),
          join_password: this.joinPassword
        }
      }
    }
  }
}
</script>
