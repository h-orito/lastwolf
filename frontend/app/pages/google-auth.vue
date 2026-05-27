<template>
  <section class="px-4 py-6 sm:py-8">
    <div class="mx-auto max-w-md">
      <article class="panel px-5 py-7 text-center sm:px-7 sm:py-9">
        <header class="section-heading">
          <h1 class="section-title">Googleアカウントでログイン</h1>
        </header>

        <p class="mb-5 text-sm text-fg-secondary">Googleアカウントを使ってログインします。</p>

        <UiButton button-type="primary" @click="handleGoogleLogin">ログイン</UiButton>
      </article>
    </div>
  </section>
</template>

<script setup lang="ts">
import UiButton from "~/components/ui/button/index.vue";

const meta = buildPageMeta({ title: "Googleアカウントでログイン" });
useSeoMeta(meta);

const { loginWithGoogle, loginout, isAuthenticated, waitForAuth } = useAuth();
const router = useRouter();
const { add: addToast } = useToast();

onMounted(async () => {
  const user = await waitForAuth();
  await loginout(user);
  if (isAuthenticated.value) {
    router.push("/");
  }
});

async function handleGoogleLogin(): Promise<void> {
  try {
    await loginWithGoogle();
    router.push("/");
  } catch (error) {
    console.error("Googleログインに失敗しました:", error);
    addToast({
      message: "ログインに失敗しました。時間をおいて再度お試しください。",
      type: "error",
    });
  }
}
</script>
