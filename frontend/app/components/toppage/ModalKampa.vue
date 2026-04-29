<template>
  <UiModalModal v-model="isOpen" title="投げ銭について" @close="close">
    <div class="space-y-4 text-sm">
      <p>
        開発を応援してくださりありがとうございます。<br />
        投げ銭いただける方は以下のいずれかの方法でお願いします。
      </p>

      <div>
        <h2 class="font-semibold text-base mb-2">Amazonほしいものリスト</h2>
        <p class="mb-2">Amazonほしいものリストから選んで開発者に送ることができます。</p>
        <a
          href="https://www.amazon.jp/hz/wishlist/ls/1KZSJAJS1ETW4?ref_=wl_share"
          target="_blank"
          rel="noopener noreferrer"
          class="inline-flex items-center px-3 py-1.5 text-sm font-medium rounded bg-[#3991f4] text-white hover:bg-[#2c7ae0] transition-colors"
        >
          Amazonほしいものリスト
        </a>
      </div>

      <div>
        <h2 class="font-semibold text-base mb-2">Amazonアソシエイト経由でお買い物</h2>
        <p class="mb-2">
          下記からAmazonに遷移してカートに追加＆購入すると、管理人に若干の紹介料が入ります。
        </p>
        <iframe
          src="https://rcm-fe.amazon-adsystem.com/e/cm?o=9&p=20&l=ez&f=ifr&linkID=c5438f7fc033eeee42260876403c6c51&t=wolfort0d-22&tracking_id=wolfort0d-22"
          width="120"
          height="90"
          scrolling="no"
          style="border: none"
          frameborder="0"
          title="Amazon"
        ></iframe>
      </div>

      <div>
        <h4 class="font-semibold text-base mb-2">補足</h4>
        <ul class="list-disc pl-5 space-y-1">
          <li>
            頂いた改善提案、ご要望については投げ銭の有無に関係なく積極的に取り入れていくので、Twitter
            <a
              href="https://twitter.com/ort_dev"
              target="_blank"
              rel="noopener noreferrer"
              class="text-blue-600 hover:text-blue-800 underline"
              >@ort_dev</a
            >までお願いします。
          </li>
        </ul>
      </div>
    </div>

    <template #footer>
      <UiButtonIndex button-type="secondary" @click="close">閉じる</UiButtonIndex>
    </template>
  </UiModalModal>
</template>

<script setup lang="ts">
import UiModalModal from "~/components/ui/modal/Modal.vue";
import UiButtonIndex from "~/components/ui/button/index.vue";

interface Props {
  modelValue: boolean;
}

const props = defineProps<Props>();
const emit = defineEmits<{
  "update:modelValue": [value: boolean];
}>();

const isOpen = computed({
  get: () => props.modelValue,
  set: (value: boolean) => emit("update:modelValue", value),
});

const close = () => {
  isOpen.value = false;
};
</script>
