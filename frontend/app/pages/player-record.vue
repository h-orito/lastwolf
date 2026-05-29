<template>
  <section class="px-4 py-6 sm:py-8">
    <div class="mx-auto max-w-5xl space-y-6 sm:space-y-8">
      <!-- ローディング中 -->
      <article v-if="loadingRecords" class="panel px-5 py-6 sm:px-7 sm:py-8">
        <header class="section-heading">
          <h1 class="section-title">戦績</h1>
        </header>
        <div class="py-8 text-center text-sm text-fg-muted">読み込み中...</div>
      </article>

      <!-- データ表示 -->
      <template v-else-if="playerRecords">
        <!-- プレイヤー名 + 総合戦績 -->
        <article class="panel px-5 py-6 sm:px-7 sm:py-8">
          <header class="section-heading">
            <h1 class="section-title">{{ playerName || "戦績" }}</h1>
          </header>
          <div class="text-center">
            <p class="text-xs tracking-wide text-fg-muted">総合戦績</p>
            <p class="mt-1 text-sm text-fg sm:text-[0.9375rem]">{{ wholeResult }}</p>
          </div>
        </article>

        <!-- 陣営戦績 -->
        <article class="panel px-5 py-6 sm:px-7 sm:py-8">
          <header class="section-heading">
            <h2 class="section-title">陣営戦績</h2>
          </header>
          <CampRecords :camp-records="playerRecords.camp_record_list" />
        </article>

        <!-- 役職戦績 -->
        <article class="panel px-5 py-6 sm:px-7 sm:py-8">
          <header class="section-heading">
            <h2 class="section-title">役職戦績</h2>
          </header>
          <SkillRecords :skill-records="playerRecords.skill_record_list" />
        </article>

        <!-- 参加した村 -->
        <article class="panel px-5 py-6 sm:px-7 sm:py-8">
          <header class="section-heading">
            <h2 class="section-title">参加した村</h2>
          </header>
          <ParticipateVillageList
            :participate-village-list="playerRecords.participate_village_list"
          />
        </article>
      </template>

      <!-- データなし -->
      <article v-else class="panel px-5 py-6 sm:px-7 sm:py-8">
        <header class="section-heading">
          <h1 class="section-title">戦績</h1>
        </header>
        <div class="py-8 text-center text-sm text-fg-muted">
          <p>戦績が見つかりませんでした</p>
        </div>
      </article>
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
