<template>
  <div v-bind="$attrs">
    <label v-if="label" class="mb-1 block text-sm font-medium text-fg">
      {{ label }}
      <span v-if="required" class="ml-0.5 text-wolf">*</span>
    </label>
    <div>
      <slot />
    </div>
    <div v-if="$slots.help" class="mt-1 text-sm text-fg-secondary">
      <slot name="help" />
    </div>
    <div v-if="$slots.error" class="mt-1 text-sm text-wolf">
      <slot name="error" />
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  label?: string;
  required?: boolean;
}

defineOptions({
  inheritAttrs: false,
});

withDefaults(defineProps<Props>(), {
  label: undefined,
  required: false,
});
</script>
