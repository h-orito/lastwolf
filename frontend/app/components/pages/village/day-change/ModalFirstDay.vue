<template>
  <UiModal v-model="isOpen" title="村が開始されました" @close="close">
    <div v-if="myself?.skill" class="text-sm">
      <p class="mb-2">
        あなたの役職は <strong>{{ myself.skill.name }}</strong> です。
      </p>
      <div class="border border-gray-200 rounded p-3 bg-gray-50 text-xs whitespace-pre-wrap">
        {{ myself.skill.description }}
      </div>
    </div>
    <template #footer>
      <UiButton button-type="secondary" block @click="close">閉じる</UiButton>
    </template>
  </UiModal>
</template>

<script setup lang="ts">
import UiModal from "~/components/ui/modal/Modal.vue";
import UiButton from "~/components/ui/button/index.vue";

interface Props {
  modelValue: boolean;
}

interface Emits {
  (e: "update:modelValue", value: boolean): void;
  (e: "close"): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const isOpen = computed({
  get: () => props.modelValue,
  set: (v: boolean) => emit("update:modelValue", v),
});

const villageStore = useVillageStore();
const myself = computed(() => villageStore.situation?.participate.myself ?? null);

const close = () => {
  emit("close");
  emit("update:modelValue", false);
};
</script>
