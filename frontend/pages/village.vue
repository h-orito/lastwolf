<template>
  <div class="is-size-7 has-text-left village-wrapper">
    <div class="columns">
      <div class="column p-b-0">
        <div v-if="village" class="village-name-area-wrapper">
          <div class="village-name-area">
            <p class="village-name">
              <strong>{{ village.id }}. {{ village.name }}</strong>
            </p>
          </div>
          <div class="share-button-area">
            <a
              :href="`https://twitter.com/share?text=${village.name}`"
              class="twitter-share-button"
              data-hashtags="人狼_LASTWOLF"
              data-lang="ja"
              data-show-count="false"
            ></a>
            <script
              v-if="!isDebug"
              async
              src="https://platform.twitter.com/widgets.js"
              charset="utf-8"
            ></script>
          </div>
        </div>
      </div>
    </div>
    <div class="columns is-desktop">
      <div class="column p-t-5 p-b-5">
        <div class="village-info-area-wrapper">
          <div class="village-participants-area">
            <participants />
          </div>
          <div class="village-myself-area">
            <village-progress ref="progress" />
          </div>
        </div>
      </div>
      <div class="column p-t-5 p-b-5">
        <div class="village-message-area-wrapper">
          <div class="village-message-area">
            <messages ref="messages" />
          </div>
          <div class="village-creator-area">
            <creator v-if="isCreator" />
          </div>
        </div>
        <debug v-if="isDebug" />
        <div class="has-text-right">
          <link-button text="トップページへ" path="/" is-small />
        </div>
      </div>
    </div>
    <first-day-modal
      :is-open="isOpenFirstdayModal"
      @close="closeFirstdayModal"
    />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import dayjs from 'dayjs'
import firebase from '~/plugins/firebase'
import messages from '~/components/message/messages.vue'
import creator from '~/components/creator/creator.vue'
import villageProgress from '~/components/progress/progress.vue'
import participants from '~/components/participants/participants.vue'
import * as actionTypes from '~/store/action-types'
import Village from '~/@types/village'
import MyselfPlayer from '~/@types/myself-player'
import { NOONNIGHT_CODE } from '~/consts/consts'

@Component({
  components: {
    messages,
    creator,
    villageProgress,
    participants,
    debug: () => import('~/components/debug/debug.vue'),
    linkButton: () => import('~/components/parts/link-button.vue'),
    firstDayModal: () => import('~/components/day-change/modal-first-day.vue')
  },
  asyncData({ query }) {
    return { villageId: query.id }
  }
})
export default class VillageV extends Vue {
  /** head */
  private head() {
    return { title: '' }
  }

  private villageId: number = 0
  private timer: any | null = null

  /** ローカル環境か */
  private get isDebug(): boolean {
    return (process.env as any).ENV === 'local'
  }

  private get village(): Village | null {
    return this.$store.getters.village
  }

  private get isAlreadyAuthenticated(): boolean {
    return this.$store.getters.isAuthenticated
  }

  private get isCreator(): boolean {
    const player = this.$store.getters.player
    return (
      !!this.village && !!player && this.village.creator_player.id === player.id
    )
  }

  private async mounted(): Promise<void> {
    await this.auth()
    const self = this
    await Promise.all([
      this.$store.dispatch(actionTypes.INIT_VILLAGE, {
        villageId: this.villageId,
        uid: this.$store.getters.user.uid,
        dayChangeCallback: () => {
          self.openLatestday()
          self.openFirstdayModalIfNeeded()
        }
      }),
      this.$store.dispatch(actionTypes.INIT_MESSAGE, {
        villageId: this.villageId,
        uid: this.$store.getters.user.uid
      })
    ])
    this.timer = this.setTimer()
  }

