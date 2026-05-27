<template>
  <section class="panel px-5 py-6 sm:px-7 sm:py-8">
    <div class="intro-inner">
      <p class="intro-tagline">LASTWOLFは短期人狼が無料で遊べるサービスです。</p>

      <nav class="registry intro-registry" aria-label="サイト内案内">
        <NuxtLink v-for="item in items" :key="item.to" :to="item.to" class="registry-entry">
          <span class="registry-numeral" aria-hidden="true">{{ item.numeral }}</span>
          <span class="registry-rule" aria-hidden="true"></span>
          <span class="registry-text">
            <span class="registry-title">{{ item.title }}</span>
            <span class="registry-subtitle">{{ item.subtitle }}</span>
          </span>
          <span class="registry-arrow" aria-hidden="true">→</span>
        </NuxtLink>
      </nav>
    </div>
  </section>
</template>

<script setup lang="ts">
interface IntroEntry {
  to: string;
  title: string;
  subtitle: string;
  numeral: string;
}

const items: IntroEntry[] = [
  { to: "/about", title: "このサイトは", subtitle: "Introduction", numeral: "I" },
  { to: "/rule", title: "仕様", subtitle: "Codex", numeral: "II" },
  { to: "/faq", title: "よくある質問", subtitle: "Inquiries", numeral: "III" },
  { to: "/release-note", title: "更新情報", subtitle: "Chronicle", numeral: "IV" },
];
</script>

<style scoped>
.intro-inner {
  margin: 0 auto;
  max-width: 32rem;
}

.intro-tagline {
  font-family: var(--font-serif);
  color: var(--color-fg);
  font-size: 0.9375rem;
  letter-spacing: 0.08em;
  line-height: 1.7;
  text-align: center;
}

.intro-registry {
  margin-top: 1.75rem;
}

/* Intro 専用 override: Roman numeral は italic + 少し大きく */
.intro-registry .registry-numeral {
  font-style: italic;
  font-size: 1.125rem;
  letter-spacing: 0.05em;
}

/* Intro の英語サブタイトル（Codex / Inquiries 等） */
.registry-subtitle {
  font-family: var(--font-display);
  font-size: 0.5625rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.32em;
  color: var(--color-fg-muted);
  line-height: 1;
}

@media (min-width: 640px) {
  .intro-tagline {
    font-size: 1rem;
  }
  .intro-registry .registry-numeral {
    font-size: 1.25rem;
  }
  .registry-subtitle {
    font-size: 0.625rem;
  }
}
</style>
