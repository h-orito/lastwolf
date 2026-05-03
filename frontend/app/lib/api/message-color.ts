import type { components } from "~/lib/api/schema";

type VillageView = components["schemas"]["VillageView"];
type VillageParticipantView = components["schemas"]["VillageParticipantView"];

// メッセージカラーのCSSクラス（インラインスタイルへ変換）
const MESSAGE_COLORS: string[] = [
  "#f00", // 0: 赤
  "#785600", // 1: 茶
  "#00f", // 2: 青
  "#880000", // 3: 暗赤
  "#008800", // 4: 緑
  "#000088", // 5: 紺
  "#f301ff", // 6: 紫
  "#017aff", // 7: 水色
  "#8800ff", // 8: 薄紫
  "#888800", // 9: 黄緑
];

export const getMessageColor = (
  village: VillageView,
  participant: VillageParticipantView,
): string | null => {
  const index = village.participants.member_list.findIndex((m) => m.id === participant.id);
  if (index === -1) return null;
  return MESSAGE_COLORS[index % 10] ?? null;
};
