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
  WOLF_CODES,
  FANATIC_CODES,
  MASON_CODES,
  MONO_CODES,
  VILLAGE_INFO_CODES,
  PSYCHIC_INFO_CODES,
  SYSTEM_CODES,
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
  // フォールバック normal の対象（DESIGN.md でロール色未定義）:
  //   - LOVERS_SAY / SECRET_SAY: 通常発言と同列の "発言" 系
  //   - PRIVATE_FOX / PRIVATE_LOVERS / PRIVATE_SYMPATHIZER: 第三陣営寄り or 不明確
  //     （messageType の [狐] 等で識別できるため normal で許容）
  // PUBLIC_SYSTEM / PRIVATE_SYSTEM は SYSTEM_CODES 経由で system variant にルーティングされる
  if (WOLF_CODES.has(code)) return "wolf";
  if (FANATIC_CODES.has(code)) return "fanatic";
  if (MASON_CODES.has(code)) return "mason";
  if (MONO_CODES.has(code)) return "mono";
  if (VILLAGE_INFO_CODES.has(code)) return "village_info";
  if (PSYCHIC_INFO_CODES.has(code)) return "psychic_info";
  if (SYSTEM_CODES.has(code)) return "system";
  if (code === MESSAGE_TYPE.GRAVE_SAY) return "grave";
  if (code === MESSAGE_TYPE.SPECTATE_SAY) return "seer";
  if (code === MESSAGE_TYPE.CREATOR_SAY) return "creator";
  return "normal";
});

// 新方針: ロール色は「線」で強調せず、背景にうっすら滲ませる + アクセントの細バー
// 詳細は DESIGN.md「チャットメッセージ」節を参照。実体は <style scoped> 内の .msg-* に閉じる
const containerClasses = computed(() => {
  const map: Record<RoleVariant, string> = {
    normal: "msg-normal",
    wolf: "msg-wolf",
    fanatic: "msg-fanatic",
    mason: "msg-mason",
    mono: "msg-mono italic",
    grave: "msg-grave italic",
    seer: "msg-seer",
    creator: "msg-creator",
    village_info: "msg-village-info",
    psychic_info: "msg-psychic-info",
    system: "msg-system",
  };
  return map[roleVariant.value];
});

const avatarRingClass = computed(() => {
  const map: Record<RoleVariant, string> = {
    normal: "",
    wolf: "msg-avatar-wolf",
    fanatic: "msg-avatar-fanatic",
    mason: "msg-avatar-mason",
    mono: "",
    grave: "msg-avatar-grave",
    seer: "msg-avatar-seer",
    creator: "msg-avatar-creator",
    village_info: "",
    psychic_info: "",
    system: "",
  };
  return map[roleVariant.value];
});

// roleTag（"人狼" "狂信" "共有" "独白" "墓下" "観戦"）と messageType（"[狼]" "[共]" "[独]" ...）は
// 意味が重複するため、roleTag が出るケースでは messageType を抑制する。
//   例: WEREWOLF_SAY → roleTag "人狼" だけ表示し、"[狼]" は隠す
//       PRIVATE_FANATIC → roleTag "狂信" だけ表示し、"[信]" は隠す
const showMessageType = computed(() => {
  if (!messageType.value) return false;
  return !roleTag.value;
});

// 小タグ（人狼/狂信/共有/独白/墓下/観戦）。normal / creator / village_info / psychic_info は表示しない
// 日本語ラベルを維持しつつ tracking-widest で「儀式感」を出す（Cinzel への英字切替は今回見送り）
const roleTag = computed<{ label: string; cls: string } | null>(() => {
  const map: Partial<Record<RoleVariant, { label: string; cls: string }>> = {
    wolf: { label: "人狼", cls: "text-wolf" },
    fanatic: { label: "狂信", cls: "text-fanatic" },
    mason: { label: "共有", cls: "text-mason" },
    mono: { label: "独白", cls: "text-mono" },
    grave: { label: "墓下", cls: "text-grave" },
    seer: { label: "観戦", cls: "text-seer" },
  };
  return map[roleVariant.value] ?? null;
});

