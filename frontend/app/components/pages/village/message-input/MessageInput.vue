<template>
  <div class="flex gap-1 mb-2">
    <input
      v-model="message"
      type="text"
      :placeholder="placeholder"
      :disabled="!canSay"
      class="flex-1 border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:border-[#3991f4] font-sans"
      :class="messageBgColorClass"
      @keypress.exact.enter="keypressEnter"
      @keypress.shift.enter="keypressShiftEnter"
    />
    <label
      class="flex items-center gap-1 px-2 py-1 text-xs rounded border cursor-pointer select-none"
      :class="
        strong
          ? 'bg-[#3991f4] text-white border-[#3991f4]'
          : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
      "
    >
      <input v-model="strong" type="checkbox" class="hidden" :disabled="!canSay" />
      <strong>B</strong> 強調
    </label>
  </div>
</template>

<script setup lang="ts">
import type { components } from "~/lib/api/schema";
import { VILLAGE_STATUS } from "~/lib/api/village-status-constants";
import { MESSAGE_TYPE } from "~/lib/api/message-constants";
import dayjs from "dayjs";

type SituationAsParticipantView = components["schemas"]["SituationAsParticipantView"];
type VillageView = components["schemas"]["VillageView"];

const villageStore = useVillageStore();
const situation = computed(() => villageStore.situation as SituationAsParticipantView | null);
const village = computed(() => villageStore.village as VillageView | null);
const latestDay = computed(() => villageStore.latestDay);
const { apiCall } = useApi();

const message = ref("");
const strong = ref(false);
const isSilentTime = ref(false);

const messageType = computed(() => {
  if (!village.value || !situation.value?.say.available_say) return "";
  const selectable = situation.value.say.selectable_message_type_list;
  if (selectable.some((t) => t.code === MESSAGE_TYPE.WEREWOLF_SAY))
    return MESSAGE_TYPE.WEREWOLF_SAY;
  if (selectable.some((t) => t.code === MESSAGE_TYPE.SYMPATHIZE_SAY))
    return MESSAGE_TYPE.SYMPATHIZE_SAY;
  if (selectable.some((t) => t.code === MESSAGE_TYPE.NORMAL_SAY)) return MESSAGE_TYPE.NORMAL_SAY;
  if (selectable.some((t) => t.code === MESSAGE_TYPE.GRAVE_SAY)) return MESSAGE_TYPE.GRAVE_SAY;
  if (selectable.some((t) => t.code === MESSAGE_TYPE.MONOLOGUE_SAY))
    return MESSAGE_TYPE.MONOLOGUE_SAY;
  return "";
});

const messageBgColorClass = computed(() => {
  switch (messageType.value) {
    case MESSAGE_TYPE.WEREWOLF_SAY:
      return "bg-red-50";
    case MESSAGE_TYPE.SYMPATHIZE_SAY:
      return "bg-green-50";
    case MESSAGE_TYPE.GRAVE_SAY:
      return "bg-blue-50";
    case MESSAGE_TYPE.MONOLOGUE_SAY:
      return "bg-yellow-50";
    default:
      return "";
  }
});

const placeholder = computed(() => {
  if (isSilentTime.value) return "沈黙時間中です。";
  switch (messageType.value) {
    case MESSAGE_TYPE.WEREWOLF_SAY:
      return "人狼同士にしか聞こえない会話が可能です。";
    case MESSAGE_TYPE.SYMPATHIZE_SAY:
      return "共有者同士にしか聞こえない会話が可能です。";
    case MESSAGE_TYPE.GRAVE_SAY:
      return "死者同士にしか聞こえない会話が可能です。";
    case MESSAGE_TYPE.MONOLOGUE_SAY:
      return "自分にしか見えない発言が可能です。";
    default:
      return "Enterで発言、Shift+Enterで強調発言できます。";
  }
});

const canSay = computed(() => {
  if (!situation.value) return false;
  return (
    situation.value.say.available_say &&
    situation.value.say.selectable_message_type_list.length > 0 &&
    !isSilentTime.value
  );
});

const canSubmit = computed(() => {
  const mes = message.value.trim();
  return mes.length > 0 && mes.length <= 200;
});

// サイレントタイムチェックタイマー
let timer: ReturnType<typeof setInterval> | null = null;

onMounted(() => {
  timer = setInterval(refreshTimer, 1000);
});

onUnmounted(() => {
  if (timer) clearInterval(timer);
});

const refreshTimer = () => {
  if (!village.value || village.value.status.code !== VILLAGE_STATUS.IN_PROGRESS) return;
  const day = latestDay.value;
  if (!day) return;
  const silentSeconds = village.value.setting.rules.silent_seconds;
  if (silentSeconds == null || day.noon_night.code !== "NOON") {
    isSilentTime.value = false;
    return;
  }
  const start = dayjs(day.start_datetime);
  const now = dayjs();
  const silentEnd = start.add(silentSeconds, "second");
  isSilentTime.value = now.isBefore(silentEnd);
};

const keypressEnter = (e: KeyboardEvent) => {
  say();
  e.preventDefault();
};

const keypressShiftEnter = async (e: KeyboardEvent) => {
  strong.value = true;
  await say();
  e.preventDefault();
};

const say = async () => {
  if (!canSubmit.value) return;
  const mes = message.value.trim().substring(0, 200);
  message.value = "";
  const isStrong = strong.value;
  strong.value = false;
  try {
    await apiCall(`/village/${villageStore.villageId}/say`, {
      method: "POST",
      body: {
        message: mes,
        message_type: messageType.value,
        strong: isStrong,
      },
    });
  } catch {
    // エラーは無視
  }
};
</script>
