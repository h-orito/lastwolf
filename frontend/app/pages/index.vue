<template>
  <div>
    <!-- スポットライト -->
    <Spotlight />

    <!-- イントロ -->
    <Intro />

    <!-- プレイヤー情報・ログイン -->
    <PlayerStats />

    <!-- 村一覧 -->
    <section class="py-8 px-4 bg-deep">
      <div class="max-w-5xl mx-auto text-center">
        <h1 class="text-lg font-bold mb-4 text-fg">村一覧</h1>
        <div class="text-sm">
          <VillageList :villages="villages" :loading-villages="loadingVillages" />
          <div class="mt-4 flex flex-wrap justify-center gap-2">
            <UiButton button-type="primary" :disabled="!canCreateVillage" to="/create-village">
              村を作成
            </UiButton>
            <UiButton button-type="secondary" to="/village-list"> 終了した村 </UiButton>
          </div>
        </div>
      </div>
    </section>

    <!-- 最近終了した村（進行中の村がない場合） -->
    <section v-if="completeVillages && completeVillages.length > 0" class="py-8 px-4 bg-deep">
      <div class="max-w-5xl mx-auto text-center">
        <h1 class="text-lg font-bold mb-4 text-fg">最近終了した村</h1>
        <div class="text-sm text-left">
          <CompleteVillageList :villages="completeVillages" />
        </div>
      </div>
    </section>

    <!-- フッター -->
    <IndexFooter />
  </div>
</template>

<script setup lang="ts">
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
