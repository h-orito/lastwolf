<template>
  <section class="px-4 py-6 sm:py-8">
    <div class="mx-auto max-w-3xl">
      <article class="panel px-5 py-6 sm:px-7 sm:py-8">
        <header class="section-heading">
          <h1 class="section-title">FAQ</h1>
        </header>

        <ul class="text-left text-sm leading-relaxed text-fg sm:text-[0.9375rem]">
          <li class="faq-question">お金はかかりますか？</li>
          <li class="faq-answer">無料です</li>
          <li class="faq-question">観戦したいのですがログインは必須ですか？</li>
          <li class="faq-answer">観戦はログインしていなくても可能です</li>
          <li class="faq-question">入村できないのですが</li>
          <li class="faq-answer">
            以下のいずれかに当てはまると入村できません
            <ul class="mt-1 list-disc space-y-1 pl-6 marker:text-blood-deep">
              <li>ログインしていない</li>
              <li>すでに参加人数が上限に達している</li>
              <li>決着のついていない村に参加中である</li>
              <li>突然死したことがあり、入村制限が解除されていない</li>
              <li>その他入村を制限されている</li>
            </ul>
          </li>
          <li class="faq-question">人狼や共有者は昼には会話できないのですか？</li>
          <li class="faq-answer">夜時間のみ他の人に聞こえない会話が可能です。</li>
          <li class="faq-question">人狼の夜会話は他の人に遠吠えとして聞こえますか？</li>
          <li class="faq-answer">聞こえません。</li>
          <li class="faq-question">死亡したのですが、昼時間に死者同士で会話できません。</li>
          <li class="faq-answer">夜時間のみ死者同士での会話が可能です。</li>
          <li class="faq-question">無残な死体が複数いる場合、表示順序に決まりはありますか</li>
          <li class="faq-answer">
            ランダムに並び替えて表示するため、順序により死因は特定できません
          </li>
        </ul>
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
ul li.faq-question,
ul li.faq-answer {
  position: relative;
  padding-left: 2.2em;
  line-height: 1.5;
}
ul li.faq-question {
  margin-top: 0.4em;
  font-weight: 600;
  color: var(--color-fg);
}
ul li.faq-question:first-child {
  margin-top: 0;
}
ul li.faq-question::before,
ul li.faq-answer::before {
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
ul li.faq-question::before {
  content: "Q";
  color: var(--color-bone);
  background-color: var(--color-blood-deep);
  box-shadow:
    inset 0 0 0 1px color-mix(in srgb, var(--color-blood) 60%, transparent),
    0 0 12px -2px color-mix(in srgb, var(--color-blood) 50%, transparent);
}
ul li.faq-answer::before {
  content: "A";
  color: var(--color-fg);
  background-color: color-mix(in srgb, var(--color-bone) 12%, transparent);
  box-shadow: inset 0 0 0 1px var(--color-line-bright);
}
ul li.faq-answer {
  margin-bottom: 1.4em;
  color: var(--color-fg-secondary);
}
ul li.faq-answer:last-child {
  margin-bottom: 0;
}
</style>
