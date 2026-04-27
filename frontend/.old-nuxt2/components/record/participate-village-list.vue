<template>
  <div>
    <div class="content is-size-7">
      <b-table :data="tableVillages" :mobile-cards="false">
        <template slot-scope="props">
          <b-table-column field="village_name" label="村名">
            <nuxt-link
              :to="{ path: 'village', query: { id: props.row.village_id } }"
              >{{ props.row.village_name }}</nuxt-link
            >
          </b-table-column>

          <b-table-column field="participant_count" label="人数">
            {{ props.row.participant_count + `(${props.row.organization})` }}
          </b-table-column>

          <b-table-column field="chara" label="キャラ">
            {{ props.row.chara.name.name }}
          </b-table-column>

          <b-table-column field="chara" label="役職">
            {{ props.row.skill }}
          </b-table-column>

          <b-table-column field="status" label="生死">
            {{ props.row.status }}
          </b-table-column>

          <b-table-column field="camp" label="陣営">
            {{ props.row.camp }}
          </b-table-column>

          <b-table-column field="win_status" label="勝敗">
            {{ props.row.win_status }}
          </b-table-column>
        </template>

        <template slot="empty">
          <section class="section">
            <div class="content has-text-grey has-text-centered">
              <p>参加した村はありません</p>
            </div>
          </section>
        </template>
      </b-table>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'nuxt-property-decorator'
// component
// type
import ParticipateVillage from '~/@types/participate-village'
import Village from '~/@types/village'
import VillageParticipant from '~/@types/village-participant'

@Component({
  components: {}
})
export default class ParticipateVillageList extends Vue {
  @Prop({ type: Array })
  private participateVillageList!: ParticipateVillage[]

  /** data */

  /** computed */
  private get tableVillages(): any[] {
    return this.participateVillageList.map(
      (participateVillage: ParticipateVillage) => ({
        village_id: participateVillage.village.id,
        village_name: participateVillage.village.name,
        participant_count: this.participantCount(participateVillage.village),
        organization:
          participateVillage.village.setting.organizations.organization[
            participateVillage.village.participants.count
          ],
        chara: participateVillage.participant.chara,
        status: this.status(participateVillage.participant),
        skill: this.skillName(participateVillage.participant),
        camp: this.campName(participateVillage.participant),
        win_status: this.winStatus(participateVillage.participant)
      })
    )
  }

  /** methods */
  private participantCount(village: Village): string {
    return `${village.participants.count}人`
  }

  private skillName(participant: VillageParticipant): string {
    return participant.skill!.name
  }

  private campName(participant: VillageParticipant): string {
    return participant.skill!.win_judge_camp.name
  }

  private winStatus(participant: VillageParticipant): string {
    switch (participant.winlose?.code) {
      case 'WIN':
        return '勝利'
      case 'LOSE':
        return '敗北'
      default:
        return '引分'
    }
  }

  private status(participant: VillageParticipant): string {
    if (!participant.dead) return '生存'
    const deadDay = participant.dead.village_day.day
    const reason = participant.dead.reason
    return `${deadDay}d ${reason}死`
  }
}
</script>

<style lang="scss" scoped></style>
