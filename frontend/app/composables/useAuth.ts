import type { User, UserCredential } from "firebase/auth";
import type { components } from "~/lib/api/schema";
import * as firebaseAuth from "~/lib/firebase/auth";

type MyselfPlayerView = components["schemas"]["MyselfPlayerView"];

/**
 * 認証操作を提供するComposable
 * ビジネスロジックと状態管理の橋渡しを担当
 */
export const useAuth = () => {
  const authStore = useAuthStore();
  const { apiCall } = useApi();

  /**
   * 認証状態の初期化
   * Firebase認証状態の変更を監視し、Storeを更新する
   */
  const initializeAuth = () => {
    firebaseAuth.onAuthStateChanged(async (firebaseUser) => {
      if (firebaseUser) {
        await loginout(firebaseUser);
      } else {
        authStore.setUser(null);
        authStore.setMyselfPlayer(null);
      }
      authStore.setLoading(false);
    });
  };

  /**
   * Googleでサインイン
   */
  const signInWithGoogle = async (): Promise<UserCredential> => {
    return await firebaseAuth.signInWithGoogle();
  };

  /**
   * Twitterでサインイン
   */
  const signInWithTwitter = async (): Promise<UserCredential> => {
    return await firebaseAuth.signInWithTwitter();
  };

  /**
   * ログアウト
   */
  const logout = async () => {
    authStore.setCurrentToken(null, null);
    await firebaseAuth.signOut();
    authStore.setUser(null);
    authStore.setMyselfPlayer(null);
  };

  /**
   * 認証状態の待機
   */
  const waitForAuth = (): Promise<User | null> => {
    return new Promise((resolve) => {
      const unsubscribe = firebaseAuth.onAuthStateChanged((user) => {
        unsubscribe();
        resolve(user);
      });
    });
  };

  /**
   * ログイン後のトークン・プレイヤー情報の更新
   * 旧nuxt2のLOGINOUTアクションに相当
   */
  const loginout = async (firebaseUser: User | null) => {
    if (!firebaseUser) {
      // ログアウト処理
      authStore.setCurrentToken(null, null);
      authStore.setUser(null);
      authStore.setMyselfPlayer(null);
      return;
    }

    // 新しいIDトークンを取得
    const idToken = await firebaseUser.getIdToken(true);

    // トークンをインメモリに保存（useCookie は await 後の非同期コンテキストで不安定なため）
    const expiresAt = new Date(Date.now() + 50 * 60 * 1000);
    authStore.setCurrentToken(idToken, expiresAt);

    // まずuserをセットしてAPIが叩けるようにする
    authStore.setUser(firebaseUser);

    // プレイヤー情報を取得
    try {
      const myPlayer = await apiCall<MyselfPlayerView>("/my-player");
      authStore.setMyselfPlayer(myPlayer);
    } catch (error) {
      console.error("Failed to fetch player:", error);
    }
  };

  /**
   * 認証情報の更新（プレイヤー情報再取得）
   */
  const refreshAuth = async () => {
    try {
      const myPlayer = await apiCall<MyselfPlayerView>("/my-player");
      authStore.setMyselfPlayer(myPlayer);
    } catch (error) {
      console.error("Failed to fetch player:", error);
    }
  };

  return {
    // 状態（Storeから取得）
    user: computed(() => authStore.user),
    myselfPlayer: computed(() => authStore.myselfPlayer),
    isAuthenticated: computed(() => authStore.isAuthenticated),
    isLoading: computed(() => authStore.isLoading),

    // 操作
    initializeAuth,
    signInWithGoogle,
    signInWithTwitter,
    logout,
    waitForAuth,
    loginout,
    refreshAuth,
  };
};
