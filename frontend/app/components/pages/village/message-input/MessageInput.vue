<template>
  <div class="flex gap-2 mb-2 items-stretch">
    <div class="msg-input-wrap relative flex-1">
      <ChatBubbleOvalLeftEllipsisIcon
        class="msg-input-icon"
        :class="{ 'is-disabled': !canSay }"
        aria-hidden="true"
      />
      <!-- @keypress.exact.enter / .shift.enter は UiFormInput が inheritAttrs: false + $attrs を
        ラッパー <div> に渡す構造のため、最終的に div に付く。keypress は内側 <input> から
        div へバブリングして発火するので意図通り動作する。 -->
      <UiFormInput
        v-model="message"
        type="text"
        :placeholder="placeholder"
        :disabled="!canSay"
        @keypress.exact.enter="keypressEnter"
        @keypress.shift.enter="keypressShiftEnter"
      />
    </div>
    <label
      class="strong-toggle flex items-center gap-1 px-3 py-2 text-xs cursor-pointer select-none"
      :class="[strong ? 'is-on' : '', !canSay ? 'is-disabled' : '']"
    >
      <input v-model="strong" type="checkbox" class="hidden" :disabled="!canSay" />
      <strong>B</strong>
      <span>強調</span>
    </label>
  </div>
</template>

<script setup lang="ts">
import UiFormInput from "~/components/ui/form/FormInput.vue";
import { ChatBubbleOvalLeftEllipsisIcon } from "@heroicons/vue/24/outline";

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
  // preventDefault は同期フェーズで呼ぶ必要があるため say() より先に
  e.preventDefault();
  say();
};

const keypressShiftEnter = async (e: KeyboardEvent) => {
  e.preventDefault();
  strong.value = true;
  await say();
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
/* チャット吹き出しアイコン: 入力欄が「チャット入力」だと一目で分かるよう左端に常時表示 */
.msg-input-wrap {
  position: relative;
}
.msg-input-icon {
  position: absolute;
  left: 0.7rem;
  top: 50%;
  width: 1rem;
  height: 1rem;
  transform: translateY(-50%);
  color: var(--color-fg-muted);
  pointer-events: none;
  z-index: 1;
  transition: opacity 150ms ease;
}
.msg-input-icon.is-disabled {
  opacity: 0.55;
}
/* UiFormInput の input の左 padding をアイコン分広げる（scoped 越境） */
.msg-input-wrap :deep(.br-input) {
  padding-left: 2.25rem;
}

/* 強調トグル: UiFormInput と高さ・角丸を揃えて並べる。
 * OFF 状態でも入力欄と並んで認識できる明度を確保 (旧 elev は panel 背景に溶け込んで「隠れて」見えた)。
 * ON 時は wine + blood-deep で染まり、外側 halo で「強調モード」を伝える。 */
.strong-toggle {
  /* line-soft ベースの 2 層 bg (パネルから明確に持ち上がる) */
  background:
    linear-gradient(135deg, rgba(40, 24, 24, 0.96) 0%, rgba(28, 16, 16, 0.96) 100%) padding-box,
    linear-gradient(
        225deg,
        rgba(244, 241, 232, 0.25) 0%,
        rgba(139, 26, 26, 0.3) 50%,
        rgba(139, 26, 26, 0.35) 100%
      )
      border-box;
  color: var(--color-fg);
  border: 1px solid transparent;
  border-radius: 10px;
  transition:
    background 200ms ease,
    color 150ms ease,
    box-shadow 200ms ease;
  white-space: nowrap;
}
.strong-toggle:hover:not(.is-disabled):not(.is-on) {
  background:
    linear-gradient(135deg, rgba(52, 32, 32, 0.96) 0%, rgba(36, 22, 22, 0.96) 100%) padding-box,
    linear-gradient(
        225deg,
        rgba(244, 241, 232, 0.35) 0%,
        rgba(224, 46, 46, 0.4) 50%,
        rgba(139, 26, 26, 0.5) 100%
      )
      border-box;
  color: var(--color-bone);
}
.strong-toggle.is-on {
  background:
    linear-gradient(135deg, rgba(80, 24, 24, 0.95) 0%, rgba(50, 16, 16, 0.95) 100%) padding-box,
    linear-gradient(
        225deg,
        rgba(255, 165, 135, 0.85) 0%,
        rgba(224, 46, 46, 0.6) 50%,
        rgba(139, 26, 26, 0.65) 100%
      )
      border-box;
  color: var(--color-bone);
  box-shadow:
    inset 0 0 8px rgba(224, 46, 46, 0.3),
    0 0 14px -4px color-mix(in srgb, var(--color-blood) 40%, transparent);
}
.strong-toggle.is-disabled {
  opacity: 0.55;
  cursor: not-allowed;
}
/* 内側 checkbox は hidden で見えないため、ラベル側で focus-within の視覚を出す */
.strong-toggle:focus-within {
  outline: 2px solid color-mix(in srgb, var(--color-blood) 65%, transparent);
  outline-offset: 2px;
}
</style>
