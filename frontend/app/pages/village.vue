<template>
  <section class="py-2 px-2">
    <div class="text-xs text-left village-wrapper" :class="{ 'village-in-progress': isInProgress }">
      <!-- 村名ヘッダー -->
      <div v-if="village" class="mb-2">
        <div class="flex items-center gap-2">
          <p class="flex-1 font-bold text-sm leading-6">{{ village.id }}. {{ village.name }}</p>
          <div>
            <a
              :href="xShareUrl"
              target="_blank"
              rel="noopener noreferrer"
              class="x-share-link inline-flex items-center gap-1 px-2 py-1 text-xs rounded"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                class="w-3 h-3"
              >
                <path
                  d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.74l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"
                />
              </svg>
              <span>ポスト</span>
            </a>
          </div>
        </div>
      </div>

      <!-- デスクトップ: 2カラムレイアウト / モバイル: 1カラム -->
      <div class="md:flex md:gap-4">
        <!-- 左カラム: 参加者 + 進行 -->
        <div class="md:w-1/2" id="participants-area">
          <Participants />
          <div id="progress-area">
            <Progress />
          </div>
        </div>

        <!-- 右カラム: メッセージ + 村建て + デバッグ -->
        <div class="md:w-1/2" id="messages-area">
          <Messages ref="messagesRef" />
          <Creator v-if="isCreator" />
          <Debug v-if="isDebug" />
          <div class="text-right mt-2">
            <UiButton button-type="secondary" to="/">トップページへ</UiButton>
          </div>
        </div>
      </div>

      <!-- 初日役職確認モーダル -->
      <ModalFirstDay v-model="isOpenFirstdayModal" @close="closeFirstdayModal" />
    </div>

    <!-- 固定フッター: PC版は残り時間バーのみ、モバイルは残り時間バー+ナビゲーション -->
    <div
      class="fixed bottom-0 left-0 w-full bg-base z-50"
      style="padding-bottom: env(safe-area-inset-bottom)"
    >
      <!-- 残り時間プログレスバー (進行中のみ表示) -->
      <ProgressBar ref="mobileProgressBarRef" class="px-2 pt-1" />
      <!-- ナビゲーション (モバイルのみ) -->
      <div class="flex border-t border-line-soft md:hidden">
        <button
          class="village-nav-btn"
          :class="activeSection === 'participants' ? 'is-active' : ''"
          @click="scrollToSection('#participants-area', 'participants')"
        >
          <UsersIcon class="h-4 w-4" />
          <span>参加者</span>
        </button>
        <button
          class="village-nav-btn"
          :class="activeSection === 'progress' ? 'is-active' : ''"
          @click="scrollToSection('#progress-area', 'progress')"
        >
          <ClockIcon class="h-4 w-4" />
          <span>進行</span>
        </button>
        <button
          class="village-nav-btn"
          :class="activeSection === 'messages' ? 'is-active' : ''"
          @click="scrollToSection('#messages-area', 'messages')"
        >
          <ChatBubbleOvalLeftEllipsisIcon class="h-4 w-4" />
          <span>チャット</span>
        </button>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import {
  getDatabase,
  ref as dbRef,
  onValue,
  onChildAdded,
  type Unsubscribe,
} from "firebase/database";
import Participants from "~/components/pages/village/participants/Participants.vue";
import Progress from "~/components/pages/village/progress/Progress.vue";
import ProgressBar from "~/components/pages/village/progress/ProgressBar.vue";
import Messages from "~/components/pages/village/message/Messages.vue";
import Creator from "~/components/pages/village/creator/Creator.vue";
import Debug from "~/components/pages/village/debug/Debug.vue";
import ModalFirstDay from "~/components/pages/village/day-change/ModalFirstDay.vue";
import { UsersIcon, ClockIcon, ChatBubbleOvalLeftEllipsisIcon } from "@heroicons/vue/24/outline";
import { VILLAGE_STATUS } from "~/lib/api/village-status-constants";
import type { components } from "~/lib/api/schema";

