<template>
  <section class="py-8 px-4">
    <div class="max-w-5xl mx-auto text-left mt-10">
      <h1 class="text-lg font-bold mb-6">Googleアカウントでログイン</h1>
      <UiButton button-type="primary" @click="googleLogin">ログイン</UiButton>
    </div>
  </section>
</template>

<script setup lang="ts">
import UiButton from "~/components/ui/button/index.vue";

const meta = buildPageMeta({ title: "Googleアカウントでログイン" });
useSeoMeta(meta);

const { signInWithGoogle, loginout, isAuthenticated, waitForAuth } = useAuth();
const router = useRouter();

onMounted(async () => {
  // 認証状態を確認・同期
  const user = await waitForAuth();
  await loginout(user);

  // 認証済みの場合はトップページへリダイレクト
  if (isAuthenticated.value) {
    router.push("/");
  }
});

async function googleLogin(): Promise<void> {
  try {
    const credential = await signInWithGoogle();
    // ログイン後にユーザー情報をサーバに登録（新規登録の場合）
    await registerUserIfNeeded(credential);
    router.push("/");
  } catch (error) {
    console.error("Googleログインに失敗しました:", error);
  }
}

async function registerUserIfNeeded(credential: {
  user: { getIdToken: (forceRefresh: boolean) => Promise<string> } | null;
}): Promise<void> {
  if (!credential.user) return;

  const user = credential.user;
  const idToken = await user.getIdToken(false);

  // Cookieに保存
  const tokenCookie = useCookie("id-token", {
    maxAge: 60 * 60 * 24 * 30,
    sameSite: "strict",
  });
  tokenCookie.value = idToken;

  // 1時間で有効期限が切れるので50分後に再取得させる
  const checkDateCookie = useCookie("id-token-check-date", {
    maxAge: 60 * 60 * 24 * 30,
    sameSite: "strict",
  });
  const now = new Date();
  now.setMinutes(now.getMinutes() + 50);
  checkDateCookie.value = now.toISOString();

  // サーバーにプレイヤー情報を登録
  try {
    const { apiCall } = useApi();
    await apiCall("/player/nickname", {
      method: "POST",
      body: {
        nickname: "仮登録",
        twitter_user_name: "仮登録",
      },
    });
  } catch (error) {
    // 既存ユーザーの場合はエラーが出る可能性があるが、無視する
    console.warn("プレイヤー情報の登録でエラーが発生しました（既存ユーザーの場合は正常）:", error);
  }
}
</script>
