<template>
  <div class="msg flex flex-row w-full leading-relaxed text-xs" :class="containerClasses">
    <!-- キャラ画像 -->
    <div v-if="image" class="mr-1.5 cursor-pointer shrink-0" @click="filter">
      <img
        :src="imgUrl"
        :width="imgWidth"
        :height="imgHeight"
        class="align-top rounded msg-avatar"
      />
    </div>
    <!-- メッセージ内容 -->
    <div class="flex-1 flex flex-col min-w-0">
      <!-- 発言者あり（通常発言 / 村建て）: 名前行 → 本文行 の 2 段 -->
      <template v-if="hasSender">
        <div class="flex items-baseline gap-1.5">
          <span class="flex-1 truncate" :class="nameColorClass" :style="nameStyle">{{
            fromName
          }}</span>
          <span v-if="roleTag" class="text-[10px] shrink-0 tracking-widest" :class="roleTag.cls">{{
            roleTag.label
          }}</span>
          <span class="text-fg-secondary text-xs shrink-0">{{ messageTime }}</span>
        </div>
        <!-- 本文ボックス: ここにだけ firewolf dark の bg/border/color を付ける。
             flex-1 で、右側（名前行+本文）がアバター画像より低いとき縦に伸びて高さを合わせる。 -->
        <div
          class="mt-0.5 flex-1 rounded border p-2 text-left whitespace-pre-wrap break-all font-sans"
          :class="[sayBodyClass, message.content.is_strong ? 'font-bold' : '']"
        >
          {{ message.content.text }}
        </div>
      </template>
      <!-- 発言者なし（システム通知）: 本文 + 種別 + 時間 を 1 行に。
           本文が長い場合は本文だけ折り返し、種別/時間は items-baseline で 1 行目に残る。 -->
      <div v-else class="flex items-baseline gap-1.5 min-w-0">
        <!-- システム通知の本文は塗り箱（暗グレー）上で読めるよう常に白系（text-fg）。陣営色は border が担う。 -->
        <span
          class="flex-1 min-w-0 whitespace-pre-wrap break-all font-sans text-fg"
          :class="message.content.is_strong ? 'font-bold' : ''"
          >{{ message.content.text }}</span
        >
        <span
          v-if="systemTag"
          class="text-[10px] shrink-0 tracking-widest"
          :style="{ color: systemTag.color }"
          >{{ systemTag.label }}</span
        >
        <span class="text-fg-secondary text-xs shrink-0">{{ messageTime }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { components } from "~/lib/api/schema";
import { MESSAGE_TYPE } from "~/lib/api/message-constants";
import {
  WOLF_SAY_CODES,
  MASON_SAY_CODES,
  MONO_CODES,
  INFO_WOLF_CODES,
  INFO_VILLAGE_CODES,
  INFO_PSYCHIC_CODES,
  INFO_MASON_CODES,
  INFO_LOVERS_CODES,
  INFO_CREATOR_CODES,
  INFO_FOX_CODES,
  INFO_PUBLIC_CODES,
  INFO_SYSTEM_CODES,
  type RoleVariant,
} from "~/lib/api/message-role";
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
  // システムメッセージ（from 無し）は発言者名を表示しない（旧「システム」表記を撤去）。
  return "";
});

// 発言者名を持つか（通常発言 / 村建て）。false = システム通知。
// システム通知は名前行を持たず、本文 + 種別 + 時間を 1 行に並べるレイアウトに切り替える。
// from の有無を主軸に判定する（chara.name.name が空のキャラでも通常発言を誤ってシステム扱いしないため）。
// CREATOR_SAY は from=null で固定名「村建て」を出す特殊ケースなので明示的に含める。
const hasSender = computed(
  () => !!props.message.from || props.message.content.type.code === MESSAGE_TYPE.CREATOR_SAY,
);

const messageTime = computed(() => {
  if (props.isPrologue || props.isEpilogue) {
    return dayjs(props.message.time.unix_time_milli).format("HH:mm");
  }
  const startDatetime = dayjs(props.start);
  const mesDatetime = dayjs(props.message.time.unix_time_milli);
  return `${mesDatetime.diff(startDatetime, "second")}秒`;
});

