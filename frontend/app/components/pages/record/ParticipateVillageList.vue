<template>
  <div>
    <!-- データなし -->
    <div v-if="tableVillages.length === 0" class="py-4 text-center text-sm text-fg-muted">
      <p>参加した村はありません</p>
    </div>

    <!-- テーブル -->
    <div v-else class="overflow-x-auto">
      <table class="doc-table whitespace-nowrap text-xs text-fg">
        <thead>
          <tr>
            <th>村名</th>
            <th>人数</th>
            <th>キャラ</th>
            <th>役職</th>
            <th>生死</th>
            <th>陣営</th>
            <th>勝敗</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="village in tableVillages" :key="village.villageId" class="row-stripe">
            <td>
              <NuxtLink
                :to="{ path: '/village', query: { id: village.villageId } }"
                class="text-link"
              >
                {{ village.villageName }}
              </NuxtLink>
            </td>
            <td>{{ village.participantCount }}</td>
            <td>{{ village.charaName }}</td>
            <td>{{ village.skillName }}</td>
            <td>{{ village.status }}</td>
            <td>{{ village.camp }}</td>
            <td>{{ village.winStatus }}</td>
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
