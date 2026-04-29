<template>
  <div>
    <textarea
      :value="modelValue"
      placeholder="村建て発言"
      rows="5"
      class="w-full border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:border-[#3991f4] font-sans resize-y"
      @input="onInput"
    />
    <p class="text-right text-xs mt-1">
      <span :class="isLengthOver ? 'text-red-600' : ''">
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
