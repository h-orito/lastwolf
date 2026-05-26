<template>
  <section class="py-8 px-4 bg-deep">
    <div class="max-w-5xl mx-auto text-center">
      <h1 class="text-lg font-bold mb-4 text-fg">LASTWOLF</h1>
      <div class="text-sm space-y-3 text-fg">
        <p>LASTWOLFは短期人狼が無料で遊べるサービスです。</p>
        <div class="flex flex-wrap justify-center gap-2 mt-3">
          <UiButton button-type="secondary" to="/about">このサイトは</UiButton>
          <UiButton button-type="secondary" to="/rule">仕様</UiButton>
          <UiButton button-type="secondary" to="/faq">よくある質問</UiButton>
          <UiButton button-type="secondary" to="/release-note">更新情報</UiButton>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts"></script>
