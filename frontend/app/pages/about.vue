<template>
  <section class="px-4 py-6 sm:py-8">
    <div class="mx-auto max-w-3xl space-y-6 sm:space-y-8">
      <!-- 導入（ページタイトル h1 + リード文） -->
      <article class="panel px-5 py-6 sm:px-7 sm:py-8">
        <header class="section-heading">
          <h1 class="section-title">このサイトは</h1>
        </header>
        <ul
          class="list-disc space-y-1.5 pl-6 text-left text-sm leading-relaxed text-fg marker:text-blood-deep sm:text-[0.9375rem]"
        >
          <li>LASTWOLFは、オンラインで短期人狼が遊べるサイトです。</li>
          <li>ユーザが自分で好きな設定の村を作成することができます。</li>
          <li>機能の豊富さよりもわかりやすさを優先し、シンプルにしています。</li>
        </ul>
      </article>

      <!-- 注意事項 -->
      <article class="panel px-5 py-6 sm:px-7 sm:py-8">
        <header class="section-heading">
          <h2 class="section-title">注意事項</h2>
        </header>
        <ul
          class="list-disc space-y-1.5 pl-6 text-left text-sm leading-relaxed text-fg marker:text-blood-deep sm:text-[0.9375rem]"
        >
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
      </article>

      <!-- キャラチップについて -->
      <article class="panel px-5 py-6 sm:px-7 sm:py-8">
        <header class="section-heading">
          <h2 class="section-title">キャラチップについて</h2>
        </header>
        <ul
          class="list-disc space-y-1.5 pl-6 text-left text-sm leading-relaxed text-fg marker:text-blood-deep sm:text-[0.9375rem]"
        >
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
      </article>

      <!-- 姉妹サイト -->
      <article class="panel px-5 py-6 sm:px-7 sm:py-8">
        <header class="section-heading">
          <h2 class="section-title">姉妹サイト</h2>
        </header>
        <ul
          class="list-disc space-y-3 pl-6 text-left text-sm leading-relaxed text-fg marker:text-blood-deep sm:text-[0.9375rem]"
        >
          <li>
            <a href="https://howling-wolf.com" target="_blank" rel="noopener" class="text-link">
              HOWLING WOLF
            </a>
            <ul class="mt-1 list-disc space-y-1 pl-6 marker:text-blood-deep/60">
              <li>短期人狼が遊べるサイトです。</li>
              <li>システムにより自動で村が作成されるため、知らない人同士で遊べます。</li>
            </ul>
          </li>
          <li>
            <a href="https://firewolf.netlify.app" target="_blank" rel="noopener" class="text-link">
              FIREWOLF
            </a>
            <ul class="mt-1 list-disc space-y-1 pl-6 marker:text-blood-deep/60">
              <li>短期人狼が遊べるサイトです。</li>
              <li>当サイト同様、好きな設定の村を作成して遊ぶことができます。</li>
            </ul>
          </li>
        </ul>
      </article>
    </div>
  </section>
</template>

<script setup lang="ts">
const meta = buildPageMeta({ title: "このサイトは" });
useSeoMeta(meta);
</script>
