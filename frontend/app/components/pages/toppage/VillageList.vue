<template>
  <div>
    <!-- ローディング中 -->
    <div v-if="loadingVillages" class="py-8 text-center text-fg-secondary text-sm">
      読み込み中...
    </div>

    <!-- データなし -->
    <div
      v-else-if="!villages || villages.length === 0"
      class="py-8 text-center text-fg-secondary text-sm"
    >
      <p>村が作成されていません</p>
    </div>

    <!-- テーブル -->
    <div v-else class="overflow-x-auto">
      <table class="w-full border-collapse bg-elev text-sm text-left text-fg">
        <thead>
          <tr>
            <th class="border-b-2 border-line-bright px-3 py-2 text-left font-semibold">村名</th>
            <th class="border-b-2 border-line-bright px-3 py-2 text-left font-semibold">状態</th>
            <th class="border-b-2 border-line-bright px-3 py-2 text-left font-semibold">作成者</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="village in villages" :key="village.id" class="row-stripe">
            <td class="border-b border-line-soft px-3 py-1">
              <NuxtLink :to="{ path: '/village', query: { id: village.id } }" class="village-link">
                {{ `${village.id}. ${village.name}` }}
              </NuxtLink>
            </td>
            <td class="border-b border-line-soft px-3 py-1">
              {{ village.status.name }}
            </td>
            <td class="border-b border-line-soft px-3 py-1">
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

<style scoped>
.row-stripe:nth-child(odd) {
  background-color: var(--color-elev);
}
.row-stripe:nth-child(even) {
  background-color: var(--color-soft);
}

/* テキストリンクには text-blood（CTA 色）。ember は rim 専用なので使わず、hover は明度を引き上げる */
.village-link {
  color: var(--color-blood);
  transition:
    color 150ms ease,
    text-shadow 150ms ease;
}
.village-link:hover {
  color: #ff5b5b;
  text-decoration: underline;
  text-shadow: 0 0 8px rgba(224, 46, 46, 0.4);
}
</style>
