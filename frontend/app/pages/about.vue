<template>
  <section class="section px-6 py-12 md:px-12">
    <div class="container mx-auto text-left text-sm">
      <h1 class="mb-4 text-xl font-bold">このサイトは</h1>
      <div class="content">
        <ul class="list-inside list-disc space-y-2">
          <li>LASTWOLFは、オンラインで短期人狼が遊べるサイトです。</li>
          <li>ユーザが自分で好きな設定の村を作成することができます。</li>
          <li>機能の豊富さよりもわかりやすさを優先し、シンプルにしています。</li>
        </ul>
      </div>

      <h2 class="mt-6 mb-3 text-xl font-bold">注意事項</h2>
      <div class="content">
        <ul class="list-inside list-disc space-y-2">
          <li>
            同村しているプレイヤーの画面の向こうにはあなたと同様人間がいます。<br />他者を思いやり、迷惑をかけないプレイを心がけるようお願いします。
          </li>
          <li>
            正常な運営を妨げる行為がなされた場合、管理人の裁量によりアクセス禁止措置等が取られる可能性があります。
          </li>
          <li>参加如何に関わらず、進行中の村の情報を別の場所でやり取りしないでください。</li>
          <li>決着を迎えるまでは、自身が希望した役職について言及しないでください。</li>
          <li>勝利を目指してください。</li>
        </ul>
      </div>

      <h2 class="mt-6 mb-3 text-xl font-bold">キャラチップについて</h2>
      <div class="content">
        <ul class="list-inside list-disc space-y-2">
          <li>
            村で各プレイヤーが使用するキャラクターの画像については、著作権は作者様にあります。
          </li>
          <li>
            スクリーンショットのSNSアップロードやキャラ画像のアイコン利用などについては著作権者である作者様の意向に従ってください。
          </li>
          <li>
            「実装国の規約に準ずる」とある場合は、村ログのスクリーンショットのSNSアップロードはOK、キャラ画像のみを利用するのはNGとします。
          </li>
        </ul>
      </div>

      <h2 class="mt-6 mb-3 text-xl font-bold">姉妹サイト</h2>
      <div class="content">
        <ul class="list-inside list-disc space-y-2">
          <li>
            <a href="https://howling-wolf.com" target="_blank" class="text-blue-600 hover:underline"
              >HOWLING WOLF</a
            >
            <ul class="ml-4 mt-1 list-inside list-disc space-y-1">
              <li>長期人狼が遊べるサイトです。</li>
              <li>システムにより自動で村が作成されるため、知らない人同士で遊べます。</li>
            </ul>
          </li>
          <li>
            <a
              href="https://firewolf.netlify.app"
              target="_blank"
              class="text-blue-600 hover:underline"
              >FIREWOLF</a
            >
            <ul class="ml-4 mt-1 list-inside list-disc space-y-1">
              <li>長期人狼が遊べるサイトです。</li>
              <li>当サイト同様、好きな設定の村を作成して遊ぶことができます。</li>
            </ul>
          </li>
        </ul>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
useHead({ title: "このサイトは | LASTWOLF" });
</script>
