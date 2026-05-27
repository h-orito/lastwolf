<template>
  <div
    class="msg flex flex-row w-full leading-relaxed py-1.5 px-2.5 text-xs rounded-lg"
    :class="containerClasses"
  >
    <!-- キャラ画像 -->
    <div v-if="image" class="mr-1.5 cursor-pointer shrink-0" @click="filter">
      <img
        :src="imgUrl"
        :width="imgWidth"
        :height="imgHeight"
        class="align-top rounded msg-avatar"
        :class="avatarRingClass"
      />
    </div>
    <!-- メッセージ内容 -->
    <div class="flex-1 flex flex-col min-w-0">
      <div class="flex items-baseline gap-1.5">
        <span class="flex-1 truncate" :class="nameColorClass" :style="nameStyle">{{
          fromName
        }}</span>
        <span v-if="roleTag" class="text-[10px] shrink-0 tracking-widest" :class="roleTag.cls">{{
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

<script setup lang="ts">
import type { components } from "~/lib/api/schema";
import { MESSAGE_TYPE } from "~/lib/api/message-constants";
import {
  WOLF_SAY_CODES,
  MASON_SAY_CODES,
  MONO_CODES,
  INFO_WOLF_CODES,
  INFO_FANATIC_CODES,
  INFO_VILLAGE_CODES,
  INFO_PSYCHIC_CODES,
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
  // 会話系（bg + frame ありの発言バブル）
  if (WOLF_SAY_CODES.has(code)) return "wolf";
  if (MASON_SAY_CODES.has(code)) return "mason";
  if (MONO_CODES.has(code)) return "mono";
  if (code === MESSAGE_TYPE.GRAVE_SAY) return "grave";
  if (code === MESSAGE_TYPE.SPECTATE_SAY) return "seer";
  if (code === MESSAGE_TYPE.CREATOR_SAY) return "creator";
  // 情報通知系（bg なし、ロール色テキスト）
  if (INFO_WOLF_CODES.has(code)) return "info_wolf";
  if (INFO_FANATIC_CODES.has(code)) return "info_fanatic";
  if (INFO_VILLAGE_CODES.has(code)) return "info_village";
  if (INFO_PSYCHIC_CODES.has(code)) return "info_psychic";
  if (INFO_SYSTEM_CODES.has(code)) return "info_system";
  // フォールバック normal:
  //   LOVERS_SAY / SECRET_SAY: 通常発言と同列の "発言" 系
  //   PRIVATE_FOX / PRIVATE_LOVERS / PRIVATE_SYMPATHIZER: 第三陣営寄り or 不明確
  return "normal";
});

const containerClasses = computed(() => {
  const map: Record<RoleVariant, string> = {
    // 会話系
    normal: "msg-normal",
    wolf: "msg-wolf",
    mason: "msg-mason",
    mono: "msg-mono italic",
    grave: "msg-grave italic",
    seer: "msg-seer",
    creator: "msg-creator",
    // 情報通知系（bg なし）
    info_wolf: "msg-info msg-info-wolf",
    info_fanatic: "msg-info msg-info-fanatic",
    info_village: "msg-info msg-info-village",
    info_psychic: "msg-info msg-info-psychic",
    info_system: "msg-info msg-info-system",
  };
  return map[roleVariant.value];
});

const avatarRingClass = computed(() => {
  // 会話系のみ avatar ring を出す。情報通知系は基本 from=null でアバター自体が出ない
  const map: Record<RoleVariant, string> = {
    normal: "",
    wolf: "msg-avatar-wolf",
    mason: "msg-avatar-mason",
    mono: "",
    grave: "msg-avatar-grave",
    seer: "msg-avatar-seer",
    creator: "msg-avatar-creator",
    info_wolf: "",
    info_fanatic: "",
    info_village: "",
    info_psychic: "",
    info_system: "",
  };
  return map[roleVariant.value];
});

// roleTag（"人狼" "共有" "独白" "墓下" "観戦"）と messageType（"[狼]" "[共]" "[独]" ...）は
// 意味が重複するため、roleTag が出るケースでは messageType を抑制する。
//   例: WEREWOLF_SAY → roleTag "人狼" だけ表示し、"[狼]" は隠す
// 情報通知系（info_*）は roleTag を持たないため messageType "[狼]" 等が表示される
const showMessageType = computed(() => {
  if (!messageType.value) return false;
  return !roleTag.value;
});

// 小タグ（人狼/共有/独白/墓下/観戦）。会話系のみ。情報通知系は messageType 接頭辞で識別。
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
  // 会話系は fg / fg-secondary ベース、情報通知系は陣営色そのものを本文色に
  const map: Record<RoleVariant, string> = {
    normal: "text-fg",
    wolf: "text-fg",
    mason: "text-fg",
    mono: "text-fg-secondary",
    grave: "text-fg-secondary",
    seer: "text-fg",
    creator: "text-fg",
    info_wolf: "text-wolf",
    info_fanatic: "text-fanatic",
    info_village: "text-mason",
    info_psychic: "text-grave",
    info_system: "text-fg-secondary",
  };
  return map[roleVariant.value];
});

