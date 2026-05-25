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

// border は variant 側で付与（フラット系の primary / danger / ghost は不要）
const baseClasses =
  "inline-flex items-center justify-center gap-1.5 px-3 py-1 text-sm font-medium rounded transition duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-steel";

// DESIGN.md「ボタン」テーブル: disabled は bg-soft + text-fg-muted + opacity 0.5
// `text-fg-muted` は DESIGN.md アクセシビリティ欄の「disabled ボタンのラベル（インタラクション
// 不可が自明な場合）」に該当するため許容（コントラスト 3.0:1 で本文用途は禁止）。
// `pointer-events-none` は付けない: button は `:disabled` 属性でクリック抑制、a/NuxtLink は handleClick で
// guard 済み。pointer-events-none を付けると hover が無効化されカーソル表示が壊れる
const DISABLED_CLASSES = "bg-soft text-fg-muted opacity-50 cursor-not-allowed";

// Onyx Mid: フラット単色 + 上下インセットで押せる感を出す（グラデ廃止）
// hover はモバイル無効でも害なし、active がモバイルのタップフィードバック
const variantClasses = computed(() => {
  if (isDisabled.value) return DISABLED_CLASSES;
  const map: Record<ButtonType, string> = {
    primary:
      "bg-[#2c4566] text-moon shadow-[inset_0_1px_0_#ffffff14,inset_0_-1px_0_#00000059] hover:bg-[#34507a] active:bg-[#233856] cursor-pointer",
    secondary:
      "bg-[#1c2230] text-fg border border-line-bright hover:bg-[#232938] active:bg-[#161b27] cursor-pointer",
    danger:
      "bg-[#4a1f27] text-[#f4c8cc] shadow-[inset_0_1px_0_#d8606b4d,inset_0_-1px_0_#00000059] hover:bg-[#5a262f] active:bg-[#3a1820] cursor-pointer",
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
