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
  "inline-flex items-center justify-center gap-1.5 px-3 py-1 text-sm font-medium rounded transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2";

const typeClasses = computed(() => {
  const map: Record<ButtonType, string> = {
    primary:
      "bg-[#3991f4] text-white hover:bg-[#2c7ae0] active:bg-[#1f63cc] focus-visible:ring-[#3991f4]",
    secondary:
      "bg-gray-200 text-gray-700 hover:bg-gray-300 active:bg-gray-400 focus-visible:ring-gray-400",
    danger: "bg-red-500 text-white hover:bg-red-600 active:bg-red-700 focus-visible:ring-red-500",
    ghost:
      "bg-transparent text-gray-700 border border-gray-300 hover:bg-gray-100 active:bg-gray-200 focus-visible:ring-gray-300",
  };
  return map[props.buttonType];
});

const disabledClasses = computed(() => {
  if (isDisabled.value) {
    return "opacity-50 cursor-not-allowed pointer-events-none";
  }
  return "cursor-pointer";
});

const blockClass = computed(() => (props.block ? "w-full" : ""));

const buttonClasses = computed(() =>
  [baseClasses, typeClasses.value, disabledClasses.value, blockClass.value]
    .filter(Boolean)
    .join(" "),
);

const handleClick = (event: MouseEvent) => {
  if (!isDisabled.value) {
    emit("click", event);
  }
};
</script>
