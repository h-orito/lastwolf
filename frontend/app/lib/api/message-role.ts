import { MESSAGE_TYPE } from "~/lib/api/message-constants";

/**
 * チャットメッセージのロールバリアント分類。
 *
 * 2 系統に分ける（2026-06 firewolf dark 準拠へ再編）:
 *   - 会話系 (say variants): 「アバター ｜ 名前行 / 本文ボックス」レイアウト。本文ボックスにだけ
 *     firewolf dark の bg/border/color を付ける（淡パステル地 + 黒文字）。directional rim / halo /
 *     アバターリングは撤去済み。normal / wolf / mason / mono / grave / seer
 *   - 情報通知系 (info_* variants): firewolf dark 準拠の「塗り箱」(暗グレー bg + 原色 border + 白系テキスト)
 *     info_wolf / info_village / info_psychic / info_mason / info_lovers / info_fox / info_public / info_system
 *     ※ 例外: info_creator（CREATOR_SAY）は「村建て」名を持つため塗り箱ではなく会話レイアウトで描画する
 *       （roleVariant としては残すが名前色 override 専用。下記 INFO_CREATOR_CODES 参照）
 *
 * UI 上のレイアウト分岐・名前色 override・小タグ（roleTag / 種別タグ）の表示分岐に使う。
 */
export type RoleVariant =
  // === 会話系（本文ボックスに firewolf dark 色） ===
  | "normal"
  | "wolf"
  | "mason"
  | "mono"
  | "grave"
  | "seer"
  // === 情報通知系 (firewolf dark の塗り箱: 暗グレー bg + 原色 border + 白系テキスト) ===
  | "info_wolf"
  | "info_village"
  | "info_psychic"
  | "info_mason"
  | "info_lovers"
  | "info_fox"
  | "info_public"
  | "info_system"
  // === 特殊: CREATOR_SAY。塗り箱ではなく会話レイアウトで描画（名前色 override 専用に roleVariant を保持） ===
  | "info_creator";

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

/* === 情報通知系（firewolf dark の塗り箱）===
 * 色グループは firewolf の SystemMessage.vue に準拠（2026-06）。bg/border 値は main.css の
 * `--color-sysmsg-*` を参照。会話の SAY 系（WEREWOLF_SAY / SYMPATHIZE_SAY 等）とは別物。 */

// 赤（#403333/#f00）: 人狼陣営への通知。firewolf は WEREWOLF と FANATIC を同じ赤に括る
export const INFO_WOLF_CODES = new Set<string>([
  MESSAGE_TYPE.PRIVATE_WEREWOLF,
  MESSAGE_TYPE.PRIVATE_FANATIC,
]);

// 緑（#334033/#0f0）: 占い系の結果（占い師 / 賢者）
export const INFO_VILLAGE_CODES = new Set<string>([
  MESSAGE_TYPE.PRIVATE_SEER,
  MESSAGE_TYPE.PRIVATE_WISE,
]);

// 青（#333340/#00f）: 死霊・検死系（霊媒 / グル / 検視官）。firewolf は GURU/CORONER も青に括る
export const INFO_PSYCHIC_CODES = new Set<string>([
  MESSAGE_TYPE.PRIVATE_PSYCHIC,
  MESSAGE_TYPE.PRIVATE_GURU,
  MESSAGE_TYPE.PRIVATE_CORONER,
]);

// 橙（#404033/#fa0）: 共有・共鳴系の通知（共有者 / 共鳴者）
export const INFO_MASON_CODES = new Set<string>([
  MESSAGE_TYPE.PRIVATE_MASON,
  MESSAGE_TYPE.PRIVATE_SYMPATHIZER,
]);

// ピンク（#404033/#f0a）: 恋人への私信
export const INFO_LOVERS_CODES = new Set<string>([MESSAGE_TYPE.PRIVATE_LOVERS]);

// CREATOR_SAY（村建て発言）。lastwolf では「村建て」名を持つため会話レイアウト（hasSender=true）で扱い、
// 本文ボックスは会話系の --color-say-creator-*（暗地+薄文字+紫枠）を使う。
// この roleVariant=info_creator は塗り箱用ではなく、Message.vue の nameOverrideClass で
// 名前色を text-fg（白系）に固定するためだけに残している（削除すると名前色判定が変わる）。
export const INFO_CREATOR_CODES = new Set<string>([MESSAGE_TYPE.CREATOR_SAY]);

// 妖狐への私信。firewolf の `.message-private-fox`（bg #403333 + くすんだ黄 border）に準拠
export const INFO_FOX_CODES = new Set<string>([MESSAGE_TYPE.PRIVATE_FOX]);

// 全体システム通知（PUBLIC_SYSTEM: 投票結果 / 開始終了等）。
// firewolf 同様 bg なし（くすんでない）+ 白枠でクリーンに見せる。
export const INFO_PUBLIC_CODES = new Set<string>([MESSAGE_TYPE.PUBLIC_SYSTEM]);

// 個別システム通知（PRIVATE_SYSTEM）。firewolf 同様 くすんだグレー bg #404040 + 薄灰枠。
export const INFO_SYSTEM_CODES = new Set<string>([MESSAGE_TYPE.PRIVATE_SYSTEM]);

/**
 * 意図的に上記いずれにも含めず normal フォールバックにするコード:
 *   - LOVERS_SAY / SECRET_SAY: 通常発言と同列の "発言" 系で会話バブル扱い
 * （PRIVATE_ABILITY は MONO_CODES = 独り言扱い。firewolf はグレー箱だが当アプリは内的ログとして mono を維持）
 */
