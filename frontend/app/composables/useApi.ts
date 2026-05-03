import type { FetchError } from "ofetch";

/**
 * 認証付きAPI呼び出し用composable（Nuxt 4推奨パターン）
 */
export const useApi = () => {
  const authStore = useAuthStore();

  // 認証ヘッダー付きAPI呼び出し（リクエスト・レスポンスインターセプター機能含む）
  const apiCall = async <T>(
    url: string,
    options: Parameters<typeof $fetch>[1] = {},
  ): Promise<T> => {
    const config = useRuntimeConfig();

    try {
      // リクエストインターセプター: 認証トークンを取得・設定
      const token = await authStore.getAuthToken();

      // リクエストインターセプター: 共通ヘッダーの設定
      const method = (options?.method ?? "GET").toUpperCase();
      const needsContentType = ["POST", "PUT", "PATCH"].includes(method);
      const fetchOptions = {
        baseURL: config.public.apiBaseUrl,
        headers: {
          ...(needsContentType && { "Content-Type": "application/json" }),
          ...options?.headers,
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        ...options,
      };

      // API呼び出し実行
      const response = await $fetch<T>(url, fetchOptions);

      return response as T;
    } catch (error: unknown) {
      // レスポンスインターセプター: エラー時の共通処理
      const fetchError = error as FetchError<{ status?: number }>;
      const status = fetchError.status || fetchError.statusCode;

      if ((status === 400 || status === 404) && fetchError.data?.status === 499) {
        // Business errorは個別にハンドリングするので再スロー
        throw error;
      }

      // その他のエラーはログ出力
      console.error("API接続エラー:", {
        url,
        status,
        error: fetchError.data || fetchError.message,
      });
      throw error;
    }
  };

  return {
    apiCall,
  };
};
