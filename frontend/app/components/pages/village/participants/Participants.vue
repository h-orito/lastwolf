<template>
  <div class="panel-compact text-fg text-xs mb-2">
    <div class="panel-compact-header">参加者</div>
    <div class="px-3 py-2">
      <Participant
        v-for="p in participants"
        :key="p.id"
        :participant="p"
        :is-disp-player="isDispPlayer"
      />
      <div v-if="isViewablePlayerInfo" class="mt-2">
        <hr class="border-line-soft my-2" />
        <UiButton button-type="secondary" @click="toggleDisplayPlayer">
          {{ toggleDisplayButtonMessage }}
        </UiButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Participant from "~/components/pages/village/participants/Participant.vue";
import type { components } from "~/lib/api/schema";
import { VILLAGE_STATUS } from "~/lib/api/village-status-constants";

type VillageParticipantView = components["schemas"]["VillageParticipantView"];
type VillageView = components["schemas"]["VillageView"];

const villageStore = useVillageStore();
const village = computed(() => villageStore.village as VillageView | null);
const situation = computed(() => villageStore.situation);

const isDispPlayer = ref(false);

const participants = computed((): VillageParticipantView[] => {
  if (!village.value) return [];
  return [...village.value.participants.member_list].sort(compare);
});

const isSolved = computed(() => {
  if (!village.value) return false;
  return [VILLAGE_STATUS.EPILOGUE, VILLAGE_STATUS.COMPLETED, VILLAGE_STATUS.CANCEL].some(
    (s) => s === village.value!.status.code,
  );
});

const isViewablePlayerInfo = computed(() => {
  return isSolved.value || (!!situation.value && situation.value.creator.viewable_spoiler);
});

const toggleDisplayButtonMessage = computed(() => {
  return isDispPlayer.value ? "プレイヤー情報を表示しない" : "プレイヤー情報を表示する";
});

const toggleDisplayPlayer = () => {
  isDispPlayer.value = !isDispPlayer.value;
};

const compare = (p1: VillageParticipantView, p2: VillageParticipantView): number => {
  // 死んだ方が右
  if (p1.dead && !p2.dead) return 1;
  if (!p1.dead && p2.dead) return -1;
  if (p1.dead && p2.dead) {
    // 先に死んだ方が右
    if (p1.dead.village_day.day < p2.dead.village_day.day) return 1;
    if (p1.dead.village_day.day > p2.dead.village_day.day) return -1;
    if (deadReasonPriority(p1.dead.reason) > deadReasonPriority(p2.dead.reason)) return 1;
    if (deadReasonPriority(p1.dead.reason) < deadReasonPriority(p2.dead.reason)) return -1;
  }
  return p2.id - p1.id;
};

const deadReasonPriority = (reason: string): number => {
  switch (reason) {
    case "ATTACK":
    case "DIVINED":
    case "MISRABLE":
      return 2;
    case "EXECUTE":
    case "SUDDEN":
      return 1;
    default:
      return 0;
  }
};
</script>
