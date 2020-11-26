<template>
  <b-message
    type="is-dark"
    size="is-small"
    title="進行"
    class="myself"
    :closable="false"
  >
    <progress-bar ref="progressBar" />
    <current-situation />
    <myself />
    <action />
    <hr class="m-t-10 m-b-10" />
    <b-button type="is-primary" size="is-small" @click="openVillageInfoModal"
      >村の設定を確認する</b-button
    >
    <village-info-modal
      :is-open="isOpenVillageInfoModal"
      :charachip-name="charachipName"
      @close="closeVillageInfoModal"
    />
  </b-message>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import dayjs from 'dayjs'
import Village from '~/@types/village'
import VillageDay from '~/@types/village-day'
import { VILLAGE_STATUS, NOONNIGHT_CODE } from '~/consts/consts'

@Component({
  components: {
    myself: () => import('~/components/progress/myself.vue'),
    currentSituation: () =>
      import('~/components/progress/current-situation.vue'),
    progressBar: () => import('~/components/progress/progress-bar.vue'),
    action: () => import('~/components/action/action.vue'),
    villageInfoModal: () =>
      import('~/components/progress/modal-village-info.vue')
  }
})
export default class Progress extends Vue {
  private isOpenVillageInfoModal: boolean = false
  private charachipName: string | null = null

  private refreshTimer(): void {
    // @ts-ignore
    this.$refs.progressBar.refreshTimer()
  }

  private async openVillageInfoModal(): Promise<void> {
    if (!this.charachipName) {
      const charachipId = this.$store.getters.village.setting.charachip
        .charachip_id
      this.charachipName = await this.loadCharachipName(charachipId)
    }
    this.isOpenVillageInfoModal = true
  }

  private closeVillageInfoModal(): void {
    this.isOpenVillageInfoModal = false
  }

  private async loadCharachipName(id: number): Promise<string> {
    const charachip = await this.$axios.$get(`/charachip/${id}`)
    return charachip.name
  }
}
</script>
