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
        class="text-sm font-medium text-fg"
        :class="{ 'cursor-pointer': !disabled, 'cursor-not-allowed': disabled }"
        @click="!disabled && toggle()"
      >
        {{ label }}
      </label>
      <p v-if="description" :id="descriptionId" class="mt-1 text-xs text-fg-secondary">
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
  const base =
    "relative inline-flex h-6 w-11 shrink-0 rounded-full border-2 border-transparent transition-shadow duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-blood focus-visible:ring-offset-2 focus-visible:ring-offset-base";

  const stateClass = props.modelValue ? "br-switch-on" : "br-switch-off";
  const disabledClass = props.disabled ? "opacity-55 cursor-not-allowed" : "cursor-pointer";

  return [base, stateClass, disabledClass].join(" ");
});

const knobClasses = computed(() => {
  const base =
    "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-bone shadow ring-0 transition duration-200 ease-in-out";

  const translate = props.modelValue ? "translate-x-5" : "translate-x-0";
  const onShadow = props.modelValue ? "br-switch-knob-on" : "";

  return [base, translate, onShadow].filter(Boolean).join(" ");
});
</script>

<style scoped>
/*
 * Black & Blood directional switch.
 * on: 黒ベース + inset blood glow + 右上から赤光が差し込む rim
 * off: 静かな黒 + わずかな bone hairline
 * 構造は BaseButton と同じ padding-box + border-box 二重背景。
 */

/* off: 暗い面、左上に微かな bone hairline、右下に薄く blood */
.br-switch-off {
  background:
    linear-gradient(135deg, rgba(20, 12, 12, 0.95) 0%, rgba(10, 6, 6, 0.95) 100%) padding-box,
    linear-gradient(
        225deg,
        rgba(244, 241, 232, 0.18) 0%,
        rgba(139, 26, 26, 0.1) 60%,
        rgba(139, 26, 26, 0.1) 100%
      )
      border-box;
  box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.6);
}

/* on: 黒ベース + 内側に弱い blood glow + 全周をクリアな blood rim が囲む。
 * track 中身は暗いまま、rim と外側 halo を明確に強めることで活性を表現する。 */
.br-switch-on {
  background:
    radial-gradient(
        ellipse 80% 200% at 100% 50%,
        rgba(255, 91, 58, 0.55) 0%,
        rgba(224, 46, 46, 0.3) 30%,
        rgba(139, 26, 26, 0.12) 60%,
        transparent 85%
      )
      padding-box,
    linear-gradient(135deg, #200a0a 0%, #100404 100%) padding-box,
    /* 全周クリアな blood rim: 起点を ember、終点も blood-deep .7 まで上げて閉ループ感を出す */
    linear-gradient(
        225deg,
        rgba(255, 200, 180, 1) 0%,
        rgba(255, 91, 58, 0.9) 15%,
        rgba(224, 46, 46, 0.75) 40%,
        rgba(180, 30, 30, 0.7) 70%,
        rgba(224, 46, 46, 0.75) 100%
      )
      border-box;
  box-shadow:
    inset 0 0 10px rgba(224, 46, 46, 0.5),
    inset 0 1px 0 rgba(255, 165, 135, 0.18),
    /* 外側 halo を 2 段に: 近距離の濃い blood + 遠距離の ember bloom */ 0 0 0 1px
      rgba(224, 46, 46, 0.35),
    0 0 18px -2px rgba(224, 46, 46, 0.75),
    0 0 32px -6px rgba(255, 91, 58, 0.4);
}

/* knob: on のとき内側に微かな赤いリフレクション */
.br-switch-knob-on {
  box-shadow:
    0 1px 2px rgba(0, 0, 0, 0.45),
    inset 0 -2px 4px rgba(224, 46, 46, 0.18);
}
</style>