const bodyColorClass = computed(() => {
  // 本文色はロール色ではなく fg ベース。視覚的な分類は背景滲み・タグ・アバターリングで表現
  const map: Record<RoleVariant, string> = {
    normal: "text-fg",
    wolf: "text-fg",
    fanatic: "text-fg",
    mason: "text-fg",
    mono: "text-fg-secondary",
    grave: "text-fg-secondary",
    seer: "text-fg",
    creator: "text-fg",
    village_info: "text-fg",
    psychic_info: "text-fg",
    system: "text-fg",
  };
  return map[roleVariant.value];
});

// 名前テキストの色: ロールが閉じた特別な場（wolf / fanatic / mason / grave）では
// 世界観優先で該当ロール色に固定し、個人識別カラー（props.color）は使わない。
// それ以外は個人識別カラー優先、無ければ fg。
const nameOverrideClass: Partial<Record<RoleVariant, string>> = {
  wolf: "text-wolf",
  fanatic: "text-fanatic",
  mason: "text-mason",
  grave: "text-grave",
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
 * rounded-lg + border: 1px solid transparent + padding-box / border-box の手法で、
 * 役割別に 2 つの rim パターンを使い分ける:
 *   - 会話・mono 系: L 字 rim（radial-gradient(ellipse at 0% 100%) border-box）
 *     左下角で最大、左辺と下辺に沿って減衰し、上辺・右辺は出ない。
 *     さらに右上にも淡い radial を padding-box で乗せ、両コーナーから光が差す構図にする。
 *   - システム系（system / village_info / psychic_info）: 全周を囲む solid rim
 *     （linear-gradient(color, color) border-box）。情報通知としての枠を強調。
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

/* Normal — 装飾なし（bg-elev + rounded のみ。発言区切りは外側コンテナ側の gap が担う） */
.msg-normal {
  background-color: var(--color-elev);
}

/*
 * 配色は `var(--color-*)` トークンを単一情報源にし、透明度合成は
 * `color-mix(in srgb, var(--color-X) N%, transparent)` で表現する。
 * rgba ハードコードは禁止（トークン値が変わったときに二重管理になるため）。
 */

/* ============ 会話・独り言系: L 字 rim（左下角中心の radial で 2 辺だけ光る） ============ */

/* Wolf — 会話。両コーナー radial bg + L 字 wolf rim */
.msg-wolf {
  background:
    radial-gradient(
        ellipse 70% 140% at 100% 0%,
        color-mix(in srgb, var(--color-wolf) 14%, transparent) 0%,
        transparent 60%
      )
      padding-box,
    radial-gradient(
        ellipse 70% 120% at 0% 100%,
        color-mix(in srgb, var(--color-wolf) 40%, transparent) 0%,
        transparent 55%
      )
      padding-box,
    linear-gradient(var(--color-elev), var(--color-elev)) padding-box,
    radial-gradient(
        ellipse 100% 100% at 0% 100%,
        var(--color-wolf) 0%,
        color-mix(in srgb, var(--color-wolf) 70%, transparent) 15%,
        color-mix(in srgb, var(--color-wolf) 30%, transparent) 35%,
        transparent 60%
      )
      border-box;
}

/* Fanatic — 狂信。両コーナー radial bg + L 字 fanatic rim */
.msg-fanatic {
  background:
    radial-gradient(
        ellipse 70% 140% at 100% 0%,
        color-mix(in srgb, var(--color-fanatic) 12%, transparent) 0%,
        transparent 60%
      )
      padding-box,
    radial-gradient(
        ellipse 70% 120% at 0% 100%,
        color-mix(in srgb, var(--color-fanatic) 32%, transparent) 0%,
        transparent 55%
      )
      padding-box,
    linear-gradient(var(--color-elev), var(--color-elev)) padding-box,
    radial-gradient(
        ellipse 100% 100% at 0% 100%,
        var(--color-fanatic) 0%,
        color-mix(in srgb, var(--color-fanatic) 65%, transparent) 15%,
        color-mix(in srgb, var(--color-fanatic) 25%, transparent) 35%,
        transparent 60%
      )
      border-box;
}

/* Mason — 会話。両コーナー radial bg + L 字 mason rim */
.msg-mason {
  background:
    radial-gradient(
        ellipse 70% 140% at 100% 0%,
        color-mix(in srgb, var(--color-mason) 12%, transparent) 0%,
        transparent 60%
      )
      padding-box,
    radial-gradient(
        ellipse 70% 120% at 0% 100%,
        color-mix(in srgb, var(--color-mason) 38%, transparent) 0%,
        transparent 55%
      )
      padding-box,
    linear-gradient(var(--color-elev), var(--color-elev)) padding-box,
    radial-gradient(
        ellipse 100% 100% at 0% 100%,
        var(--color-mason) 0%,
        color-mix(in srgb, var(--color-mason) 65%, transparent) 15%,
        color-mix(in srgb, var(--color-mason) 28%, transparent) 35%,
        transparent 60%
      )
      border-box;
}

/* Mono — 独り言。透過 + 両コーナーから mono 灰がうっすら + L 字 mono(灰) rim + italic
 * bg は透過のため、左下 radial が大きいと本文（text-fg-secondary）と重なって読みづらくなる。
 * 半径を絞り（40% × 80%）+ 早めにフェード（transparent 40%）して本文領域を avoid する。
 * 他 variant と違い elev の linear 層を省略（背景を透過にして「内側の声」感を出すため）。
 * 新 variant をここから派生させる場合は背景補完層の有無に注意。 */
.msg-mono {
  background:
    radial-gradient(
        ellipse 50% 100% at 100% 0%,
        color-mix(in srgb, var(--color-mono) 6%, transparent) 0%,
        transparent 55%
      )
      padding-box,
    radial-gradient(
        ellipse 40% 80% at 0% 100%,
        color-mix(in srgb, var(--color-mono) 10%, transparent) 0%,
        transparent 40%
      )
      padding-box,
    radial-gradient(
        ellipse 100% 100% at 0% 100%,
        var(--color-mono) 0%,
        color-mix(in srgb, var(--color-mono) 50%, transparent) 15%,
        color-mix(in srgb, var(--color-mono) 20%, transparent) 35%,
        transparent 60%
      )
      border-box;
}

/* Grave — 墓下発言。両コーナー radial bg + L 字 grave rim + italic */
.msg-grave {
  background:
    radial-gradient(
        ellipse 70% 130% at 100% 0%,
        color-mix(in srgb, var(--color-grave) 10%, transparent) 0%,
        transparent 60%
      )
      padding-box,
    radial-gradient(
        ellipse 70% 120% at 0% 100%,
        color-mix(in srgb, var(--color-grave) 30%, transparent) 0%,
        transparent 55%
      )
      padding-box,
    linear-gradient(var(--color-elev), var(--color-elev)) padding-box,
    radial-gradient(
        ellipse 100% 100% at 0% 100%,
        var(--color-grave) 0%,
        color-mix(in srgb, var(--color-grave) 60%, transparent) 15%,
        color-mix(in srgb, var(--color-grave) 25%, transparent) 35%,
        transparent 60%
      )
      border-box;
}

/* Seer — 観戦。両コーナー radial(seer) + L 字 seer rim（弱） */
.msg-seer {
  background:
    radial-gradient(
        ellipse 60% 130% at 100% 0%,
        color-mix(in srgb, var(--color-seer) 8%, transparent) 0%,
        transparent 60%
      )
      padding-box,
    radial-gradient(
        ellipse 60% 110% at 0% 100%,
        color-mix(in srgb, var(--color-seer) 20%, transparent) 0%,
        transparent 55%
      )
      padding-box,
    linear-gradient(var(--color-elev), var(--color-elev)) padding-box,
    radial-gradient(
        ellipse 100% 100% at 0% 100%,
        var(--color-seer) 0%,
        color-mix(in srgb, var(--color-seer) 50%, transparent) 15%,
        color-mix(in srgb, var(--color-seer) 20%, transparent) 35%,
        transparent 60%
      )
      border-box;
}

/* Creator — 村建て。両コーナー radial(medium) + L 字 medium rim */
.msg-creator {
  background:
    radial-gradient(
        ellipse 60% 130% at 100% 0%,
        color-mix(in srgb, var(--color-medium) 10%, transparent) 0%,
        transparent 60%
      )
      padding-box,
    radial-gradient(
        ellipse 70% 120% at 0% 100%,
        color-mix(in srgb, var(--color-medium) 26%, transparent) 0%,
        transparent 55%
      )
      padding-box,
    linear-gradient(var(--color-elev), var(--color-elev)) padding-box,
    radial-gradient(
        ellipse 100% 100% at 0% 100%,
        var(--color-medium) 0%,
        color-mix(in srgb, var(--color-medium) 60%, transparent) 15%,
        color-mix(in srgb, var(--color-medium) 25%, transparent) 35%,
        transparent 60%
      )
      border-box;
}

/* ============ システム系: 全周 solid rim ============ */

/* System — 投票結果 / 開始終了など汎用システム通知。白系 (bone) で全周囲む */
.msg-system {
  background:
    radial-gradient(
        ellipse 70% 110% at 0% 100%,
        color-mix(in srgb, var(--color-bone) 6%, transparent) 0%,
        transparent 55%
      )
      padding-box,
    linear-gradient(var(--color-elev), var(--color-elev)) padding-box,
    linear-gradient(
        color-mix(in srgb, var(--color-bone) 35%, transparent),
        color-mix(in srgb, var(--color-bone) 35%, transparent)
      )
      border-box;
}

/* Village info — 占い結果 / 賢者 / 検視官 等。緑(mason)で全周囲む */
.msg-village-info {
  background:
    radial-gradient(
        ellipse 70% 120% at 0% 100%,
        color-mix(in srgb, var(--color-mason) 24%, transparent) 0%,
        transparent 55%
      )
      padding-box,
    linear-gradient(var(--color-elev), var(--color-elev)) padding-box,
    linear-gradient(
        color-mix(in srgb, var(--color-mason) 45%, transparent),
        color-mix(in srgb, var(--color-mason) 45%, transparent)
      )
      border-box;
}

/* Psychic info — 霊媒結果。水色(grave)で全周囲む */
.msg-psychic-info {
  background:
    radial-gradient(
        ellipse 70% 120% at 0% 100%,
        color-mix(in srgb, var(--color-grave) 24%, transparent) 0%,
        transparent 55%
      )
      padding-box,
    linear-gradient(var(--color-elev), var(--color-elev)) padding-box,
    linear-gradient(
        color-mix(in srgb, var(--color-grave) 45%, transparent),
        color-mix(in srgb, var(--color-grave) 45%, transparent)
      )
      border-box;
}

/* === Avatar ring — wolf / fanatic / mason はロール色の弱い halo を外側に重ねて主役感を出す === */
.msg-avatar-wolf {
  box-shadow:
    0 0 0 2px var(--color-wolf),
    0 0 10px -2px color-mix(in srgb, var(--color-wolf) 55%, transparent);
}
.msg-avatar-fanatic {
  box-shadow:
    0 0 0 2px var(--color-fanatic),
    0 0 10px -2px color-mix(in srgb, var(--color-fanatic) 45%, transparent);
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
