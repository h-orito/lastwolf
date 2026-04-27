<template>
  <div class="content is-size-7">
    <b-table :data="tableVillages" :mobile-cards="false">
      <template slot-scope="props">
        <b-table-column field="village_name" label="村名">
          <nuxt-link
            :to="{
              path: '/village',
              query: { id: props.row.village_id }
            }"
            >{{ props.row.village_name }}</nuxt-link
          >
        </b-table-column>

        <b-table-column field="participant_count" label="人数">
          {{ props.row.participant_count }}
        </b-table-column>

        <b-table-column field="organization" label="編成">
          {{ props.row.organization }}
        </b-table-column>

        <b-table-column field="win_camp" label="勝利">
          {{ props.row.win_camp }}
        </b-table-column>
      </template>

      <template slot="empty">
        <section class="section">
          <div class="content has-text-grey has-text-centered">
            <p>終了した村はありません</p>
          </div>
        </section>
      </template>
    </b-table>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'nuxt-property-decorator'
// type
import SimpleVillage from '~/@types/simple-village'

@Component({
  components: {}
})
export default class CompleteVillageList extends Vue {
  // 村一覧
  @Prop({ type: Array })
  private villages!: SimpleVillage[] | null

  /** computed */
  private get tableVillages(): any[] {
    if (!this.villages) return []
    return this.villages.map((village: SimpleVillage) => ({
      village_id: village.id,
      village_name: village.name,
      participant_count: `${village.participants.count}人`,
      organization:
        village.setting.organizations.organization[village.participants.count],
      win_camp: village.win_camp?.name || '引分'
    }))
  }

  /** methods */
}
</script>
