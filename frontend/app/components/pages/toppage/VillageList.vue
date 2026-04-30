<template>
  <div>
    <!-- ローディング中 -->
    <div v-if="loadingVillages" class="py-8 text-center text-gray-500 text-sm">読み込み中...</div>

    <!-- データなし -->
    <div
      v-else-if="!villages || villages.length === 0"
      class="py-8 text-center text-gray-500 text-sm"
    >
      <p>村が作成されていません</p>
    </div>

    <!-- テーブル -->
    <div v-else class="overflow-x-auto">
      <table class="w-full border-collapse bg-white text-sm text-left">
        <thead>
          <tr>
            <th class="border-b-2 border-gray-300 px-3 py-2 text-left font-semibold">村名</th>
            <th class="border-b-2 border-gray-300 px-3 py-2 text-left font-semibold">状態</th>
            <th class="border-b-2 border-gray-300 px-3 py-2 text-left font-semibold">作成者</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="village in villages" :key="village.id" class="odd:bg-white even:bg-gray-50">
            <td class="border-b border-gray-200 px-3 py-1">
              <NuxtLink
                :to="{ path: '/village', query: { id: village.id } }"
                class="text-blue-600 hover:text-blue-800"
              >
                {{ `${village.id}. ${village.name}` }}
              </NuxtLink>
            </td>
            <td class="border-b border-gray-200 px-3 py-1">
              {{ village.status.name }}
            </td>
            <td class="border-b border-gray-200 px-3 py-1">
              {{ village.creator_player.nickname }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { components } from "~/lib/api/schema";

type SimpleVillageView = components["schemas"]["SimpleVillageView"];

interface Props {
  villages: SimpleVillageView[] | null;
  loadingVillages: boolean;
}

withDefaults(defineProps<Props>(), {
  villages: null,
  loadingVillages: false,
});
</script>
