<template>
  <section class="px-4 py-6 sm:py-8">
    <div class="mx-auto max-w-2xl">
      <article class="panel px-5 py-6 sm:px-7 sm:py-8">
        <header class="section-heading">
          <h1 class="section-title">終了した村一覧</h1>
        </header>

        <!-- ローディング中 -->
        <div v-if="loading" class="registry-state">
          <span class="registry-state-mark" aria-hidden="true">···</span>
          <span class="registry-state-text">読み込み中</span>
        </div>

        <!-- 取得失敗（エラーと空状態を区別する） -->
        <div v-else-if="hasError" class="registry-state">
          <span class="registry-state-mark" aria-hidden="true">—</span>
          <span class="registry-state-text">
            終了した村一覧の取得に失敗しました。時間をおいて再度お試しください。
          </span>
        </div>

        <!-- 終了した村レジストリ（データなし時はコンポーネント側で空状態を表示） -->
        <CompleteVillageList v-else :villages="villages ?? []" />
      </article>
    </div>
  </section>
</template>

<script setup lang="ts">
import CompleteVillageList from "~/components/pages/toppage/CompleteVillageList.vue";
import type { components } from "~/lib/api/schema";
import { VILLAGE_STATUS } from "~/lib/api/village-status-constants";

type SimpleVillageView = components["schemas"]["SimpleVillageView"];
type VillagesView = components["schemas"]["VillagesView"];

const meta = buildPageMeta({ title: "終了した村一覧" });
useSeoMeta(meta);

const { apiCall } = useApi();

const villages = ref<SimpleVillageView[] | null>(null);
const loading = ref(true);
const hasError = ref(false);

onMounted(async () => {
  try {
    const data = await apiCall<VillagesView>("/village/list", {
      params: {
        village_status: [VILLAGE_STATUS.COMPLETED],
      },
    });
    villages.value = data.list;
  } catch {
    hasError.value = true;
  } finally {
    loading.value = false;
  }
});
</script>
