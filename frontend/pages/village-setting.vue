<template>
  <section class="section">
    <div class="container has-text-left">
      <b-button
        :to="{ path: '/village', query: { id: villageId } }"
        tag="nuxt-link"
        size="is-small"
      >
        戻る
      </b-button>
      <h1 class="title is-5 m-t-40">村の設定を変更する</h1>
      <b-notification type="is-warning" :closable="false" class="is-size-7">
        <ul>
          <li>参加パスワードが毎回空になるのでご注意ください。</li>
        </ul>
      </b-notification>
      <setting
        ref="setting"
        :village-name.sync="villageName"
        :start-datetime.sync="startDatetime"
        :noon-seconds.sync="noonSeconds"
        :vote-seconds.sync="voteSeconds"
        :night-seconds.sync="nightSeconds"
        :charachip-id.sync="charachipId"
        :dummy-chara-id.sync="dummyCharaId"
        :organization.sync="organization"
        :available-dummy-skill.sync="availableDummySkill"
        :available-skill-request.sync="availableSkillRequest"
        :available-same-target-guard.sync="availableSameTargetGuard"
        :first-divine-nowolf.sync="firstDivineNowolf"
        :join-password.sync="joinPassword"
        save-label="設定を変更する"
        :modifiable-chara="false"
        @confirm="confirmSetting"
        @save="modifySetting"
      />
    </div>
  </section>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import dayjs from 'dayjs'
import setting from '~/components/setting/setting.vue'
import Village from '~/@types/village'
import { MESSAGE_TYPE } from '~/consts/consts'

@Component({
  components: {
    setting
  },
  asyncData({ query }) {
    return { villageId: query.id }
  }
})
export default class VillageSetting extends Vue {
  /** head */
  private head() {
    return { title: ' | 村設定変更' }
  }

  /** data */
  private villageId: number = 0
  private village: Village | null = null

  // form data ------------------------------------
  private villageName: string = ''
  // @ts-ignore
  private startDatetime: Date = this.$dayjs()
    .add(7, 'days') // 1週間後にしておく
    .startOf('days')
    .toDate()

  private noonSeconds: string = '3600'
  private voteSeconds: string = '600'
  private nightSeconds: string = '1200'
  private charachipId: string = '1'
  private dummyCharaId: string = '1'
  private organization: string = '村'
  private availableDummySkill: boolean = false
  private availableSkillRequest: boolean = true
  private availableSameTargetGuard: boolean = true
  private firstDivineNowolf: boolean = false
  private joinPassword: string = ''

  /** computed */
  /** mounted */
  private async mounted(): Promise<void> {
    this.village = await this.fetchVillage(this.villageId)
    this.reset()
    // @ts-ignore
    this.$refs.setting.loadSkills()
  }

  /** methods */
  private fetchVillage(villageId: number): Promise<Village> {
    return this.$axios.$get(`/village/${villageId}`)
  }

  private reset(): void {
    if (!this.village) return
    this.villageName = this.village.name

    const time = this.village.setting.time
    // @ts-ignore
    this.startDatetime = this.$dayjs(time.start_datetime).toDate()
    this.noonSeconds = time.noon_seconds.toString()
    this.voteSeconds = time.vote_seconds.toString()
    this.nightSeconds = time.night_seconds.toString()

    const charachip = this.village.setting.charachip
    this.charachipId = charachip.charachip_id.toString()
    this.dummyCharaId = charachip.dummy_chara_id.toString()

    this.organization = Object.values(
      this.village.setting.organizations.organization
    ).join('\n')

    const rules = this.village.setting.rules
    this.availableDummySkill = rules.available_dummy_skill
    this.availableSkillRequest = rules.available_skill_request
    this.availableSameTargetGuard = rules.available_same_target_guard
    this.firstDivineNowolf = rules.first_divine_nowolf
    this.joinPassword = ''
  }

  private async confirmSetting({ param, errCb, successCb }): Promise<void> {
    try {
      await this.$axios.$post(
        `/village/${this.villageId}/setting/confirm`,
        param
      )
      successCb()
    } catch (error) {
      errCb(error)
    }
  }

  private async modifySetting({ param, errCb }): Promise<void> {
    try {
      const res = await this.$axios.$post(
        `/village/${this.villageId}/setting`,
        param
      )
      location.href = `/village?id=${this.villageId}`
    } catch (err) {
      errCb(err)
    }
  }
}
</script>

<style lang="scss"></style>
