<template>
  <div class="text-xs overflow-x-auto">
    <table v-if="tableVillages.length > 0" class="w-full border-collapse bg-white">
      <thead>
        <tr class="bg-gray-100">
          <th class="border border-gray-300 px-3 py-2 text-left">村名</th>
          <th class="border border-gray-300 px-3 py-2 text-left">人数</th>
          <th class="border border-gray-300 px-3 py-2 text-left">編成</th>
          <th class="border border-gray-300 px-3 py-2 text-left">勝利</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="v in tableVillages" :key="v.village_id" class="odd:bg-white even:bg-gray-50">
          <td class="border border-gray-300 px-3 py-1">
            <NuxtLink
              :to="{ path: '/village', query: { id: v.village_id } }"
              class="text-blue-600 hover:text-blue-800"
            >
              {{ v.village_name }}
            </NuxtLink>
          </td>
          <td class="border border-gray-300 px-3 py-1">{{ v.participant_count }}</td>
          <td class="border border-gray-300 px-3 py-1">{{ v.organization }}</td>
          <td class="border border-gray-300 px-3 py-1">{{ v.win_camp }}</td>
        </tr>
      </tbody>
    </table>
    <div v-else class="text-center text-gray-500 py-4">
      <p>終了した村はありません</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { components } from "~/lib/api/schema";

type SimpleVillageView = components["schemas"]["SimpleVillageView"];

interface Props {
  villages: SimpleVillageView[] | null;
}

const props = defineProps<Props>();

const tableVillages = computed(() => {
  if (!props.villages) return [];
  return props.villages.map((v) => ({
    village_id: v.id,
    village_name: v.name,
    participant_count: `${v.participants.count}人`,
    organization: v.setting.organizations.organization[v.participants.count] ?? "",
    win_camp: v.win_camp?.name ?? "引分",
  }));
});
</script>
