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
  type?: "text" | "password" | "email" | "number" | "datetime-local" | "textarea";
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  readonly?: boolean;
  maxlength?: number;
  rows?: number;
  error?: boolean;
  id?: string;
  name?: string;
  // datetime-local では min/max に "YYYY-MM-DDTHH:mm" 形式の文字列を渡すため number | string
  min?: number | string;
  max?: number | string;
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
  /* number の spinner や datetime-local の native ピッカー / カレンダーアイコンをダークで描画する */
  color-scheme: dark;
}

/* normal: ページ bg #050202 から明確に持ち上がる base + 視認できる rim。
 * 入力欄であることが一目で分かる必要があるため、focus 相当の rim 明度を baseline にする。
 *
 * 改訂 (2026-06): 旧 225deg 単一 rim は右上ピーク → 左下が floor のため「右側だけ光り左側が暗い」と
 * 指摘された。**四隅それぞれを ember→blood で光らせる radial 4 枚 + blood-deep floor** の対称 rim に変更し、
 * 左右どちらの端も同じ明度で光るようにする（panel-compact と同じ言語）。
 */
.br-input-normal {
  background:
    linear-gradient(135deg, rgba(44, 26, 26, 0.96) 0%, rgba(28, 16, 16, 0.96) 100%) padding-box,
    radial-gradient(
        ellipse 50% 75% at 0% 0%,
        rgba(255, 175, 145, 0.75) 0%,
        rgba(224, 46, 46, 0.5) 24%,
        transparent 80%
      )
      border-box,
    radial-gradient(
        ellipse 50% 75% at 100% 0%,
        rgba(255, 175, 145, 0.75) 0%,
        rgba(224, 46, 46, 0.5) 24%,
        transparent 80%
      )
      border-box,
    radial-gradient(
        ellipse 50% 75% at 0% 100%,
        rgba(255, 175, 145, 0.75) 0%,
        rgba(224, 46, 46, 0.5) 24%,
        transparent 80%
      )
      border-box,
    radial-gradient(
        ellipse 50% 75% at 100% 100%,
        rgba(255, 175, 145, 0.75) 0%,
        rgba(224, 46, 46, 0.5) 24%,
        transparent 80%
      )
      border-box,
    linear-gradient(0deg, rgba(224, 46, 46, 0.58), rgba(224, 46, 46, 0.58)) border-box;
  box-shadow:
    inset 0 1px 0 rgba(255, 165, 135, 0.12),
    inset 0 0 0 1px rgba(255, 91, 58, 0.04);
}

.br-input-normal:hover:not(:focus) {
  background:
    linear-gradient(135deg, rgba(52, 32, 32, 0.96) 0%, rgba(34, 20, 20, 0.96) 100%) padding-box,
    radial-gradient(
        ellipse 50% 75% at 0% 0%,
        rgba(255, 185, 155, 0.85) 0%,
        rgba(224, 46, 46, 0.6) 24%,
        transparent 80%
      )
      border-box,
    radial-gradient(
        ellipse 50% 75% at 100% 0%,
        rgba(255, 185, 155, 0.85) 0%,
        rgba(224, 46, 46, 0.6) 24%,
        transparent 80%
      )
      border-box,
    radial-gradient(
        ellipse 50% 75% at 0% 100%,
        rgba(255, 185, 155, 0.85) 0%,
        rgba(224, 46, 46, 0.6) 24%,
        transparent 80%
      )
      border-box,
    radial-gradient(
        ellipse 50% 75% at 100% 100%,
        rgba(255, 185, 155, 0.85) 0%,
        rgba(224, 46, 46, 0.6) 24%,
        transparent 80%
      )
      border-box,
    linear-gradient(0deg, rgba(224, 46, 46, 0.66), rgba(224, 46, 46, 0.66)) border-box;
  box-shadow:
    inset 0 1px 0 rgba(255, 185, 155, 0.18),
    inset 0 0 0 1px rgba(255, 91, 58, 0.06);
}

/* focus: 上辺中央から radial 赤光が差し込み（左右対称）、四隅の rim が一段強まり、外側に blood halo */
.br-input-normal:focus {
  background:
    radial-gradient(
        ellipse 120% 150% at 50% -35%,
        rgba(255, 120, 100, 0.24) 0%,
        rgba(224, 46, 46, 0.12) 32%,
        transparent 64%
      )
      padding-box,
    linear-gradient(135deg, rgba(58, 36, 36, 0.96) 0%, rgba(36, 22, 22, 0.96) 100%) padding-box,
    radial-gradient(
        ellipse 50% 78% at 0% 0%,
        rgba(255, 200, 180, 1) 0%,
        rgba(255, 84, 84, 0.78) 24%,
        transparent 80%
      )
      border-box,
    radial-gradient(
        ellipse 50% 78% at 100% 0%,
        rgba(255, 200, 180, 1) 0%,
        rgba(255, 84, 84, 0.78) 24%,
        transparent 80%
      )
      border-box,
    radial-gradient(
        ellipse 50% 78% at 0% 100%,
        rgba(255, 200, 180, 1) 0%,
        rgba(255, 84, 84, 0.78) 24%,
        transparent 80%
      )
      border-box,
    radial-gradient(
        ellipse 50% 78% at 100% 100%,
        rgba(255, 200, 180, 1) 0%,
        rgba(255, 84, 84, 0.78) 24%,
        transparent 80%
      )
      border-box,
    linear-gradient(0deg, rgba(224, 46, 46, 0.66), rgba(224, 46, 46, 0.66)) border-box;
  box-shadow:
    inset 0 1px 0 rgba(255, 200, 180, 0.22),
    0 0 0 3px rgba(224, 46, 46, 0.22),
    0 0 24px -6px rgba(224, 46, 46, 0.55);
}

/* error: 全周均一な濃い blood ring + 赤い base + 常時 outer halo。
 * normal が rim を主張するため、error は「明らかに不正」と一目で分かる強さにする。 */
.br-input-error {
  background:
    linear-gradient(135deg, rgba(80, 22, 22, 0.95) 0%, rgba(44, 12, 12, 0.95) 100%) padding-box,
    /* rim は閉ループの blood ring。階調をほぼ無くして全周「赤い枠」に見せる */
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

.br-input-error:focus {
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
