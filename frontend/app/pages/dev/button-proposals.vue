<template>
  <div class="min-h-dvh bg-deep text-fg">
    <header class="border-b border-line-soft bg-base px-6 py-6">
      <div class="mx-auto max-w-6xl">
        <p class="font-display text-xs uppercase tracking-[0.4em] text-steel">
          Phase 2 · Button study
        </p>
        <h1 class="mt-2 font-serif text-3xl font-bold text-moon">Button Design Proposals</h1>
        <p class="mt-2 max-w-2xl text-sm text-fg-secondary">
          現状のボタンが「古い iOS 風」とのフィードバックを受けて、4
          種類の方向性で代替案を用意しました。 ホバー /
          アクティブの挙動も載せています。良かったものを 1 つ選んでください（混ぜても OK）。
        </p>
      </div>
    </header>

    <main class="mx-auto max-w-6xl space-y-16 px-6 py-12">
      <!-- ===================== Current ===================== -->
      <section>
        <header class="mb-4 flex items-baseline justify-between border-b border-line-soft pb-2">
          <div>
            <p class="font-display text-[10px] uppercase tracking-[0.4em] text-fg-muted">Now</p>
            <h2 class="mt-1 font-serif text-xl text-fg">Current（現状）</h2>
          </div>
          <p class="text-xs text-fg-secondary">linear-gradient 縦方向 + 1px border</p>
        </header>
        <div class="rounded border border-line-soft bg-elev p-5">
          <ButtonProposalRow variant="current" />
        </div>
      </section>

      <!-- ===================== A. Onyx (Flat tonal) ===================== -->
      <section>
        <header class="mb-4 flex items-baseline justify-between border-b border-line-soft pb-2">
          <div>
            <p class="font-display text-[10px] uppercase tracking-[0.4em] text-steel">Proposal A</p>
            <h2 class="mt-1 font-serif text-xl text-moon">Onyx — Flat Tonal</h2>
          </div>
          <p class="max-w-[42ch] text-right text-xs text-fg-secondary">
            グラデを廃し、単色 + わずかな上端ハイライト。Linear / Vercel
            系の現代的フラット。控えめだがどの面にも馴染む。
          </p>
        </header>
        <div class="rounded border border-line-soft bg-elev p-5">
          <ButtonProposalRow variant="onyx" />
        </div>
      </section>

      <!-- ===================== B. Halo (Outline) ===================== -->
      <section>
        <header class="mb-4 flex items-baseline justify-between border-b border-line-soft pb-2">
          <div>
            <p class="font-display text-[10px] uppercase tracking-[0.4em] text-steel">Proposal B</p>
            <h2 class="mt-1 font-serif text-xl text-moon">Halo — Outline</h2>
          </div>
          <p class="max-w-[42ch] text-right text-xs text-fg-secondary">
            1px のスチール輪郭 +
            透明背景。月白テキスト。ホバーで内側がうっすら満ちる。線で語る、軽さとエレガンス。
          </p>
        </header>
        <div class="rounded border border-line-soft bg-elev p-5">
          <ButtonProposalRow variant="halo" />
        </div>
      </section>

      <!-- ===================== C. Sigil (Ceremonial hairline) ===================== -->
      <section>
        <header class="mb-4 flex items-baseline justify-between border-b border-line-soft pb-2">
          <div>
            <p class="font-display text-[10px] uppercase tracking-[0.4em] text-gold">Proposal C</p>
            <h2 class="mt-1 font-serif text-xl text-moon">Sigil — Ceremonial Hairline</h2>
          </div>
          <p class="max-w-[42ch] text-right text-xs text-fg-secondary">
            Cinzel + 広めのトラッキング + 細い 1px 罫。儀式的・人狼世界観に最も寄せた案。装飾マーク
            ⟡ がホバーで金に色付く。
          </p>
        </header>
        <div class="rounded border border-line-soft bg-elev p-5">
          <ButtonProposalRow variant="sigil" />
        </div>
      </section>

      <!-- ===================== D. Moonlit (Flat + shimmer) ===================== -->
      <section>
        <header class="mb-4 flex items-baseline justify-between border-b border-line-soft pb-2">
          <div>
            <p class="font-display text-[10px] uppercase tracking-[0.4em] text-steel">Proposal D</p>
            <h2 class="mt-1 font-serif text-xl text-moon">Moonlit — Flat + Shimmer</h2>
          </div>
          <p class="max-w-[42ch] text-right text-xs text-fg-secondary">
            フラットに見えるが、ホバーで月光が左から右へ薄く流れる微細インタラクション。"署名"
            になる動き。
          </p>
        </header>
        <div class="rounded border border-line-soft bg-elev p-5">
          <ButtonProposalRow variant="moonlit" />
        </div>
      </section>

      <!-- ===================== Onyx Brightness Study ===================== -->
      <section>
        <header class="mb-4 flex items-baseline justify-between border-b border-line-soft pb-2">
          <div>
            <p class="font-display text-[10px] uppercase tracking-[0.4em] text-gold">Follow-up</p>
            <h2 class="mt-1 font-serif text-xl text-moon">Onyx — Brightness Study（明度比較）</h2>
          </div>
          <p class="max-w-[42ch] text-right text-xs text-fg-secondary">
            「フラットは OK だが暗すぎてボタンに見えない」フィードバックを受けて、primary の明度を 4
            段階で。bg-elev と bg-deep 双方の上で確認。
          </p>
        </header>

        <!-- bg-elev 上 -->
        <div class="mb-4 rounded border border-line-soft bg-elev p-5">
          <p class="mb-3 text-[10px] uppercase tracking-[0.3em] text-fg-muted">
            on bg-elev (#10131a) — カード内など
          </p>
          <div class="flex flex-wrap items-center gap-4">
            <div
              v-for="lvl in brightnessLevels"
              :key="`elev-${lvl.label}`"
              class="flex flex-col items-center gap-2"
            >
              <span class="font-display text-[10px] uppercase tracking-[0.3em] text-fg-muted">{{
                lvl.label
              }}</span>
              <button
                class="btn-base text-moon"
                :style="{ backgroundColor: lvl.bg, boxShadow: lvl.shadow }"
              >
                村に入る
              </button>
              <span class="text-[10px] text-fg-muted">{{ lvl.bg }}</span>
            </div>
          </div>
        </div>

        <!-- bg-deep 上 -->
        <div class="rounded border border-line-soft bg-deep p-5">
          <p class="mb-3 text-[10px] uppercase tracking-[0.3em] text-fg-muted">
            on bg-deep (#050609) — ページ背景
          </p>
          <div class="flex flex-wrap items-center gap-4">
            <div
              v-for="lvl in brightnessLevels"
              :key="`deep-${lvl.label}`"
              class="flex flex-col items-center gap-2"
            >
              <span class="font-display text-[10px] uppercase tracking-[0.3em] text-fg-muted">{{
                lvl.label
              }}</span>
              <button
                class="btn-base text-moon"
                :style="{ backgroundColor: lvl.bg, boxShadow: lvl.shadow }"
              >
                村に入る
              </button>
              <span class="text-[10px] text-fg-muted">{{ lvl.bg }}</span>
            </div>
          </div>
        </div>

        <!-- Mid 推奨 + secondary 改善案 -->
        <div class="mt-4 rounded border border-line-soft bg-elev p-5">
          <p class="mb-3 text-[10px] uppercase tracking-[0.3em] text-steel">
            Onyx (Mid) フルセット案 — primary 明度上げ + secondary に薄縁を追加
          </p>
          <div class="space-y-3">
            <p class="text-[10px] uppercase tracking-[0.3em] text-fg-muted">Japanese</p>
            <div class="flex flex-wrap items-center gap-3">
              <button class="btn-base btn-onyx2-primary">村に入る</button>
              <button class="btn-base btn-onyx2-secondary">戻る</button>
              <button class="btn-base btn-onyx2-danger">削除</button>
              <button class="btn-base btn-onyx2-ghost">詳細</button>
              <button class="btn-base btn-onyx2-disabled" disabled>入村不可</button>
            </div>
            <p class="mt-4 text-[10px] uppercase tracking-[0.3em] text-fg-muted">Latin (Cinzel)</p>
            <div class="flex flex-wrap items-center gap-3">
              <button class="btn-base btn-onyx2-primary font-display tracking-[0.2em]">
                ENTER
              </button>
              <button class="btn-base btn-onyx2-secondary font-display tracking-[0.2em]">
                BACK
              </button>
              <button class="btn-base btn-onyx2-danger font-display tracking-[0.2em]">
                DELETE
              </button>
              <button class="btn-base btn-onyx2-ghost font-display tracking-[0.2em]">
                DETAILS
              </button>
              <button class="btn-base btn-onyx2-disabled font-display tracking-[0.2em]" disabled>
                LOCKED
              </button>
            </div>
          </div>
          <p class="mt-4 text-xs text-fg-secondary">
            primary は <code class="text-steel">#2c4566</code>（旧グラデの上端と同色）。secondary
            は背景を残しつつ <code class="text-steel">border-line-bright</code> を 1px
            置いて押せる縁を作っています。
          </p>
        </div>
      </section>

      <!-- ===================== Side-by-side ===================== -->
      <section>
        <header class="mb-4 flex items-baseline justify-between border-b border-line-soft pb-2">
          <div>
            <p class="font-display text-[10px] uppercase tracking-[0.4em] text-fg-muted">
              Side-by-side
            </p>
            <h2 class="mt-1 font-serif text-xl text-fg">Primary だけ並べて比較</h2>
          </div>
          <p class="text-xs text-fg-secondary">同じ「村に入る」を 5 通りで</p>
        </header>
        <div
          class="grid grid-cols-1 gap-6 rounded border border-line-soft bg-elev p-6 sm:grid-cols-5"
        >
          <div class="flex flex-col items-center gap-3">
            <span class="font-display text-[10px] uppercase tracking-[0.3em] text-fg-muted"
              >Now</span
            >
            <button
              class="btn-base bg-[linear-gradient(180deg,#2c4566,#15263a)] border border-steel text-moon hover:brightness-110 active:brightness-95"
            >
              村に入る
            </button>
          </div>
          <div class="flex flex-col items-center gap-3">
            <span class="font-display text-[10px] uppercase tracking-[0.3em] text-steel">Onyx</span>
            <button class="btn-base btn-onyx-primary">村に入る</button>
          </div>
          <div class="flex flex-col items-center gap-3">
            <span class="font-display text-[10px] uppercase tracking-[0.3em] text-steel">Halo</span>
            <button class="btn-base btn-halo-primary">村に入る</button>
          </div>
          <div class="flex flex-col items-center gap-3">
            <span class="font-display text-[10px] uppercase tracking-[0.3em] text-gold">Sigil</span>
            <button class="btn-sigil-base btn-sigil-primary">
              <span class="sigil-mark">⟡</span>
              <span>村に入る</span>
              <span class="sigil-mark">⟡</span>
            </button>
          </div>
          <div class="flex flex-col items-center gap-3">
            <span class="font-display text-[10px] uppercase tracking-[0.3em] text-steel"
              >Moonlit</span
            >
            <button class="btn-base btn-moonlit btn-moonlit-primary">
              <span class="moonlit-label">村に入る</span>
            </button>
          </div>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup lang="ts">
import ButtonProposalRow from "~/components/dev/ButtonProposalRow.vue";

definePageMeta({
  middleware: "dev-only",
  layout: false,
});

useHead({ title: "Button Proposals" });

// Onyx primary の明度サンプル（暗→明）。box-shadow は上端 1px ハイライトのみ
const inset = "inset 0 1px 0 rgba(255,255,255,0.06)";
const brightnessLevels = [
  { label: "Soft (現状)", bg: "#1a253a", shadow: inset },
  { label: "Mid (推奨)", bg: "#2c4566", shadow: inset },
  { label: "Bold", bg: "#456185", shadow: inset },
  { label: "Bright", bg: "#5a7ba8", shadow: inset },
];
</script>

<style>
/* ============================================================
   共通ベース（scoped にしない: 子コンポーネントからも参照するため）
   ============================================================ */
.btn-base {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.375rem;
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  font-weight: 500;
  border-radius: 6px;
  transition:
    background-color 180ms ease,
    border-color 180ms ease,
    color 180ms ease,
    box-shadow 220ms ease,
    transform 120ms ease;
  cursor: pointer;
  user-select: none;
  position: relative;
}
.btn-base:active:not(:disabled) {
  transform: translateY(0.5px);
}
.btn-base:disabled {
  cursor: not-allowed;
}

/* ============================================================
   A. Onyx — Flat Tonal
   ============================================================ */
.btn-onyx-primary {
  background-color: #1a253a;
  color: var(--color-moon);
  box-shadow:
    inset 0 1px 0 rgba(111, 149, 189, 0.25),
    inset 0 -1px 0 rgba(0, 0, 0, 0.4);
}
.btn-onyx-primary:hover:not(:disabled) {
  background-color: #233048;
}
.btn-onyx-primary:active:not(:disabled) {
  background-color: #151e30;
}

.btn-onyx-secondary {
  background-color: #161a24;
  color: var(--color-fg);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.04);
}
.btn-onyx-secondary:hover:not(:disabled) {
  background-color: #1c2230;
}
.btn-onyx-secondary:active:not(:disabled) {
  background-color: #11141c;
}

.btn-onyx-danger {
  background-color: #341a1f;
  color: #f4c8cc;
  box-shadow:
    inset 0 1px 0 rgba(216, 96, 107, 0.25),
    inset 0 -1px 0 rgba(0, 0, 0, 0.4);
}
.btn-onyx-danger:hover:not(:disabled) {
  background-color: #43222a;
}
.btn-onyx-danger:active:not(:disabled) {
  background-color: #2a141a;
}

.btn-onyx-ghost {
  background-color: transparent;
  color: var(--color-fg-secondary);
}
.btn-onyx-ghost:hover:not(:disabled) {
  background-color: rgba(255, 255, 255, 0.04);
  color: var(--color-fg);
}

.btn-onyx-disabled {
  background-color: #11141c;
  color: var(--color-fg-muted);
  opacity: 0.6;
}

/* ============================================================
   A'. Onyx 2 — 明度上げ版（"暗くてボタンに見えない" 対応）
   primary を旧グラデ上端の #2c4566 にし、secondary に薄い縁を追加
   ============================================================ */
.btn-onyx2-primary {
  background-color: #2c4566;
  color: var(--color-moon);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.08),
    inset 0 -1px 0 rgba(0, 0, 0, 0.35);
}
.btn-onyx2-primary:active:not(:disabled) {
  background-color: #233856;
}