definePageMeta({ layout: "default" });

type VillageView = components["schemas"]["VillageView"];
type SituationAsParticipantView = components["schemas"]["SituationAsParticipantView"];
type MessagesView = components["schemas"]["MessagesView"];
type MessageView = components["schemas"]["MessageView"];
type VillageDay = components["schemas"]["VillageDay"];
type VillageParticipantView = components["schemas"]["VillageParticipantView"];

const route = useRoute();
const { apiCall } = useApi();
const villageStore = useVillageStore();
const messagesStore = useMessagesStore();
const authStore = useAuthStore();
const { waitForAuth, loginout } = useAuth();

// ページタイトル
const village = computed(() => villageStore.village as VillageView | null);

const { origin } = useRequestURL();
const xShareUrl = computed(() => {
  if (!village.value) return "#";
  const url = `${origin}/village?id=${village.value.id}`;
  const text = `${village.value.name}\n${url}\n#人狼_LASTWOLF`;
  return `https://twitter.com/share?text=${encodeURIComponent(text)}`;
});
useSeoMeta(buildPageMeta({ title: "" }));
watchEffect(() => {
  if (village.value) {
    useSeoMeta(buildPageMeta({ title: village.value.name }));
  }
});

// URLクエリから村IDを取得
const villageId = computed(() => {
  const id = route.query.id;
  if (typeof id === "string") return parseInt(id, 10);
  return 0;
});

// デバッグモード判定
const isDebug = computed(() => import.meta.env.VITE_ENV === "local" || import.meta.env.DEV);

// 村建て者かどうか
const isCreator = computed(() => {
  const player = authStore.myselfPlayer;
  if (!village.value || !player) return false;
  return village.value.creator_player.id === player.id;
});

// 子コンポーネントのref
const mobileProgressBarRef = ref<{ refreshTimer: () => void } | null>(null);
const messagesRef = ref<{ openLatestday: () => void } | null>(null);

const isInProgress = computed(() => {
  return village.value?.status.code === VILLAGE_STATUS.IN_PROGRESS;
});

// 1日目役職確認モーダル
const isOpenFirstdayModal = ref(false);

const closeFirstdayModal = () => {
  isOpenFirstdayModal.value = false;
};

// 最新日を開く
const openLatestday = () => {
  messagesRef.value?.openLatestday();
};

// 1日目夜に役職確認モーダルを開く
const openFirstdayModalIfNeeded = () => {
  const latestDay = villageStore.latestDay;
  if (!latestDay) return;
  // 1日目夜のみ
  if (latestDay.day !== 1 || latestDay.noon_night.code !== "NIGHT") return;
  // 参加している場合のみ
  const situation = villageStore.situation as SituationAsParticipantView | null;
  if (situation && !situation.participate.myself) return;
  isOpenFirstdayModal.value = true;
};

// 日付変更後にメッセージを再読み込みする必要があるか判定
const shouldReloadMessage = (
  latestDay: VillageDay,
  myself: VillageParticipantView | null,
  isGmNotParticipating: boolean,
): boolean => {
  // エピローグになった場合、夜時間のメッセージが読めるようになるので再読み込み
  if (latestDay.is_epilogue) return true;
  // 死亡した場合、呻きが読めるようになるので再読み込み
  if (myself?.dead?.village_day.id === latestDay.id) return true;
  // GM制で村建てが参加していない場合、夜時間のメッセージを再読み込み
  if (isGmNotParticipating && latestDay.noon_night.code === "NIGHT") return true;
  return false;
};

const reloadMessageIfNeeded = async () => {
  const latestDay = villageStore.latestDay;
  if (!latestDay) return;
  const situation = villageStore.situation as SituationAsParticipantView | null;
  const myself = situation?.participate.myself ?? null;
  const isGmNotParticipating = !myself && (situation?.creator.viewable_spoiler ?? false);
  if (!shouldReloadMessage(latestDay, myself, isGmNotParticipating)) return;
  await fetchNightMessages();
};

