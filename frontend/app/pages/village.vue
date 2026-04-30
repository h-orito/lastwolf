<template>
  <section class="py-2 px-2">
    <div class="text-xs text-left village-wrapper">
      <!-- 村名ヘッダー -->
      <div v-if="village" class="mb-2">
        <div class="flex items-center gap-2">
          <p class="flex-1 font-bold text-sm leading-6">{{ village.id }}. {{ village.name }}</p>
          <div>
            <a
              :href="`https://twitter.com/share?text=${encodeURIComponent(village.name)}`"
              class="twitter-share-button"
              data-hashtags="人狼_LASTWOLF"
              data-lang="ja"
              data-show-count="false"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src="https://platform.twitter.com/widgets/tweet_button.1730a52f0bbee52abe1d0df2f82afe5e.en.html"
                alt="Tweet"
                style="width: 61px; height: 20px"
              />
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
            <Progress ref="progressRef" />
          </div>
        </div>

        <!-- 右カラム: メッセージ + 村建て + デバッグ -->
        <div class="md:w-1/2" id="messages-area">
          <Messages ref="messagesRef" />
          <Creator v-if="isCreator" />
          <Debug v-if="isDebug" />
          <div class="text-right mt-2">
            <NuxtLink
              to="/"
              class="inline-block px-3 py-1 text-xs bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
            >
              トップページへ
            </NuxtLink>
          </div>
        </div>
      </div>

      <!-- 初日役職確認モーダル -->
      <ModalFirstDay v-model="isOpenFirstdayModal" @close="closeFirstdayModal" />
    </div>

    <!-- モバイル固定フッターボタン (md以上では非表示) -->
    <div
      class="fixed bottom-0 left-0 w-full flex border-t border-gray-300 bg-white z-50 md:hidden"
      style="padding-bottom: env(safe-area-inset-bottom)"
    >
      <button
        class="flex-1 py-2 text-xs flex items-center justify-center gap-1 border-t-2 transition-colors"
        :class="
          activeSection === 'participants'
            ? 'text-blue-600 border-blue-600'
            : 'text-gray-500 border-transparent hover:bg-gray-100'
        "
        @click="scrollToSection('#participants-area', 'participants')"
      >
        <UsersIcon class="h-4 w-4" />
        <span>参加者</span>
      </button>
      <button
        class="flex-1 py-2 text-xs flex items-center justify-center gap-1 border-t-2 transition-colors"
        :class="
          activeSection === 'progress'
            ? 'text-blue-600 border-blue-600'
            : 'text-gray-500 border-transparent hover:bg-gray-100'
        "
        @click="scrollToSection('#progress-area', 'progress')"
      >
        <ClockIcon class="h-4 w-4" />
        <span>進行</span>
      </button>
      <button
        class="flex-1 py-2 text-xs flex items-center justify-center gap-1 border-t-2 transition-colors"
        :class="
          activeSection === 'messages'
            ? 'text-blue-600 border-blue-600'
            : 'text-gray-500 border-transparent hover:bg-gray-100'
        "
        @click="scrollToSection('#messages-area', 'messages')"
      >
        <ChatBubbleOvalLeftEllipsisIcon class="h-4 w-4" />
        <span>チャット</span>
      </button>
    </div>
  </section>
</template>

<script setup lang="ts">
import { getDatabase, ref as dbRef, onValue, type Unsubscribe } from "firebase/database";
import Participants from "~/components/pages/village/participants/Participants.vue";
import Progress from "~/components/pages/village/progress/Progress.vue";
import Messages from "~/components/pages/village/message/Messages.vue";
import Creator from "~/components/pages/village/creator/Creator.vue";
import Debug from "~/components/pages/village/debug/Debug.vue";
import ModalFirstDay from "~/components/pages/village/day-change/ModalFirstDay.vue";
import { UsersIcon, ClockIcon, ChatBubbleOvalLeftEllipsisIcon } from "@heroicons/vue/24/outline";
import type { components } from "~/lib/api/schema";

definePageMeta({ layout: "default" });

type VillageView = components["schemas"]["VillageView"];
type SituationAsParticipantView = components["schemas"]["SituationAsParticipantView"];
type MessagesView = components["schemas"]["MessagesView"];
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
const pageTitle = computed(() => (village.value ? village.value.name : "村ページ"));
useSeoMeta(buildPageMeta({ title: pageTitle.value }));

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
const progressRef = ref<{ refreshTimer: () => void } | null>(null);
const messagesRef = ref<{ openLatestday: () => void } | null>(null);

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
): boolean => {
  // エピローグになった場合、夜時間のメッセージが読めるようになるので再読み込み
  if (latestDay.is_epilogue) return true;
  // 死亡した場合、呻きが読めるようになるので再読み込み
  if (myself?.dead?.village_day.id === latestDay.id) return true;
  return false;
};

const reloadMessageIfNeeded = async () => {
  const latestDay = villageStore.latestDay;
  if (!latestDay) return;
  const situation = villageStore.situation as SituationAsParticipantView | null;
  const myself = situation?.participate.myself ?? null;
  if (!shouldReloadMessage(latestDay, myself)) return;
  await fetchMessages();
};

// タイマー
let timer: ReturnType<typeof setInterval> | null = null;

const setTimer = () => {
  return setInterval(() => {
    progressRef.value?.refreshTimer();
  }, 1000);
};

// Firebase Realtime DB リスナー
let unsubscribeVillage: Unsubscribe | null = null;
let unsubscribeAbility: Unsubscribe | null = null;
let unsubscribeMessage: Unsubscribe | null = null;

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

// メッセージをAPIから取得
const fetchMessages = async (): Promise<void> => {
  try {
    const messages = await apiCall<MessagesView>(`/village/${villageId.value}/message-list`);
    messagesStore.saveMessages(messages);
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

  // メッセージ最新情報リスナー
  const messageRef = dbRef(db, `${vid}/message_latest/${uid}`);
  unsubscribeMessage = onValue(messageRef, async () => {
    await fetchMessages();
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

  // メッセージ初期取得
  await fetchMessages();

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
/* モバイル: プログレスバーを上部固定 */
@media (max-width: 767px) {
  .village-wrapper {
    padding-top: calc(50px + env(safe-area-inset-top));
    padding-bottom: calc(50px + env(safe-area-inset-bottom));
  }
}
</style>
