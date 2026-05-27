<template>
  <div class="site">
    <GoogleAds />
    <NavBar />
    <div class="site-content text-center">
      <slot />
    </div>
    <Toast />
  </div>
</template>

<script setup lang="ts">
import GoogleAds from "~/components/layout/GoogleAds.vue";
import NavBar from "~/components/layout/NavBar.vue";
import Toast from "~/components/ui/feedback/Toast.vue";
</script>

<style scoped>
/*
 * 村画面（および default layout を使う他ページ）の背景:
 * 右上から赤光が差し込む warm-dark gradient wash。
 * layouts/top.vue と同じ言語で世界観を統一。
 */
.site {
  min-height: 100dvh;
  color: var(--color-fg);
  background-color: var(--color-deep);
  background-image:
    radial-gradient(ellipse 1400px 900px at 95% 0%, rgba(255, 91, 58, 0.18), transparent 55%),
    radial-gradient(ellipse 1100px 700px at 92% -5%, rgba(224, 46, 46, 0.22), transparent 50%),
    radial-gradient(ellipse 800px 600px at 0% 100%, rgba(139, 26, 26, 0.12), transparent 60%),
    linear-gradient(225deg, #1c0606 0%, #0a0404 55%, #050202 100%);
  background-attachment: fixed;
}

.site-content {
  width: 100%;
}
</style>
