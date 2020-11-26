<template>
  <b-table
    :data="villages ? villages.list : []"
    :loading="loadingVillages"
    :mobile-cards="false"
  >
    <template slot-scope="props">
      <b-table-column field="village_name" label="村名">
        <nuxt-link
          :to="{
            path: '/village',
            query: { id: props.row.id }
          }"
          >{{ `${props.row.id}. ${props.row.name}` }}</nuxt-link
        >
      </b-table-column>
      <b-table-column field="status" label="状態">
        {{ props.row.status.name }}
      </b-table-column>
      <b-table-column field="create_player_name" label="作成者">
        {{ props.row.creator_player.nickname }}
      </b-table-column>
    </template>

    <template slot="empty">
      <section class="section">
        <div class="content has-text-grey has-text-centered">
          <p>村が作成されていません</p>
        </div>
      </section>
    </template>
  </b-table>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'nuxt-property-decorator'
import Villages from '~/@types/village'

@Component({
  components: {}
})
export default class VillageList extends Vue {
  @Prop({ type: Object })
  private villages!: Villages | null
}
</script>
