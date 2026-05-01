<template>
  <section class="py-8 px-4">
    <div class="max-w-5xl mx-auto text-left mt-10">
      <h1 class="text-lg font-bold mb-6">Googleアカウントでログイン</h1>
      <UiButton button-type="primary" @click="handleGoogleLogin">ログイン</UiButton>
    </div>
  </section>
</template>

<script setup lang="ts">
import UiButton from "~/components/ui/button/index.vue";

const meta = buildPageMeta({ title: "Googleアカウントでログイン" });
useSeoMeta(meta);

const { loginWithGoogle, loginout, isAuthenticated, waitForAuth } = useAuth();
const router = useRouter();

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
  }
}
</script>
