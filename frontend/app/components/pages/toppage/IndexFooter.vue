<template>
  <section class="panel px-5 py-5 sm:px-7 sm:py-6">
    <div class="imprint">
      <nav class="imprint-line" aria-label="サイトリンク">
        <NuxtLink to="/charachip-list" class="imprint-link">キャラ画像一覧</NuxtLink>
        <a
          href="https://twitter.com/ort_dev"
          target="_blank"
          rel="noopener noreferrer"
          class="imprint-link"
          title="Twitter @ort_dev へ"
          >要望・不具合報告</a
        >
        <a
          href="#"
          class="imprint-link"
          title="投げ銭でサイトを応援"
          @click.prevent="openKampaModal"
          >投げ銭</a
        >
        <a href="#" class="imprint-link" @click.prevent="openTermModal">利用規約</a>
        <a href="#" class="imprint-link" @click.prevent="openPolicyModal">プライバシーポリシー</a>
      </nav>

      <p class="imprint-mark" aria-hidden="true">
        <span class="imprint-mark-ornament">✦</span>
        <span class="imprint-mark-text">LASTWOLF</span>
        <span class="imprint-mark-ornament">✦</span>
      </p>

      <ToppageModalKampa v-model="isKampaModalOpen" />
      <ToppageModalTerm v-model="isTermModalOpen" />
      <ToppageModalPolicy v-model="isPolicyModalOpen" />
    </div>
  </section>
</template>

<script setup lang="ts">
const isKampaModalOpen = ref(false);
const isTermModalOpen = ref(false);
const isPolicyModalOpen = ref(false);

const openKampaModal = () => {
  isKampaModalOpen.value = true;
};

const openTermModal = () => {
  isTermModalOpen.value = true;
};

const openPolicyModal = () => {
  isPolicyModalOpen.value = true;
};
</script>

<style scoped>
/*
 * Footer imprint — 1 行のインラインリンク + 装飾マーク（合計 2 行）
 *  line 1: 5 links separated by Cinzel middle-dots (blood-deep)
 *  line 2: tiny "✦ LASTWOLF ✦" Cinzel mark
 *
 * 各リンクの ::after にセパレータを置くことで、折り返し時にも
 * リンク末尾にセパレータが貼り付いて行末が綺麗になる。
 */
.imprint {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.55rem;
  text-align: center;
}

.imprint-line {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  font-family: var(--font-sans);
  line-height: 1.7;
}

.imprint-link {
  font-size: 0.8rem;
  letter-spacing: 0.04em;
  color: var(--color-fg-secondary);
  padding: 0.15rem 0;
  text-decoration: underline;
  text-decoration-color: transparent;
  text-decoration-thickness: 1px;
  text-underline-offset: 0.28em;
  transition:
    color 220ms ease,
    text-decoration-color 220ms ease,
    text-shadow 220ms ease;
}

/* リンク間セパレータ（中点）
 * 末尾以外のリンクの直後に貼り付く。inline-block で text-decoration の影響を受けない。 */
.imprint-link:not(:last-child)::after {
  content: "·";
  display: inline-block;
  margin: 0 0.65em;
  color: var(--color-blood-deep);
  font-family: var(--font-display);
  font-size: 0.85em;
  pointer-events: none;
  text-decoration: none;
}

.imprint-link:hover,
.imprint-link:focus-visible {
  color: var(--color-bone);
  outline: none;
  text-decoration-color: currentColor;
  text-shadow: 0 0 14px color-mix(in srgb, var(--color-blood) 30%, transparent);
}

/* 装飾的な LASTWOLF インプリント（2 行目） */
.imprint-mark {
  display: inline-flex;
  align-items: center;
  gap: 0.9em;
  margin: 0;
  font-family: var(--font-display);
  font-size: 0.58rem;
  font-weight: 500;
  text-transform: uppercase;
  color: var(--color-fg-muted);
  line-height: 1;
  user-select: none;
}
.imprint-mark-ornament {
  color: var(--color-blood-deep);
  font-size: 0.85rem;
}
.imprint-mark-text {
  letter-spacing: 0.6em;
  /* letter-spacing 末尾の余白を打ち消して中央寄せをきれいに */
  margin-right: -0.6em;
}

@media (min-width: 640px) {
  .imprint-link {
    font-size: 0.85rem;
  }
  .imprint-mark {
    font-size: 0.62rem;
  }
  .imprint-mark-ornament {
    font-size: 0.95rem;
  }
}
</style>
