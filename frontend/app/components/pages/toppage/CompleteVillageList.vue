<template>
  <div class="overflow-x-auto">
    <table class="w-full border-collapse bg-elev text-sm text-fg">
      <thead>
        <tr>
          <th class="border-b-2 border-line-bright px-3 py-2 text-left font-semibold">村名</th>
          <th class="border-b-2 border-line-bright px-3 py-2 text-left font-semibold">人数</th>
          <th class="border-b-2 border-line-bright px-3 py-2 text-left font-semibold">編成</th>
          <th class="border-b-2 border-line-bright px-3 py-2 text-left font-semibold">勝利</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="village in tableVillages" :key="village.id" class="row-stripe">
          <td class="border-b border-line-soft px-3 py-1">
            <NuxtLink :to="{ path: '/village', query: { id: village.id } }" class="village-link">
              {{ village.name }}
            </NuxtLink>
          </td>
          <td class="border-b border-line-soft px-3 py-1">{{ village.participantCount }}</td>
          <td class="border-b border-line-soft px-3 py-1">{{ village.organization }}</td>
          <td class="border-b border-line-soft px-3 py-1">{{ village.winCamp }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import type { components } from "~/lib/api/schema";

type SimpleVillageView = components["schemas"]["SimpleVillageView"];

interface Props {
  villages: SimpleVillageView[];
}

const props = defineProps<Props>();

const tableVillages = computed(() =>
  props.villages.map((village) => ({
    id: village.id,
    name: village.name,
    participantCount: `${village.participants.count}人`,
    organization:
      village.setting.organizations.organization[String(village.participants.count)] ?? "",
    winCamp: village.win_camp?.name ?? "引分",
  })),
);
</script>

<style scoped>
.row-stripe:nth-child(odd) {
  background-color: var(--color-elev);
}
.row-stripe:nth-child(even) {
  background-color: var(--color-soft);
}

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
