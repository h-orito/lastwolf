<template>
  <section class="py-8 px-4">
    <div class="max-w-5xl mx-auto text-left">
      <!-- 戻るボタン -->
      <NuxtLink
        :to="{ path: '/village', query: { id: villageId } }"
        class="inline-flex items-center px-3 py-1.5 text-sm font-medium rounded bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors"
      >
        戻る
      </NuxtLink>

      <h1 class="text-lg font-bold mt-8 mb-6">村の設定を変更する</h1>

      <!-- 注意書き -->
      <div class="mb-4 bg-yellow-50 border border-yellow-200 rounded p-3 text-xs text-yellow-800">
        <ul class="list-disc pl-4 space-y-1">
          <li>参加パスワードが毎回空になるのでご注意ください。</li>
        </ul>
      </div>

      <!-- バリデーションエラー -->
      <div
        v-if="validationErrors.length > 0"
        class="mb-4 bg-red-50 border border-red-200 rounded p-3 text-xs text-red-700"
      >
        <ul class="list-disc pl-4 space-y-1">
          <li v-for="err in validationErrors" :key="err">{{ err }}</li>
        </ul>
      </div>

      <div v-if="loading" class="py-8 text-center text-gray-500 text-sm">読み込み中...</div>

      <div v-else class="text-sm space-y-6">
        <!-- 基本情報 -->
        <BasicInfoSection :form="basicForm" :errors="basicErrors" />

        <hr class="border-gray-200" />

        <!-- 編成 -->
        <OrganizationSection :form="organizationForm" :errors="organizationErrors" />

        <hr class="border-gray-200" />

        <!-- ルール -->
        <RuleSection :form="ruleForm" :errors="ruleErrors" />

        <hr class="border-gray-200" />

        <!-- 参加パスワード -->
        <JoinPasswordSection :form="joinPasswordForm" :errors="joinPasswordErrors" />

        <hr class="border-gray-200" />

        <!-- 確認ボタン -->
        <div class="flex justify-end">
          <UiButton
            button-type="primary"
            :disabled="confirming"
            :loading="confirming"
            @click="confirm"
          >
            確認画面へ
          </UiButton>
        </div>

        <!-- プレビューモーダル -->
        <PreviewModal
          v-model="isOpenConfirmModal"
          :param="registerParam"
          charachip-name=""
          dummy-chara-name=""
          save-label="設定を変更する"
          @create="modifySetting"
        />
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import UiButton from "~/components/ui/button/index.vue";

import BasicInfoSection from "~/components/pages/create-village/BasicInfoSection.vue";
import OrganizationSection from "~/components/pages/create-village/OrganizationSection.vue";
import RuleSection from "~/components/pages/create-village/RuleSection.vue";
import JoinPasswordSection from "~/components/pages/create-village/JoinPasswordSection.vue";
import PreviewModal from "~/components/pages/create-village/PreviewModal.vue";
import type { components } from "~/lib/api/schema";

type VillageView = components["schemas"]["VillageView"];

const meta = buildPageMeta({ title: "村設定変更" });
useSeoMeta(meta);

const route = useRoute();
const { apiCall } = useApi();
const { add: addToast } = useToast();

const villageId = computed(() => {
  const id = route.query.id;
  if (typeof id === "string") return parseInt(id, 10);
  return 0;
});

const loading = ref(true);
const confirming = ref(false);
const isOpenConfirmModal = ref(false);
const validationErrors = ref<string[]>([]);

// フォームデータ
const basicForm = reactive({
  villageName: "",
  startDatetime: (() => {
    const d = new Date();
    d.setDate(d.getDate() + 7);
    d.setHours(0, 0, 0, 0);
    const pad = (n: number) => String(n).padStart(2, "0");
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
  })(),
  noonSeconds: 3600,
  voteSeconds: 600,
  nightSeconds: 1200,
});

const organizationForm = reactive({
  organization: "村",
  availableDummySkill: false,
  availableSkillRequest: true,
});

const ruleForm = reactive({
  availableSameTargetGuard: true,
  firstDivineNowolf: false,
  creatorGameMaster: false,
  silentSeconds: 0,
});

