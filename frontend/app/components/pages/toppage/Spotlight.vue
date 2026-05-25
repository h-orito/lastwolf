<template>
  <div class="spotlight-area">
    <picture>
      <source media="(max-width: 640px)" srcset="/image/lastwolf-mobile.webp" />
      <img src="/image/lastwolf.webp" alt="top_image" class="w-full" width="1228" height="768" />
    </picture>
    <div class="spotlight">
      <p class="spotlight-intro spotlight-shadow text-3xl text-white">LASTWOLF</p>
    </div>
  </div>
</template>

<script setup lang="ts">
// スポットライト: lastwolfをフルビジュアルで表示し、LASTWOLFテキストをオーバーレイ
// 画面幅 640px 以下では中央クロップ版に切り替え
</script>

<style scoped>
.spotlight-area {
  position: relative;
}

.spotlight {
  position: absolute;
  right: 2%;
  bottom: calc(50% - 2rem);
  text-align: right;
}

.spotlight-intro {
  font-family:
    "游明朝", YuMincho, "Hiragino Mincho ProN W3", "ヒラギノ明朝 ProN W3", "Hiragino Mincho ProN",
    "HG明朝E", "ＭＳ Ｐ明朝", "ＭＳ 明朝", serif;
}

.spotlight-shadow {
  /* 新画像の赤いオーラに合わせて blood-deep に変更（旧 steel-deep #456185 から） */
  text-shadow:
    2px 2px 6px rgba(139, 26, 26, 1),
    -2px 2px 6px rgba(139, 26, 26, 1),
    2px -2px 6px rgba(139, 26, 26, 1),
    -2px -2px 6px rgba(139, 26, 26, 1),
    0 0 24px rgba(224, 46, 46, 0.6);
}
</style>
