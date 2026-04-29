<template>
  <div class="border border-gray-600 rounded bg-gray-700 text-white text-xs mb-2">
    <div class="bg-gray-600 px-3 py-2 rounded-t font-bold">チャット</div>
    <div class="px-3 py-2">
      <!-- 日付タブ -->
      <div class="flex flex-wrap gap-1 mb-2">
        <button
          v-for="day in days"
          :key="day.id"
          class="px-2 py-1 text-xs rounded border transition-colors"
          :class="
            tabId === day.id
              ? 'bg-gray-800 border-gray-800 text-white'
              : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-100'
          "
          @click="tabId = day.id"
        >
          <span class="mr-1">{{ dayIcon(day) }}</span>
          {{ dayLabel(day) }}
        </button>
      </div>

      <!-- 選択中の日のコンテンツ -->
      <template v-for="day in days" :key="day.id">
        <div v-if="tabId === day.id">
          <AliveParticipants
            :day="day"
            :filtering-id="filteringId"
            @filter="filteringOrCancel($event)"
          />
          <!-- 強調発言フィルタ -->
          <div class="mb-2">
            <label class="flex items-center gap-1 cursor-pointer text-xs">
              <input v-model="shouldFilterByStrong" type="checkbox" class="rounded" />
              強調発言のみ表示
            </label>
          </div>
          <hr class="border-gray-500 my-2" />
          <!-- メッセージ入力 -->
          <MessageInput />
          <!-- メッセージ一覧 -->
          <DayMessages
            :day="day"
            :filtering-id="filteringId"
            :should-filter-by-strong="shouldFilterByStrong"
            @filter="filteringOrCancel($event)"
          />
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import AliveParticipants from "~/components/pages/village/message/AliveParticipants.vue";
import MessageInput from "~/components/pages/village/message-input/MessageInput.vue";
import DayMessages from "~/components/pages/village/message/DayMessages.vue";
import type { components } from "~/lib/api/schema";

type VillageView = components["schemas"]["VillageView"];
type VillageDay = components["schemas"]["VillageDay"];

const villageStore = useVillageStore();
const village = computed(() => villageStore.village as VillageView | null);

const days = computed((): VillageDay[] => {
  if (!village.value) return [];
  return village.value.days.list.filter((d) => !d.noon_night.code.startsWith("VOTE"));
});

const tabId = ref<number>(
  days.value.length === 0 ? 0 : (days.value[days.value.length - 1]?.id ?? 0),
);

const filteringId = ref<number | null>(null);
const shouldFilterByStrong = ref(false);

const dayLabel = (day: VillageDay): string => {
  if (day.is_epilogue) return "エピローグ";
  if (village.value) {
    const epilogueDay = village.value.days.list.find((d) => d.is_epilogue);
    if (epilogueDay && day.id > epilogueDay.id) return "終了";
  }
  return `${day.day}日目${day.noon_night.name}`;
};

const dayIcon = (day: VillageDay): string => {
  return day.noon_night.code === "NOON" ? "☀" : "🌙";
};

const filteringOrCancel = (payload: { participantId: number | undefined }) => {
  if (payload.participantId == null) return;
  if (filteringId.value === payload.participantId) {
    filteringId.value = null;
  } else {
    filteringId.value = payload.participantId;
  }
};

const openLatestday = () => {
  const lastDay = days.value[days.value.length - 1];
  if (lastDay) tabId.value = lastDay.id;
};

defineExpose({ openLatestday });
</script>
