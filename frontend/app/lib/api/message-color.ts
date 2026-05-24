import type { components } from "~/lib/api/schema";

type VillageView = components["schemas"]["VillageView"];
type VillageParticipantView = components["schemas"]["VillageParticipantView"];

// プレイヤーごとの個人識別カラー（最大 10 名分）。
// ダーク基調（bg-deep #050609）の上で 4.5:1 以上のコントラストを満たすよう
// パステル寄り・中明度に調整している。色相は旧 10 色（赤/茶/青/暗赤/緑/紺/紫/水/薄紫/黄緑）を踏襲。
// DESIGN.md「アクセシビリティ」セクション参照。
const MESSAGE_COLORS: string[] = [
  "#ff8585", // 0: 赤（パステル）
  "#d4a574", // 1: 茶（淡）
  "#8ab4ff", // 2: 青（パステル）
  "#e89090", // 3: 暗赤 → 明るめに振り直し
  "#86c990", // 4: 緑（パステル）
  "#7a9bff", // 5: 紺 → 明るめのスチール寄り
  "#e088ff", // 6: 紫（パステル）
  "#88d0ff", // 7: 水色（パステル）
  "#b8a0ff", // 8: 薄紫
  "#d4d480", // 9: 黄緑（パステル）
];

export const getMessageColor = (
  village: VillageView,
  participant: VillageParticipantView,
): string | null => {
  const index = village.participants.member_list.findIndex((m) => m.id === participant.id);
  if (index === -1) return null;
  return MESSAGE_COLORS[index % 10] ?? null;
};
