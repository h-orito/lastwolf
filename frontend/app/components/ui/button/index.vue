<template>
  <component
    :is="componentType"
    :type="resolvedAs === 'button' ? type : undefined"
    :disabled="resolvedAs === 'button' ? isDisabled : undefined"
    :href="resolvedAs === 'a' && !isDisabled ? href : undefined"
    :to="resolvedAs === 'NuxtLink' && !isDisabled ? to : undefined"
    :target="resolvedAs !== 'button' ? target : undefined"
    :rel="resolvedAs !== 'button' && target === '_blank' ? 'noopener noreferrer' : undefined"
    :tabindex="resolvedAs !== 'button' && isDisabled ? -1 : undefined"
    :aria-disabled="resolvedAs !== 'button' && isDisabled ? true : undefined"
    :class="buttonClasses"
    @click="handleClick"
  >
    <span v-if="loading" class="inline-block animate-spin">
      <svg class="h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
        <path
          class="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
        />
      </svg>
    </span>
    <slot />
  </component>
</template>

<script setup lang="ts">
import type { RouteLocationRaw } from "vue-router";

type ButtonType = "primary" | "secondary" | "danger" | "ghost";

interface Props {
  buttonType?: ButtonType;
  loading?: boolean;
  disabled?: boolean;
  block?: boolean;
  type?: "button" | "submit" | "reset";
  as?: "button" | "a" | "NuxtLink";
  href?: string;
  to?: RouteLocationRaw;
  target?: string;
}

const props = withDefaults(defineProps<Props>(), {
  buttonType: "primary",
  loading: false,
  disabled: false,
  block: false,
  type: "button",
  as: "button",
  href: undefined,
  to: undefined,
  target: undefined,
});

const emit = defineEmits<{
  click: [event: MouseEvent];
}>();

const resolvedAs = computed(() => {
  if (props.as !== "button") return props.as;
  if (props.to) return "NuxtLink";
  if (props.href) return "a";
  return "button";
});

const componentType = computed(() => {
  if (resolvedAs.value === "a") return "a";
  if (resolvedAs.value === "NuxtLink") return resolveComponent("NuxtLink");
  return "button";
});

const isDisabled = computed(() => props.disabled || props.loading);

// フラットボタン配色（2026-06 視認性刷新）:
//   primary = 赤 (#c62f2f) + 白文字
//   secondary = グレー (#474242) + 白文字
//   danger = 同じグレー + 赤文字（bg 共通・文字色で区別）
//   ghost = 透過 + text-fg
// directional な赤グロー（黒ベース + 右上赤光）は「何ボタンか一目で分からない」ため廃止し、
// border=bg のフラット面に統一（border 色は variant 側で bg と同色に上書き）。
// タイポグラフィ: 視認性のため weight を base 400 から font-semibold に底上げ + tracking-wide。
// font-family は sans のまま（明朝は和文ボタンで読みづらく崩れやすいため不採用）
const baseClasses =
  "inline-flex items-center justify-center gap-1.5 px-3 py-1 text-sm font-semibold tracking-wide antialiased rounded-lg border border-transparent transition duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-blood";

// DESIGN.md「ボタン」テーブル: disabled は bg-soft + text-fg-muted + opacity 0.5
// `text-fg-muted` は DESIGN.md アクセシビリティ欄の「disabled ボタンのラベル」許容用途に該当
// `pointer-events-none` は付けない: button は `:disabled` 属性で抑制、a/NuxtLink は handleClick で guard 済み
const DISABLED_CLASSES = "bg-soft text-fg-muted opacity-55 cursor-not-allowed";

const variantClasses = computed(() => {
  if (isDisabled.value) return DISABLED_CLASSES;
  const map: Record<ButtonType, string> = {
    primary: "btn-primary cursor-pointer",
    secondary: "btn-secondary cursor-pointer",
    danger: "btn-danger cursor-pointer",
    ghost: "bg-transparent text-fg hover:bg-elev active:bg-soft cursor-pointer",
  };
  return map[props.buttonType];
});

const blockClass = computed(() => (props.block ? "w-full" : ""));

const buttonClasses = computed(() =>
  [baseClasses, variantClasses.value, blockClass.value].filter(Boolean).join(" "),
);

const handleClick = (event: MouseEvent) => {
  if (isDisabled.value) {
    // a / NuxtLink でも navigation を抑制し、親のクリックハンドラへの伝播も止める
    event.preventDefault();
    event.stopPropagation();
    return;
  }
  emit("click", event);
};
</script>

<style scoped>
/*
 * フラットボタン（2026-06 視認性刷新 / 旧 directional 赤グローを廃止）
 * border=bg のフラット面 + weight 強め（baseClasses font-semibold）。
 *   primary   = 赤 (#c62f2f) + 白文字
 *   secondary = グレー (#474242) + 白文字
 *   danger    = 同じグレー + 赤文字 (#ff6b6b)（bg 共通・文字色で区別）
 *   ghost     = 透過 + text-fg（variantClasses 側で付与）
 * border は baseClasses の transparent を variant 側で bg と同色に上書きしてフラットに。
 * hover は filter: brightness で一段明るく（transition でアニメート）。
 */

.btn-primary {
  color: #fff;
  background-color: #c62f2f;
  border-color: #c62f2f;
}
.btn-secondary {
  color: #fff;
  background-color: #474242;
  border-color: #474242;
}
.btn-danger {
  /* グレー地で読める明るめの赤（blood #e02e2e は暗背景でコントラスト不足のため明色側へ） */
  color: #ff6b6b;
  background-color: #474242;
  border-color: #474242;
}
.btn-primary:hover:not(:disabled),
.btn-secondary:hover:not(:disabled),
.btn-danger:hover:not(:disabled) {
  filter: brightness(1.12);
}
</style>
