import type { VillageLatestView } from "~/lib/api/types";
import { useVillageRefresh } from "./useVillageRefresh";

/**
 * 村の最新情報を定期的にポーリング
 */
export const useVillagePolling = () => {
  // Store
  const villageStore = useVillageStore();
  useVillageRefresh();

  // State
  const pollingInterval = ref<NodeJS.Timeout | null>(null);

  // API
  const { apiCall } = useApi();

  // クリーンアップ: アンマウント時にポーリングを停止
  onUnmounted(() => {
    stopPolling();
  });

  /**
   * ポーリングを開始
   */
  const startPolling = () => {
    // 既存のポーリングがあれば停止
    stopPolling();

    // 30秒ごとにチェック
    pollingInterval.value = setInterval(async () => {
      await checkLatest();
    }, 30 * 1000);
  };

  /**
   * ポーリングを停止
   */
  const stopPolling = () => {
    if (pollingInterval.value) {
      clearInterval(pollingInterval.value);
      pollingInterval.value = null;
    }
  };

  /**
   * 最新情報をチェック
   */
  const checkLatest = async () => {
    try {
      const currentLatest = villageStore.villageLatest;
      const latest = await loadVillageLatest();

      // 初回(storeがnull)の場合は保存のみ
      if (!currentLatest) {
        villageStore.saveVillageLatest(latest);
        return;
      }

      // LASTWOLFはlatestエンドポイント未対応のため、ポーリングは無効
      villageStore.saveVillageLatest(latest);
    } catch (error) {
      console.error("最新情報の取得に失敗しました:", error);
    }
  };

  const loadVillageLatest = async (): Promise<VillageLatestView> => {
    const url = `/village/${villageStore.villageId}/latest`;
    return await apiCall<VillageLatestView>(url);
  };

  return {
    // Computed (from store)
    villageLatest: computed(() => villageStore.villageLatest),
    existsNewMessages: computed(() => villageStore.existsNewMessages),

    // Methods
    startPolling,
    stopPolling,
    checkLatest,
  };
};
