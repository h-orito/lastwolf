<template>
  <section class="py-8 px-4">
    <div class="max-w-5xl mx-auto text-left">
      <h1 class="text-lg font-bold mt-8 mb-6">村を作成</h1>

      <!-- バリデーションエラー -->
      <div
        v-if="validationErrors.length > 0"
        class="mb-4 bg-red-50 border border-red-200 rounded p-3 text-xs text-red-700"
      >
        <ul class="list-disc pl-4 space-y-1">
          <li v-for="err in validationErrors" :key="err">{{ err }}</li>
        </ul>
      </div>

      <div class="text-sm space-y-6">
        <!-- 基本情報 -->
        <BasicInfoSection :form="basicForm" :errors="basicErrors" />

        <hr class="border-gray-200" />

        <!-- キャラチップ -->
        <CharachipSection
          :form="charachipForm"
          :errors="charachipErrors"
          :charachips="charachips"
          :charas="charas"
          @load-charas="loadCharasByCharachipId"
        />

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
          :charachip-name="charachipName"
          :dummy-chara-name="dummyCharaName"
          save-label="村を作成する"
          @create="createVillage"
        />
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import UiButton from "~/components/ui/button/index.vue";

import BasicInfoSection from "~/components/pages/create-village/BasicInfoSection.vue";
import CharachipSection from "~/components/pages/create-village/CharachipSection.vue";
import OrganizationSection from "~/components/pages/create-village/OrganizationSection.vue";
import RuleSection from "~/components/pages/create-village/RuleSection.vue";
import JoinPasswordSection from "~/components/pages/create-village/JoinPasswordSection.vue";
import PreviewModal from "~/components/pages/create-village/PreviewModal.vue";
import type { components } from "~/lib/api/schema";

type CharachipView = components["schemas"]["CharachipView"];
type CharachipsView = components["schemas"]["CharachipsView"];
type Chara = components["schemas"]["Chara"];

const meta = buildPageMeta({ title: "村作成" });
useSeoMeta(meta);

const { apiCall } = useApi();
const { add: addToast } = useToast();

// ローディング状態
const confirming = ref(false);
const isOpenConfirmModal = ref(false);
const validationErrors = ref<string[]>([]);

// キャラチップデータ
const charachips = ref<CharachipView[]>([]);
const charas = ref<Chara[]>([]);

// フォームデータ
const basicForm = reactive({
  villageName: "",
  startDatetime: (() => {
    const d = new Date();
    d.setHours(d.getHours() + 1);
    d.setMinutes(0, 0, 0);
    const pad = (n: number) => String(n).padStart(2, "0");
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
  })(),
  noonSeconds: 480,
  voteSeconds: 120,
  nightSeconds: 240,
});

const charachipForm = reactive({
  charachipId: 1,
  dummyCharaId: 1,
});

const organizationForm = reactive({
  organization: "狼狼狼狂狐占霊狩共共村村村村村村村",
  availableDummySkill: true,
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

// キャラチップ名（プレビュー用）
const charachipName = computed(() => {
  const c = charachips.value.find((ch: CharachipView) => ch.id === charachipForm.charachipId);
  return c ? c.name : "";
});

// ダミーキャラ名（プレビュー用）
const dummyCharaName = computed(() => {
  const c = charas.value.find((ch: Chara) => ch.id === charachipForm.dummyCharaId);
  return c ? c.name.name : "";
});

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
        dummy_chara_id: charachipForm.dummyCharaId,
        charachip_id: charachipForm.charachipId,
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

// キャラチップ一覧を取得
const loadCharachips = async () => {
  try {
    const data = await apiCall<CharachipsView>("/charachip/list");
    charachips.value = data.list;
    const firstCharachip = data.list[0];
    if (firstCharachip) {
      charachipForm.charachipId = firstCharachip.id;
      await loadCharasByCharachipId(firstCharachip.id);
    }
  } catch {
    console.error("キャラチップ一覧の取得に失敗しました");
  }
};

// キャラ一覧をキャラチップIDで取得
const loadCharasByCharachipId = async (charachipId: number) => {
  try {
    const data = await apiCall<CharachipView>(`/charachip/${charachipId}`);
    charas.value = data.chara_list;
    const firstChara = data.chara_list[0];
    if (firstChara) {
      charachipForm.dummyCharaId = firstChara.id;
    }
  } catch {
    console.error("キャラ一覧の取得に失敗しました");
  }
};

// 確認（バリデーション）
const confirm = async () => {
  confirming.value = true;
  validationErrors.value = [];

  try {
    await apiCall("/village/confirm", {
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

// 村を作成
const createVillage = async () => {
  try {
    const res = await apiCall<{ village_id: number }>("/village", {
      method: "POST",
      body: registerParam.value,
    });
    window.location.href = `/village?id=${res.village_id}`;
  } catch {
    addToast({ message: "エラーが発生しました。設定を確認してください。", type: "error" });
  }
};

onMounted(async () => {
  await loadCharachips();
});
</script>
