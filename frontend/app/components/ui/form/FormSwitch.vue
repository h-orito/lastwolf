<template>
  <div class="flex items-start">
    <button
      :id="computedId"
      type="button"
      role="switch"
      :aria-checked="modelValue"
      :aria-labelledby="labelId"
      :aria-describedby="description ? descriptionId : undefined"
      :disabled="disabled"
      :class="switchClasses"
      class="mt-1"
      @click="toggle"
    >
      <span :class="knobClasses" aria-hidden="true" />
    </button>
    <div class="ml-3 text-left">
      <label
        :id="labelId"
        class="text-sm font-medium text-gray-700"
        :class="{ 'cursor-pointer': !disabled, 'cursor-not-allowed': disabled }"
        @click="!disabled && toggle()"
      >
        {{ label }}
      </label>
      <p v-if="description" :id="descriptionId" class="mt-1 text-xs text-gray-500">
        {{ description }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  modelValue: boolean;
  label: string;
  description?: string;
  disabled?: boolean;
  id?: string;
}

const props = withDefaults(defineProps<Props>(), {
  description: undefined,
  disabled: false,
  id: undefined,
});

const emit = defineEmits<{
  "update:modelValue": [value: boolean];
}>();

const autoId = useId();
const computedId = computed(() => props.id ?? autoId);
const labelId = computed(() => `${computedId.value}-label`);
const descriptionId = computed(() => `${computedId.value}-description`);

const toggle = () => {
  if (!props.disabled) {
    emit("update:modelValue", !props.modelValue);
  }
};

const switchClasses = computed(() => {
  const baseClasses =
    "relative inline-flex h-6 w-11 shrink-0 rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-[#3991f4] focus:ring-offset-2";

  const stateClasses = props.modelValue ? "bg-[#3991f4]" : "bg-gray-200";

  const disabledClasses = props.disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer";

  return [baseClasses, stateClasses, disabledClasses].join(" ");
});

const knobClasses = computed(() => {
  const baseClasses =
    "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out";

  const translateClasses = props.modelValue ? "translate-x-5" : "translate-x-0";

  return [baseClasses, translateClasses].join(" ");
});
</script>
