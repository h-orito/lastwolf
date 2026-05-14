<template>
  <section class="py-8 px-4">
    <div class="max-w-5xl mx-auto">
      <h1 class="text-lg font-bold mb-4">FAQ</h1>
      <ul class="text-left text-sm">
        <li class="faq-question">お金はかかりますか？</li>
        <li class="faq-answer">無料です</li>
        <li class="faq-question">観戦したいのですがログインは必須ですか？</li>
        <li class="faq-answer">観戦はログインしていなくても可能です</li>
        <li class="faq-question">入村できないのですが</li>
        <li class="faq-answer">
          以下のいずれかに当てはまると入村できません
          <ul class="list-disc pl-6 mt-1 space-y-1">
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
        <li class="faq-answer">ランダムに並び替えて表示するため、順序により死因は特定できません</li>
      </ul>
    </div>
  </section>
</template>

<script setup lang="ts">
const meta = buildPageMeta({ title: "FAQ" });
useSeoMeta(meta);
</script>

<style scoped>
ul li.faq-question,
ul li.faq-answer {
  position: relative;
  padding-left: 2em;
  line-height: 20px;
}
ul li.faq-question::before {
  content: "Q";
  display: block;
  position: absolute;
  left: 0;
  text-align: center;
  line-height: 20px;
  border-radius: 50%;
  background-color: #3273dc;
  width: 20px;
  height: 20px;
  color: #ffffff;
  font-size: 14px;
  font-weight: bold;
}
ul li.faq-answer {
  margin-bottom: 20px;
}
ul li.faq-answer::before {
  content: "A";
  display: block;
  position: absolute;
  left: 0;
  text-align: center;
  line-height: 20px;
  border-radius: 50%;
  background-color: #ff3860;
  width: 20px;
  height: 20px;
  color: #ffffff;
  font-size: 14px;
  font-weight: bold;
}
</style>
