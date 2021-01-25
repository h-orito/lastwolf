<template>
  <div>
    <section class="section has-background-light">
      <div class="container">
        <h1 class="title is-5">終了した村一覧</h1>
        <complete-village-list :villages="villages" />
      </div>
    </section>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import qs from 'qs'
import completeVillageList from '~/components/complete-village-list/complete-village-list.vue'
// type
import Villages from '~/@types/villages'
import SimpleVillage from '~/@types/simple-village'
import { VILLAGE_STATUS } from '~/consts/consts'

@Component({
  components: { completeVillageList }
})
export default class VillageList extends Vue {
  /** head */
  private head() {
    return { title: ' | 終了した村一覧' }
  }

  // 村一覧
  private villages: SimpleVillage[] | null = null

  /** computed */
  private get loadingVillages(): boolean {
    return this.villages == null
  }

  /** created */
  async created() {
    const villages = await this.$axios.$get('/village/list', {
      params: {
        village_status: VILLAGE_STATUS.COMPLETE
      }
    })
    this.villages = (villages as Villages).list
  }

  /** methods */
}
</script>
