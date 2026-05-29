<template>
  <div>
    <!-- 画面上部のヘッダー: LASTWOLF + ユーザー情報 -->
    <TopHeader />

    <!-- スポットライト（フルブリードのヒーロー画像） -->
    <Spotlight />

    <!-- 以下のセクションは max-w コンテナにまとめて panel として並べる -->
    <div class="mx-auto max-w-6xl space-y-6 px-4 py-6 sm:space-y-8 sm:px-6 sm:py-8">
      <!-- イントロ -->
      <Intro />

      <!-- プレイヤー情報・ログイン -->
      <PlayerStats />

      <!-- 村一覧 -->
      <section class="panel px-5 py-6 sm:px-7 sm:py-8">
        <div class="mx-auto max-w-2xl">
          <header class="section-heading">
            <h2 class="section-title">村一覧</h2>
          </header>
          <VillageList :villages="villages" :loading-villages="loadingVillages" />
          <div class="mt-5 flex flex-wrap justify-center gap-2">
            <UiButton button-type="primary" :disabled="!canCreateVillage" to="/create-village">
              村を作成
            </UiButton>
            <UiButton button-type="secondary" to="/village-list">終了した村</UiButton>
          </div>
        </div>
      </section>

      <!-- 最近終了した村（進行中の村がない場合） -->
      <section
        v-if="completeVillages && completeVillages.length > 0"
        class="panel px-5 py-6 sm:px-7 sm:py-8"
      >
        <div class="mx-auto max-w-2xl">
          <header class="section-heading">
            <h2 class="section-title">最近終了した村</h2>
          </header>
          <CompleteVillageList :villages="completeVillages" label="最近終了した村一覧" />
        </div>
      </section>

      <!-- フッター -->
      <IndexFooter />
    </div>
  </div>
</template>

<script setup lang="ts">
import TopHeader from "~/components/pages/toppage/TopHeader.vue";
import Spotlight from "~/components/pages/toppage/Spotlight.vue";
import Intro from "~/components/pages/toppage/Intro.vue";
import PlayerStats from "~/components/pages/toppage/PlayerStats.vue";
import VillageList from "~/components/pages/toppage/VillageList.vue";
import CompleteVillageList from "~/components/pages/toppage/CompleteVillageList.vue";
import IndexFooter from "~/components/pages/toppage/IndexFooter.vue";
import type { components } from "~/lib/api/schema";
import { VILLAGE_STATUS } from "~/lib/api/village-status-constants";

type SimpleVillageView = components["schemas"]["SimpleVillageView"];
type VillagesView = components["schemas"]["VillagesView"];

definePageMeta({ layout: "top" });

const meta = buildPageMeta({ title: "" });
useSeoMeta(meta);
useHead({ titleTemplate: () => "LASTWOLF" });

const { apiCall } = useApi();
const { isAuthenticated, myselfPlayer } = useAuth();

const villages = ref<SimpleVillageView[] | null>(null);
const completeVillages = ref<SimpleVillageView[] | null>(null);
const loadingVillages = ref(true);

const canCreateVillage = computed(() => {
  if (!isAuthenticated.value || !myselfPlayer.value) return false;
  return myselfPlayer.value.available_create_village;
});

// 進行中の村一覧を取得
const loadVillages = async (): Promise<SimpleVillageView[]> => {
  const data = await apiCall<VillagesView>("/village/list", {
    params: {
      village_status: [
        VILLAGE_STATUS.PROLOGUE,
        VILLAGE_STATUS.ROLLCALLING,
        VILLAGE_STATUS.IN_PROGRESS,
        VILLAGE_STATUS.EPILOGUE,
      ],
    },
  });
  return data.list;
};

// 終了した村一覧を取得
const loadCompleteVillages = async (): Promise<SimpleVillageView[]> => {
  const data = await apiCall<VillagesView>("/village/list", {
    params: {
      village_status: [VILLAGE_STATUS.COMPLETED],
    },
  });
  return data.list;
};

onMounted(async () => {
  loadingVillages.value = true;
  try {
    villages.value = await loadVillages();
  } catch {
    villages.value = [];
  } finally {
    loadingVillages.value = false;
  }

  // 進行中の村がない場合は最近終了した村を表示
  if (!villages.value || villages.value.length === 0) {
    try {
      const allComplete = await loadCompleteVillages();
      completeVillages.value = allComplete.slice(0, 3);
    } catch {
      completeVillages.value = [];
    }
  }
});
</script>
