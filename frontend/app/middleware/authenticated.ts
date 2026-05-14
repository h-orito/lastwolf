/**
 * 認証が必要なページへのアクセスを制御するミドルウェア
 * 未ログイン時はトップページへリダイレクトする
 */
export default defineNuxtRouteMiddleware(async (to) => {
  // サーバーサイドでは認証チェックをスキップ（Firebaseはクライアントのみ）
  if (import.meta.server) {
    return;
  }

  const auth = useAuth();

  // 認証が必要なルートのパスを定義
  // 旧nuxt2実装: /と/villageと/google-authはスキップしていた
  const skipPaths = ["/", "/village", "/google-auth"];

  // 現在のパスがスキップ対象かチェック
  const shouldSkip = skipPaths.some((path) => to.path === path || to.path.startsWith("/village/"));

  if (shouldSkip) {
    return;
  }

  // Firebase認証の初期化完了を待つ
  await auth.waitForAuth();

  // 認証されていない場合はトップページへリダイレクト
  if (!auth.isAuthenticated.value) {
    return navigateTo("/");
  }
});