.btn-onyx2-secondary {
  background-color: #1c2230;
  color: var(--color-fg);
  border: 1px solid #2d3848;
}
.btn-onyx2-secondary:active:not(:disabled) {
  background-color: #161b27;
}

.btn-onyx2-danger {
  background-color: #4a1f27;
  color: #f4c8cc;
  box-shadow:
    inset 0 1px 0 rgba(216, 96, 107, 0.3),
    inset 0 -1px 0 rgba(0, 0, 0, 0.35);
}
.btn-onyx2-danger:active:not(:disabled) {
  background-color: #3a1820;
}

.btn-onyx2-ghost {
  background-color: transparent;
  color: var(--color-fg-secondary);
  border: 1px solid transparent;
}
.btn-onyx2-ghost:active:not(:disabled) {
  background-color: rgba(255, 255, 255, 0.04);
  color: var(--color-fg);
}

.btn-onyx2-disabled {
  background-color: #161a24;
  color: var(--color-fg-muted);
  border: 1px solid #1f2530;
  opacity: 0.55;
}

/* ============================================================
   B. Halo — Outline
   ============================================================ */
.btn-halo-primary {
  background-color: transparent;
  color: var(--color-steel);
  border: 1px solid var(--color-steel);
}
.btn-halo-primary:hover:not(:disabled) {
  background-color: rgba(111, 149, 189, 0.1);
  color: var(--color-moon);
  border-color: var(--color-halo);
  box-shadow: 0 0 0 3px rgba(111, 149, 189, 0.08);
}
.btn-halo-primary:active:not(:disabled) {
  background-color: rgba(111, 149, 189, 0.18);
}

