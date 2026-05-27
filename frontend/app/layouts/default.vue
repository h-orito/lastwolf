<template>
  <div class="site site-bg">
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
/* 背景の gradient は main.css の .site-bg に共通化 (layouts/top.vue と同一定義のため) */
.site {
  min-height: 100dvh;
}

.site-content {
  width: 100%;
}
</style>
