<template>
  <!-- ログイン済みのウェルカム表示はヘッダー右上に集約済み。未ログイン時のみ案内パネルを出す -->
  <section v-if="!isAuthenticated" class="panel px-5 py-6 sm:px-7 sm:py-8">
    <div class="mx-auto max-w-xl text-left">
      <h2 class="mb-3 text-center text-lg font-bold text-fg">ログインすると村に参加できます</h2>
      <ul class="space-y-2 text-sm text-fg-secondary">
        <li>
          <span class="text-fg">閲覧のみ</span
          >ならログインは不要です。村の進行や記録は誰でも見られます。
        </li>
        <li>
          <span class="text-fg">村への参加・村の作成</span>には X アカウントでのログインが必要です。
        </li>
        <li>
          X アカウントの<span class="text-fg">名前・ユーザー名</span>は、その村が
          <span class="text-fg">エピローグに到達したとき</span>に他の参加者へ公開されます。
        </li>
      </ul>
      <p class="mt-4 text-center text-xs text-fg-muted">右上の「ログイン」から開始できます。</p>
    </div>
  </section>
</template>

<script setup lang="ts">
const { isAuthenticated } = useAuth();
</script>
