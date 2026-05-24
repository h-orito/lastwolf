<template>
  <div v-bind="$attrs" class="relative">
    <select
      :id="id"
      :name="name"
      :value="modelValue"
      :disabled="disabled"
      :required="required"
      :class="selectClasses"
      @change="handleChange"
      @blur="handleBlur"
    >
      <option
        v-if="placeholder"
        value=""
        disabled
        :selected="modelValue === null || modelValue === undefined"
      >
        {{ placeholder }}
      </option>
      <option
        v-for="option in normalizedOptions"
        :key="option.value"
        :value="option.value"
        :disabled="option.disabled"
      >
        {{ option.label }}
      </option>
    </select>
    <!-- ドロップダウン矢印アイコン -->
    <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
      <svg
        class="h-4 w-4 text-fg-secondary"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        fill="currentColor"
        aria-hidden="true"
      >
        <path
          fill-rule="evenodd"
          d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
          clip-rule="evenodd"
        />
      </svg>
    </div>
  </div>
</template>

<script setup lang="ts">
type SelectOption =
  | {
      label: string;
      value: string | number;
      disabled?: boolean;
    }
  | string
  | number;

interface Props {
  modelValue: string | number | null | undefined;
  options: SelectOption[];
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  error?: boolean;
  id?: string;
  name?: string;
  labelAttribute?: string;
  valueAttribute?: string;
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: "",
  disabled: false,
  required: false,
  error: false,
  id: undefined,
  name: undefined,
  labelAttribute: "label",
  valueAttribute: "value",
});

const emit = defineEmits<{
  "update:modelValue": [value: string | number];
  blur: [event: FocusEvent];
  change: [event: Event];
}>();

defineOptions({
  inheritAttrs: false,
});

const normalizedOptions = computed(() => {
  return props.options.map((option) => {
    if (typeof option === "string" || typeof option === "number") {
      return { label: String(option), value: option, disabled: false };
    }
    const optionObj = option as Record<string, unknown>;
    return {
      label: String(optionObj[props.labelAttribute] ?? optionObj.label ?? ""),
      value: (optionObj[props.valueAttribute] ?? optionObj.value) as string | number,
      disabled: !!optionObj.disabled,
    };
  });
});

const baseClasses =
  "block w-full appearance-none rounded border px-2 py-1 pr-9 text-sm text-fg bg-soft focus:outline-none transition-colors duration-150 cursor-pointer";

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
  return "";
});

const selectClasses = computed(() =>
  [baseClasses, borderClasses.value, disabledClasses.value].filter(Boolean).join(" "),
);

const handleChange = (event: Event) => {
  const target = event.target as HTMLSelectElement;
  const value = target.value;
  if (value === "") {
    emit("update:modelValue", value);
    emit("change", event);
    return;
  }
  const numValue = Number(value);
  emit("update:modelValue", isNaN(numValue) ? value : numValue);
  emit("change", event);
};

const handleBlur = (event: FocusEvent) => {
  emit("blur", event);
};
</script>
