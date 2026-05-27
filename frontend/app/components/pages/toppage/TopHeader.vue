<template>
  <header class="top-header-wrapper">
    <div class="mx-auto max-w-6xl px-4 pt-4 sm:px-6 sm:pt-6">
      <nav class="panel flex items-center justify-between gap-2 px-3 py-2.5 sm:px-5 sm:py-3">
        <!-- Left: LASTWOLF テキスト（直下の Spotlight 画像とアイコンが被るのでアイコン省略） -->
        <NuxtLink to="/" class="brand inline-flex items-center">
          <span class="brand-text">LASTWOLF</span>
        </NuxtLink>

        <!-- Right: ユーザー状態 -->
        <div class="flex items-center gap-2">
          <!-- ログイン済み -->
          <template v-if="isAuthenticated && myselfPlayer">
            <!-- ニックネーム: sm 以上のみ表示。モバイルではボタンのみ -->
            <span class="user-name hidden sm:inline text-sm text-fg-secondary">
              {{ myselfPlayer.nickname
              }}<span class="text-fg-muted">@{{ myselfPlayer.twitter_user_name }}</span>
            </span>
            <UiButton button-type="secondary" @click="handleLogout">
              <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path
                  d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"
                />
              </svg>
              <span class="hidden sm:inline">ログアウト</span>
            </UiButton>
          </template>

          <!-- 未ログイン -->
          <template v-else>
            <UiButton button-type="primary" @click="handleSignin">
              <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path
                  d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"
                />
              </svg>
              <span>ログイン</span>
            </UiButton>
          </template>
        </div>
      </nav>
    </div>
  </header>
</template>

<script setup lang="ts">
// トップページ専用ヘッダー: ブランド (左) + ユーザー情報 (右)。
// モバイルではニックネーム表示を抑制し、ボタンのみで状態を伝える。
const { isAuthenticated, myselfPlayer, loginWithTwitter, logout } = useAuth();

const handleSignin = async () => {
  await loginWithTwitter();
};

const handleLogout = async () => {
  await logout();
  window.location.reload();
};
</script>

<style scoped>
.top-header-wrapper {
  position: relative;
  z-index: 10;
}

.brand {
  color: var(--color-bone);
  transition: opacity 150ms ease;
}
.brand:hover {
  opacity: 0.85;
}

/* ブランド名: Spotlight と同じ明朝 + blood-deep シャドウ。フォントサイズだけ縮小 */
.brand-text {
  color: var(--color-bone);
  font-family:
    "Noto Serif JP", "游明朝", YuMincho, "Hiragino Mincho ProN W3", "ヒラギノ明朝 ProN W3",
    "Hiragino Mincho ProN", "HG明朝E", "ＭＳ Ｐ明朝", "ＭＳ 明朝", serif;
  font-size: 1rem;
  line-height: 1;
  text-shadow:
    1px 1px 4px rgba(139, 26, 26, 1),
    -1px 1px 4px rgba(139, 26, 26, 1),
    1px -1px 4px rgba(139, 26, 26, 1),
    -1px -1px 4px rgba(139, 26, 26, 1),
    0 0 14px rgba(224, 46, 46, 0.5);
}
@media (min-width: 640px) {
  .brand-text {
    font-size: 1.25rem;
  }
}

/* ニックネーム表示は長すぎる場合のため省略表示 */
.user-name {
  max-width: 220px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
