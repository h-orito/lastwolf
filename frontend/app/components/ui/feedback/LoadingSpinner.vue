<template>
  <div class="loading-bg" :class="{ 'loading-fixed': fixed }">
    <div class="loading-content">
      <img
        src="/image/loading.gif"
        width="80"
        height="80"
        alt="loading..."
        class="opacity-100"
        loading="eager"
      />
      <p class="mt-2 text-sm text-fg-secondary">{{ message }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  message?: string;
  fixed?: boolean;
}

withDefaults(defineProps<Props>(), {
  message: "読み込み中",
  fixed: false,
});
</script>

<style scoped>
.loading-bg {
  z-index: 50;
  position: relative;
  background: rgba(5, 6, 9, 0.6);
  width: 100%;
  height: 100%;
}

.loading-fixed {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100dvh;
}

.loading-content {
  position: absolute;
  width: 200px;
  height: 100px;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  margin: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
</style>