// システム通知の種別タグ（1 文字）。色は枠（info_* の border）= firewolf 原色トークン由来。
// ただし 赤(#f00) と 青(#00f) は暗背景上で文字が沈むため、同トークンを white 寄りに混ぜて明度を上げる
// （枠の「明るめ版」。緑/橙/桃/黄は十分明るいので枠色そのまま）。
// 会話系（roleTag を持つ wolf/mason/mono/grave/seer）は roleTag で表示するためここに含めない。
// CREATOR_SAY（「村建て」名で表示）/ PUBLIC_SYSTEM（全体通知）/ PRIVATE_SYSTEM はタグなし。
const TAG_WOLF = "color-mix(in srgb, var(--color-sysmsg-wolf-border) 60%, white)";
const TAG_PSYCHIC = "color-mix(in srgb, var(--color-sysmsg-psychic-border) 50%, white)";
const SYSTEM_TAG: Record<string, { label: string; color: string }> = {
  [MESSAGE_TYPE.PRIVATE_WEREWOLF]: { label: "狼", color: TAG_WOLF },
  [MESSAGE_TYPE.PRIVATE_FANATIC]: { label: "信", color: TAG_WOLF },
  [MESSAGE_TYPE.PRIVATE_SEER]: { label: "占", color: "var(--color-sysmsg-village-border)" },
  [MESSAGE_TYPE.PRIVATE_WISE]: { label: "賢", color: "var(--color-sysmsg-village-border)" },
  [MESSAGE_TYPE.PRIVATE_PSYCHIC]: { label: "霊", color: TAG_PSYCHIC },
  [MESSAGE_TYPE.PRIVATE_GURU]: { label: "導", color: TAG_PSYCHIC },
  [MESSAGE_TYPE.PRIVATE_CORONER]: { label: "検", color: TAG_PSYCHIC },
  [MESSAGE_TYPE.PRIVATE_MASON]: { label: "共", color: "var(--color-sysmsg-mason-border)" },
  [MESSAGE_TYPE.PRIVATE_SYMPATHIZER]: { label: "鳴", color: "var(--color-sysmsg-mason-border)" },
  [MESSAGE_TYPE.PRIVATE_LOVERS]: { label: "恋", color: "var(--color-sysmsg-lovers-border)" },
  [MESSAGE_TYPE.PRIVATE_FOX]: { label: "狐", color: "var(--color-sysmsg-fox-border)" },
};
const systemTag = computed(() => SYSTEM_TAG[props.message.content.type.code] ?? null);

// 発言（会話系）本文ボックスのクラス（コード単位）。firewolf dark の SayMessage.vue messageClass に対応。
// 色実体は main.css の --color-say-* を参照する .msg-say-* クラス（scoped）。
const SAY_BODY_CLASS: Record<string, string> = {
  [MESSAGE_TYPE.NORMAL_SAY]: "msg-say-normal",
  [MESSAGE_TYPE.WEREWOLF_SAY]: "msg-say-werewolf",
  [MESSAGE_TYPE.SYMPATHIZE_SAY]: "msg-say-sympathize",
  [MESSAGE_TYPE.LOVERS_SAY]: "msg-say-lovers",
  [MESSAGE_TYPE.MONOLOGUE_SAY]: "msg-say-monologue",
  [MESSAGE_TYPE.PRIVATE_ABILITY]: "msg-say-monologue",
  [MESSAGE_TYPE.GRAVE_SAY]: "msg-say-grave",
  [MESSAGE_TYPE.SPECTATE_SAY]: "msg-say-spectate",
  [MESSAGE_TYPE.SECRET_SAY]: "msg-say-secret",
  [MESSAGE_TYPE.CREATOR_SAY]: "msg-say-creator",
};
const sayBodyClass = computed(
  () => SAY_BODY_CLASS[props.message.content.type.code] ?? "msg-say-normal",
);

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
  // 会話系（bg + frame ありの発言バブル）
  if (WOLF_SAY_CODES.has(code)) return "wolf";
  if (MASON_SAY_CODES.has(code)) return "mason";
  if (MONO_CODES.has(code)) return "mono";
  if (code === MESSAGE_TYPE.GRAVE_SAY) return "grave";
  if (code === MESSAGE_TYPE.SPECTATE_SAY) return "seer";
  // 情報通知系（firewolf dark の塗り箱）
  if (INFO_WOLF_CODES.has(code)) return "info_wolf";
  if (INFO_VILLAGE_CODES.has(code)) return "info_village";
  if (INFO_PSYCHIC_CODES.has(code)) return "info_psychic";
  if (INFO_MASON_CODES.has(code)) return "info_mason";
  if (INFO_LOVERS_CODES.has(code)) return "info_lovers";
  if (INFO_CREATOR_CODES.has(code)) return "info_creator";
  if (INFO_FOX_CODES.has(code)) return "info_fox";
  if (INFO_PUBLIC_CODES.has(code)) return "info_public";
  if (INFO_SYSTEM_CODES.has(code)) return "info_system";
  // フォールバック normal: LOVERS_SAY / SECRET_SAY（通常発言と同列の "発言" 系）
  return "normal";
});

