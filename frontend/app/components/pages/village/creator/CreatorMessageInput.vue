<template>
  <div>
    <textarea
      :value="modelValue"
      placeholder="村建て発言"
      rows="5"
      class="creator-textarea w-full px-2 py-1 text-sm font-sans resize-y"
      @input="onInput"
    />
    <p class="text-right text-xs mt-1">
      <span :class="isLengthOver ? 'text-wolf' : 'text-fg-secondary'">
        文字数: {{ currentLength }}/{{ maxLength }}
      </span>
    </p>
  </div>
</template>

<script setup lang="ts">
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

const onInput = (e: Event) => {
  emit("update:modelValue", (e.target as HTMLTextAreaElement).value);
};

defineExpose({ isLengthOver });
</script>

<style scoped>
.creator-textarea {
  background-color: var(--color-elev);
  color: var(--color-fg);
  border: 1px solid var(--color-line-soft);
  border-radius: 0.375rem;
  transition:
    border-color 150ms ease,
    box-shadow 150ms ease;
}
.creator-textarea::placeholder {
  color: var(--color-fg-muted);
}
.creator-textarea:focus {
  outline: none;
  border-color: var(--color-blood);
  box-shadow: 0 0 0 2px color-mix(in srgb, var(--color-blood) 25%, transparent);
}
</style>
