<template>
  <div>
    <div class="spotlight-area">
      <img src="~/static/image/top.jpg" alt="top_image" width="100%" />
      <div class="spotlight has-text-left">
        <p class="spotlight-intro spotlight-shadow is-size-3 has-text-white">
          LASTWOLF
        </p>
      </div>
    </div>
    <section class="section">
      <div class="container">
        <h1 class="title is-5">LASTWOLF</h1>
        <div class="content is-size-6">
          <p>LASTWOLFは短期人狼が無料で遊べるサービスです。</p>
          <link-button text="このサイトは" path="/about" class="m-b-10" />
          <link-button text="仕様" path="/rule" class="m-b-10" /><br />
          <link-button text="よくある質問" path="/faq" class="m-b-10" />
          <link-button text="更新情報" path="/release-note" class="m-b-10" />
        </div>
      </div>
    </section>
    <section class="section has-background-light" v-if="isLogin">
      <div class="container">
        <h2 class="title is-5">ようこそ</h2>
        <div class="content">
          <p class="is-size-6">
            {{ `${player.nickname}@${player.twitter_user_name} さん` }}
          </p>
        </div>
        <b-button icon-pack="fab" icon-left="twitter" @click="logout"
          >ログアウト</b-button
        >
      </div>
    </section>
    <section class="section has-background-light" v-if="!isLogin">
      <div class="container">
        <h2 class="title is-5">アプリ連携すると参加できます</h2>
        <div class="content is-size-6">
          <p class="is-size-7">名前とユーザ名がエピローグで表示されます</p>
        </div>
        <b-button
          type="is-primary"
          icon-pack="fab"
          icon-left="twitter"
          @click="signin"
          >連携する</b-button
        >
      </div>
    </section>
    <section class="section">
      <div class="container">
        <h1 class="title is-5">村一覧</h1>
        <div class="content is-size-7">
          <village-list
            :villages="villages"
            :loading-villages="loadingVillages"
          />
          <link-button
            :disabled="!canCreateVillage"
            class="m-t-10 m-r-10"
            text="村を作成"
            path="/create-village"
          />
          <link-button class="m-t-10" text="終了した村" path="/village-list" />
        </div>
      </div>
    </section>
    <section class="section has-background-light">
      <div class="container">
        <div class="content is-size-7">
          <toppage-footer />
        </div>
      </div>
    </section>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import qs from 'qs'
import cookies from 'cookie-universal-nuxt'
import firebase from '~/plugins/firebase'
import Villages from '~/@types/village'
import MyselfPlayer from '~/@types/myself-player'
import linkButton from '~/components/parts/link-button.vue'
import { VILLAGE_STATUS } from '~/consts/consts'

@Component({
  components: {
    linkButton,
    villageList: () => import('~/components/toppage/village-list.vue'),
    toppageFooter: () => import('~/components/toppage/footer.vue')
  }
})
export default class TopPage extends Vue {
  /** head */
  private head() {
    return { title: '' }
  }

  private layout() {
    return 'top-layout'
  }

  /** data */
  private villages: Villages | null = null
  private loadingVillages: boolean = false

  private get player(): MyselfPlayer | null {
    return this.$store.getters.player
  }

  private get isLogin(): boolean {
    return this.$store.getters.isLogin
  }

  private get isAlreadyAuthenticated(): boolean {
    return this.$store.getters.isAuthenticated
  }

  private get canCreateVillage(): boolean {
    if (!this.player) return false
    return this.player.available_create_village
  }

  /** created */
  private async created(): Promise<void> {
    this.loadingVillages = true
    this.villages = await this.$axios.$get('/village/list', {
      params: {
        village_status: [
          VILLAGE_STATUS.PROLOGUE,
          VILLAGE_STATUS.PROGRESS,
          VILLAGE_STATUS.EPILOGUE
        ]
      },
      paramsSerializer: params =>
        qs.stringify(params, { arrayFormat: 'repeat' })
    })
    this.loadingVillages = false
    await this.auth()
    // ログイン後のリダイレクトの際、ユーザ情報をサーバに保存
    this.registerUserIfNeeded()
  }

  private async auth(): Promise<void> {
    // 認証済みなら何もしない
    if (this.isAlreadyAuthenticated) return
    const user = await new Promise((resolve, reject) => {
      firebase.auth().onAuthStateChanged(user => resolve(user))
    })
    await this.$store.dispatch('LOGINOUT', {
      user
    })
  }

  private async registerUserIfNeeded(): Promise<void> {
    const redirectResult = await firebase.auth().getRedirectResult()
    if (!redirectResult.additionalUserInfo || !redirectResult.user) {
      return
    }
    const twitterUsername = redirectResult.additionalUserInfo.username
    const user = redirectResult.user
    const idToken = await user.getIdToken(false)
    this.$cookies.set('id-token', idToken, {
      path: '/',
      maxAge: 60 * 60 * 24 * 30
    })
    // 1時間で有効期限が切れるので50分後に再取得させる
    const now = new Date()
    this.$cookies.set(
      'id-token-check-date',
      now.setMinutes(now.getMinutes() + 50),
      {
        path: '/',
        maxAge: 60 * 60 * 24 * 30
      }
    )
    // 変更しても古いままなので取得できたら無理やりとる
    let displayName = user.displayName
    if (
      redirectResult.additionalUserInfo.profile != null &&
      (redirectResult.additionalUserInfo.profile as any).name != null
    ) {
      displayName = (redirectResult.additionalUserInfo.profile as any).name
    }
    return this.$axios.$post('/player/nickname', {
      nickname: displayName,
      twitter_user_name: twitterUsername
    })
  }

  private async signin(): Promise<void> {
    const provider = new firebase.auth.TwitterAuthProvider()
    await firebase.auth().signInWithRedirect(provider)
  }

  private async logout(): Promise<void> {
    await firebase.auth().signOut()
    location.reload()
  }
}
</script>

<style lang="scss">
.spotlight-area {
  position: relative;

  .spotlight {
    position: absolute;
    right: 2%;
    bottom: calc(50% - 2rem);
  }

  .spotlight-intro {
    font-family: '游明朝', YuMincho, 'Hiragino Mincho ProN W3',
      'ヒラギノ明朝 ProN W3', 'Hiragino Mincho ProN', 'HG明朝E', 'ＭＳ Ｐ明朝',
      'ＭＳ 明朝', serif;
  }

  .spotlight-shadow {
    text-shadow: 2px 2px 5px rgba(69, 97, 133, 1),
      -2px 2px 5px rgba(69, 97, 133, 1), 2px -2px 5px rgba(69, 97, 133, 1),
      -2px -2px 5px rgba(69, 97, 133, 1);
  }
}
</style>
