<template>
  <nav class="nav-bar flex items-center justify-center px-4 py-3">
    <NuxtLink to="/" class="logo text-lg font-bold tracking-widest"> LASTWOLF </NuxtLink>
  </nav>
</template>

<script setup lang="ts">
// NavBar: Black & Blood 世界観に合わせたヘッダー
// - 背景: linear-gradient(180deg, bg-soft, bg-base) + 上端 1px の gold グラデ線
// - ロゴ: 月白テキスト + blood-deep のテキストシャドウ（lastwolf 赤グローと整合）
</script>

<style scoped>
.nav-bar {
  background: linear-gradient(180deg, var(--color-soft) 0%, var(--color-base) 100%);
  border-bottom: 1px solid var(--color-line-soft);
  position: relative;
}

/* 上端 1px の gold グラデ線（左右が暗→中央 gold） */
.nav-bar::before {
  content: "";
  position: absolute;
  inset: 0 0 auto 0;
  height: 1px;
  background: linear-gradient(
    90deg,
    transparent 0%,
    color-mix(in srgb, var(--color-gold) 50%, transparent) 30%,
    var(--color-gold) 50%,
    color-mix(in srgb, var(--color-gold) 50%, transparent) 70%,
    transparent 100%
  );
}

.logo {
  color: var(--color-bone);
  text-shadow:
    0 0 6px rgba(139, 26, 26, 0.6),
    0 0 16px rgba(224, 46, 46, 0.25);
  transition: text-shadow 150ms ease;
}

.logo:hover {
  text-shadow:
    0 0 8px rgba(139, 26, 26, 0.8),
    0 0 22px rgba(224, 46, 46, 0.45);
}
</style>
