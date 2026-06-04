<template>
  <div class="panel-compact text-fg text-xs mb-2">
    <div class="panel-compact-header">チャット</div>
    <div class="px-3 py-2">
      <!-- 日付タブ -->
      <div class="flex flex-wrap gap-1 mb-2">
        <button
          v-for="day in days"
          :key="day.id"
          class="day-tab"
          :class="tabId === day.id ? 'is-active' : ''"
          @click="tabId = day.id"
        >
          <SunIcon v-if="day.noon_night.code === 'NOON'" class="w-3 h-3" />
          <MoonIcon v-else class="w-3 h-3" />
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
            <label class="inline-flex items-center gap-1 cursor-pointer text-xs text-fg">
              <input
                v-model="shouldFilterByStrong"
                type="checkbox"
                class="rounded cursor-pointer accent-blood"
              />
              強調発言のみ表示
            </label>
          </div>
          <hr class="border-line-soft my-2" />
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
import { SunIcon, MoonIcon } from "@heroicons/vue/24/outline";
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

watch(days, (newDays) => {
  if (newDays.length > 0 && tabId.value === 0) {
    tabId.value = newDays[newDays.length - 1]?.id ?? 0;
  }
});

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

<style scoped>
.day-tab {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.25rem 0.5rem;
  font-size: 0.75rem;
  border-radius: 0.375rem;
  border: 1px solid var(--color-line-soft);
  background-color: var(--color-elev);
  color: var(--color-fg-secondary);
  transition:
    background-color 150ms ease,
    color 150ms ease,
    border-color 150ms ease;
}
.day-tab:hover {
  background-color: var(--color-soft);
  color: var(--color-fg);
}
.day-tab.is-active {
  background-color: var(--color-wine);
  border-color: var(--color-blood-deep);
  color: var(--color-bone);
}
</style>