// 名前テキストの色: ロールが閉じた特別な場（wolf / mason / grave）と情報通知系では
// ロール色に固定（個人識別カラー props.color は使わない）。それ以外は個人識別カラー優先、
// 無ければ fg。
const nameOverrideClass: Partial<Record<RoleVariant, string>> = {
  wolf: "text-wolf",
  mason: "text-mason",
  grave: "text-grave",
  info_wolf: "text-wolf",
  info_fanatic: "text-fanatic",
  info_village: "text-mason",
  info_psychic: "text-grave",
  info_system: "text-fg-secondary",
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
 * Black & Blood directional lighting をチャットメッセージにも展開。
 *
 * 改訂方針 (2026-05):
 *   - base bg を「ロール色を 14% 程度混ぜた elev」に変更（純黒ではなく、ロール色が透けて見える）
 *   - L 字 rim の outer stop を transparent から「ロール色 20-25%」に上げて、全周にロール色のラインを残す
 *     （左下→右上方向に減衰する directional は維持）
 *   - 外側に box-shadow でロール色の halo を追加。「囁き」が発光して見える
 *
 * 役割別 rim パターン:
 *   - 会話・mono 系: L 字 rim（radial-gradient(ellipse at 0% 100%) border-box）
 *     左下角で最大、上辺・右辺もロール色の floor 値で薄く可視。
 *   - システム系（system / village_info / psychic_info）: 全周 solid rim
 *     （linear-gradient(color, color) border-box）。情報通知の枠を強調。
 *
 * 配色は `var(--color-*)` トークンを単一情報源にし、透明度合成は
 * `color-mix(in srgb, var(--color-X) N%, transparent)` で表現する。
 * rgba ハードコードは禁止（トークン値が変わったときに二重管理になるため）。
 *
 * 詳細は DESIGN.md「チャットメッセージ」節を参照。
 */

.msg {
  /* 共通ベース。padding-box / border-box を使うため border 透明を指定するだけに留め、
   * 背景は各 variant が `background:` ショートハンドで自前管理する。
   * （`.msg` に background-color を書くと background ショートハンドにリセットされ
   * 機能しないため。新 variant 追加時は必ず elev 層を含めること） */
  position: relative;
  border: 1px solid transparent;
}

/* Normal — 中性色。base bg-elev + 薄い line-soft 線で枠を出す */
.msg-normal {
  background-color: var(--color-elev);
  border-color: color-mix(in srgb, var(--color-line-bright) 85%, transparent);
}

/* ============ 会話・独り言系: L 字 rim + ロール色 base + 外側 halo ============ */

/* Wolf — 血色の囁き。base に wolf 14% を混ぜて赤く染め、L 字 rim 強化 + 外側 halo */
.msg-wolf {
  background:
    radial-gradient(
        ellipse 70% 140% at 100% 0%,
        color-mix(in srgb, var(--color-wolf) 22%, transparent) 0%,
        transparent 60%
      )
      padding-box,
    radial-gradient(
        ellipse 80% 130% at 0% 100%,
        color-mix(in srgb, var(--color-wolf) 50%, transparent) 0%,
        transparent 55%
      )
      padding-box,
    linear-gradient(
        135deg,
        color-mix(in srgb, var(--color-wolf) 14%, var(--color-elev)) 0%,
        color-mix(in srgb, var(--color-wolf) 6%, var(--color-elev)) 100%
      )
      padding-box,
    radial-gradient(
        ellipse 110% 110% at 0% 100%,
        var(--color-wolf) 0%,
        color-mix(in srgb, var(--color-wolf) 75%, transparent) 18%,
        color-mix(in srgb, var(--color-wolf) 40%, transparent) 45%,
        color-mix(in srgb, var(--color-wolf) 25%, transparent) 100%
      )
      border-box;
  box-shadow: 0 0 12px -4px color-mix(in srgb, var(--color-wolf) 32%, transparent);
}

/* Mason — 共有の会話。苔緑染め + L 字 mason rim + halo */
.msg-mason {
  background:
    radial-gradient(
        ellipse 70% 140% at 100% 0%,
        color-mix(in srgb, var(--color-mason) 16%, transparent) 0%,
        transparent 60%
      )
      padding-box,
    radial-gradient(
        ellipse 80% 130% at 0% 100%,
        color-mix(in srgb, var(--color-mason) 46%, transparent) 0%,
        transparent 55%
      )
      padding-box,
    linear-gradient(
        135deg,
        color-mix(in srgb, var(--color-mason) 12%, var(--color-elev)) 0%,
        color-mix(in srgb, var(--color-mason) 5%, var(--color-elev)) 100%
      )
      padding-box,
    radial-gradient(
        ellipse 110% 110% at 0% 100%,
        var(--color-mason) 0%,
        color-mix(in srgb, var(--color-mason) 70%, transparent) 18%,
        color-mix(in srgb, var(--color-mason) 38%, transparent) 45%,
        color-mix(in srgb, var(--color-mason) 24%, transparent) 100%
      )
      border-box;
  box-shadow: 0 0 10px -4px color-mix(in srgb, var(--color-mason) 28%, transparent);
}

/* Mono — 独り言（内側の声）。控えめのまま、tint を僅かに加え rim 全周を可視化
 *  - base に mono 4% を混ぜて純黒を避ける
 *  - 他 variant と違い halo は付けない（発光しない、内側の声） */
.msg-mono {
  background:
    radial-gradient(
        ellipse 50% 100% at 100% 0%,
        color-mix(in srgb, var(--color-mono) 8%, transparent) 0%,
        transparent 55%
      )
      padding-box,
    radial-gradient(
        ellipse 50% 90% at 0% 100%,
        color-mix(in srgb, var(--color-mono) 16%, transparent) 0%,
        transparent 45%
      )
      padding-box,
    linear-gradient(
        135deg,
        color-mix(in srgb, var(--color-mono) 4%, var(--color-elev)) 0%,
        var(--color-elev) 100%
      )
      padding-box,
    radial-gradient(
        ellipse 100% 100% at 0% 100%,
        var(--color-mono) 0%,
        color-mix(in srgb, var(--color-mono) 55%, transparent) 18%,
        color-mix(in srgb, var(--color-mono) 28%, transparent) 45%,
        color-mix(in srgb, var(--color-mono) 18%, transparent) 100%
      )
      border-box;
}

/* Grave — 墓下発言。幽霊水色染め + L 字 grave rim + halo + italic */
.msg-grave {
  background:
    radial-gradient(
        ellipse 70% 130% at 100% 0%,
        color-mix(in srgb, var(--color-grave) 14%, transparent) 0%,
        transparent 60%
      )
      padding-box,
    radial-gradient(
        ellipse 80% 130% at 0% 100%,
        color-mix(in srgb, var(--color-grave) 36%, transparent) 0%,
        transparent 55%
      )
      padding-box,
    linear-gradient(
        135deg,
        color-mix(in srgb, var(--color-grave) 10%, var(--color-elev)) 0%,
        color-mix(in srgb, var(--color-grave) 4%, var(--color-elev)) 100%
      )
      padding-box,
    radial-gradient(
        ellipse 110% 110% at 0% 100%,
        var(--color-grave) 0%,
        color-mix(in srgb, var(--color-grave) 65%, transparent) 18%,
        color-mix(in srgb, var(--color-grave) 32%, transparent) 45%,
        color-mix(in srgb, var(--color-grave) 22%, transparent) 100%
      )
      border-box;
  box-shadow: 0 0 8px -4px color-mix(in srgb, var(--color-grave) 22%, transparent);
}

/* Seer — 観戦。淡金染め + L 字 seer rim + 薄 halo */
.msg-seer {
  background:
    radial-gradient(
        ellipse 60% 130% at 100% 0%,
        color-mix(in srgb, var(--color-seer) 12%, transparent) 0%,
        transparent 60%
      )
      padding-box,
    radial-gradient(
        ellipse 70% 120% at 0% 100%,
        color-mix(in srgb, var(--color-seer) 28%, transparent) 0%,
        transparent 55%
      )
      padding-box,
    linear-gradient(
        135deg,
        color-mix(in srgb, var(--color-seer) 8%, var(--color-elev)) 0%,
        color-mix(in srgb, var(--color-seer) 3%, var(--color-elev)) 100%
      )
      padding-box,
    radial-gradient(
        ellipse 110% 110% at 0% 100%,
        var(--color-seer) 0%,
        color-mix(in srgb, var(--color-seer) 55%, transparent) 18%,
        color-mix(in srgb, var(--color-seer) 26%, transparent) 45%,
        color-mix(in srgb, var(--color-seer) 18%, transparent) 100%
      )
      border-box;
  box-shadow: 0 0 8px -4px color-mix(in srgb, var(--color-seer) 20%, transparent);
}

/* Creator — 村建て。青紫(medium)染め + L 字 medium rim + 薄 halo */
.msg-creator {
  background:
    radial-gradient(
        ellipse 60% 130% at 100% 0%,
        color-mix(in srgb, var(--color-medium) 14%, transparent) 0%,
        transparent 60%
      )
      padding-box,
    radial-gradient(
        ellipse 80% 130% at 0% 100%,
        color-mix(in srgb, var(--color-medium) 34%, transparent) 0%,
        transparent 55%
      )
      padding-box,
    linear-gradient(
        135deg,
        color-mix(in srgb, var(--color-medium) 10%, var(--color-elev)) 0%,
        color-mix(in srgb, var(--color-medium) 4%, var(--color-elev)) 100%
      )
      padding-box,
    radial-gradient(
        ellipse 110% 110% at 0% 100%,
        var(--color-medium) 0%,
        color-mix(in srgb, var(--color-medium) 65%, transparent) 18%,
        color-mix(in srgb, var(--color-medium) 30%, transparent) 45%,
        color-mix(in srgb, var(--color-medium) 20%, transparent) 100%
      )
      border-box;
  box-shadow: 0 0 8px -4px color-mix(in srgb, var(--color-medium) 22%, transparent);
}

/* ============ 情報通知系 (info_*): bg なし、全周ロール色 border、ロール色テキスト ============
 *
 * 「システム生成の通知」は会話バブルとは別の存在感にする:
 * - bg なし → 縦に並んだ際にチャットの「発言の流れ」を圧迫しない
 * - **全周 1px のロール色 border**（会話バブルの bg + frame + halo に対する「軽い枠」）
 * - 本文はロール色そのまま（人狼通知=赤、狂信者通知=橙、村陣営通知=緑、霊媒結果=水色、汎用=fg）
 * - アバター ring も出さない（情報通知に発信者ロール色を二重で付けない）
 * - 微かな box-shadow halo で会話バブルとの「並びの中での沈み込み」を防ぐ */
.msg-info {
  background-color: transparent;
}
.msg-info-wolf {
  border-color: color-mix(in srgb, var(--color-wolf) 55%, transparent);
  box-shadow: 0 0 6px -3px color-mix(in srgb, var(--color-wolf) 18%, transparent);
}
.msg-info-fanatic {
  border-color: color-mix(in srgb, var(--color-fanatic) 55%, transparent);
  box-shadow: 0 0 6px -3px color-mix(in srgb, var(--color-fanatic) 15%, transparent);
}
.msg-info-village {
  border-color: color-mix(in srgb, var(--color-mason) 55%, transparent);
  box-shadow: 0 0 6px -3px color-mix(in srgb, var(--color-mason) 18%, transparent);
}
.msg-info-psychic {
  border-color: color-mix(in srgb, var(--color-grave) 55%, transparent);
  box-shadow: 0 0 6px -3px color-mix(in srgb, var(--color-grave) 18%, transparent);
}
.msg-info-system {
  border-color: color-mix(in srgb, var(--color-bone) 35%, transparent);
}

/* === Avatar ring — wolf / mason はロール色の弱い halo を外側に重ねて主役感を出す === */
.msg-avatar-wolf {
  box-shadow:
    0 0 0 2px var(--color-wolf),
    0 0 10px -2px color-mix(in srgb, var(--color-wolf) 55%, transparent);
}
.msg-avatar-mason {
  box-shadow:
    0 0 0 2px var(--color-mason),
    0 0 10px -2px color-mix(in srgb, var(--color-mason) 45%, transparent);
}
.msg-avatar-grave {
  box-shadow: 0 0 0 1px var(--color-grave);
}
.msg-avatar-seer {
  box-shadow: 0 0 0 1px var(--color-seer);
}
.msg-avatar-creator {
  box-shadow: 0 0 0 1px var(--color-medium);
}
</style>
