<template>
  <div class="overflow-x-auto">
    <table class="w-full border-collapse bg-white text-sm">
      <thead>
        <tr class="bg-gray-100">
          <th class="border border-gray-300 px-3 py-2 text-left">村名</th>
          <th class="border border-gray-300 px-3 py-2 text-left">人数</th>
          <th class="border border-gray-300 px-3 py-2 text-left">編成</th>
          <th class="border border-gray-300 px-3 py-2 text-left">勝利</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="village in tableVillages" :key="village.id" class="odd:bg-white even:bg-gray-50">
          <td class="border border-gray-300 px-3 py-1">
            <NuxtLink
              :to="{ path: '/village', query: { id: village.id } }"
              class="text-blue-600 hover:text-blue-800 underline"
            >
              {{ village.name }}
            </NuxtLink>
          </td>
          <td class="border border-gray-300 px-3 py-1">{{ village.participantCount }}</td>
          <td class="border border-gray-300 px-3 py-1">{{ village.organization }}</td>
          <td class="border border-gray-300 px-3 py-1">{{ village.winCamp }}</td>
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
