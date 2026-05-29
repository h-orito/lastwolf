<template>
  <div>
    <!-- データなし -->
    <div v-if="campRecords.length === 0" class="py-4 text-center text-sm text-fg-muted">
      <p>参加した村がありません</p>
    </div>

    <!-- テーブル -->
    <div v-else class="overflow-x-auto">
      <table class="doc-table whitespace-nowrap text-xs text-fg">
        <thead>
          <tr>
            <th>陣営</th>
            <th>参加</th>
            <th>勝利</th>
            <th>敗北</th>
            <th>引分</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="record in campRecords" :key="record.camp.code" class="row-stripe">
            <td>{{ record.camp.name }}</td>
            <td>{{ record.participate_count }}回</td>
            <td>{{ `${record.win_count}回(${toPercent(record.win_rate)}%)` }}</td>
            <td>{{ `${record.lose_count}回(${toPercent(record.lose_rate)}%)` }}</td>
            <td>{{ `${record.draw_count}回(${toPercent(record.draw_rate)}%)` }}</td>
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
