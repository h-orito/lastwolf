<template>
  <section class="py-8 px-4">
    <div class="max-w-5xl mx-auto">
      <h1 class="text-lg font-bold mb-4">更新情報</h1>
      <div>
        <ul class="text-left text-sm list-disc pl-6 space-y-1">
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
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const meta = buildPageMeta({ title: "更新情報" });
useSeoMeta(meta);
</script>
