<template>
  <div>
    <!-- データなし -->
    <div v-if="tableVillages.length === 0" class="py-4 text-center text-gray-500 text-sm">
      <p>参加した村はありません</p>
    </div>

    <!-- テーブル -->
    <div v-else class="overflow-x-auto">
      <table class="w-full border-collapse bg-white text-xs whitespace-nowrap">
        <thead>
          <tr class="bg-gray-100">
            <th class="border border-gray-300 px-3 py-2 text-left">村名</th>
            <th class="border border-gray-300 px-3 py-2 text-left">人数</th>
            <th class="border border-gray-300 px-3 py-2 text-left">キャラ</th>
            <th class="border border-gray-300 px-3 py-2 text-left">役職</th>
            <th class="border border-gray-300 px-3 py-2 text-left">生死</th>
            <th class="border border-gray-300 px-3 py-2 text-left">陣営</th>
            <th class="border border-gray-300 px-3 py-2 text-left">勝敗</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="village in tableVillages"
            :key="village.villageId"
            class="odd:bg-white even:bg-gray-50"
          >
            <td class="border border-gray-300 px-3 py-1">
              <NuxtLink
                :to="{ path: '/village', query: { id: village.villageId } }"
                class="text-blue-600 hover:text-blue-800 underline"
              >
                {{ village.villageName }}
              </NuxtLink>
            </td>
            <td class="border border-gray-300 px-3 py-1">{{ village.participantCount }}</td>
            <td class="border border-gray-300 px-3 py-1">{{ village.charaName }}</td>
            <td class="border border-gray-300 px-3 py-1">{{ village.skillName }}</td>
            <td class="border border-gray-300 px-3 py-1">{{ village.status }}</td>
            <td class="border border-gray-300 px-3 py-1">{{ village.camp }}</td>
            <td class="border border-gray-300 px-3 py-1">{{ village.winStatus }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { components } from "~/lib/api/schema";

type ParticipateVillageView = components["schemas"]["ParticipateVillageView"];
type VillageParticipantView = components["schemas"]["VillageParticipantView"];

interface TableVillage {
  villageId: number;
  villageName: string;
  participantCount: string;
  charaName: string;
  skillName: string;
  status: string;
  camp: string;
  winStatus: string;
}

interface Props {
  participateVillageList: ParticipateVillageView[];
}

const props = withDefaults(defineProps<Props>(), {
  participateVillageList: () => [],
});

const tableVillages = computed<TableVillage[]>(() => {
  return props.participateVillageList.map((pv: ParticipateVillageView) => ({
    villageId: pv.village.id,
    villageName: pv.village.name,
    participantCount: `${pv.village.participants.count}人`,
    charaName: pv.participant.chara.name.name,
    skillName: pv.participant.skill?.name ?? "-",
    status: getStatus(pv.participant),
    camp: pv.participant.skill?.win_judge_camp.name ?? "-",
    winStatus: getWinStatus(pv.participant),
  }));
});

const getStatus = (participant: VillageParticipantView): string => {
  if (!participant.dead) return "生存";
  const deadDay = participant.dead.village_day.day;
  const reason = participant.dead.reason;
  return `${deadDay}d ${reason}死`;
};

const getWinStatus = (participant: VillageParticipantView): string => {
  switch (participant.winlose?.code) {
    case "WIN":
      return "勝利";
    case "LOSE":
      return "敗北";
    default:
      return "引分";
  }
};
</script>