// タイマー
let timer: ReturnType<typeof setInterval> | null = null;

const setTimer = () => {
  return setInterval(() => {
    mobileProgressBarRef.value?.refreshTimer();
  }, 1000);
};

// Firebase Realtime DB リスナー
let unsubscribeVillage: Unsubscribe | null = null;
let unsubscribeAbility: Unsubscribe | null = null;
let unsubscribeMessage: Unsubscribe | null = null;
let unsubscribeNoonMessage: Unsubscribe | null = null;

const buildVid = (id: number): string => {
  return `v${("00000" + id).slice(-5)}`;
};

// 村情報をAPIから取得
const fetchVillage = async (): Promise<VillageView | null> => {
  try {
    const v = await apiCall<VillageView>(`/village/${villageId.value}`);
    return v;
  } catch {
    return null;
  }
};

// 状況をAPIから取得
const fetchSituation = async (): Promise<SituationAsParticipantView | null> => {
  try {
    const s = await apiCall<SituationAsParticipantView>(`/village/${villageId.value}/situation`);
    return s;
  } catch {
    return null;
  }
};

// 夜メッセージをAPIから取得（personalized: uidに基づいて見えるメッセージを取得）
const fetchNightMessages = async (): Promise<void> => {
  try {
    const res = await apiCall<MessagesView>(`/village/${villageId.value}/message-list`);
    messagesStore.saveNightMessages(res.list);
  } catch {
    // エラーは無視
  }
};

// Firebase Realtime DB リスナー初期化
const initFirebaseListeners = () => {
  const db = getDatabase();
  const vid = buildVid(villageId.value);
  const uid = authStore.user?.uid ?? "not_login";

  // 村の最新情報リスナー
  const villageRef = dbRef(db, `${vid}/village_latest/`);
  let prevDayCount = villageStore.village?.days.list.length ?? 0;

  unsubscribeVillage = onValue(villageRef, async () => {
    const [newVillage, newSituation] = await Promise.all([fetchVillage(), fetchSituation()]);
    if (!newVillage) return;

    const newDayCount = newVillage.days.list.length;
    const dayChanged = prevDayCount > 0 && newDayCount > prevDayCount;

    villageStore.initVillage(villageId.value, newVillage);
    if (newSituation) {
      villageStore.initSituation(newSituation);
    }

    prevDayCount = newDayCount;

    if (dayChanged) {
      openLatestday();
      openFirstdayModalIfNeeded();
      await reloadMessageIfNeeded();
    }
  });

  // 能力変化リスナー（状況再取得）
  const abilityRef = dbRef(db, `${vid}/situation_latest/${uid}`);
  unsubscribeAbility = onValue(abilityRef, async () => {
    const newSituation = await fetchSituation();
    if (newSituation) {
      villageStore.initSituation(newSituation);
    }
  });

  // 夜メッセージリスナー: message_latest/${uid} が更新されたらAPIから取得
  const messageRef = dbRef(db, `${vid}/message_latest/${uid}`);
  unsubscribeMessage = onValue(messageRef, async () => {
    await fetchNightMessages();
  });

  // 昼メッセージリスナー: v${vid}/messages/ にメッセージが追加されたらFirebaseから直接取得
  // Firebase は 'strong' フィールド、API スキーマは 'is_strong' を使うため正規化する
  const noonMessageRef = dbRef(db, `${vid}/messages/`);
  unsubscribeNoonMessage = onChildAdded(noonMessageRef, (snapshot) => {
    const raw = snapshot.val();
    if (!raw) return;
    const message: MessageView = {
      from: raw.from,
      time: raw.time,
      content: {
        type: raw.content.type,
        text: raw.content.text,
        is_strong: raw.content.strong,
      },
    };
    messagesStore.addNoonMessage(message);
  });
};

