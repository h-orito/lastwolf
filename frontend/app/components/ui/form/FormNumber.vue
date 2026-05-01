<template>
  <FormInput
    :id="id"
    :model-value="String(modelValue)"
    type="number"
    :min="min"
    :max="max"
    :step="step"
    :placeholder="placeholder"
    :required="required"
    :disabled="disabled"
    :error="error"
    :name="name"
    input-class="text-right"
    @update:model-value="handleUpdate"
    @blur="handleBlur"
  />
</template>

<script setup lang="ts">
import FormInput from "~/components/ui/form/FormInput.vue";

interface Props {
  modelValue: string | number;
  min?: number;
  max?: number;
  step?: number;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  error?: boolean;
  id?: string;
  name?: string;
}

const props = withDefaults(defineProps<Props>(), {
  min: undefined,
  max: undefined,
  step: 1,
  placeholder: "",
  required: false,
  disabled: false,
  error: false,
  id: undefined,
  name: undefined,
});

const emit = defineEmits<{
  "update:modelValue": [value: number];
  blur: [event: FocusEvent];
}>();

const handleUpdate = (value: string) => {
  const numValue = Number(value);
  emit("update:modelValue", Number.isNaN(numValue) ? 0 : numValue);
};

const handleBlur = (event: FocusEvent) => {
  const currentValue = Number(props.modelValue);
  let clamped = currentValue;
  if (props.min !== undefined && clamped < props.min) clamped = props.min;
  if (props.max !== undefined && clamped > props.max) clamped = props.max;
  if (clamped !== currentValue) {
    emit("update:modelValue", clamped);
  }
  emit("blur", event);
};
</script>
