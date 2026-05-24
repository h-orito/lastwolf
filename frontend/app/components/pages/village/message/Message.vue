<template>
  <div
    class="flex flex-row w-full leading-relaxed py-1 px-1 text-xs bg-elev"
    :class="containerClasses"
  >
    <!-- キャラ画像 -->
    <div v-if="image" class="mr-1 cursor-pointer shrink-0" @click="filter">
      <img
        :src="imgUrl"
        :width="imgWidth"
        :height="imgHeight"
        class="align-top rounded"
        :class="avatarRingClass"
      />
    </div>
    <!-- メッセージ内容 -->
    <div class="flex-1 flex flex-col min-w-0">
      <div class="flex items-baseline gap-1">
        <span class="flex-1 truncate" :class="nameColorClass" :style="nameStyle">{{
          fromName
        }}</span>
        <span v-if="roleTag" class="text-xs shrink-0" :class="roleTag.cls">{{
          roleTag.label
        }}</span>
        <span v-if="showMessageType" class="text-fg-secondary text-xs shrink-0">{{
          messageType
        }}</span>
        <span class="text-fg-secondary text-xs shrink-0">{{ messageTime }}</span>
      </div>
      <div>
        <span
          class="whitespace-pre-wrap break-all font-sans"
          :class="[bodyColorClass, message.content.is_strong ? 'font-bold' : '']"
          >{{ message.content.text }}</span
        >
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { MESSAGE_TYPE } from "~/lib/api/message-constants";

// メッセージコードのグルーピング（roleVariant と messageType の双方から参照）。
// module scope に置くことでコンポーネントインスタンスごとの再生成を避ける
const WOLF_CODES = new Set<string>([
  MESSAGE_TYPE.PRIVATE_WEREWOLF,
  MESSAGE_TYPE.WEREWOLF_SAY,
  MESSAGE_TYPE.PRIVATE_FANATIC,
]);
const MASON_CODES = new Set<string>([MESSAGE_TYPE.PRIVATE_MASON, MESSAGE_TYPE.SYMPATHIZE_SAY]);
const MONO_CODES = new Set<string>([MESSAGE_TYPE.MONOLOGUE_SAY, MESSAGE_TYPE.PRIVATE_ABILITY]);

type RoleVariant = "normal" | "wolf" | "mason" | "mono" | "grave" | "seer" | "creator";
</script>

<script setup lang="ts">
import type { components } from "~/lib/api/schema";
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

const roleVariant = computed<RoleVariant>(() => {
  const code = props.message.content.type.code;
  // 以下は DESIGN.md でロール色未定義のため normal にフォールバック（Phase 3+ で要整理）:
  //   - LOVERS_SAY / SECRET_SAY: 通常発言と同列の "発言" 系
  //   - PRIVATE_SEER / PRIVATE_PSYCHIC / PRIVATE_GURU / PRIVATE_WISE / PRIVATE_FOX /
  //     PRIVATE_SYMPATHIZER / PRIVATE_CORONER / PRIVATE_LOVERS: 役職限定のシステム通知
  //     （messageType の [霊]/[狐] 等で識別できるため normal で許容）
  if (WOLF_CODES.has(code)) return "wolf";
  if (MASON_CODES.has(code)) return "mason";
  if (MONO_CODES.has(code)) return "mono";
  if (code === MESSAGE_TYPE.GRAVE_SAY) return "grave";
  if (code === MESSAGE_TYPE.SPECTATE_SAY) return "seer";
  if (code === MESSAGE_TYPE.CREATOR_SAY) return "creator";
  return "normal";
});

const containerClasses = computed(() => {
  // 通常発言の上ボーダーは DESIGN.md 仕様で fg-secondary
  const map: Record<RoleVariant, string> = {
    normal: "border-t border-fg-secondary",
    wolf: "border-t-2 border-wolf",
    mason: "border-t-2 border-mason",
    mono: "border-l-2 border-mono border-dotted italic",
    grave: "border-t border-grave border-dashed italic",
    seer: "border-t border-seer border-dashed",
    creator: "border-t border-gold",
  };
  return map[roleVariant.value];
});

const avatarRingClass = computed(() => {
  const map: Record<RoleVariant, string> = {
    normal: "",
    wolf: "ring-2 ring-wolf",
    mason: "ring-2 ring-mason",
    mono: "",
    grave: "ring-1 ring-grave",
    seer: "ring-1 ring-seer",
    creator: "ring-1 ring-gold",
  };
  return map[roleVariant.value];
});

// roleTag と messageType の重複表示を抑制する
//   例: MONOLOGUE_SAY は roleTag "独白" / messageType "[独]" の両方を返すため [独] を抑制
//   ただし PRIVATE_FANATIC は roleTag "人狼" 配下だが messageType は固有の "[信]" なので残す
const showMessageType = computed(() => {
  if (!messageType.value) return false;
  if (!roleTag.value) return true;
  return props.message.content.type.code === MESSAGE_TYPE.PRIVATE_FANATIC;
});

// 小タグ（人狼/共有/独白/墓下/観戦）。normal / creator は表示しない
const roleTag = computed<{ label: string; cls: string } | null>(() => {
  const map: Partial<Record<RoleVariant, { label: string; cls: string }>> = {
    wolf: { label: "人狼", cls: "text-wolf" },
    mason: { label: "共有", cls: "text-mason" },
    mono: { label: "独白", cls: "text-mono" },
    grave: { label: "墓下", cls: "text-grave" },
    seer: { label: "観戦", cls: "text-seer" },
  };
  return map[roleVariant.value] ?? null;
});

const bodyColorClass = computed(() => {
  // 本文色はロール色ではなく fg ベース。視覚的な分類は枠線・タグ・アバターリングで表現
  const map: Record<RoleVariant, string> = {
    normal: "text-fg",
    wolf: "text-fg",
    mason: "text-fg",
    mono: "text-fg-secondary",
    grave: "text-fg-secondary",
    seer: "text-fg",
    creator: "text-fg",
  };
  return map[roleVariant.value];
});

// 名前テキストの色: 個人識別カラー (props.color) を優先、無ければ fg
const nameColorClass = computed(() => (props.color ? "" : "text-fg"));
const nameStyle = computed(() => (props.color ? { color: props.color } : {}));

const filter = () => {
  emit("filter", { participantId: props.message.from?.id });
};
</script>
