<template>
  <div>
    <section class="py-8 px-4 bg-gray-100">
      <div class="max-w-5xl mx-auto text-left">
        <h1 class="text-lg font-bold mb-4">終了した村一覧</h1>

        <!-- ローディング中 -->
        <div v-if="loading" class="py-8 text-center text-gray-500 text-sm">読み込み中...</div>

        <!-- データなし -->
        <div
          v-else-if="!villages || villages.length === 0"
          class="py-8 text-center text-gray-500 text-sm"
        >
          <p>村がありません</p>
        </div>

        <!-- テーブル -->
        <div v-else class="overflow-x-auto">
          <table class="w-full border-collapse bg-white text-sm">
            <thead>
              <tr class="bg-gray-200">
                <th class="border border-gray-300 px-3 py-2 text-left">村名</th>
                <th class="border border-gray-300 px-3 py-2 text-left">人数</th>
                <th class="border border-gray-300 px-3 py-2 text-left">勝利陣営</th>
                <th class="border border-gray-300 px-3 py-2 text-left">作成者</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="village in villages"
                :key="village.id"
                class="odd:bg-white even:bg-gray-50"
              >
                <td class="border border-gray-300 px-3 py-1">
                  <NuxtLink
                    :to="{ path: '/village', query: { id: village.id } }"
                    class="text-blue-600 hover:text-blue-800"
                  >
                    {{ `${village.id}. ${village.name}` }}
                  </NuxtLink>
                </td>
                <td class="border border-gray-300 px-3 py-1">{{ village.participants.count }}人</td>
                <td class="border border-gray-300 px-3 py-1">
                  {{ village.win_camp ? village.win_camp.name : "-" }}
                </td>
                <td class="border border-gray-300 px-3 py-1">
                  {{ village.creator_player.nickname }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import type { components } from "~/lib/api/schema";
import { VILLAGE_STATUS } from "~/lib/api/village-status-constants";

type SimpleVillageView = components["schemas"]["SimpleVillageView"];
type VillagesView = components["schemas"]["VillagesView"];

const meta = buildPageMeta({ title: "終了した村一覧" });
useSeoMeta(meta);

const { apiCall } = useApi();

const villages = ref<SimpleVillageView[] | null>(null);
const loading = ref(true);

onMounted(async () => {
  try {
    const data = await apiCall<VillagesView>("/village/list", {
      params: {
        village_status: [VILLAGE_STATUS.COMPLETED],
      },
    });
    villages.value = data.list;
  } catch {
    villages.value = [];
  } finally {
    loading.value = false;
  }
});
</script>
