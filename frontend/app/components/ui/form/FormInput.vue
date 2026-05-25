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
  "block w-full px-3 py-2 text-sm text-fg placeholder-fg-muted focus:outline-none transition-shadow duration-200 br-input border border-transparent";

// 優先順位: disabled > error > readonly。
// error は readonly と同時指定でも表示する（旧実装の additive 合成を踏襲）。
// disabled は操作不可が自明なので error rim は隠す。
const stateClasses = computed(() => {
  if (props.disabled) return "br-input-disabled cursor-not-allowed";
  if (props.error) return "br-input-error";
  if (props.readonly) return "br-input-readonly";
  return "br-input-normal";
});

const inputClasses = computed(() =>
  [baseClasses, stateClasses.value, props.inputClass].filter(Boolean).join(" "),
);

const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement | HTMLTextAreaElement;
  emit("update:modelValue", target.value);
};

const handleBlur = (event: FocusEvent) => {
  emit("blur", event);
};
</script>

<style scoped>
/*
 * Black & Blood directional input.
 * 黒ベースに右上から赤光が差し込む。focus で rim と inset glow が強まる。
 * BaseButton の padding-box + border-box 二重背景手法を踏襲。
 */

.br-input {
  border-radius: 10px;
}

.br-input-normal {
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

.br-input-normal:hover:not(:focus) {
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

/* focus: 右上から赤光が差し込む + 周囲に弱い blood halo */
.br-input-normal:focus {
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

/* error: 全周 blood-deep の rim、focus で halo が強まる */
.br-input-error {
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

.br-input-error:focus {
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

/* readonly: 通常より沈み、focus rim は出さない */
.br-input-readonly {
  background:
    linear-gradient(135deg, rgba(14, 8, 8, 0.85) 0%, rgba(8, 4, 4, 0.85) 100%) padding-box,
    linear-gradient(
        225deg,
        rgba(244, 241, 232, 0.1) 0%,
        rgba(139, 26, 26, 0.06) 60%,
        rgba(139, 26, 26, 0.06) 100%
      )
      border-box;
}

/* disabled: opacity と pointer/cursor だけで沈める */
.br-input-disabled {
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
