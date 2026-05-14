<template>
  <div>
    <Participate v-if="isDispParticipate" />
    <SkillRequest v-if="isDispSkillRequest" />
    <Leave v-if="isDispLeave" />
    <Rollcall v-if="isDispRollcall" />
    <Ability v-if="isDispAbility" :ability-type="abilityType" />
    <Vote v-if="isDispVote" />
    <Commit v-if="isDispCommit" />
  </div>
</template>

<script setup lang="ts">
import Participate from "~/components/pages/village/action/Participate.vue";
import SkillRequest from "~/components/pages/village/action/SkillRequest.vue";
import Leave from "~/components/pages/village/action/Leave.vue";
import Rollcall from "~/components/pages/village/action/Rollcall.vue";
import Ability from "~/components/pages/village/action/Ability.vue";
import Vote from "~/components/pages/village/action/Vote.vue";
import Commit from "~/components/pages/village/action/Commit.vue";
import type { components } from "~/lib/api/schema";

type SituationAsParticipantView = components["schemas"]["SituationAsParticipantView"];

const villageStore = useVillageStore();
const situation = computed(() => villageStore.situation as SituationAsParticipantView | null);

const isDispParticipate = computed(() => {
  return situation.value?.participate.available_participate ?? false;
});

const isDispLeave = computed(() => {
  return situation.value?.participate.available_leave ?? false;
});

const isDispSkillRequest = computed(() => {
  if (!situation.value) return false;
  return (
    situation.value.participate.participating &&
    situation.value.skill_request.available_skill_request
  );
});

const isDispRollcall = computed(() => {
  return situation.value?.roll_call.available_roll_call ?? false;
});

const isDispAbility = computed(() => {
  if (!situation.value) return false;
  const abilitySituation = situation.value.ability;
  if (abilitySituation.list.length <= 0) return false;
  const ability = abilitySituation.list[0];
  return ability?.usable ?? false;
});

const abilityType = computed(() => {
  if (!isDispAbility.value) return "";
  return situation.value!.ability.list[0]?.type.code ?? "";
});

const isDispVote = computed(() => {
  return situation.value?.vote.available_vote ?? false;
});

const isDispCommit = computed(() => {
  return situation.value?.commit.available_commit ?? false;
});
</script>
