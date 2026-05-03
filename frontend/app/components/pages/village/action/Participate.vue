<template>
  <div>
    <hr class="border-gray-200 my-2" />
    <p class="mb-2 font-bold">参加</p>
    <p class="mb-2">あなたはこの村に参加できます。</p>

    <!-- キャラクター選択 -->
    <div class="mb-2">
      <label class="block text-xs mb-1">キャラクター</label>
      <div class="flex gap-1">
        <UiFormSelect
          v-model="charaId"
          :options="charaOptions"
          placeholder="選択してください"
          class="flex-1"
        />
        <button
          class="px-2 py-1 text-sm bg-gray-200 text-gray-700 rounded hover:bg-gray-300 active:bg-gray-400 whitespace-nowrap"
          @click="openCharaModal"
        >
          画像で選択
        </button>
      </div>
    </div>

    <!-- 役職希望 -->
    <div v-if="situation?.skill_request.available_skill_request" class="mb-2">
      <label class="block text-xs mb-1">役職第1希望</label>
      <UiFormSelect v-model="firstRequestSkillCode" :options="skillOptions" />
    </div>
    <div v-if="situation?.skill_request.available_skill_request" class="mb-2">
      <label class="block text-xs mb-1">役職第2希望</label>
      <UiFormSelect v-model="secondRequestSkillCode" :options="skillOptions" />
    </div>

    <!-- 入村パスワード -->
    <div v-if="requiredJoinPassword" class="mb-2">
      <label class="block text-xs mb-1">入村パスワード</label>
      <input
        v-model="joinPassword"
        type="text"
        class="w-full border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:border-[#3991f4] bg-white"
      />
    </div>

    <UiButton button-type="primary" :disabled="!canSubmit || submitting" @click="participate">
      入村する
    </UiButton>

    <!-- キャラ選択モーダル -->
    <UiCharaSelectModal
      v-model="isCharaSelectModalOpen"
      :charas="situation?.participate.selectable_chara_list ?? []"
      @select="charaSelect"
    />
  </div>
</template>

<script setup lang="ts">
import UiCharaSelectModal from "~/components/ui/chara-select/CharaSelectModal.vue";
import UiButton from "~/components/ui/button/index.vue";
import UiFormSelect from "~/components/ui/form/FormSelect.vue";

import type { components } from "~/lib/api/schema";

type SituationAsParticipantView = components["schemas"]["SituationAsParticipantView"];
type VillageView = components["schemas"]["VillageView"];
type Chara = components["schemas"]["Chara"];

const villageStore = useVillageStore();
const situation = computed(() => villageStore.situation as SituationAsParticipantView | null);
const village = computed(() => villageStore.village as VillageView | null);
const { apiCall } = useApi();
const toast = useToast();

const submitting = ref(false);
const charaId = ref<number | null>(null);
const firstRequestSkillCode = ref<string>(
  situation.value?.skill_request.skill_request?.first.code ?? "LEFTOVER",
);
const secondRequestSkillCode = ref<string>(
  situation.value?.skill_request.skill_request?.second.code ?? "LEFTOVER",
);
const joinPassword = ref("");
const isCharaSelectModalOpen = ref(false);

const charaOptions = computed(() => {
  return (
    situation.value?.participate.selectable_chara_list.map((c) => ({
      label: c.name.name,
      value: c.id,
    })) ?? []
  );
});

const skillOptions = computed(() => {
  return (
    situation.value?.skill_request.selectable_skill_list.map((s) => ({
      label: s.name,
      value: s.code,
    })) ?? []
  );
});

const requiredJoinPassword = computed(() => {
  return village.value?.setting.password.join_password_required ?? false;
});

const canSubmit = computed(() => {
  return (
    charaId.value != null &&
    firstRequestSkillCode.value != null &&
    secondRequestSkillCode.value != null
  );
});

const participate = async () => {
  submitting.value = true;
  try {
    await apiCall(`/village/${villageStore.villageId}/participate`, {
      method: "POST",
      body: {
        chara_id: charaId.value,
        first_request_skill: firstRequestSkillCode.value,
        second_request_skill: secondRequestSkillCode.value,
        join_password: joinPassword.value,
      },
    });
    location.reload();
  } catch (error: unknown) {
    const fetchError = error as { status?: number; data?: { message?: string } };
    if (fetchError.status === 404 && fetchError.data) {
      toast.add({ message: fetchError.data.message ?? "エラーが発生しました", type: "error" });
    }
  } finally {
    submitting.value = false;
  }
};

const openCharaModal = () => {
  isCharaSelectModalOpen.value = true;
};

const charaSelect = (chara: Chara) => {
  charaId.value = chara.id;
};
</script>