.btn-halo-secondary {
  background-color: transparent;
  color: var(--color-fg-secondary);
  border: 1px solid #2d3848;
}
.btn-halo-secondary:hover:not(:disabled) {
  color: var(--color-fg);
  border-color: var(--color-steel);
  background-color: rgba(111, 149, 189, 0.05);
}

.btn-halo-danger {
  background-color: transparent;
  color: var(--color-wolf);
  border: 1px solid var(--color-wolf);
}
.btn-halo-danger:hover:not(:disabled) {
  background-color: rgba(216, 96, 107, 0.1);
  color: #f4c8cc;
  box-shadow: 0 0 0 3px rgba(216, 96, 107, 0.08);
}

.btn-halo-ghost {
  background-color: transparent;
  color: var(--color-fg-secondary);
  border: 1px solid transparent;
}
.btn-halo-ghost:hover:not(:disabled) {
  color: var(--color-fg);
  background-color: rgba(255, 255, 255, 0.04);
}

.btn-halo-disabled {
  background-color: transparent;
  color: var(--color-fg-muted);
  border: 1px solid #1f2530;
  opacity: 0.5;
}

/* ============================================================
   C. Sigil — Ceremonial hairline
   ============================================================ */
.btn-sigil-base {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.6rem;
  padding: 0.6rem 1.4rem;
  font-size: 0.8rem;
  font-weight: 500;
  border-radius: 2px;
  letter-spacing: 0.12em;
  transition:
    background-color 220ms ease,
    border-color 220ms ease,
    color 220ms ease,
    letter-spacing 320ms ease,
    box-shadow 320ms ease;
  cursor: pointer;
  user-select: none;
  position: relative;
}
.btn-sigil-base:disabled {
  cursor: not-allowed;
}
.sigil-mark {
  opacity: 0.35;
  font-size: 0.7em;
  transition:
    opacity 320ms ease,
    color 320ms ease,
    transform 320ms ease;
}

