<template>
  <div class="message-area max-h-[80vh] overflow-y-auto">
    <Message
      v-for="m in filteredMessages"
      :key="`${m.time.village_day_id}-${m.time.unix_time_milli}-${m.from?.id ?? 'sys'}`"
      :message="m"
      :start="day.start_datetime"
      :is-prologue="isPrologue"
      :is-epilogue="day.is_epilogue"
      :color="messageColor(m)"
      @filter="filter($event)"
    />
  </div>
</template>

<script setup lang="ts">
import Message from "~/components/pages/village/message/Message.vue";
import type { components } from "~/lib/api/schema";
import { getMessageColor } from "~/lib/api/message-color";

type VillageView = components["schemas"]["VillageView"];
type VillageDay = components["schemas"]["VillageDay"];
type MessageView = components["schemas"]["MessageView"];

interface Props {
  day: VillageDay;
  filteringId: number | null;
  shouldFilterByStrong: boolean;
}

interface Emits {
  (e: "filter", payload: { participantId: number | undefined }): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const villageStore = useVillageStore();
const village = computed(() => villageStore.village as VillageView | null);
const messagesStore = useMessagesStore();

const isNight = computed(() => props.day.noon_night.code === "NIGHT");

const isPrologue = computed(() => {
  return props.day.day === 1 && props.day.noon_night.code === "NOON";
});

const messages = computed((): MessageView[] => {
  // 夜（非エピローグ）はAPI取得の nightMessages、昼・エピローグは Firebase直接の noonMessages
  const allMessages = (
    !props.day.is_epilogue && isNight.value
      ? messagesStore.nightMessages
      : messagesStore.noonMessages
  ) as MessageView[];
  return allMessages.filter((m) => m.time.village_day_id === props.day.id);
});

const filteredMessages = computed((): MessageView[] => {
  let msgs = messages.value;

  if (props.filteringId != null) {
    msgs = msgs.filter((m) => !!m.from && m.from.id === props.filteringId);
  }

  if (props.shouldFilterByStrong) {
    msgs = msgs.filter((m) => m.content.is_strong);
  }

  return msgs;
});

const messageColor = (message: MessageView): string | null => {
  if (!message.from) return null;
  // エピ以外の夜は色をつけない
  if (!props.day.is_epilogue && isNight.value) return null;
  if (!village.value) return null;
  return getMessageColor(village.value, message.from);
};

const filter = (payload: { participantId: number | undefined }) => {
  emit("filter", payload);
};
</script>

<style scoped>
/* 発言と発言の間にわずかな gap を入れて、各メッセージの枠を独立して認識しやすくする */
.message-area {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}
</style>
