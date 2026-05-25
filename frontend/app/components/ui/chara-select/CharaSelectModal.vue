<template>
  <BaseModal v-model="isOpen" title="画像から選択">
    <div class="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-5">
      <button
        v-for="chara in charas"
        :key="chara.id"
        type="button"
        class="flex flex-col items-center rounded-lg border border-line-soft bg-elev p-2 hover:border-blood hover:bg-soft focus:outline-none focus:ring-2 focus:ring-blood transition-colors"
        @click="selectChara(chara)"
      >
        <img
          :src="chara.image.image_url"
          :alt="chara.name.name"
          :width="chara.image.width"
          :height="chara.image.height"
          class="mb-1"
          loading="lazy"
        />
        <p class="text-center text-xs text-fg">{{ chara.name.name }}</p>
      </button>
    </div>
  </BaseModal>
</template>

<script setup lang="ts">
import BaseModal from "~/components/ui/modal/Modal.vue";
import type { components } from "~/lib/api/schema";

type Chara = components["schemas"]["Chara"];

const props = defineProps<{
  modelValue: boolean;
  charas: Chara[];
}>();

const emit = defineEmits<{
  "update:modelValue": [value: boolean];
  select: [chara: Chara];
}>();

const isOpen = computed({
  get: () => props.modelValue,
  set: (v) => emit("update:modelValue", v),
});

const selectChara = (chara: Chara) => {
  emit("select", chara);
  isOpen.value = false;
};
</script>
