<template>
  <div>
    <participate v-if="isDispParticipate" />
    <skill-request v-if="isDispSkillRequest" />
    <leave v-if="isDispLeave" />
    <rollcall v-if="isDispRollcall" />
    <ability :ability-type="abilityType" v-if="isDispAbility" />
    <vote v-if="isDispVote" />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import SituationAsParticipant from '~/@types/situation-as-participant'

@Component({
  components: {
    participate: () => import('~/components/action/participate.vue'),
    leave: () => import('~/components/action/leave.vue'),
    skillRequest: () => import('~/components/action/skill-request.vue'),
    rollcall: () => import('~/components/action/rollcall.vue'),
    ability: () => import('~/components/action/ability.vue'),
    vote: () => import('~/components/action/vote.vue')
  }
})
export default class Action extends Vue {
  private get situation(): SituationAsParticipant | null {
    return this.$store.getters.situation
  }

  private get isDispParticipate(): boolean {
    if (!this.situation) return false
    return this.situation.participate.available_participate
  }

  private get isDispLeave(): boolean {
    if (!this.situation) return false
    return this.situation.participate.available_leave
  }

  private get isDispSkillRequest(): boolean {
    if (!this.situation) return false
    return (
      this.situation.participate.participating &&
      this.situation.skill_request.available_skill_request
    )
  }

  private get isDispRollcall(): boolean {
    if (!this.situation) return false
    return this.situation.roll_call.available_roll_call
  }

  private get isDispAbility(): boolean {
    if (!this.situation) return false
    const abilitySituation = this.situation.ability
    if (abilitySituation.list.length <= 0) return false
    const ability = abilitySituation.list[0]
    return ability.usable
  }

  private get abilityType(): string {
    if (!this.isDispAbility) return ''
    const ability = this.situation!.ability.list[0]
    return ability.type.code
  }

  private get isDispVote(): boolean {
    if (!this.situation) return false
    return this.situation.vote.available_vote
  }
}
</script>
