<template>
  <div class="site">
    <GoogleAds />
    <div class="site-content text-center">
      <slot />
    </div>
    <Toast />
  </div>
</template>

<script setup lang="ts">
import GoogleAds from "~/components/layout/GoogleAds.vue";
import Toast from "~/components/ui/feedback/Toast.vue";
</script>

<style scoped>
.site {
  min-height: 100dvh;
  background-color: var(--color-deep);
  color: var(--color-fg);
}

.site-content {
  width: 100%;
}
</style>