.btn-sigil-primary {
  background-color: transparent;
  color: var(--color-moon);
  border: 1px solid var(--color-steel-deep);
}
.btn-sigil-primary:hover:not(:disabled) {
  border-color: var(--color-gold);
  letter-spacing: 0.15em;
  box-shadow: 0 0 24px -8px rgba(201, 184, 122, 0.4);
}
.btn-sigil-primary:hover:not(:disabled) .sigil-mark {
  opacity: 0.85;
  color: var(--color-gold);
  transform: scale(1.1);
}

.btn-sigil-secondary {
  background-color: transparent;
  color: var(--color-fg-secondary);
  border: 1px solid #1f2530;
}
.btn-sigil-secondary:hover:not(:disabled) {
  color: var(--color-fg);
  border-color: #2d3848;
  letter-spacing: 0.15em;
}
.btn-sigil-secondary:hover:not(:disabled) .sigil-mark {
  opacity: 0.6;
}

.btn-sigil-danger {
  background-color: transparent;
  color: var(--color-wolf);
  border: 1px solid #4f161e;
}
.btn-sigil-danger:hover:not(:disabled) {
  border-color: var(--color-wolf);
  letter-spacing: 0.15em;
  box-shadow: 0 0 24px -8px rgba(216, 96, 107, 0.35);
}
.btn-sigil-danger:hover:not(:disabled) .sigil-mark {
  opacity: 0.85;
  color: var(--color-wolf);
}

