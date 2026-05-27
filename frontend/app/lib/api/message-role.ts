import { MESSAGE_TYPE } from "~/lib/api/message-constants";

/**
 * チャットメッセージのロールバリアント分類。
 *
 * 2 系統に分ける:
 *   - 会話系 (say variants): 全周 bg + frame + halo を持つ「発言バブル」
 *     normal / wolf / mason / mono / grave / seer / creator
 *   - 情報通知系 (info_* variants): bg なし、文字色のみで陣営を識別する「システム通知」
 *     info_wolf / info_fanatic / info_village / info_psychic / info_system
 *
 * UI 上の枠線・アバターリング・小タグの表示分岐に使う。
 */
export type RoleVariant =
  // === 会話系 ===
  | "normal"
  | "wolf"
  | "mason"
  | "mono"
  | "grave"
  | "seer"
  | "creator"
  // === 情報通知系 (no bg, role-colored text) ===
  | "info_wolf"
  | "info_fanatic"
  | "info_village"
  | "info_psychic"
  | "info_system";

/* === 会話系 === */

// 人狼陣営の発言。bg + frame ありの「血色の囁き」
export const WOLF_SAY_CODES = new Set<string>([MESSAGE_TYPE.WEREWOLF_SAY]);

// 共有者（共鳴）の発言。bg + frame ありの「苔緑の会話」
export const MASON_SAY_CODES = new Set<string>([MESSAGE_TYPE.SYMPATHIZE_SAY]);

// 独り言。MONOLOGUE_SAY = ユーザー手入力、PRIVATE_ABILITY = 能力行使確認（個人内ログ）
// どちらも「個人の内的ログ」として mono 灰染め + italic で表示
export const MONO_CODES = new Set<string>([
  MESSAGE_TYPE.MONOLOGUE_SAY,
  MESSAGE_TYPE.PRIVATE_ABILITY,
]);

/* === 情報通知系（bg なし、文字色のみ） === */

// 人狼陣営への通知（誰を襲撃したか等）。赤テキスト
export const INFO_WOLF_CODES = new Set<string>([MESSAGE_TYPE.PRIVATE_WEREWOLF]);

// 狂信者への通知（人狼仲間の情報等）。橙テキスト
export const INFO_FANATIC_CODES = new Set<string>([MESSAGE_TYPE.PRIVATE_FANATIC]);

// 村陣営の役職限定通知。共有者通知 + 占い・賢者・グル・検視官の結果を緑（mason）テキストで揃える
export const INFO_VILLAGE_CODES = new Set<string>([
  MESSAGE_TYPE.PRIVATE_MASON,
  MESSAGE_TYPE.PRIVATE_SEER,
  MESSAGE_TYPE.PRIVATE_WISE,
  MESSAGE_TYPE.PRIVATE_GURU,
  MESSAGE_TYPE.PRIVATE_CORONER,
]);

// 霊媒結果。死霊との繋がりを示唆する水色（grave）テキスト
export const INFO_PSYCHIC_CODES = new Set<string>([MESSAGE_TYPE.PRIVATE_PSYCHIC]);

// 汎用システム通知（投票結果 / 開始終了等）。bone / fg ベースのニュートラルテキスト
export const INFO_SYSTEM_CODES = new Set<string>([
  MESSAGE_TYPE.PUBLIC_SYSTEM,
  MESSAGE_TYPE.PRIVATE_SYSTEM,
]);
