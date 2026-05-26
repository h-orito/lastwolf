<template>
  <section class="py-8 px-4 bg-base">
    <div class="max-w-5xl mx-auto text-center">
      <!-- ログイン済み: ようこそ -->
      <template v-if="isAuthenticated && myselfPlayer">
        <h2 class="text-lg font-bold mb-4 text-fg">ようこそ</h2>
        <div class="text-sm mb-4 text-fg">
          <p>{{ `${myselfPlayer.nickname}@${myselfPlayer.twitter_user_name} さん` }}</p>
        </div>
        <UiButton button-type="secondary" @click="handleLogout">
          <svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path
              d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"
            />
          </svg>
          ログアウト
        </UiButton>
      </template>

      <!-- 未ログイン: アプリ連携 -->
      <template v-else-if="!isAuthenticated">
        <h2 class="text-lg font-bold mb-4 text-fg">アプリ連携すると参加できます</h2>
        <div class="text-sm mb-4 text-fg-secondary">
          <p class="text-xs">名前とユーザ名がエピローグで表示されます</p>
        </div>
        <UiButton button-type="primary" @click="handleSignin">
          <svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path
              d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"
            />
          </svg>
          連携する
        </UiButton>
      </template>
    </div>
  </section>
</template>

<script setup lang="ts">
const { isAuthenticated, myselfPlayer, loginWithTwitter, logout } = useAuth();

const handleSignin = async () => {
  await loginWithTwitter();
};

const handleLogout = async () => {
  await logout();
  window.location.reload();
};
</script>
