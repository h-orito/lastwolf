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

// Strategy A directional lighting:
//   primary = 黒ベース + 右上から赤光（pill rounded-full）
//   secondary = 黒に rim gradient
//   danger = outline 赤（取り返しのつかない操作）
//   ghost = text only
// border は variant 側で付与
// タイポグラフィ: Noto Sans JP の font-medium は世界観に対して「素のゴシック太字」感が出るため、
// font-normal + tracking-wide で重さと密度を抜く（font-family は sans のまま、明朝は和文ボタンで読みづらく崩れやすいため不採用）
const baseClasses =
  "inline-flex items-center justify-center gap-1.5 px-3 py-1 text-sm font-normal tracking-wide rounded-full border border-transparent transition duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-blood";

// DESIGN.md「ボタン」テーブル: disabled は bg-soft + text-fg-muted + opacity 0.5
// `text-fg-muted` は DESIGN.md アクセシビリティ欄の「disabled ボタンのラベル」許容用途に該当
// `pointer-events-none` は付けない: button は `:disabled` 属性で抑制、a/NuxtLink は handleClick で guard 済み
const DISABLED_CLASSES = "bg-soft text-fg-muted opacity-55 cursor-not-allowed";

const variantClasses = computed(() => {
  if (isDisabled.value) return DISABLED_CLASSES;
  const map: Record<ButtonType, string> = {
    primary: "btn-primary-glow cursor-pointer",
    secondary: "btn-secondary-rim cursor-pointer",
    danger: "btn-danger-outline cursor-pointer",
    ghost:
      "bg-transparent text-fg-secondary hover:bg-elev hover:text-fg active:bg-soft cursor-pointer",
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
 * Strategy A directional lighting buttons.
 * "黒の物体に右上から赤光が当たっている" 見え方:
 *   - 内側: 右上 corner に赤の radial、左下にわずかな赤、ベースは黒
 *   - 縁:   225deg の linear-gradient で右上ほど明るく赤、左下にわずか赤
 */

/* Primary — 黒ベース + 右上から強い赤光 */
.btn-primary-glow {
  color: #fff;
  background:
    radial-gradient(
        ellipse 90% 160% at 95% -20%,
        rgba(255, 120, 100, 0.95) 0%,
        rgba(220, 50, 50, 0.65) 25%,
        rgba(120, 22, 22, 0.32) 50%,
        rgba(40, 8, 8, 0.1) 75%,
        transparent 95%
      )
      padding-box,
    radial-gradient(
        ellipse 70% 130% at 0% 120%,
        rgba(224, 46, 46, 0.4) 0%,
        rgba(139, 26, 26, 0.15) 35%,
        transparent 65%
      )
      padding-box,
    linear-gradient(135deg, #1a0606 0%, #0a0303 60%, #050202 100%) padding-box,
    linear-gradient(
        225deg,
        rgba(255, 165, 135, 0.95) 0%,
        rgba(224, 46, 46, 0.55) 18%,
        rgba(244, 241, 232, 0.06) 40%,
        rgba(0, 0, 0, 0) 65%,
        rgba(139, 26, 26, 0.35) 100%
      )
      border-box;
  box-shadow:
    inset 0 1px 0 rgba(255, 165, 135, 0.18),
    0 6px 18px -6px rgba(0, 0, 0, 0.75),
    0 0 28px -10px rgba(224, 46, 46, 0.45);
}
.btn-primary-glow:hover:not(:disabled) {
  background:
    radial-gradient(
        ellipse 95% 175% at 95% -20%,
        rgba(255, 145, 130, 1) 0%,
        rgba(240, 60, 60, 0.78) 25%,
        rgba(140, 26, 26, 0.4) 52%,
        rgba(40, 8, 8, 0.12) 78%,
        transparent 100%
      )
      padding-box,
    radial-gradient(
        ellipse 80% 140% at 0% 120%,
        rgba(255, 70, 70, 0.5) 0%,
        rgba(139, 26, 26, 0.2) 35%,
        transparent 65%
      )
      padding-box,
    linear-gradient(135deg, #220808 0%, #0e0404 60%, #060303 100%) padding-box,
    linear-gradient(
        225deg,
        rgba(255, 200, 180, 1) 0%,
        rgba(255, 84, 84, 0.7) 18%,
        rgba(244, 241, 232, 0.1) 40%,
        rgba(0, 0, 0, 0) 65%,
        rgba(224, 46, 46, 0.5) 100%
      )
      border-box;
  box-shadow:
    inset 0 1px 0 rgba(255, 200, 180, 0.28),
    0 8px 22px -6px rgba(0, 0, 0, 0.8),
    0 0 42px -10px rgba(224, 46, 46, 0.65);
}

/* Secondary — 黒に rim gradient */
.btn-secondary-rim {
  color: var(--color-fg);
  background:
    linear-gradient(135deg, rgba(24, 14, 14, 0.85) 0%, rgba(14, 8, 8, 0.85) 100%) padding-box,
    linear-gradient(
        225deg,
        rgba(244, 241, 232, 0.22) 0%,
        rgba(224, 46, 46, 0.18) 30%,
        rgba(0, 0, 0, 0) 60%,
        rgba(139, 26, 26, 0.12) 100%
      )
      border-box;
}
.btn-secondary-rim:hover:not(:disabled) {
  background:
    linear-gradient(135deg, rgba(36, 20, 20, 0.9) 0%, rgba(20, 12, 12, 0.9) 100%) padding-box,
    linear-gradient(
        225deg,
        rgba(244, 241, 232, 0.35) 0%,
        rgba(224, 46, 46, 0.3) 30%,
        rgba(0, 0, 0, 0) 60%,
        rgba(139, 26, 26, 0.2) 100%
      )
      border-box;
}

/* Danger — outline 赤（取り返しのつかない操作） */
.btn-danger-outline {
  color: #ff8484;
  background:
    linear-gradient(180deg, rgba(60, 10, 10, 0.35) 0%, rgba(20, 6, 6, 0.35) 100%) padding-box,
    linear-gradient(
        225deg,
        rgba(255, 130, 100, 0.85) 0%,
        rgba(224, 46, 46, 0.55) 22%,
        rgba(139, 26, 26, 0.2) 50%,
        rgba(139, 26, 26, 0.35) 100%
      )
      border-box;
  box-shadow:
    inset 0 0 16px -4px rgba(224, 46, 46, 0.18),
    0 0 22px -10px rgba(224, 46, 46, 0.4);
}
.btn-danger-outline:hover:not(:disabled) {
  color: #ffb0b0;
  background:
    linear-gradient(180deg, rgba(80, 14, 14, 0.5) 0%, rgba(30, 8, 8, 0.5) 100%) padding-box,
    linear-gradient(
        225deg,
        rgba(255, 160, 130, 1) 0%,
        rgba(255, 84, 84, 0.7) 22%,
        rgba(180, 30, 30, 0.4) 50%,
        rgba(180, 30, 30, 0.5) 100%
      )
      border-box;
  box-shadow:
    inset 0 0 22px -4px rgba(224, 46, 46, 0.3),
    0 0 30px -8px rgba(224, 46, 46, 0.55);
}
</style>
