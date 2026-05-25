<template>
  <div class="br min-h-dvh px-4 py-6 sm:px-8 sm:py-10">
    <!-- ============= Outer chrome (warm-dark wash) ============= -->
    <div class="mx-auto max-w-6xl space-y-8">
      <!-- ===== Top bar ===== -->
      <nav class="br-pill flex items-center justify-between px-5 py-3">
        <div class="flex items-center gap-3">
          <span class="logo-mark" aria-hidden="true">▲</span>
          <span class="font-display text-sm tracking-[0.25em] text-bone">LASTWOLF</span>
        </div>
        <div class="hidden gap-7 text-[12px] text-bone/60 sm:flex">
          <a href="#">Home</a>
          <a href="#">Villages</a>
          <a href="#">Charachips</a>
          <a href="#">Record</a>
        </div>
        <div class="flex gap-2">
          <button class="br-btn-pill br-btn-pill-ghost">Sign In</button>
          <button class="br-btn-pill br-btn-pill-red">Start</button>
        </div>
      </nav>

      <!-- ===== Hero ===== -->
      <section class="hero-card relative overflow-hidden">
        <div class="hero-bloom" aria-hidden="true" />
        <div class="hero-bloom-inner" aria-hidden="true" />
        <div class="relative z-10 px-6 py-16 text-center sm:px-12 sm:py-24">
          <p class="font-display text-[11px] uppercase tracking-[0.5em] text-blood/80">
            人狼 · The Last
          </p>
          <h1 class="hero-title mt-6 font-serif font-bold text-bone">
            最後の人狼を <br class="sm:hidden" />炙り出せ
          </h1>
          <p class="mx-auto mt-6 max-w-xl text-sm text-bone/60 sm:text-base">
            嘘と推理だけが武器。月のない夜、誰が狼で、誰が人間か。
          </p>

          <!-- Glowing centerpiece (search-bar inspired by Lumix shot) -->
          <div class="centerpiece mx-auto mt-14 max-w-xl">
            <div class="centerpiece-bloom" aria-hidden="true" />
            <div class="centerpiece-panel relative flex items-center gap-3 px-4 py-3">
              <span class="orb" aria-hidden="true" />
              <input
                v-model="hint"
                class="centerpiece-input flex-1"
                placeholder="村名で検索、または / で操作"
              />
              <button class="br-btn-pill br-btn-pill-red px-4">参加</button>
            </div>
          </div>

          <div class="mt-10 flex flex-wrap items-center justify-center gap-4">
            <button class="br-btn-pill br-btn-pill-red">
              <span>村を探す</span>
              <span aria-hidden="true" class="ml-2">→</span>
            </button>
            <button class="br-btn-pill br-btn-pill-ghost">ルールを見る</button>
          </div>
        </div>
      </section>

      <!-- ===== Pricing-style row (村カード showcase, mimicking the 3-column with one highlight) ===== -->
      <section class="cards-row">
        <article class="plan-card">
          <p class="font-display text-[10px] uppercase tracking-[0.3em] text-bone/40">№ 1242</p>
          <h3 class="mt-4 font-serif text-xl text-bone">沈黙の解析</h3>
          <p class="mt-1 text-xs text-bone/50">エピローグ</p>
          <ul class="mt-5 space-y-2 text-sm text-bone/70">
            <li>16 / 16 名</li>
            <li>結審 · 人狼陣営勝利</li>
            <li>3 日構成</li>
          </ul>
          <button class="br-btn-pill br-btn-pill-ghost mt-7 w-full">記録を読む</button>
        </article>

        <article class="plan-card plan-card-featured">
          <div class="plan-glow" aria-hidden="true" />
          <div class="flex items-baseline justify-between">
            <p class="font-display text-[10px] uppercase tracking-[0.3em] text-bone/60">№ 1247</p>
            <span class="badge-live">LIVE</span>
          </div>
          <h3 class="mt-4 font-serif text-xl text-bone">第七夜、月は欠けた</h3>
          <p class="mt-1 text-xs text-bone/60">3 日目 · 夜</p>
          <ul class="mt-5 space-y-2 text-sm text-bone/80">
            <li>15 / 16 名 参加中</li>
            <li>占い師 · 霊媒師 在</li>
            <li>残機 5 名</li>
          </ul>
          <button class="br-btn-pill br-btn-pill-red mt-7 w-full">入村する</button>
        </article>

        <article class="plan-card">
          <p class="font-display text-[10px] uppercase tracking-[0.3em] text-bone/40">№ 1248</p>
          <h3 class="mt-4 font-serif text-xl text-bone">骨を埋める場所</h3>
          <p class="mt-1 text-xs text-bone/50">募集中</p>
          <ul class="mt-5 space-y-2 text-sm text-bone/70">
            <li>8 / 14 名</li>
            <li>明日 21:00 開始</li>
            <li>標準ルール</li>
          </ul>
          <button class="br-btn-pill br-btn-pill-outline mt-7 w-full">予約する</button>
        </article>
      </section>

      <!-- ===== Button study ===== -->
      <section class="br-pill px-6 py-7">
        <div class="mb-6 flex items-baseline justify-between border-b border-bone/10 pb-3">
          <h2 class="font-serif text-lg text-bone">Buttons</h2>
          <p class="font-display text-[10px] uppercase tracking-[0.4em] text-bone/30">
            pill · rim-light · glow
          </p>
        </div>

        <p class="mb-3 font-display text-[10px] uppercase tracking-[0.3em] text-bone/40">
          Strategy A — Red primary, outline danger
        </p>
        <div class="mb-8 flex flex-wrap items-center gap-3">
          <button class="br-btn-pill br-btn-pill-red">投票する</button>
          <button class="br-btn-pill br-btn-pill-secondary">戻る</button>
          <button class="br-btn-pill br-btn-pill-outline-red">村を削除</button>
          <button class="br-btn-pill br-btn-pill-ghost">詳細</button>
          <button class="br-btn-pill br-btn-pill-disabled" disabled>処刑済</button>
        </div>

        <p class="mb-3 font-display text-[10px] uppercase tracking-[0.3em] text-bone/40">
          Strategy B — Bone primary, red danger
        </p>
        <div class="flex flex-wrap items-center gap-3">
          <button class="br-btn-pill br-btn-pill-bone">投票する</button>
          <button class="br-btn-pill br-btn-pill-secondary">戻る</button>
          <button class="br-btn-pill br-btn-pill-red">村を削除</button>
          <button class="br-btn-pill br-btn-pill-ghost">詳細</button>
          <button class="br-btn-pill br-btn-pill-disabled" disabled>処刑済</button>
        </div>
      </section>

      <!-- ===== Palette ===== -->
      <section class="br-pill px-6 py-7">
        <div class="mb-6 flex items-baseline justify-between border-b border-bone/10 pb-3">
          <h2 class="font-serif text-lg text-bone">Palette</h2>
          <p class="font-display text-[10px] uppercase tracking-[0.4em] text-bone/30">
            warm-dark + blood
          </p>
        </div>
        <div class="palette-grid">
          <div v-for="t in tokens" :key="t.label" class="palette-cell">
            <div :style="{ backgroundColor: t.hex }" class="palette-swatch" />
            <div class="text-xs text-bone">{{ t.label }}</div>
            <div class="text-[10px] text-bone/40">{{ t.hex }}</div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: "dev-only",
  layout: false,
});

