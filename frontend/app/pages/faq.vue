<template>
  <section class="px-4 py-6 sm:py-8">
    <div class="mx-auto max-w-3xl">
      <article class="panel px-5 py-6 sm:px-7 sm:py-8">
        <header class="section-heading">
          <h1 class="section-title">FAQ</h1>
        </header>

        <dl class="text-left text-sm leading-relaxed text-fg sm:text-[0.9375rem]">
          <dt class="faq-question">お金はかかりますか？</dt>
          <dd class="faq-answer">無料です</dd>

          <dt class="faq-question">観戦したいのですがログインは必須ですか？</dt>
          <dd class="faq-answer">観戦はログインしていなくても可能です</dd>

          <dt class="faq-question">入村できないのですが</dt>
          <dd class="faq-answer">
            以下のいずれかに当てはまると入村できません
            <ul class="mt-1 list-disc space-y-1 pl-6 marker:text-blood-deep">
              <li>ログインしていない</li>
              <li>すでに参加人数が上限に達している</li>
              <li>決着のついていない村に参加中である</li>
              <li>突然死したことがあり、入村制限が解除されていない</li>
              <li>その他入村を制限されている</li>
            </ul>
          </dd>

          <dt class="faq-question">人狼や共有者は昼には会話できないのですか？</dt>
          <dd class="faq-answer">夜時間のみ他の人に聞こえない会話が可能です。</dd>

          <dt class="faq-question">人狼の夜会話は他の人に遠吠えとして聞こえますか？</dt>
          <dd class="faq-answer">聞こえません。</dd>

          <dt class="faq-question">死亡したのですが、昼時間に死者同士で会話できません。</dt>
          <dd class="faq-answer">夜時間のみ死者同士での会話が可能です。</dd>

          <dt class="faq-question">無残な死体が複数いる場合、表示順序に決まりはありますか</dt>
          <dd class="faq-answer">
            ランダムに並び替えて表示するため、順序により死因は特定できません
          </dd>
        </dl>
      </article>
    </div>
  </section>
</template>

<script setup lang="ts">
const meta = buildPageMeta({ title: "FAQ" });
useSeoMeta(meta);
</script>

<style scoped>
/* Q/A はアイコンバッジで区別。Black & Blood: Q=深い静脈赤、A=骨白に近い hairline */
.faq-question,
.faq-answer {
  position: relative;
  padding-left: 2.2em;
  line-height: 1.5;
}
.faq-question {
  margin-top: 0.4em;
  font-weight: 600;
  color: var(--color-fg);
}
.faq-question:first-child {
  margin-top: 0;
}
.faq-question::before,
.faq-answer::before {
  display: flex;
  position: absolute;
  left: 0;
  top: 0.1em;
  align-items: center;
  justify-content: center;
  width: 1.4em;
  height: 1.4em;
  border-radius: 999px;
  font-size: 0.78em;
  font-weight: 700;
  font-family: var(--font-display);
  letter-spacing: 0.02em;
}
.faq-question::before {
  content: "Q";
  color: var(--color-bone);
  background-color: var(--color-blood-deep);
  box-shadow:
    inset 0 0 0 1px color-mix(in srgb, var(--color-blood) 60%, transparent),
    0 0 12px -2px color-mix(in srgb, var(--color-blood) 50%, transparent);
}
.faq-answer::before {
  content: "A";
  color: var(--color-fg);
  background-color: color-mix(in srgb, var(--color-bone) 12%, transparent);
  box-shadow: inset 0 0 0 1px var(--color-line-bright);
}
.faq-answer {
  /* dd はデフォルト margin-inline-start: 40px が付くので 0 で戻す */
  margin-inline-start: 0;
  margin-bottom: 1.4em;
  color: var(--color-fg-secondary);
}
.faq-answer:last-child {
  margin-bottom: 0;
}
</style>
