<template>
  <section class="section">
    <div class="container has-text-left">
      <h1 class="title is-5 m-t-40">Googleアカウントでログイン</h1>
      <b-button type="is-primary" size="is-small" @click="googleLogin"
        >ログイン</b-button
      >
    </div>
  </section>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import firebase from '~/plugins/firebase'

@Component({
  components: {}
})
export default class GoogleAuth extends Vue {
  /** head */
  private head() {
    return { title: ' | Googleアカウントでログイン' }
  }

  private get isAlreadyAuthenticated(): boolean {
    return this.$store.getters.isAuthenticated
  }

  private async created(): Promise<void> {
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
    return this.$axios.$post('/player/nickname', {
      nickname: '仮登録',
      twitter_user_name: '仮登録'
    })
  }

  private googleLogin(): void {
    firebase.auth().signInWithRedirect(new firebase.auth.GoogleAuthProvider())
  }
}
</script>
