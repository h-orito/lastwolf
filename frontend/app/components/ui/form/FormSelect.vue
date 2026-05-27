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

/* normal: 入力欄であることが一目で分かる base + rim 明度。FormInput と揃える。
 *
 * 改訂 (2026-05): 225deg rim の 40-70% 帯（上辺・左辺中段）の floor を底上げ。
 * 旧 bone 10% が事実上透明で「左側が暗い／枠がない」と認識されていたため。 */
.br-select-normal {
  background:
    linear-gradient(135deg, rgba(44, 26, 26, 0.96) 0%, rgba(28, 16, 16, 0.96) 100%) padding-box,
    linear-gradient(
        225deg,
        rgba(255, 175, 145, 0.75) 0%,
        rgba(224, 46, 46, 0.5) 18%,
        rgba(139, 26, 26, 0.4) 40%,
        rgba(139, 26, 26, 0.45) 70%,
        rgba(139, 26, 26, 0.55) 100%
      )
      border-box;
  box-shadow:
    inset 0 1px 0 rgba(255, 165, 135, 0.12),
    inset 0 0 0 1px rgba(255, 91, 58, 0.04);
}

.br-select-normal:hover:not(:focus) {
  background:
    linear-gradient(135deg, rgba(52, 32, 32, 0.96) 0%, rgba(34, 20, 20, 0.96) 100%) padding-box,
    linear-gradient(
        225deg,
        rgba(255, 185, 155, 0.85) 0%,
        rgba(224, 46, 46, 0.6) 18%,
        rgba(139, 26, 26, 0.5) 40%,
        rgba(139, 26, 26, 0.55) 70%,
        rgba(139, 26, 26, 0.65) 100%
      )
      border-box;
  box-shadow:
    inset 0 1px 0 rgba(255, 185, 155, 0.18),
    inset 0 0 0 1px rgba(255, 91, 58, 0.06);
}

.br-select-normal:focus {
  background:
    radial-gradient(
        ellipse 60% 140% at 100% -20%,
        rgba(255, 120, 100, 0.28) 0%,
        rgba(224, 46, 46, 0.14) 30%,
        transparent 60%
      )
      padding-box,
    linear-gradient(135deg, rgba(58, 36, 36, 0.96) 0%, rgba(36, 22, 22, 0.96) 100%) padding-box,
    linear-gradient(
        225deg,
        rgba(255, 200, 180, 1) 0%,
        rgba(255, 84, 84, 0.8) 18%,
        rgba(224, 46, 46, 0.55) 40%,
        rgba(224, 46, 46, 0.55) 70%,
        rgba(139, 26, 26, 0.75) 100%
      )
      border-box;
  box-shadow:
    inset 0 1px 0 rgba(255, 200, 180, 0.22),
    0 0 0 3px rgba(224, 46, 46, 0.22),
    0 0 24px -6px rgba(224, 46, 46, 0.55);
}

/* error: FormInput と揃える。全周均一 blood ring + 赤い base + 常時 outer halo。 */
.br-select-error {
  background:
    linear-gradient(135deg, rgba(80, 22, 22, 0.95) 0%, rgba(44, 12, 12, 0.95) 100%) padding-box,
    linear-gradient(
        225deg,
        rgba(255, 160, 130, 1) 0%,
        rgba(224, 46, 46, 0.95) 20%,
        rgba(224, 46, 46, 0.85) 55%,
        rgba(224, 46, 46, 0.9) 100%
      )
      border-box;
  box-shadow:
    inset 0 0 12px rgba(224, 46, 46, 0.3),
    0 0 0 1px rgba(224, 46, 46, 0.45),
    0 0 18px -2px rgba(224, 46, 46, 0.6);
}

.br-select-error:focus {
  background:
    radial-gradient(
        ellipse 60% 140% at 100% -20%,
        rgba(255, 130, 110, 0.35) 0%,
        rgba(224, 46, 46, 0.18) 30%,
        transparent 60%
      )
      padding-box,
    linear-gradient(135deg, rgba(96, 28, 28, 0.96) 0%, rgba(52, 16, 16, 0.96) 100%) padding-box,
    linear-gradient(
        225deg,
        rgba(255, 200, 180, 1) 0%,
        rgba(255, 91, 58, 0.95) 18%,
        rgba(224, 46, 46, 0.9) 55%,
        rgba(224, 46, 46, 0.95) 100%
      )
      border-box;
  box-shadow:
    inset 0 0 16px rgba(255, 91, 58, 0.4),
    inset 0 1px 0 rgba(255, 200, 180, 0.2),
    0 0 0 3px rgba(224, 46, 46, 0.28),
    0 0 26px -4px rgba(224, 46, 46, 0.75);
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
