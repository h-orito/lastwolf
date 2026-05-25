import { MESSAGE_TYPE } from "~/lib/api/message-constants";

/**
 * チャットメッセージのロールバリアント分類。
 * UI 上の枠線・アバターリング・小タグの表示分岐に使う。
 */
export type RoleVariant =
  | "normal"
  | "wolf"
  | "fanatic"
  | "mason"
  | "mono"
  | "grave"
  | "seer"
  | "creator"
  | "village_info"
  | "psychic_info"
  | "system";

export const WOLF_CODES = new Set<string>([
  MESSAGE_TYPE.PRIVATE_WEREWOLF,
  MESSAGE_TYPE.WEREWOLF_SAY,
]);

// 狂信者（人狼陣営だが人狼ではない）。wolf と区別してくすんだ橙系で表示
export const FANATIC_CODES = new Set<string>([MESSAGE_TYPE.PRIVATE_FANATIC]);

export const MASON_CODES = new Set<string>([
  MESSAGE_TYPE.PRIVATE_MASON,
  MESSAGE_TYPE.SYMPATHIZE_SAY,
]);

export const MONO_CODES = new Set<string>([
  MESSAGE_TYPE.MONOLOGUE_SAY,
  MESSAGE_TYPE.PRIVATE_ABILITY,
]);

// 村陣営の役職限定システム通知（霊媒系を除く）。占い結果 / 賢者 / グル / 検視官 等。
// 緑系の色味で「村陣営の情報」であることを示す。
// PRIVATE_FOX / PRIVATE_LOVERS / PRIVATE_SYMPATHIZER は第三陣営寄り or 不明確のため
// 含めない（normal フォールバック維持）。
export const VILLAGE_INFO_CODES = new Set<string>([
  MESSAGE_TYPE.PRIVATE_SEER,
  MESSAGE_TYPE.PRIVATE_WISE,
  MESSAGE_TYPE.PRIVATE_GURU,
  MESSAGE_TYPE.PRIVATE_CORONER,
]);

// 霊媒結果。死霊との繋がりを示唆するため墓下と同じ水色（grave）系統で表示。
export const PSYCHIC_INFO_CODES = new Set<string>([MESSAGE_TYPE.PRIVATE_PSYCHIC]);

// 一般システム通知（投票結果 / 開始終了等）。占い・霊媒のロール固有ではない汎用通知を白系で囲む
export const SYSTEM_CODES = new Set<string>([
  MESSAGE_TYPE.PUBLIC_SYSTEM,
  MESSAGE_TYPE.PRIVATE_SYSTEM,
]);
