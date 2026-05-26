<template>
  <section class="py-8 px-4 bg-base">
    <div class="max-w-5xl mx-auto text-left">
      <ul class="text-sm space-y-2 text-fg">
        <li>
          <NuxtLink to="/charachip-list" class="footer-link"> キャラ画像一覧 </NuxtLink>
        </li>
        <li>
          要望、改善提案、不具合報告はTwitter
          <a
            href="https://twitter.com/ort_dev"
            target="_blank"
            rel="noopener noreferrer"
            class="footer-link"
            >@ort_dev</a
          >へお願いします
        </li>
        <li>
          投げ銭いただける方は
          <a href="#" class="footer-link" @click.prevent="openKampaModal">こちら</a>からお願いします
        </li>
        <li>
          <a href="#" class="footer-link" @click.prevent="openTermModal">利用規約</a>
        </li>
        <li>
          <a href="#" class="footer-link" @click.prevent="openPolicyModal">プライバシーポリシー</a>
        </li>
      </ul>

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
.footer-link {
  color: var(--color-blood);
  transition:
    color 150ms ease,
    text-shadow 150ms ease;
}
.footer-link:hover {
  color: #ff5b5b;
  text-decoration: underline;
  text-shadow: 0 0 8px rgba(224, 46, 46, 0.4);
}
</style>
