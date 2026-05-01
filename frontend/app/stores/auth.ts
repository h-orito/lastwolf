import { defineStore } from "pinia";
import type { User } from "firebase/auth";
import type { components } from "~/lib/api/schema";

type MyselfPlayerView = components["schemas"]["MyselfPlayerView"];

/**
 * 認証状態管理Store
 * 状態の保持と更新のみを担当
 */
export const useAuthStore = defineStore("auth", () => {
  // State
  const user = ref<User | null>(null);
  const myselfPlayer = ref<MyselfPlayerView | null>(null);
  const isLoading = ref(true);

  // トークン in-memory (useCookie は非同期コンテキストで不安定なため直接管理)
  const currentToken = ref<string | null>(null);
  const tokenExpiresAt = ref<Date | null>(null);

  // Computed
  const isAuthenticated = computed(() => !!user.value);

  // Mutations（状態更新メソッド）
  const setUser = (newUser: User | null) => {
    user.value = newUser;
  };

  const setMyselfPlayer = (player: MyselfPlayerView | null) => {
    myselfPlayer.value = player;
  };

  const setLoading = (loading: boolean) => {
    isLoading.value = loading;
  };

  const setCurrentToken = (token: string | null, expiresAt: Date | null = null) => {
    currentToken.value = token;
    tokenExpiresAt.value = expiresAt;
  };

  // 認証トークンの取得
  const getAuthToken = async (): Promise<string | null> => {
    const currentUser = user.value;

    if (!currentToken.value || !currentUser) {
      return null;
    }

    // 有効期限チェック
    const expired = tokenExpiresAt.value ?? new Date(0);
    if (new Date().getTime() >= expired.getTime()) {
      // 期限切れの場合は更新
      try {
        const newToken = await currentUser.getIdToken(true);
        const newExpiresAt = new Date(Date.now() + 50 * 60 * 1000);
        currentToken.value = newToken;
        tokenExpiresAt.value = newExpiresAt;
        return newToken;
      } catch (error) {
        console.error("Failed to refresh token:", error);
        return null;
      }
    }

    return currentToken.value;
  };

  return {
    // State
    user,
    myselfPlayer,
    isAuthenticated,
    isLoading,

    // Mutations
    setUser,
    setMyselfPlayer,
    setLoading,
    setCurrentToken,

    // Token管理（API呼び出しで使用）
    getAuthToken,
  };
});