// root のクラス。
//  - 会話系（hasSender）: 本文ボックス（.msg-say-*）が色を持つので root は無装飾。
//  - システム系（from 無し）: root 自体を firewolf dark の塗り箱（rounded + border + padding + bg）にする。
//    info_creator（CREATOR_SAY）は「村建て」名を持つため hasSender=true 側＝会話レイアウトで扱う。
const containerClasses = computed(() => {
  if (hasSender.value) return "";
  const map: Partial<Record<RoleVariant, string>> = {
    info_wolf: "msg-info-wolf",
    info_village: "msg-info-village",
    info_psychic: "msg-info-psychic",
    info_mason: "msg-info-mason",
    info_lovers: "msg-info-lovers",
    info_fox: "msg-info-fox",
    info_public: "msg-info-public",
    info_system: "msg-info-system",
  };
  // !hasSender で到達するのは info_*（creator 除く）のみで全て map にあるため variant は通常見つかる。
  // 念のため未登録時は塗り箱の枠だけ（base）にフォールバックする。
  const base = "rounded-lg border px-2.5 py-1.5";
  const variant = map[roleVariant.value];
  return variant ? `${base} ${variant}` : base;
});

// 小タグ（人狼/共有/独白/墓下/観戦）。会話系のみ。情報通知系は systemTag（種別1文字）で識別。
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

// 名前テキストの色 override（名前行を持つ＝ hasSender のバリアントのみ対象）。
// 閉じた特別な場（wolf / mason / grave）はロール色に固定（個人識別カラー props.color は使わない）。
// info_creator（村建て）は塗り箱でなく会話レイアウトなので名前を白系（text-fg）に固定。
// それ以外（normal / mono / seer）は個人識別カラー優先、無ければ fg（map に入れない）。
// ※ 他の情報通知系（info_wolf 等）は名前行が描画されないためここに入れない（dead を避ける）。
const nameOverrideClass: Partial<Record<RoleVariant, string>> = {
  wolf: "text-wolf",
  mason: "text-mason",
  grave: "text-grave",
  info_creator: "text-fg",
};
const nameColorClass = computed(() => {
  const override = nameOverrideClass[roleVariant.value];
  if (override) return override;
  return props.color ? "" : "text-fg";
});
const nameStyle = computed(() => {
  if (nameOverrideClass[roleVariant.value]) return {};
  return props.color ? { color: props.color } : {};
});

const filter = () => {
  emit("filter", { participantId: props.message.from?.id });
};
</script>

<style scoped>
/*
 * チャットメッセージのスタイル（2026-06: firewolf dark 準拠へ再編）。
 *
 * 2 系統:
 *   - 会話系（発言バブル）: root（.msg）は無装飾。アバター ｜ 名前行 / 本文ボックス の構成で、
 *     本文ボックス（.msg-say-*）にだけ firewolf dark の bg/border/color を付ける（淡パステル地 + 黒文字）。
 *   - 情報通知系（info_*）: root 自体を firewolf dark の塗り箱（暗グレー bg + 原色 border + 白系テキスト）。
 *
 * 配色は main.css の --color-say-*（会話）/ --color-sysmsg-*（通知）を単一情報源にし、ハードコードしない。
 * 詳細は DESIGN.md「チャットメッセージ」節を参照。
 */