// Firebase リスナー解除
const terminateFirebaseListeners = () => {
  if (unsubscribeVillage) {
    unsubscribeVillage();
    unsubscribeVillage = null;
  }
  if (unsubscribeAbility) {
    unsubscribeAbility();
    unsubscribeAbility = null;
  }
  if (unsubscribeMessage) {
    unsubscribeMessage();
    unsubscribeMessage = null;
  }
  if (unsubscribeNoonMessage) {
    unsubscribeNoonMessage();
    unsubscribeNoonMessage = null;
  }
};

// アクティブセクション管理
type SectionKey = "participants" | "progress" | "messages";
const activeSection = ref<SectionKey>("participants");

// セクションへスクロール
const scrollToSection = (hash: string, section: SectionKey) => {
  activeSection.value = section;
  const el = document.querySelector(hash);
  if (el) {
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  }
};

// Intersection Observerでスクロール位置に応じてアクティブセクションを更新
let sectionObserver: IntersectionObserver | null = null;

const initSectionObserver = () => {
  sectionObserver = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          if (id === "participants-area") activeSection.value = "participants";
          else if (id === "progress-area") activeSection.value = "progress";
          else if (id === "messages-area") activeSection.value = "messages";
        }
      }
    },
    { threshold: 0.3, rootMargin: "0px 0px -50% 0px" },
  );

  for (const id of ["participants-area", "progress-area", "messages-area"]) {
    const el = document.getElementById(id);
    if (el) sectionObserver.observe(el);
  }
};

// 初期化
const initialize = async () => {
  // 認証待機
  if (!authStore.isAuthenticated) {
    const user = await waitForAuth();
    if (user) {
      await loginout(user);
    }
  }

  // 初期データ取得
  const [initVillage, initSituation] = await Promise.all([fetchVillage(), fetchSituation()]);

  if (initVillage) {
    villageStore.initVillage(villageId.value, initVillage);
  }
  if (initSituation) {
    villageStore.initSituation(initSituation);
  }

  // 夜メッセージ初期取得（昼メッセージは Firebase onChildAdded で自動ロード）
  await fetchNightMessages();

  // Firebase リスナー開始
  initFirebaseListeners();

  // タイマー開始
  timer = setTimer();
};

onMounted(async () => {
  await initialize();
  initSectionObserver();
});

onUnmounted(() => {
  terminateFirebaseListeners();
  villageStore.terminateVillage();
  messagesStore.init();
  if (timer !== null) {
    clearInterval(timer);
    timer = null;
  }
  sectionObserver?.disconnect();
  sectionObserver = null;
});
</script>

<style>
@media (max-width: 767px) {
  .village-wrapper {
    padding-bottom: calc(50px + env(safe-area-inset-bottom));
  }
  /* 進行中はプログレスバー分の高さを追加 */
  .village-wrapper.village-in-progress {
    padding-bottom: calc(100px + env(safe-area-inset-bottom));
  }
}
/* PC版: 進行中はプログレスバー固定表示分の余白を追加 */
@media (min-width: 768px) {
  .village-wrapper.village-in-progress {
    padding-bottom: calc(50px + env(safe-area-inset-bottom));
  }
}

/* X(Twitter) シェアボタン: deep を base に + 微 blood で温度を持たせる（X ロゴ自体は黒地イメージを継承） */
.x-share-link {
  background-color: var(--color-deep);
  color: var(--color-bone);
  border: 1px solid var(--color-line-bright);
  transition:
    background-color 150ms ease,
    border-color 150ms ease;
}
.x-share-link:hover {
  background-color: color-mix(in srgb, var(--color-wine) 35%, var(--color-deep));
  border-color: var(--color-blood-deep);
}

/* モバイルのセクションナビ */
.village-nav-btn {
  flex: 1;
  padding: 0.5rem 0;
  font-size: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.25rem;
  color: var(--color-fg-secondary);
  border-top: 2px solid transparent;
  transition:
    color 150ms ease,
    background-color 150ms ease,
    border-color 150ms ease;
}
.village-nav-btn:hover {
  background-color: var(--color-elev);
}
.village-nav-btn.is-active {
  color: var(--color-blood);
  border-top-color: var(--color-blood);
}
</style>