  private destroyed(): void {
    this.$store.dispatch(actionTypes.TERMINATE_VILLAGE)
    this.$store.dispatch(actionTypes.TERMINATE_MESSAGE)
    clearInterval(this.timer)
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

  // 最新日を開く
  private openLatestday(): void {
    // @ts-ignore
    this.$refs.messages.openLatestday()
  }

  // 役職確認モーダル
  private isOpenFirstdayModal = false
  private openFirstdayModalIfNeeded(): void {
    const latestDay = this.$store.getters.latestDay
    // 1日目夜のみ
    if (
      latestDay.day !== 1 ||
      latestDay.noon_night.code !== NOONNIGHT_CODE.NIGHT
    ) {
      return
    }
    // 参加している場合のみ
    if (
      !!this.$store.getters.situation &&
      !this.$store.getters.situation.participate.myself
    ) {
      return
    }
    this.isOpenFirstdayModal = true
  }

  private closeFirstdayModal(): void {
    this.isOpenFirstdayModal = false
  }

  // タイマー
  private setTimer(): any {
    return setInterval(this.updateDaychangeTimer, 1000)
  }

  private updateDaychangeTimer(): void {
    // @ts-ignore
    this.$refs.progress.refreshTimer()
  }
}
</script>

<style lang="scss">
.village-wrapper {
  padding: 5px;

  .village-name-area-wrapper {
    display: flex;

    .village-name-area {
      flex: 1;

      .village-name {
        line-height: 1.5rem;
      }
    }

    .share-button-area {
      right: 0;
    }
  }

  .village-info-area-wrapper {
    .village-participants-area {
      margin-bottom: 5px;

      .participants {
        .participant {
          display: inline-block;
          vertical-align: top;

          .bold {
            font-weight: bold;
          }

          img {
            width: 50px;
            height: 77px;
          }
          img.dead {
            opacity: 0.3;
          }
        }
      }
    }
    .village-myself-area {
      margin-bottom: 5px;

      .progress-bar {
        margin-bottom: 10px;
      }

      .myself {
        p {
          line-height: 1.5;
        }
      }
      .chara-select-content {
        display: flex;
        flex-wrap: wrap;

        .chara-select-box {
          border: 1px solid #cccccc;
          border-radius: 16px;
          padding: 5px;
          margin: 5px auto;
          width: 160px;
        }
        .chara-select-box:hover {
          cursor: pointer;
          border: 1px solid $primary;
          font-weight: 700;
        }
      }
    }
  }
  .village-message-area-wrapper {
    .village-message-area {
      .messages {
        .message-area {
          max-height: 80vh;
          overflow-y: auto;
          -webkit-overflow-scrolling: touch;

          .village-message {
            color: #777777;
            display: flex;
            flex-direction: row;
            width: 100%;
            line-height: 1.8;

            .message-speaker {
            }
            .message-content {
              flex: 1;
              font-family: sans-serif;
              white-space: pre-wrap;
              word-wrap: break-word;
              word-break: break-all;
            }
            .message-strong {
              font-weight: bold;
            }
            .message-type {
              color: #ccc;
              text-align: right;
            }
            .message-time {
              color: #ccc;
              text-align: right;
            }
          }

          .message-border {
            border-top: 1px solid #eee;
            border-bottom: 1px solid #eee;
          }

          /** 線同士の重なりを防ぐ */
          .message-border + .message-border {
            border-top: none;
          }
        }
      }
      .b-tabs .tab-content {
        padding-left: 0 !important;
        padding-right: 0 !important;
        padding-bottom: 0 !important;
      }

      .tabs.is-toggle li {
        a {
          text-decoration: none !important;
        }

        &.is-active a {
          color: $white !important;
        }
      }
    }
  }

  .message-color-0 {
    color: #f00 !important;
  }

  .message-color-1 {
    color: #785600 !important;
  }

  .message-color-2 {
    color: #00f !important;
  }

  .message-color-3 {
    color: #880000 !important;
  }

  .message-color-4 {
    color: #008800 !important;
  }

  .message-color-5 {
    color: #000088 !important;
  }

  .message-color-6 {
    color: #f301ff !important;
  }

  .message-color-7 {
    color: #017aff !important;
  }

  .message-color-8 {
    color: #8800ff !important;
  }

  .message-color-9 {
    color: #888800 !important;
  }
}

@media screen and (max-width: 767px) {
  .village-wrapper {
    padding-bottom: 60px;

    .progress-bar {
      position: fixed;
      z-index: 100;
      bottom: 0;
      left: 0;
      margin-bottom: 0 !important;
      padding: 10px;
      width: 100vw;
      background-color: #fff;
      border-top: 1px solid #ccc;
    }
  }
}
</style>