.msg {
  position: relative;
}

/* ============ 発言系（会話）本文ボックス: firewolf dark 準拠 ============
 * firewolf SayMessage.vue の messageClass（dark）を本文ボックスにのみ適用。
 * 淡いパステル地 + 黒文字（#0a0a0a）+ 同系 border。例外: lovers=赤文字 / creator=暗地+薄文字+紫枠。 */
.msg-say-normal {
  background-color: var(--color-say-normal-bg);
  border-color: var(--color-say-normal-border);
  color: var(--color-say-text);
}
.msg-say-werewolf {
  background-color: var(--color-say-werewolf-bg);
  border-color: var(--color-say-werewolf-border);
  color: var(--color-say-text);
}
.msg-say-sympathize {
  background-color: var(--color-say-sympathize-bg);
  border-color: var(--color-say-sympathize-border);
  color: var(--color-say-text);
}
.msg-say-lovers {
  background-color: var(--color-say-lovers-bg);
  border-color: var(--color-say-lovers-border);
  color: var(--color-say-lovers-text);
}
.msg-say-monologue {
  background-color: var(--color-say-monologue-bg);
  border-color: var(--color-say-monologue-border);
  color: var(--color-say-text);
}
.msg-say-grave {
  background-color: var(--color-say-grave-bg);
  border-color: var(--color-say-grave-border);
  color: var(--color-say-text);
}
.msg-say-spectate {
  background-color: var(--color-say-spectate-bg);
  border-color: var(--color-say-spectate-border);
  color: var(--color-say-text);
}
.msg-say-secret {
  background-color: var(--color-say-secret-bg);
  border-color: var(--color-say-secret-border);
  color: var(--color-say-text);
}
.msg-say-creator {
  background-color: var(--color-say-creator-bg);
  border-color: var(--color-say-creator-border);
  color: var(--color-say-creator-text);
}

/* ============ 情報通知系 (info_*): firewolf dark 準拠の「塗り箱」============
 *
 * 「システム生成の通知」は会話バブルとは別の存在感にする。2026-06 に firewolf の
 * ダークモード（暗いグレー塗り bg + 原色 border）に合わせてフラットな箱型へ変更:
 * - bg: 陣営ごとの暗いグレー塗り（`--color-sysmsg-*-bg`）。会話バブルの directional とは別系統
 * - border: firewolf の原色枠（`--color-sysmsg-*-border`）で陣営を即判別
 * - 本文・名前は白系（text-fg）— 中間グレー bg 上でミュート役職色は AA 不足のため（陣営色は border が担う）
 * - halo / 会話系の L 字 rim は持たない（フラット）
 * トークン定義と出典は main.css の `--color-sysmsg-*` 参照。 */
.msg-info-wolf {
  background-color: var(--color-sysmsg-wolf-bg);
  border-color: var(--color-sysmsg-wolf-border);
}
.msg-info-village {
  background-color: var(--color-sysmsg-village-bg);
  border-color: var(--color-sysmsg-village-border);
}
.msg-info-psychic {
  background-color: var(--color-sysmsg-psychic-bg);
  border-color: var(--color-sysmsg-psychic-border);
}
.msg-info-mason {
  background-color: var(--color-sysmsg-mason-bg);
  border-color: var(--color-sysmsg-mason-border);
}
.msg-info-lovers {
  background-color: var(--color-sysmsg-lovers-bg);
  border-color: var(--color-sysmsg-lovers-border);
}
/* CREATOR_SAY は「村建て」名を持つため会話系（.msg-say-creator）で扱う。info_creator の塗り箱は廃止。 */
.msg-info-fox {
  background-color: var(--color-sysmsg-fox-bg);
  border-color: var(--color-sysmsg-fox-border);
}
/* PUBLIC_SYSTEM: firewolf 同様 bg なし（くすんでない）+ 白枠のみ */
.msg-info-public {
  background-color: transparent;
  border-color: var(--color-sysmsg-public-border);
}
/* PRIVATE_SYSTEM: くすんだグレー塗り */
.msg-info-system {
  background-color: var(--color-sysmsg-system-bg);
  border-color: var(--color-sysmsg-system-border);
}
</style>
