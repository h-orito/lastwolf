<template>
  <section class="py-8 px-4 bg-white">
    <div class="max-w-5xl mx-auto text-center">
      <h1 class="text-lg font-bold mb-4">LASTWOLF</h1>
      <div class="text-sm space-y-3">
        <p>LASTWOLFは短期人狼が無料で遊べるサービスです。</p>
        <div class="flex flex-wrap justify-center gap-2 mt-3">
          <NuxtLink
            to="/about"
            class="inline-flex items-center px-4 py-1.5 text-sm font-medium rounded bg-[#3991f4] text-white hover:bg-[#2c7ae0] transition-colors"
          >
            このサイトは
          </NuxtLink>
          <NuxtLink
            to="/rule"
            class="inline-flex items-center px-4 py-1.5 text-sm font-medium rounded bg-[#3991f4] text-white hover:bg-[#2c7ae0] transition-colors"
          >
            仕様
          </NuxtLink>
          <NuxtLink
            to="/faq"
            class="inline-flex items-center px-4 py-1.5 text-sm font-medium rounded bg-[#3991f4] text-white hover:bg-[#2c7ae0] transition-colors"
          >
            よくある質問
          </NuxtLink>
          <NuxtLink
            to="/release-note"
            class="inline-flex items-center px-4 py-1.5 text-sm font-medium rounded bg-[#3991f4] text-white hover:bg-[#2c7ae0] transition-colors"
          >
            更新情報
          </NuxtLink>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts"></script>
