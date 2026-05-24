<template>
  <div v-bind="$attrs">
    <textarea
      v-if="type === 'textarea'"
      :id="id"
      :name="name"
      :value="modelValue"
      :placeholder="placeholder"
      :required="required"
      :disabled="disabled"
      :readonly="readonly"
      :maxlength="maxlength"
      :rows="rows"
      :class="inputClasses"
      @input="handleInput"
      @blur="handleBlur"
    />
    <input
      v-else
      :id="id"
      :name="name"
      :type="type"
      :value="modelValue"
      :placeholder="placeholder"
      :required="required"
      :disabled="disabled"
      :readonly="readonly"
      :maxlength="maxlength"
      :min="min"
      :max="max"
      :step="step"
      :class="inputClasses"
      @input="handleInput"
      @blur="handleBlur"
    />
  </div>
</template>

<script setup lang="ts">
interface Props {
  modelValue: string;
  type?: "text" | "password" | "email" | "number" | "textarea";
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  readonly?: boolean;
  maxlength?: number;
  rows?: number;
  error?: boolean;
  id?: string;
  name?: string;
  min?: number;
  max?: number;
  step?: number;
  inputClass?: string;
}

const props = withDefaults(defineProps<Props>(), {
  type: "text",
  placeholder: "",
  required: false,
  disabled: false,
  readonly: false,
  maxlength: undefined,
  rows: 3,
  error: false,
  id: undefined,
  name: undefined,
  min: undefined,
  max: undefined,
  step: undefined,
  inputClass: undefined,
});

const emit = defineEmits<{
  "update:modelValue": [value: string];
  blur: [event: FocusEvent];
}>();

defineOptions({
  inheritAttrs: false,
});

const baseClasses =
  "block w-full rounded border px-3 py-2 text-sm text-fg placeholder-fg-muted bg-soft focus:outline-none transition-colors duration-150";

const borderClasses = computed(() => {
  if (props.error) {
    return "border-wolf focus:border-wolf focus:ring-2 focus:ring-wolf/20";
  }
  return "border-line-soft focus:border-steel focus:ring-2 focus:ring-steel/20";
});

const disabledClasses = computed(() => {
  if (props.disabled) {
    return "opacity-50 cursor-not-allowed bg-elev";
  }
  if (props.readonly) {
    return "bg-elev";
  }
  return "";
});

const inputClasses = computed(() =>
  [baseClasses, borderClasses.value, disabledClasses.value, props.inputClass]
    .filter(Boolean)
    .join(" "),
);

const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement | HTMLTextAreaElement;
  emit("update:modelValue", target.value);
};

const handleBlur = (event: FocusEvent) => {
  emit("blur", event);
};
</script>
