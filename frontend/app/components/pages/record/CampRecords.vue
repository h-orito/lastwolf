<template>
  <div>
    <!-- データなし -->
    <div v-if="campRecords.length === 0" class="py-4 text-center text-gray-500 text-sm">
      <p>参加した村がありません</p>
    </div>

    <!-- テーブル -->
    <div v-else class="overflow-x-auto">
      <table class="w-full border-collapse bg-white text-xs whitespace-nowrap">
        <thead>
          <tr class="bg-gray-100">
            <th class="border border-gray-300 px-3 py-2 text-left">陣営</th>
            <th class="border border-gray-300 px-3 py-2 text-left">参加</th>
            <th class="border border-gray-300 px-3 py-2 text-left">勝利</th>
            <th class="border border-gray-300 px-3 py-2 text-left">敗北</th>
            <th class="border border-gray-300 px-3 py-2 text-left">引分</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="record in campRecords"
            :key="record.camp.code"
            class="odd:bg-white even:bg-gray-50"
          >
            <td class="border border-gray-300 px-3 py-1">{{ record.camp.name }}</td>
            <td class="border border-gray-300 px-3 py-1">{{ record.participate_count }}回</td>
            <td class="border border-gray-300 px-3 py-1">
              {{ `${record.win_count}回(${toPercent(record.win_rate)}%)` }}
            </td>
            <td class="border border-gray-300 px-3 py-1">
              {{ `${record.lose_count}回(${toPercent(record.lose_rate)}%)` }}
            </td>
            <td class="border border-gray-300 px-3 py-1">
              {{ `${record.draw_count}回(${toPercent(record.draw_rate)}%)` }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { components } from "~/lib/api/schema";

type CampRecord = components["schemas"]["CampRecord"];

interface Props {
  campRecords: CampRecord[];
}

withDefaults(defineProps<Props>(), {
  campRecords: () => [],
});

const toPercent = (rate: number): number => {
  return Math.round(rate * 1000) / 10;
};
</script>
