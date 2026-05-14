import { defineStore } from "pinia";
import type { components } from "~/lib/api/schema";

type VillageView = components["schemas"]["VillageView"];
type SituationAsParticipantView = components["schemas"]["SituationAsParticipantView"];
type CharaImage = components["schemas"]["CharaImage"];

/**
 * 村の状態管理Store
 */
export const useVillageStore = defineStore("village", () => {
  // State
  const villageId = ref<number>(0);
  const village = ref<VillageView | null>(null);
  const situation = ref<SituationAsParticipantView | null>(null);
  const participantIdImgMap = ref<Map<number, CharaImage>>(new Map());

  // Computed
  const latestDay = computed(() => {
    if (!village.value?.days.list || village.value.days.list.length === 0) {
      return null;
    }
    return village.value.days.list[village.value.days.list.length - 1] ?? null;
  });

  // Actions
  /**
   * 村情報を初期化
   */
  const initVillage = (id: number, v: VillageView) => {
    villageId.value = id;
    village.value = v;
    participantIdImgMap.value = new Map(
      v.participants.member_list.map((p) => [p.id, p.chara.image]),
    );
  };

  /**
   * 参加状況を保存
   */
  const initSituation = (s: SituationAsParticipantView) => {
    situation.value = s;
  };

  /**
   * 村情報をリセット
   */
  const terminateVillage = () => {
    villageId.value = 0;
    village.value = null;
    situation.value = null;
    participantIdImgMap.value = new Map();
  };

  return {
    // State
    villageId: readonly(villageId),
    village: readonly(village),
    situation: readonly(situation),
    participantIdImgMap: readonly(participantIdImgMap),

    // Computed
    latestDay,

    // Actions
    initVillage,
    initSituation,
    terminateVillage,
  };
});