.btn-sigil-ghost {
  background-color: transparent;
  color: var(--color-fg-secondary);
  border: 1px solid transparent;
}
.btn-sigil-ghost:hover:not(:disabled) {
  color: var(--color-fg);
  letter-spacing: 0.15em;
}
.btn-sigil-ghost .sigil-mark,
.btn-sigil-ghost:hover .sigil-mark {
  opacity: 0;
}

.btn-sigil-disabled {
  background-color: transparent;
  color: var(--color-fg-muted);
  border: 1px solid #1f2530;
  opacity: 0.5;
}
.btn-sigil-disabled .sigil-mark {
  opacity: 0.2;
}

/* ============================================================
   D. Moonlit — Flat + shimmer
   ============================================================ */
.btn-moonlit {
  position: relative;
  overflow: hidden;
  isolation: isolate;
}
.btn-moonlit::before {
  content: "";
  position: absolute;
  inset: -1px;
  background: linear-gradient(
    105deg,
    transparent 30%,
    rgba(240, 238, 216, 0.18) 48%,
    rgba(240, 238, 216, 0.35) 50%,
    rgba(240, 238, 216, 0.18) 52%,
    transparent 70%
  );
  transform: translateX(-130%);
  pointer-events: none;
  z-index: 0;
}
.btn-moonlit:hover:not(:disabled)::before {
  animation: moonlit-sweep 1.1s ease-out;
}
.moonlit-label {
  position: relative;
  z-index: 1;
}
@keyframes moonlit-sweep {
  0% {
    transform: translateX(-130%);
  }
  100% {
    transform: translateX(130%);
  }
}

.btn-moonlit-primary {
  background-color: #1d2a40;
  color: var(--color-moon);
  border: 1px solid rgba(111, 149, 189, 0.4);
}
.btn-moonlit-primary:hover:not(:disabled) {
  background-color: #233048;
  border-color: var(--color-steel);
}

.btn-moonlit-secondary {
  background-color: #161a24;
  color: var(--color-fg);
  border: 1px solid #1f2530;
}
.btn-moonlit-secondary:hover:not(:disabled) {
  background-color: #1c2230;
  border-color: #2d3848;
}

.btn-moonlit-danger {
  background-color: #341a20;
  color: #f4c8cc;
  border: 1px solid rgba(216, 96, 107, 0.45);
}
.btn-moonlit-danger:hover:not(:disabled) {
  background-color: #421f26;
  border-color: var(--color-wolf);
}

.btn-moonlit-ghost {
  background-color: transparent;
  color: var(--color-fg-secondary);
  border: 1px solid transparent;
}
.btn-moonlit-ghost:hover:not(:disabled) {
  color: var(--color-fg);
  background-color: rgba(255, 255, 255, 0.03);
}

.btn-moonlit-disabled {
  background-color: #11141c;
  color: var(--color-fg-muted);
  border: 1px solid #1f2530;
  opacity: 0.55;
}
</style>
