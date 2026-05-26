<template>
  <div class="flex gap-1 mb-2">
    <input
      v-model="message"
      type="text"
      :placeholder="placeholder"
      :disabled="!canSay"
      class="msg-input flex-1 px-2 py-1 text-sm font-sans"
      :class="messageBgColorClass"
      @keypress.exact.enter="keypressEnter"
      @keypress.shift.enter="keypressShiftEnter"
    />
    <label
      class="strong-toggle flex items-center gap-1 px-2 py-1 text-xs cursor-pointer select-none"
      :class="strong ? 'is-on' : ''"
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
  if (!canSay.value) return "";
  // メッセージ種別ごとに input の bg にロール色をうっすら載せる（dark theme 対応）
  switch (messageType.value) {
    case MESSAGE_TYPE.WEREWOLF_SAY:
      return "msg-input-wolf";
    case MESSAGE_TYPE.SYMPATHIZE_SAY:
      return "msg-input-mason";
    case MESSAGE_TYPE.GRAVE_SAY:
      return "msg-input-grave";
    case MESSAGE_TYPE.MONOLOGUE_SAY:
      return "msg-input-mono";
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

<style scoped>
.msg-input {
  background-color: var(--color-elev);
  color: var(--color-fg);
  border: 1px solid var(--color-line-soft);
  border-radius: 0.375rem;
  transition:
    border-color 150ms ease,
    background-color 150ms ease,
    box-shadow 150ms ease;
}
.msg-input::placeholder {
  color: var(--color-fg-muted);
}
.msg-input:focus {
  outline: none;
  border-color: var(--color-blood);
  box-shadow: 0 0 0 2px color-mix(in srgb, var(--color-blood) 25%, transparent);
}
.msg-input:disabled {
  opacity: 0.55;
  cursor: not-allowed;
}

/* メッセージ種別ごとに base bg を変える: ロール色を 8% 程度 elev に重ねる */
.msg-input-wolf {
  background-color: color-mix(in srgb, var(--color-wolf) 8%, var(--color-elev));
}
.msg-input-mason {
  background-color: color-mix(in srgb, var(--color-mason) 8%, var(--color-elev));
}
.msg-input-grave {
  background-color: color-mix(in srgb, var(--color-grave) 8%, var(--color-elev));
}
.msg-input-mono {
  background-color: color-mix(in srgb, var(--color-mono) 8%, var(--color-elev));
}

.strong-toggle {
  background-color: var(--color-elev);
  color: var(--color-fg-secondary);
  border: 1px solid var(--color-line-soft);
  border-radius: 0.375rem;
  transition:
    background-color 150ms ease,
    color 150ms ease,
    border-color 150ms ease;
}
.strong-toggle:hover {
  background-color: var(--color-soft);
  color: var(--color-fg);
}
.strong-toggle.is-on {
  background-color: var(--color-wine);
  color: var(--color-bone);
  border-color: var(--color-blood-deep);
}
</style>
