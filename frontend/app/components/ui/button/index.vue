<template>
  <component
    :is="componentType"
    :type="resolvedAs === 'button' ? type : undefined"
    :disabled="resolvedAs === 'button' ? isDisabled : undefined"
    :href="resolvedAs === 'a' ? href : undefined"
    :to="resolvedAs === 'NuxtLink' ? to : undefined"
    :target="resolvedAs !== 'button' ? target : undefined"
    :rel="resolvedAs !== 'button' && target === '_blank' ? 'noopener noreferrer' : undefined"
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

const baseClasses =
  "inline-flex items-center justify-center gap-1.5 px-3 py-1 text-sm font-medium rounded border transition duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-steel";

// DESIGN.md「ボタン」テーブル: disabled は bg-soft + text-fg-muted + border-line-soft + opacity 0.5
// `pointer-events-none` は付けない: button は `:disabled` 属性でクリック抑制、a/NuxtLink は handleClick で
// guard 済み。pointer-events-none を付けると hover が無効化されカーソル表示が壊れる
const DISABLED_CLASSES = "bg-soft text-fg-muted border-line-soft opacity-50 cursor-not-allowed";

const variantClasses = computed(() => {
  if (isDisabled.value) return DISABLED_CLASSES;
  const map: Record<ButtonType, string> = {
    primary:
      "bg-[linear-gradient(180deg,#2c4566,#15263a)] text-moon border-steel hover:brightness-110 active:brightness-95 cursor-pointer",
    secondary:
      "bg-elev text-fg-secondary border-line-soft hover:bg-soft active:bg-base cursor-pointer",
    danger:
      "bg-[linear-gradient(180deg,#8a2934,#4f161e)] text-[#fce4e6] border-wolf hover:brightness-110 active:brightness-95 cursor-pointer",
    ghost:
      "bg-transparent text-fg-secondary border-line-soft hover:bg-elev active:bg-soft cursor-pointer",
  };
  return map[props.buttonType];
});

const blockClass = computed(() => (props.block ? "w-full" : ""));

const buttonClasses = computed(() =>
  [baseClasses, variantClasses.value, blockClass.value].filter(Boolean).join(" "),
);

const handleClick = (event: MouseEvent) => {
  if (isDisabled.value) {
    // a / NuxtLink でも navigation を抑制
    event.preventDefault();
    return;
  }
  emit("click", event);
};
</script>
