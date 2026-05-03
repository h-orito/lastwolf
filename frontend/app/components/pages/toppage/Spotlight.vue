<template>
  <div class="spotlight-area">
    <img src="/image/top.jpg" alt="top_image" class="w-full" />
    <div class="spotlight">
      <p class="spotlight-intro spotlight-shadow text-3xl text-white">LASTWOLF</p>
    </div>
  </div>
</template>

<script setup lang="ts">
// スポットライト: top.jpgをフルビジュアルで表示し、LASTWOLFテキストをオーバーレイ
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
  text-shadow:
    2px 2px 5px rgba(69, 97, 133, 1),
    -2px 2px 5px rgba(69, 97, 133, 1),
    2px -2px 5px rgba(69, 97, 133, 1),
    -2px -2px 5px rgba(69, 97, 133, 1);
}
</style>
