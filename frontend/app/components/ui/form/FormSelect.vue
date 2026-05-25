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
    <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2.5">
      <svg
        :class="['h-4 w-4 transition-colors', disabled ? 'text-fg-muted' : 'text-blood/80']"
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
  "block w-full appearance-none px-3 py-1.5 pr-9 text-sm text-fg focus:outline-none transition-shadow duration-200 br-select border border-transparent cursor-pointer";

const stateClasses = computed(() => {
  if (props.disabled) return "br-select-disabled cursor-not-allowed";
  if (props.error) return "br-select-error";
  return "br-select-normal";
});

const selectClasses = computed(() => [baseClasses, stateClasses.value].filter(Boolean).join(" "));

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

<style scoped>
/*
 * Black & Blood directional select.
 * FormInput と同方針: 黒ベースに右上から赤光、focus で rim + halo が強まる。
 */

.br-select {
  border-radius: 10px;
  /* ネイティブ option の dark テーマ追従（chrome 119+ / safari 16.4+） */
  color-scheme: dark;
}

.br-select-normal {
  background:
    linear-gradient(135deg, rgba(20, 12, 12, 0.85) 0%, rgba(10, 6, 6, 0.85) 100%) padding-box,
    linear-gradient(
        225deg,
        rgba(244, 241, 232, 0.18) 0%,
        rgba(224, 46, 46, 0.12) 30%,
        rgba(0, 0, 0, 0) 60%,
        rgba(139, 26, 26, 0.1) 100%
      )
      border-box;
}

.br-select-normal:hover:not(:focus) {
  background:
    linear-gradient(135deg, rgba(28, 16, 16, 0.9) 0%, rgba(14, 8, 8, 0.9) 100%) padding-box,
    linear-gradient(
        225deg,
        rgba(244, 241, 232, 0.25) 0%,
        rgba(224, 46, 46, 0.18) 30%,
        rgba(0, 0, 0, 0) 60%,
        rgba(139, 26, 26, 0.15) 100%
      )
      border-box;
}

.br-select-normal:focus {
  background:
    radial-gradient(
        ellipse 60% 140% at 100% -20%,
        rgba(255, 120, 100, 0.22) 0%,
        rgba(224, 46, 46, 0.1) 30%,
        transparent 60%
      )
      padding-box,
    linear-gradient(135deg, rgba(28, 16, 16, 0.92) 0%, rgba(14, 8, 8, 0.92) 100%) padding-box,
    linear-gradient(
        225deg,
        rgba(255, 165, 135, 0.85) 0%,
        rgba(224, 46, 46, 0.55) 18%,
        rgba(244, 241, 232, 0.08) 40%,
        rgba(0, 0, 0, 0) 65%,
        rgba(139, 26, 26, 0.35) 100%
      )
      border-box;
  box-shadow:
    inset 0 1px 0 rgba(255, 165, 135, 0.12),
    0 0 0 3px rgba(224, 46, 46, 0.15),
    0 0 18px -6px rgba(224, 46, 46, 0.4);
}

.br-select-error {
  background:
    linear-gradient(135deg, rgba(40, 14, 14, 0.85) 0%, rgba(20, 8, 8, 0.85) 100%) padding-box,
    linear-gradient(
        225deg,
        rgba(255, 130, 100, 0.7) 0%,
        rgba(224, 46, 46, 0.5) 25%,
        rgba(139, 26, 26, 0.35) 60%,
        rgba(139, 26, 26, 0.45) 100%
      )
      border-box;
  box-shadow:
    inset 0 0 12px -4px rgba(224, 46, 46, 0.18),
    0 0 16px -8px rgba(224, 46, 46, 0.35);
}

.br-select-error:focus {
  background:
    radial-gradient(
        ellipse 60% 140% at 100% -20%,
        rgba(255, 120, 100, 0.28) 0%,
        rgba(224, 46, 46, 0.14) 30%,
        transparent 60%
      )
      padding-box,
    linear-gradient(135deg, rgba(50, 18, 18, 0.9) 0%, rgba(24, 10, 10, 0.9) 100%) padding-box,
    linear-gradient(
        225deg,
        rgba(255, 165, 135, 0.95) 0%,
        rgba(224, 46, 46, 0.65) 22%,
        rgba(139, 26, 26, 0.4) 60%,
        rgba(139, 26, 26, 0.55) 100%
      )
      border-box;
  box-shadow:
    inset 0 0 14px -3px rgba(224, 46, 46, 0.28),
    0 0 0 3px rgba(224, 46, 46, 0.2),
    0 0 22px -6px rgba(224, 46, 46, 0.55);
}

.br-select-disabled {
  background:
    linear-gradient(135deg, rgba(14, 8, 8, 0.7) 0%, rgba(8, 4, 4, 0.7) 100%) padding-box,
    linear-gradient(
        225deg,
        rgba(244, 241, 232, 0.06) 0%,
        rgba(139, 26, 26, 0.04) 60%,
        rgba(139, 26, 26, 0.04) 100%
      )
      border-box;
  opacity: 0.55;
}
</style>
