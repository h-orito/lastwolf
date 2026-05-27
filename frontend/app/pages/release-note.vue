<template>
  <section class="px-4 py-6 sm:py-8">
    <div class="mx-auto max-w-3xl">
      <article class="panel px-5 py-6 sm:px-7 sm:py-8">
        <header class="section-heading">
          <h1 class="section-title">更新情報</h1>
        </header>

        <ul
          class="list-disc space-y-1.5 pl-6 text-left text-sm leading-relaxed text-fg marker:text-blood-deep sm:text-[0.9375rem]"
        >
          <li>2026/05/03 残り時間と能力・投票勧告を常に最下部に表示</li>
          <li>2026/05/03 フロントエンドのフレームワーク刷新</li>
          <li>2024/02/23 設定「GM制」追加</li>
          <li>2023/12/20 設定「昼沈黙時間」追加</li>
          <li>2023/12/20 強調発言のみ表示する機能を追加</li>
          <li>2023/12/20 スマホは残り時間を画面上部に表示するよう変更</li>
          <li>2023/12/20 役職「C国狂人」「狂信者」を追加</li>
          <li>2021/02/11 死亡後リロードするまで過去の墓ログを見られなかった不具合を修正</li>
          <li>2021/02/11 発言の顔アイコンで抽出/解除できるよう変更</li>
          <li>2021/02/11 発言のレイアウトを変更</li>
          <li>2021/02/11 iPhoneX以降で残り時間が正しく表示されない不具合を修正</li>
          <li>2020/12/21 村設定「初日白通知」「連続護衛」を追加</li>
          <li>2020/12/16 公開</li>
          <li>2020/12/07 テストプレイ開始</li>
        </ul>
      </article>
    </div>
  </section>
</template>

<script setup lang="ts">
const meta = buildPageMeta({ title: "更新情報" });
useSeoMeta(meta);
</script>