const joinPasswordForm = reactive({
  joinPassword: "",
});

// エラー状態
const basicErrors = reactive<Partial<Record<string, string>>>({});
const charachipErrors = reactive<Partial<Record<string, string>>>({});
const organizationErrors = reactive<Partial<Record<string, string>>>({});
const ruleErrors = reactive<Partial<Record<string, string>>>({});
const joinPasswordErrors = reactive<Partial<Record<string, string>>>({});

// APIリクエストパラメータ
const registerParam = computed(() => {
  const startDatetime = basicForm.startDatetime.replace("T", "T") + ":00";
  return {
    village_name: basicForm.villageName,
    setting: {
      time: {
        start_datetime: startDatetime,
        noon_seconds: basicForm.noonSeconds,
        vote_seconds: basicForm.voteSeconds,
        night_seconds: basicForm.nightSeconds,
      },
      organization: {
        organization: organizationForm.organization,
      },
      charachip: {
        dummy_chara_id: 1, // 設定変更ではキャラチップは変更不可
        charachip_id: 1, // 設定変更ではキャラチップは変更不可
      },
      rule: {
        open_vote: true,
        available_skill_request: organizationForm.availableSkillRequest,
        open_skill_in_grave: false,
        visible_grave_message: false,
        available_suddenly_death: true,
        available_commit: true,
        available_dummy_skill: organizationForm.availableDummySkill,
        available_same_target_guard: ruleForm.availableSameTargetGuard,
        first_divine_nowolf: ruleForm.firstDivineNowolf,
        creator_game_master: ruleForm.creatorGameMaster,
        silent_seconds: ruleForm.silentSeconds === 0 ? null : ruleForm.silentSeconds,
        join_password: joinPasswordForm.joinPassword,
      },
    },
  };
});

// 村情報をAPIから取得してフォームに反映
const fetchAndResetForm = async () => {
  try {
    const village = await apiCall<VillageView>(`/village/${villageId.value}`);

    basicForm.villageName = village.name;

    const time = village.setting.time;
    basicForm.startDatetime = time.start_datetime.slice(0, 16);
    basicForm.noonSeconds = time.noon_seconds;
    basicForm.voteSeconds = time.vote_seconds;
    basicForm.nightSeconds = time.night_seconds;

    const orgs = village.setting.organizations.organization;
    organizationForm.organization = Object.values(orgs).join("\n");

    const rules = village.setting.rules;
    organizationForm.availableDummySkill = rules.available_dummy_skill;
    organizationForm.availableSkillRequest = rules.available_skill_request;
    ruleForm.availableSameTargetGuard = rules.available_same_target_guard;
    ruleForm.firstDivineNowolf = rules.first_divine_nowolf;
    ruleForm.creatorGameMaster = rules.creator_game_master;
    ruleForm.silentSeconds = rules.silent_seconds ?? 0;
    joinPasswordForm.joinPassword = "";
  } catch {
    addToast({ message: "村情報の取得に失敗しました。", type: "error" });
  }
};

// 確認（バリデーション）
const confirm = async () => {
  confirming.value = true;
  validationErrors.value = [];

  try {
    await apiCall(`/village/${villageId.value}/setting/confirm`, {
      method: "POST",
      body: registerParam.value,
    });
    isOpenConfirmModal.value = true;
  } catch (error) {
    const fetchError = error as {
      status?: number;
      data?: { status?: number; message?: string };
    };
    if (fetchError.data?.message) {
      validationErrors.value = fetchError.data.message.split("\n").filter((s) => s.length > 0);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
    addToast({ message: "エラーが発生しました。設定を確認してください。", type: "error" });
  } finally {
    confirming.value = false;
  }
};

// 設定を変更
const modifySetting = async () => {
  try {
    await apiCall(`/village/${villageId.value}/setting`, {
      method: "POST",
      body: registerParam.value,
    });
    window.location.href = `/village?id=${villageId.value}`;
  } catch {
    addToast({ message: "エラーが発生しました。設定を確認してください。", type: "error" });
  }
};

onMounted(async () => {
  loading.value = true;
  await fetchAndResetForm();
  loading.value = false;
});
</script>
