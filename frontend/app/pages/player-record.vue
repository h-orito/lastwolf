<template>
  <section class="py-8 px-4">
    <div class="max-w-5xl mx-auto text-left">
      <!-- ローディング中 -->
      <div v-if="loadingRecords" class="py-8 text-center text-gray-500 text-sm">読み込み中...</div>

      <!-- データ表示 -->
      <template v-else-if="playerRecords">
        <h1 v-if="playerName" class="text-lg font-bold mb-6">{{ playerName }}</h1>

        <!-- 総合戦績 -->
        <div class="mb-8">
          <h2 class="text-base font-semibold mb-2">総合戦績</h2>
          <p class="text-sm">{{ wholeResult }}</p>
        </div>

        <!-- 陣営戦績 -->
        <div class="mb-8">
          <h2 class="text-base font-semibold mb-2">陣営戦績</h2>
          <CampRecords :camp-records="playerRecords.camp_record_list" />
        </div>

        <!-- 役職戦績 -->
        <div class="mb-8">
          <h2 class="text-base font-semibold mb-2">役職戦績</h2>
          <SkillRecords :skill-records="playerRecords.skill_record_list" />
        </div>

        <!-- 参加した村 -->
        <div class="mb-8">
          <h2 class="text-xl font-semibold mb-2">参加した村</h2>
          <ParticipateVillageList
            :participate-village-list="playerRecords.participate_village_list"
          />
        </div>
      </template>

      <!-- データなし -->
      <div v-else class="py-8 text-center text-gray-500 text-sm">
        <p>戦績が見つかりませんでした</p>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import CampRecords from "~/components/pages/record/CampRecords.vue";
import SkillRecords from "~/components/pages/record/SkillRecords.vue";
import ParticipateVillageList from "~/components/pages/record/ParticipateVillageList.vue";
import type { components } from "~/lib/api/schema";

type PlayerRecordsView = components["schemas"]["PlayerRecordsView"];

const meta = buildPageMeta({ title: "戦績" });
useSeoMeta(meta);

const route = useRoute();
const { apiCall } = useApi();

const playerId = computed(() => {
  const id = route.query.id;
  if (typeof id === "string") return parseInt(id, 10);
  return 0;
});

const playerRecords = ref<PlayerRecordsView | null>(null);
const loadingRecords = ref(true);

const playerName = computed(() => {
  if (!playerRecords.value) return "";
  const player = playerRecords.value.player;
  return `${player.nickname}@${player.twitter_user_name}`;
});

const wholeResult = computed(() => {
  if (!playerRecords.value) return "";
  const record = playerRecords.value.whole_record;
  return `${record.win_count}勝 ${record.lose_count}負 ${record.draw_count}分 (${toPercent(record.win_rate)}%/${toPercent(record.lose_rate)}%/${toPercent(record.draw_rate)}%)`;
});

const toPercent = (rate: number): number => {
  return Math.round(rate * 1000) / 10;
};

onMounted(async () => {
  if (!playerId.value) {
    loadingRecords.value = false;
    return;
  }

  loadingRecords.value = true;
  try {
    playerRecords.value = await apiCall<PlayerRecordsView>(`/player/${playerId.value}/record`);
  } catch {
    playerRecords.value = null;
  } finally {
    loadingRecords.value = false;
  }
});
</script>
