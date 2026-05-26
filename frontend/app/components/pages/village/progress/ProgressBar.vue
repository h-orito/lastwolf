<template>
  <div v-if="village && isInProgress" class="progress-bar mb-2">
    <strong class="text-xs text-fg">{{ timeName }}</strong>
    <strong v-if="needsAbility" class="text-xs text-wolf ml-2">時間内に能力行使してください</strong>
    <strong v-if="needsVote" class="text-xs text-wolf ml-2">時間内に投票してください</strong>
    <div class="mt-1">
      <!-- プログレスバー -->
      <div class="w-full bg-soft rounded h-4 relative overflow-hidden border border-line-soft">
        <div
          class="h-4 rounded transition-all duration-1000"
          :class="barColorClass"
          :style="{ width: `${barPercent}%` }"
        />
        <span class="absolute inset-0 flex items-center justify-center text-xs font-bold text-bone">
          残り{{ left }}秒
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { components } from "~/lib/api/schema";
import { VILLAGE_STATUS } from "~/lib/api/village-status-constants";
import dayjs from "dayjs";

type VillageView = components["schemas"]["VillageView"];
type SituationAsParticipantView = components["schemas"]["SituationAsParticipantView"];

const villageStore = useVillageStore();
const village = computed(() => villageStore.village as VillageView | null);
const latestDay = computed(() => villageStore.latestDay);
const situation = computed(() => villageStore.situation as SituationAsParticipantView | null);

const { apiCall } = useApi();

const interval = ref(0);
const left = ref(0);
const isSilentTime = ref(false);

const isInProgress = computed(() => {
  return !!village.value && village.value.status.code === VILLAGE_STATUS.IN_PROGRESS;
});

const timeName = computed(() => {
  if (!village.value || !latestDay.value) return "";
  const day = latestDay.value;
  const base = `${day.day}日目${day.noon_night.name}`;
  if (day.noon_night.code === "NOON" && isSilentTime.value) {
    return `${base}（沈黙時間中）`;
  }
  return base;
});

const barPercent = computed(() => {
  if (interval.value <= 0) return 0;
  return Math.min(100, (left.value / interval.value) * 100);
});

const needsAbility = computed(() => {
  if (!situation.value) return false;
  const list = situation.value.ability.list;
  if (list.length <= 0) return false;
  return list[0]?.usable ?? false;
});

const needsVote = computed(() => {
  if (!situation.value) return false;
  const vote = situation.value.vote;
  return vote.available_vote && vote.target == null;
});

const barColorClass = computed(() => {
  // 残り時間バー: ダーク世界観の差異色（彩度を抑えつつ識別可能なペース）
  if (isSilentTime.value) return "bar-silent";
  if (left.value > 60) return "bar-safe";
  if (left.value > 30) return "bar-warn";
  return "bar-danger";
});

const refreshTimer = () => {
  if (!village.value || !isInProgress.value || !latestDay.value) return;

  const day = latestDay.value;
  const start = dayjs(day.start_datetime);
  const end = dayjs(day.end_datetime);
  interval.value = end.diff(start, "second");

  const now = dayjs();
  const diff = end.diff(now, "second");
  left.value = diff < 0 ? 0 : diff;

  isSilentTime.value = false;
  const silentSeconds = village.value.setting.rules.silent_seconds;
  if (silentSeconds != null && day.noon_night.code === "NOON") {
    const silentEnd = start.add(silentSeconds, "second");
    isSilentTime.value = now.isBefore(silentEnd);
  }

  // 残り0秒を切っていたら定期的に更新チェック
  checkDaychangeIfNeeded(diff);
};

const checkDaychangeIfNeeded = (diff: number) => {
  if (diff >= 0 || !situation.value?.participate.myself) return;
  const index = village.value!.participants.member_list.findIndex(
    (p) => p.id === situation.value!.participate.myself!.id,
  );
  const mod = ((-1 * diff) % village.value!.participants.count) | 0;
  if (index !== mod) return;
  apiCall(`/village/${village.value!.id}/daychange-check`, { method: "POST" }).catch(() => {});
};

defineExpose({ refreshTimer });
</script>

<style scoped>
/* 残り時間: 安全 → mason 緑（おだやか）/ 注意 → seer 淡金 / 危険 → blood 赤グロー / 沈黙 → 灰 */
.bar-safe {
  background: linear-gradient(
    180deg,
    var(--color-mason) 0%,
    color-mix(in srgb, var(--color-mason) 70%, #000) 100%
  );
}
.bar-warn {
  background: linear-gradient(
    180deg,
    var(--color-seer) 0%,
    color-mix(in srgb, var(--color-seer) 70%, #000) 100%
  );
}
.bar-danger {
  background: linear-gradient(180deg, var(--color-blood) 0%, var(--color-blood-deep) 100%);
  box-shadow: inset 0 0 12px rgba(224, 46, 46, 0.5);
}
.bar-silent {
  background: linear-gradient(
    180deg,
    var(--color-fg-muted) 0%,
    color-mix(in srgb, var(--color-fg-muted) 60%, #000) 100%
  );
}
</style>