useHead({ title: "Black + Red · Glow v2" });

const hint = ref("");

const tokens = [
  { label: "ink", hex: "#0a0606" },
  { label: "obsidian", hex: "#100808" },
  { label: "smoke", hex: "#1a1010" },
  { label: "ash", hex: "#2a1818" },
  { label: "wine", hex: "#3a1414" },
  { label: "bone", hex: "#f4f1e8" },
  { label: "fog", hex: "#a9a4a0" },
  { label: "blood", hex: "#e02e2e" },
  { label: "blood-deep", hex: "#8b1a1a" },
  { label: "ember", hex: "#ff5b3a" },
  { label: "gold", hex: "#b88b3c" },
];
</script>

<style scoped>
/* =================================================================
   Page outer chrome — warm-dark gradient wash (like Lumix bg)
   ================================================================= */
.br {
  --c-bone: #f4f1e8;
  --c-blood: #e02e2e;
  --c-blood-deep: #8b1a1a;
  --c-ember: #ff5b3a;
  --c-gold: #b88b3c;
  --c-ink: #0a0606;
  --c-obsidian: #100808;
  --c-smoke: #1a1010;
  color: var(--c-bone);
  background-color: #050202;
  /* 光源は右上。左下にもごく薄い赤が差し込む */
  background-image:
    radial-gradient(ellipse 1400px 900px at 95% 0%, rgba(255, 91, 58, 0.18), transparent 55%),
    radial-gradient(ellipse 1100px 700px at 92% -5%, rgba(224, 46, 46, 0.22), transparent 50%),
    radial-gradient(ellipse 800px 600px at 0% 100%, rgba(139, 26, 26, 0.12), transparent 60%),
    linear-gradient(225deg, #1c0606 0%, #0a0404 55%, #050202 100%);
  background-attachment: fixed;
}

/* Generic color helpers (scoped) */
.br .text-bone {
  color: var(--c-bone);
}
.br .text-blood {
  color: var(--c-blood);
}
.br .text-blood\/80 {
  color: rgba(224, 46, 46, 0.8);
}
.br .text-bone\/30 {
  color: rgba(244, 241, 232, 0.3);
}
.br .text-bone\/40 {
  color: rgba(244, 241, 232, 0.4);
}
.br .text-bone\/50 {
  color: rgba(244, 241, 232, 0.5);
}
.br .text-bone\/60 {
  color: rgba(244, 241, 232, 0.6);
}
.br .text-bone\/70 {
  color: rgba(244, 241, 232, 0.7);
}
.br .text-bone\/80 {
  color: rgba(244, 241, 232, 0.8);
}
.br .border-bone\/10 {
  border-color: rgba(244, 241, 232, 0.1);
}

/* =================================================================
   Common: rounded "pill" container with red-rim gradient border
   ================================================================= */
.br-pill {
  position: relative;
  border-radius: 28px;
  /* 黒ベース + 右上から狭い赤光、border は強く光る */
  background:
    radial-gradient(
        ellipse 38% 50% at 100% 0%,
        rgba(255, 91, 58, 0.15) 0%,
        rgba(224, 46, 46, 0.06) 32%,
        transparent 65%
      )
      padding-box,
    radial-gradient(ellipse 32% 42% at 0% 100%, rgba(224, 46, 46, 0.06) 0%, transparent 60%)
      padding-box,
    linear-gradient(135deg, rgba(14, 8, 8, 0.92) 0%, rgba(8, 4, 4, 0.92) 100%) padding-box,
    /* 縁: 右上 corner で強く発光 */
    linear-gradient(
        225deg,
        rgba(255, 130, 100, 0.9) 0%,
        rgba(255, 91, 58, 0.65) 10%,
        rgba(224, 46, 46, 0.38) 22%,
        rgba(139, 26, 26, 0.15) 36%,
        rgba(244, 241, 232, 0.04) 52%,
        rgba(0, 0, 0, 0) 70%,
        rgba(139, 26, 26, 0.13) 100%
      )
      border-box;
  border: 1px solid transparent;
  box-shadow:
    inset 0 0 0 1px rgba(255, 91, 58, 0.05),
    0 0 32px -10px rgba(224, 46, 46, 0.38),
    0 0 70px -20px rgba(255, 91, 58, 0.18),
    0 30px 60px -30px rgba(0, 0, 0, 0.9);
}

/* Logo mark */
.logo-mark {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 8px;
  background: linear-gradient(160deg, #ff5b3a, #8b1a1a);
  color: #fff;
  font-size: 14px;
  box-shadow: 0 0 18px -2px rgba(255, 91, 58, 0.6);
}

/* =================================================================
   Hero card — large rounded panel with internal radial bloom
   ================================================================= */
.hero-card {
  position: relative;
  border-radius: 36px;
  /* 黒ベース + 右上から狭い範囲で赤光、左下にわずか赤。border は強く光らせる */
  background:
    /* 内部の赤光は狭く、body は黒く保つ */
    radial-gradient(
        ellipse 45% 60% at 100% 0%,
        rgba(255, 91, 58, 0.28) 0%,
        rgba(224, 46, 46, 0.13) 30%,
        rgba(139, 26, 26, 0.04) 55%,
        transparent 78%
      )
      padding-box,
    radial-gradient(ellipse 38% 45% at 0% 100%, rgba(224, 46, 46, 0.09) 0%, transparent 65%)
      padding-box,
    linear-gradient(135deg, #0a0404 0%, #050202 100%) padding-box,
    /* 縁: 右上 corner で発光、強烈な明度 */
    linear-gradient(
        225deg,
        rgba(255, 165, 130, 1) 0%,
        rgba(255, 91, 58, 0.85) 10%,
        rgba(224, 46, 46, 0.5) 22%,
        rgba(139, 26, 26, 0.22) 36%,
        rgba(244, 241, 232, 0.04) 52%,
        rgba(0, 0, 0, 0) 68%,
        rgba(139, 26, 26, 0.25) 100%
      )
      border-box;
  border: 1px solid transparent;
  box-shadow:
    /* 内側の発光ライン（rimをさらに強調） */
    inset 0 0 0 1px rgba(255, 91, 58, 0.08),
    /* 外側の赤いhalo */ 0 0 60px -10px rgba(224, 46, 46, 0.55),
    0 0 120px -20px rgba(255, 91, 58, 0.25),
    0 40px 80px -30px rgba(0, 0, 0, 0.95);
}

/* 右上から差す追加の局所ハイライト（顔の上にスポットライト的に） */
.hero-bloom {
  position: absolute;
  right: -8%;
  top: -15%;
  width: 70%;
  height: 80%;
  pointer-events: none;
  background: radial-gradient(
    ellipse 55% 60% at center,
    rgba(255, 145, 110, 0.45) 0%,
    rgba(255, 91, 58, 0.25) 25%,
    rgba(224, 46, 46, 0.12) 50%,
    transparent 75%
  );
  filter: blur(20px);
}
/* 左下にぼんやり赤いにじみ */
.hero-bloom-inner {
  position: absolute;
  left: -5%;
  bottom: -10%;
  width: 50%;
  height: 60%;
  pointer-events: none;
  background: radial-gradient(
    ellipse 60% 50% at center,
    rgba(224, 46, 46, 0.2) 0%,
    rgba(139, 26, 26, 0.08) 35%,
    transparent 65%
  );
  filter: blur(16px);
}

.hero-title {
  font-size: clamp(2.5rem, 6vw, 4.5rem);
  line-height: 1.05;
  letter-spacing: -0.01em;
}

/* =================================================================
   Centerpiece (search-bar style, copied directly from Lumix vibe)
   ================================================================= */
.centerpiece {
  position: relative;
}
.centerpiece-bloom {
  position: absolute;
  inset: -30px -20px -10px;
  pointer-events: none;
  background: radial-gradient(
    ellipse 60% 70% at center,
    rgba(255, 91, 58, 0.45) 0%,
    rgba(224, 46, 46, 0.2) 35%,
    transparent 65%
  );
  filter: blur(12px);
}
.centerpiece-panel {
  position: relative;
  border-radius: 22px;
  background:
    radial-gradient(
        ellipse 70% 200% at 100% 50%,
        rgba(255, 91, 58, 0.18) 0%,
        rgba(224, 46, 46, 0.1) 30%,
        transparent 60%
      )
      padding-box,
    linear-gradient(135deg, rgba(20, 10, 10, 0.94) 0%, rgba(8, 4, 4, 0.94) 100%) padding-box,
    linear-gradient(
        225deg,
        rgba(255, 145, 110, 0.65) 0%,
        rgba(224, 46, 46, 0.4) 25%,
        rgba(244, 241, 232, 0.05) 50%,
        rgba(0, 0, 0, 0) 70%,
        rgba(139, 26, 26, 0.3) 100%
      )
      border-box;
  border: 1px solid transparent;
  box-shadow:
    0 0 40px -10px rgba(224, 46, 46, 0.4),
    inset 0 1px 0 rgba(255, 255, 255, 0.06);
}
.centerpiece-input {
  background: transparent;
  border: 0;
  outline: 0;
  color: var(--c-bone);
  font-size: 0.95rem;
}
.centerpiece-input::placeholder {
  color: rgba(244, 241, 232, 0.4);
}

/* Glowing orb — pulses */
.orb {
  display: inline-flex;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background: radial-gradient(circle, #ff9168 0%, #e02e2e 40%, #8b1a1a 80%);
  box-shadow:
    0 0 16px rgba(255, 91, 58, 0.8),
    0 0 32px rgba(224, 46, 46, 0.5),
    inset 0 0 6px rgba(255, 255, 255, 0.4);
  animation: orb-pulse 2.6s ease-in-out infinite;
  flex-shrink: 0;
}
@keyframes orb-pulse {
  0%,
  100% {
    box-shadow:
      0 0 16px rgba(255, 91, 58, 0.8),
      0 0 32px rgba(224, 46, 46, 0.5),
      inset 0 0 6px rgba(255, 255, 255, 0.4);
  }
  50% {
    box-shadow:
      0 0 26px rgba(255, 91, 58, 1),
      0 0 52px rgba(224, 46, 46, 0.7),
      inset 0 0 8px rgba(255, 255, 255, 0.6);
  }
}

/* =================================================================
   Pill buttons — rounded, with rim-light gradient borders
   ================================================================= */
.br-btn-pill {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.6rem 1.2rem;
  font-size: 0.85rem;
  font-weight: 500;
  letter-spacing: 0.01em;
  border-radius: 999px;
  border: 1px solid transparent;
  cursor: pointer;
  user-select: none;
  position: relative;
  transition:
    background-color 220ms ease,
    color 220ms ease,
    box-shadow 280ms ease,
    transform 120ms ease;
}
.br-btn-pill:active:not(:disabled) {
  transform: translateY(0.5px);
}
.br-btn-pill:disabled {
  cursor: not-allowed;
}

/* Red — 黒ベースに右上から赤光が差し込む directional lighting */
.br-btn-pill-red {
  color: #fff;
  background:
    /* 右上の強い赤グロー（赤の主光源） */
    radial-gradient(
        ellipse 90% 160% at 95% -20%,
        rgba(255, 120, 100, 0.95) 0%,
        rgba(220, 50, 50, 0.65) 25%,
        rgba(120, 22, 22, 0.32) 50%,
        rgba(40, 8, 8, 0.1) 75%,
        transparent 95%
      )
      padding-box,
    /* 左下のわずかな赤いにじみ */
    radial-gradient(
        ellipse 70% 130% at 0% 120%,
        rgba(224, 46, 46, 0.4) 0%,
        rgba(139, 26, 26, 0.15) 35%,
        transparent 65%
      )
      padding-box,
    /* 黒のベース */ linear-gradient(135deg, #1a0606 0%, #0a0303 60%, #050202 100%) padding-box,
    /* 縁の rim：右上が明るく、左下に弱く赤 */
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
.br-btn-pill-red:hover:not(:disabled) {
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

/* Bone — white pill */
.br-btn-pill-bone {
  color: #1a0808;
  background: linear-gradient(180deg, #ffffff, #d9d4c2);
  box-shadow:
    0 6px 18px -8px rgba(244, 241, 232, 0.45),
    inset 0 -1px 0 rgba(0, 0, 0, 0.15);
}
.br-btn-pill-bone:hover:not(:disabled) {
  background: linear-gradient(180deg, #ffffff, #f4f1e8);
}

/* Outline red — for "danger" with red rim */
.br-btn-pill-outline-red {
  color: #ff8484;
  background:
    linear-gradient(180deg, rgba(60, 10, 10, 0.4), rgba(20, 6, 6, 0.4)) padding-box,
    linear-gradient(180deg, rgba(224, 46, 46, 0.7), rgba(139, 26, 26, 0.4)) border-box;
  box-shadow:
    inset 0 0 16px -4px rgba(224, 46, 46, 0.25),
    0 0 24px -10px rgba(224, 46, 46, 0.4);
}
.br-btn-pill-outline-red:hover:not(:disabled) {
  color: #ffb0b0;
  background:
    linear-gradient(180deg, rgba(80, 14, 14, 0.55), rgba(30, 8, 8, 0.55)) padding-box,
    linear-gradient(180deg, rgba(255, 100, 100, 0.9), rgba(180, 30, 30, 0.6)) border-box;
}

/* Secondary — dark with rim gradient */
.br-btn-pill-secondary {
  color: var(--c-bone);
  background:
    linear-gradient(180deg, rgba(40, 22, 22, 0.7), rgba(20, 10, 10, 0.7)) padding-box,
    linear-gradient(180deg, rgba(244, 241, 232, 0.18), rgba(224, 46, 46, 0.12)) border-box;
}
.br-btn-pill-secondary:hover:not(:disabled) {
  background:
    linear-gradient(180deg, rgba(56, 30, 30, 0.85), rgba(30, 16, 16, 0.85)) padding-box,
    linear-gradient(180deg, rgba(244, 241, 232, 0.3), rgba(224, 46, 46, 0.25)) border-box;
}

/* Outline — neutral outline (used in cards as "reserve" CTA) */
.br-btn-pill-outline {
  color: var(--c-bone);
  background:
    linear-gradient(180deg, rgba(40, 22, 22, 0.4), rgba(20, 10, 10, 0.4)) padding-box,
    linear-gradient(180deg, rgba(244, 241, 232, 0.25), rgba(244, 241, 232, 0.08)) border-box;
}
.br-btn-pill-outline:hover:not(:disabled) {
  background:
    linear-gradient(180deg, rgba(60, 32, 32, 0.6), rgba(30, 16, 16, 0.6)) padding-box,
    linear-gradient(180deg, rgba(244, 241, 232, 0.4), rgba(244, 241, 232, 0.15)) border-box;
}

/* Ghost — text only */
.br-btn-pill-ghost {
  color: rgba(244, 241, 232, 0.65);
  background: transparent;
}
.br-btn-pill-ghost:hover:not(:disabled) {
  color: var(--c-bone);
  background: rgba(244, 241, 232, 0.06);
}

/* Disabled */
.br-btn-pill-disabled {
  color: rgba(244, 241, 232, 0.3);
  background:
    linear-gradient(180deg, rgba(30, 18, 18, 0.5), rgba(16, 8, 8, 0.5)) padding-box,
    linear-gradient(180deg, rgba(244, 241, 232, 0.08), rgba(244, 241, 232, 0.04)) border-box;
  opacity: 0.7;
}

/* =================================================================
   Plan-style cards (3-column village showcase)
   ================================================================= */
.plan-card {
  position: relative;
  padding: 1.6rem 1.4rem 1.4rem;
  border-radius: 24px;
  background:
    /* 右上の赤光（狭く、body は黒く保つ） */
    radial-gradient(
        ellipse 42% 55% at 100% 0%,
        rgba(255, 91, 58, 0.14) 0%,
        rgba(224, 46, 46, 0.06) 32%,
        transparent 65%
      )
      padding-box,
    /* 左下のわずかな赤いにじみ（狭く） */
    radial-gradient(ellipse 35% 45% at 0% 100%, rgba(224, 46, 46, 0.06) 0%, transparent 60%)
      padding-box,
    linear-gradient(135deg, rgba(14, 8, 8, 0.9) 0%, rgba(8, 4, 4, 0.9) 100%) padding-box,
    /* 縁: 右上 corner が強く光る */
    linear-gradient(
        225deg,
        rgba(255, 130, 100, 0.95) 0%,
        rgba(255, 91, 58, 0.7) 10%,
        rgba(224, 46, 46, 0.4) 22%,
        rgba(139, 26, 26, 0.18) 35%,
        rgba(244, 241, 232, 0.04) 52%,
        rgba(0, 0, 0, 0) 70%,
        rgba(139, 26, 26, 0.14) 100%
      )
      border-box;
  border: 1px solid transparent;
  box-shadow:
    inset 0 0 0 1px rgba(255, 91, 58, 0.05),
    0 0 28px -8px rgba(224, 46, 46, 0.42),
    0 0 60px -15px rgba(255, 91, 58, 0.18),
    0 25px 50px -25px rgba(0, 0, 0, 0.9);
  transition:
    box-shadow 280ms ease,
    transform 240ms ease;
  overflow: hidden;
}
.plan-card:hover {
  transform: translateY(-2px);
}

/* Featured card — 右上の光がさらに強い + 左下のにじみも強め */
.plan-card-featured {
  background:
    /* 右上の光は強いが範囲は狭い */
    radial-gradient(
        ellipse 50% 65% at 100% 0%,
        rgba(255, 120, 90, 0.34) 0%,
        rgba(255, 91, 58, 0.16) 28%,
        rgba(139, 26, 26, 0.06) 55%,
        transparent 75%
      )
      padding-box,
    radial-gradient(ellipse 42% 52% at 0% 100%, rgba(224, 46, 46, 0.12) 0%, transparent 62%)
      padding-box,
    linear-gradient(135deg, rgba(18, 8, 8, 0.92) 0%, rgba(10, 5, 5, 0.92) 100%) padding-box,
    /* 縁: 右上 corner が強烈に光る（featured は最高明度） */
    linear-gradient(
        225deg,
        rgba(255, 175, 145, 1) 0%,
        rgba(255, 120, 90, 0.9) 8%,
        rgba(255, 91, 58, 0.7) 18%,
        rgba(224, 46, 46, 0.4) 30%,
        rgba(244, 241, 232, 0.06) 48%,
        rgba(0, 0, 0, 0) 65%,
        rgba(139, 26, 26, 0.28) 100%
      )
      border-box;
  box-shadow:
    inset 0 0 0 1px rgba(255, 120, 90, 0.1),
    0 0 50px -8px rgba(224, 46, 46, 0.6),
    0 0 110px -20px rgba(255, 91, 58, 0.3),
    0 25px 60px -20px rgba(0, 0, 0, 0.95);
}
/* featured カードの追加グロー: 右上に強いスポット、左下に薄い赤 */
.plan-glow {
  position: absolute;
  inset: 0;
  pointer-events: none;
}
.plan-glow::before {
  content: "";
  position: absolute;
  right: -10%;
  top: -20%;
  width: 70%;
  height: 70%;
  background: radial-gradient(
    ellipse 50% 60% at center,
    rgba(255, 145, 110, 0.32) 0%,
    rgba(255, 91, 58, 0.16) 35%,
    transparent 65%
  );
  filter: blur(14px);
}
.plan-glow::after {
  content: "";
  position: absolute;
  left: -5%;
  bottom: -10%;
  width: 50%;
  height: 50%;
  background: radial-gradient(
    ellipse 60% 50% at center,
    rgba(224, 46, 46, 0.15) 0%,
    rgba(139, 26, 26, 0.06) 40%,
    transparent 70%
  );
  filter: blur(12px);
}

.badge-live {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.18rem 0.55rem;
  font-size: 0.62rem;
  font-weight: 700;
  letter-spacing: 0.18em;
  border-radius: 999px;
  color: #fff;
  background: linear-gradient(180deg, #ff5454, #b81818);
  box-shadow:
    0 0 0 1px rgba(255, 145, 110, 0.4) inset,
    0 0 16px -4px rgba(224, 46, 46, 0.7);
}
.badge-live::before {
  content: "";
  display: inline-block;
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: #fff;
  box-shadow: 0 0 6px rgba(255, 255, 255, 0.8);
  animation: orb-pulse 2.2s ease-in-out infinite;
}

/* =================================================================
   Layout grids — explicit CSS to avoid Tailwind responsive issues
   ================================================================= */
.cards-row {
  display: grid;
  gap: 1rem;
  grid-template-columns: 1fr;
}
@media (min-width: 768px) {
  .cards-row {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}

.palette-grid {
  display: grid;
  gap: 0.5rem;
  grid-template-columns: repeat(2, minmax(0, 1fr));
}
@media (min-width: 640px) {
  .palette-grid {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }
}
@media (min-width: 768px) {
  .palette-grid {
    grid-template-columns: repeat(7, minmax(0, 1fr));
  }
}

/* =================================================================
   Palette
   ================================================================= */
.palette-cell {
  padding: 0.6rem;
  border-radius: 12px;
  background: rgba(20, 10, 10, 0.55);
  border: 1px solid rgba(244, 241, 232, 0.06);
}
.palette-swatch {
  height: 44px;
  width: 100%;
  border-radius: 8px;
  border: 1px solid rgba(244, 241, 232, 0.06);
  margin-bottom: 0.45rem;
}
</style>
