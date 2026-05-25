import { MESSAGE_TYPE } from "~/lib/api/message-constants";

/**
 * チャットメッセージのロールバリアント分類。
 * UI 上の枠線・アバターリング・小タグの表示分岐に使う。
 */
export type RoleVariant = "normal" | "wolf" | "mason" | "mono" | "grave" | "seer" | "creator";

export const WOLF_CODES = new Set<string>([
  MESSAGE_TYPE.PRIVATE_WEREWOLF,
  MESSAGE_TYPE.WEREWOLF_SAY,
  MESSAGE_TYPE.PRIVATE_FANATIC,
]);

export const MASON_CODES = new Set<string>([
  MESSAGE_TYPE.PRIVATE_MASON,
  MESSAGE_TYPE.SYMPATHIZE_SAY,
]);

export const MONO_CODES = new Set<string>([
  MESSAGE_TYPE.MONOLOGUE_SAY,
  MESSAGE_TYPE.PRIVATE_ABILITY,
]);
