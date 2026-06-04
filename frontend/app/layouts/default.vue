<template>
  <div class="site site-bg">
    <GoogleAds />
    <!-- トップ (/) は自前の TopHeader を持つため NavBar は出さない（旧 top.vue 相当）。
         全ページを単一レイアウトに統一することで、レイアウト跨ぎの swap を無くし
         pageTransition を全遷移で一貫して効かせる（旧 top/default 分離 + layoutTransition の
         白フラッシュ/間延び問題を構造的に回避）。 -->
    <NavBar v-if="showNav" />
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

const route = useRoute();
const showNav = computed(() => route.path !== "/");
</script>

<style scoped>
/* 背景の gradient は main.css の .site-bg に共通化 */
.site {
  min-height: 100dvh;
}

.site-content {
  width: 100%;
}
</style>
