<template>
  <div class="space-y-3">
    <p class="text-[10px] uppercase tracking-[0.3em] text-fg-muted">Japanese</p>
    <div class="flex flex-wrap items-center gap-3">
      <component
        :is="tag"
        v-for="state in states"
        :key="`jp-${state.key}`"
        :class="buttonClass(state.key)"
        :disabled="state.key === 'disabled'"
      >
        <template v-if="variant === 'sigil'">
          <span class="sigil-mark">⟡</span>
          <span>{{ state.jp }}</span>
          <span class="sigil-mark">⟡</span>
        </template>
        <template v-else-if="variant === 'moonlit'">
          <span class="moonlit-label">{{ state.jp }}</span>
        </template>
        <template v-else>{{ state.jp }}</template>
      </component>
    </div>

    <p class="mt-4 text-[10px] uppercase tracking-[0.3em] text-fg-muted">Latin (Cinzel)</p>
    <div class="flex flex-wrap items-center gap-3">
      <component
        :is="tag"
        v-for="state in states"
        :key="`latin-${state.key}`"
        :class="[buttonClass(state.key), 'font-display tracking-[0.2em]']"
        :disabled="state.key === 'disabled'"
      >
        <template v-if="variant === 'sigil'">
          <span class="sigil-mark">⟡</span>
          <span>{{ state.latin }}</span>
          <span class="sigil-mark">⟡</span>
        </template>
        <template v-else-if="variant === 'moonlit'">
          <span class="moonlit-label">{{ state.latin }}</span>
        </template>
        <template v-else>{{ state.latin }}</template>
      </component>
    </div>
  </div>
</template>

<script setup lang="ts">
type Variant = "current" | "onyx" | "halo" | "sigil" | "moonlit";
type StateKey = "primary" | "secondary" | "danger" | "ghost" | "disabled";

interface Props {
  variant: Variant;
}

const props = defineProps<Props>();

const tag = "button";

const states: { key: StateKey; jp: string; latin: string }[] = [
  { key: "primary", jp: "村に入る", latin: "ENTER" },
  { key: "secondary", jp: "戻る", latin: "BACK" },
  { key: "danger", jp: "削除", latin: "DELETE" },
  { key: "ghost", jp: "詳細", latin: "DETAILS" },
  { key: "disabled", jp: "入村不可", latin: "LOCKED" },
];

const classMap: Record<Variant, Record<StateKey, string>> = {
  current: {
    primary:
      "bg-[linear-gradient(180deg,#2c4566,#15263a)] text-moon border border-steel hover:brightness-110 active:brightness-95",
    secondary: "bg-elev text-fg-secondary border border-line-soft hover:bg-soft active:bg-base",
    danger:
      "bg-[linear-gradient(180deg,#8a2934,#4f161e)] text-[#fce4e6] border border-wolf hover:brightness-110 active:brightness-95",
    ghost: "bg-transparent text-fg-secondary border border-line-soft hover:bg-elev active:bg-soft",
    disabled: "bg-soft text-fg-muted border border-line-soft opacity-50 cursor-not-allowed",
  },
  onyx: {
    primary: "btn-onyx-primary",
    secondary: "btn-onyx-secondary",
    danger: "btn-onyx-danger",
    ghost: "btn-onyx-ghost",
    disabled: "btn-onyx-disabled",
  },
  halo: {
    primary: "btn-halo-primary",
    secondary: "btn-halo-secondary",
    danger: "btn-halo-danger",
    ghost: "btn-halo-ghost",
    disabled: "btn-halo-disabled",
  },
  sigil: {
    primary: "btn-sigil-primary",
    secondary: "btn-sigil-secondary",
    danger: "btn-sigil-danger",
    ghost: "btn-sigil-ghost",
    disabled: "btn-sigil-disabled",
  },
  moonlit: {
    primary: "btn-moonlit-primary",
    secondary: "btn-moonlit-secondary",
    danger: "btn-moonlit-danger",
    ghost: "btn-moonlit-ghost",
    disabled: "btn-moonlit-disabled",
  },
};

const buttonClass = (key: StateKey) => {
  const variantCls = classMap[props.variant][key];
  const base = props.variant === "sigil" ? "btn-sigil-base" : "btn-base";
  const moonlit = props.variant === "moonlit" ? "btn-moonlit" : "";
  return [base, variantCls, moonlit].filter(Boolean).join(" ");
};
</script>
