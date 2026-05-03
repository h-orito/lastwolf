<template>
  <div
    class="flex flex-row w-full leading-relaxed py-0.5 border-t border-b border-gray-100 text-xs message-border"
    :class="messageClasses"
    :style="messageStyle"
  >
    <!-- キャラ画像 -->
    <div v-if="image" class="mr-1 cursor-pointer shrink-0" @click="filter">
      <img :src="imgUrl" :width="imgWidth" :height="imgHeight" class="align-top rounded" />
    </div>
    <!-- メッセージ内容 -->
    <div class="flex-1 flex flex-col min-w-0">
      <div class="flex items-baseline gap-1">
        <span class="flex-1 truncate">{{ fromName }}</span>
        <span v-if="messageType" class="text-gray-400 text-xs shrink-0">{{ messageType }}</span>
        <span class="text-gray-400 text-xs shrink-0">{{ messageTime }}</span>
      </div>
      <div>
        <span
          class="whitespace-pre-wrap break-all font-sans"
          :class="message.content.is_strong ? 'font-bold' : ''"
          >{{ message.content.text }}</span
        >
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { components } from "~/lib/api/schema";
import { MESSAGE_TYPE } from "~/lib/api/message-constants";
import dayjs from "dayjs";

type MessageView = components["schemas"]["MessageView"];
type CharaImage = components["schemas"]["CharaImage"];

interface Props {
  message: MessageView;
  start: string;
  isPrologue: boolean;
  isEpilogue: boolean;
  color: string | null;
}

interface Emits {
  (e: "filter", payload: { participantId: number | undefined }): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const villageStore = useVillageStore();

const fromName = computed(() => {
  if (props.message.from) return props.message.from.chara.name.name;
  if (props.message.content.type.code === MESSAGE_TYPE.CREATOR_SAY) return "村建て";
  return "システム";
});

const messageTime = computed(() => {
  if (props.isPrologue || props.isEpilogue) {
    return dayjs(props.message.time.unix_time_milli).format("HH:mm");
  }
  const startDatetime = dayjs(props.start);
  const mesDatetime = dayjs(props.message.time.unix_time_milli);
  return `${mesDatetime.diff(startDatetime, "second")}秒`;
});

const messageType = computed(() => {
  const code = props.message.content.type.code;
  switch (code) {
    case MESSAGE_TYPE.PUBLIC_SYSTEM:
      return "";
    case MESSAGE_TYPE.PRIVATE_ABILITY:
    case MESSAGE_TYPE.MONOLOGUE_SAY:
      return "[独]";
    case MESSAGE_TYPE.PRIVATE_PSYCHIC:
      return "[霊]";
    case MESSAGE_TYPE.PRIVATE_WEREWOLF:
    case MESSAGE_TYPE.WEREWOLF_SAY:
      return "[狼]";
    case MESSAGE_TYPE.PRIVATE_FANATIC:
      return "[信]";
    case MESSAGE_TYPE.PRIVATE_MASON:
    case MESSAGE_TYPE.SYMPATHIZE_SAY:
      return "[共]";
    case MESSAGE_TYPE.PRIVATE_FOX:
      return "[狐]";
    case MESSAGE_TYPE.GRAVE_SAY:
      return "[墓]";
    default:
      return "";
  }
});

const image = computed((): CharaImage | null => {
  const map = villageStore.participantIdImgMap;
  if (!props.message.from) return null;
  return map.get(props.message.from.id) ?? null;
});

const imgUrl = computed(() => image.value?.image_url ?? "");
// モバイルは半分のサイズに
const isMobile = ref(false);
onMounted(() => {
  isMobile.value = window.innerWidth < 768;
});
const imgWidth = computed(() => {
  if (!image.value) return 0;
  return isMobile.value ? Math.floor(image.value.width / 2) : image.value.width;
});
const imgHeight = computed(() => {
  if (!image.value) return 0;
  return isMobile.value ? Math.floor(image.value.height / 2) : image.value.height;
});

const messageClasses = computed(() => {
  const classes: string[] = [];
  const code = props.message.content.type.code;

  if (
    (
      [
        MESSAGE_TYPE.PRIVATE_WEREWOLF,
        MESSAGE_TYPE.WEREWOLF_SAY,
        MESSAGE_TYPE.PRIVATE_FANATIC,
      ] as string[]
    ).includes(code)
  ) {
    classes.push("text-red-600");
  } else if (
    ([MESSAGE_TYPE.PRIVATE_MASON, MESSAGE_TYPE.SYMPATHIZE_SAY] as string[]).includes(code)
  ) {
    classes.push("text-green-600");
  } else if (code === MESSAGE_TYPE.GRAVE_SAY) {
    classes.push("text-blue-600");
  } else if (code === MESSAGE_TYPE.LOVERS_SAY) {
    classes.push("text-pink-600");
  } else if (code === MESSAGE_TYPE.CREATOR_SAY) {
    classes.push("text-gray-900");
  } else {
    classes.push("text-gray-600");
  }

  return classes;
});

const messageStyle = computed(() => {
  if (props.color) return { color: props.color };
  return {};
});

const filter = () => {
  emit("filter", { participantId: props.message.from?.id });
};
</script>
