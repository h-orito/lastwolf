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
      <!-- 会話系（各種発言 / 村建て）: 名前行 → 本文ボックス の 2 段 -->
      <template v-if="isConversation">
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
          :class="systemTag.cls"
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

// 名前行に出す発言者名。テンプレート上は会話レイアウト（v-if="isConversation"）でのみ参照され、
// システム通知（v-else）では描画されない。CREATOR_SAY は from=null だが会話系（SAY_BODY_CLASS に含む）
// なので「村建て」を返す。それ以外の from=null（システム通知）は会話側に来ないため "" は実質描画されない。
const fromName = computed(() => {
  if (props.message.from) return props.message.from.chara.name.name;
  if (props.message.content.type.code === MESSAGE_TYPE.CREATOR_SAY) return "村建て";
  return "";
});

const messageTime = computed(() => {
  if (props.isPrologue || props.isEpilogue) {
    return dayjs(props.message.time.unix_time_milli).format("HH:mm");
  }
  const startDatetime = dayjs(props.start);
  const mesDatetime = dayjs(props.message.time.unix_time_milli);
  return `${mesDatetime.diff(startDatetime, "second")}秒`;
});

// システム通知の種別タグ（1 文字）。色は枠（info_* の border）= firewolf 原色トークン由来で、
// scoped の .systag-* クラスに閉じる（赤/青は暗背景で沈むため white 寄せの明るめ版にしている）。
// 会話系（roleTag を持つ wolf/mason/mono/grave/seer）は roleTag で表示するためここに含めない。
// CREATOR_SAY（「村建て」名で表示）/ PUBLIC_SYSTEM（全体通知）/ PRIVATE_SYSTEM はタグなし。
const SYSTEM_TAG: Record<string, { label: string; cls: string }> = {
  [MESSAGE_TYPE.PRIVATE_WEREWOLF]: { label: "狼", cls: "systag-wolf" },
  [MESSAGE_TYPE.PRIVATE_FANATIC]: { label: "信", cls: "systag-wolf" },
  [MESSAGE_TYPE.PRIVATE_SEER]: { label: "占", cls: "systag-village" },
  [MESSAGE_TYPE.PRIVATE_WISE]: { label: "賢", cls: "systag-village" },
  [MESSAGE_TYPE.PRIVATE_PSYCHIC]: { label: "霊", cls: "systag-psychic" },
  [MESSAGE_TYPE.PRIVATE_GURU]: { label: "導", cls: "systag-psychic" },
  [MESSAGE_TYPE.PRIVATE_CORONER]: { label: "検", cls: "systag-psychic" },
  [MESSAGE_TYPE.PRIVATE_MASON]: { label: "共", cls: "systag-mason" },
  [MESSAGE_TYPE.PRIVATE_SYMPATHIZER]: { label: "鳴", cls: "systag-mason" },
  [MESSAGE_TYPE.PRIVATE_LOVERS]: { label: "恋", cls: "systag-lovers" },
  [MESSAGE_TYPE.PRIVATE_FOX]: { label: "狐", cls: "systag-fox" },
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
// isConversation=true なら必ず SAY_BODY_CLASS にヒットするため ?? は理論上到達しない安全ネット。
const sayBodyClass = computed(
  () => SAY_BODY_CLASS[props.message.content.type.code] ?? "msg-say-normal",
);

// 会話レイアウト（アバター ｜ 名前行 / 本文ボックス）で描画するか。
// 会話系の truth source は SAY_BODY_CLASS のキー集合（各種発言 + 村建て）。from の有無ではなく
// メッセージ種別で判定するため、from=null の say（恋人/秘話 等）が来ても誤ってシステム通知に落ちない。
// message-constants の isSayType() を使わないのは、CREATOR_SAY / PRIVATE_ABILITY が MESSAGE_TYPE_MAP では
// "system" に分類される一方、lastwolf では会話レイアウト（村建て / 独り言）で扱うため分類が一致しないから。
const isConversation = computed(() =>
  Object.hasOwn(SAY_BODY_CLASS, props.message.content.type.code),
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
//  - 会話系（isConversation）: 本文ボックス（.msg-say-*）が色を持つので root は無装飾。
//  - システム系: root 自体を firewolf dark の塗り箱（rounded + border + padding + bg）にする。
//    info_creator（CREATOR_SAY）は会話系（SAY_BODY_CLASS に含む）なので会話レイアウトで扱う。
const containerClasses = computed(() => {
  if (isConversation.value) return "";
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
  // !isConversation で到達するのは info_*（creator 除く）。想定外のシステム種別（PARTICIPANTS / ACTION 等が
  // 万一メッセージ列に混入した場合）は roleVariant=normal で map 未登録になるため、個別システム通知
  // （info_system / くすんだグレー塗り箱）の見た目にフォールバックして「枠だけ」になるのを防ぐ。
  const base = "rounded-lg border px-2.5 py-1.5";
  return `${base} ${map[roleVariant.value] ?? "msg-info-system"}`;
});

// 小タグ（人狼/共有/独白/墓下/観戦）。会話系のみ。情報通知系は systemTag（種別1文字）で識別。
// NORMAL_SAY / LOVERS_SAY / SECRET_SAY（roleVariant=normal）は roleTag を出さない（意図的）。
// 恋人=桃 / 秘話=灰紫 は本文ボックスの色で識別できるため小タグは不要。
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

// 名前テキストの色 override（名前行を持つ＝会話系 isConversation のバリアントのみ対象）。
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

/* システム通知の種別タグ（1 文字）の色。枠（--color-sysmsg-*-border）と同色。
 * 赤(#f00)/青(#00f) は暗背景で文字が沈むため white を混ぜて明度を上げる（緑/橙/桃/黄は枠色そのまま）。 */
.systag-wolf {
  color: color-mix(in srgb, var(--color-sysmsg-wolf-border) 60%, white);
}
.systag-village {
  color: var(--color-sysmsg-village-border);
}
.systag-psychic {
  color: color-mix(in srgb, var(--color-sysmsg-psychic-border) 50%, white);
}
.systag-mason {
  color: var(--color-sysmsg-mason-border);
}
.systag-lovers {
  color: var(--color-sysmsg-lovers-border);
}
.systag-fox {
  color: var(--color-sysmsg-fox-border);
}
</style>
