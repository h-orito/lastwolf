<template>
  <section class="section">
    <div class="container has-text-left">
      <h1 class="title is-5 m-t-40">村を作成</h1>
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
        :join-password.sync="joinPassword"
        save-label="村を作成する"
        @confirm="confirmVillage"
        @save="createVillage"
      />
    </div>
  </section>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import dayjs from 'dayjs'
import setting from '~/components/setting/setting.vue'
import Villages from '~/@types/village'

@Component({
  components: { setting }
})
export default class CreateVillage extends Vue {
  /** head */
  private head() {
    return { title: ' | 村作成' }
  }

  // form data ------------------------------------
  private villageName: string = ''
  // @ts-ignore
  private startDatetime: Date = this.$dayjs()
    .add(2, 'hours') // 2時間後にしておく
    .startOf('hour')
    .toDate()

  private noonSeconds: string = '3600'
  private voteSeconds: string = '600'
  private nightSeconds: string = '1200'
  private charachipId: string = '1'
  private dummyCharaId: string = '1'
  private organization: string = '狼狼狼狂狐占霊狩共共村村村村村村村'
  private availableDummySkill: boolean = true
  private availableSkillRequest: boolean = true

  private joinPassword: string = ''

  /** mounted */
  private mounted() {
    // @ts-ignore
    this.$refs.setting.loadCharachips()
    // @ts-ignore
    this.$refs.setting.loadCharas()
    // @ts-ignore
    this.$refs.setting.loadSkills()
  }

  /** methods */
  private async confirmVillage({ param, errCb, successCb }): Promise<void> {
    try {
      await this.$axios.$post('/village/confirm', param)
      successCb()
    } catch (error) {
      errCb(error)
    }
  }

  private async createVillage({ param, errCb }): Promise<void> {
    try {
      const res = await this.$axios.$post('/village', param)
      location.href = `/village?id=${res.village_id}`
    } catch (err) {
      errCb(err)
    }
  }
}
</script>
