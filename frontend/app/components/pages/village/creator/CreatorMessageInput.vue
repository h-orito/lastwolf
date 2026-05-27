<template>
  <div>
    <UiFormInput
      :model-value="modelValue"
      type="textarea"
      placeholder="村建て発言"
      :rows="5"
      @update:model-value="onUpdate"
    />
    <p class="text-right text-xs mt-1">
      <span :class="isLengthOver ? 'text-wolf' : 'text-fg-secondary'">
        文字数: {{ currentLength }}/{{ maxLength }}
      </span>
    </p>
  </div>
</template>

<script setup lang="ts">
import UiFormInput from "~/components/ui/form/FormInput.vue";

interface Props {
  modelValue: string;
}

interface Emits {
  (e: "update:modelValue", value: string): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const maxLength = 400;

const currentLength = computed(() => {
  const lines = props.modelValue.split("\n").length - 1;
  return props.modelValue.length - lines;
});

const isLengthOver = computed(() => currentLength.value > maxLength);

const onUpdate = (value: string) => {
  emit("update:modelValue", value);
};

defineExpose({ isLengthOver });
</script>
