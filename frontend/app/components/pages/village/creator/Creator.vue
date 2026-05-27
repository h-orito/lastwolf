<template>
  <div class="panel-compact text-fg text-xs mb-2">
    <div class="px-3 pt-2 pb-1.5 font-bold border-b border-line-soft">村建て機能</div>
    <div class="px-3 py-2">
      <!-- 村建て発言 -->
      <div v-if="canCreatorSay" class="mb-2">
        <strong class="block mb-1 text-fg">村建て発言</strong>
        <CreatorMessageInput ref="messageInputRef" v-model="message" />
        <div class="text-right mt-1">
          <UiButton button-type="primary" :disabled="!canSay" @click="say"> 発言 </UiButton>
        </div>
      </div>

      <!-- 設定変更 -->
      <div v-if="isPrologue" class="mb-2">
        <hr class="border-line-soft my-2" />
        <strong class="block mb-1 text-fg">設定変更</strong>
        <UiButton
          button-type="secondary"
          :to="{ path: '/village-setting', query: { id: village?.id } }"
        >
          村の設定を変更する
        </UiButton>
      </div>

      <!-- キック -->
      <div v-if="isPrologue" class="mb-2">
        <hr class="border-line-soft my-2" />
        <strong class="block mb-1 text-fg">キック</strong>
        <div class="flex gap-1">
          <UiFormSelect
            v-model="participantId"
            :options="participantOptions"
            :disabled="!canKick"
            placeholder="選択してください"
            class="flex-1"
          />
          <UiButton
            button-type="danger"
            :disabled="!canKick || !participantId"
            @click="confirmKick"
          >
            退村させる
          </UiButton>
        </div>
      </div>

      <!-- 点呼 -->
      <div v-if="isPrologue || isRollcalling" class="mb-2">
        <hr class="border-line-soft my-2" />
        <strong class="block mb-1 text-fg">点呼</strong>
        <p class="mb-1 text-fg">点呼を開始し、全員が点呼すると村を開始することができます。</p>
        <div class="flex gap-1">
          <UiButton button-type="primary" :disabled="!canStartRollcall" @click="startRollcall">
            点呼を開始する
          </UiButton>
          <UiButton button-type="danger" :disabled="!canCancelRollcall" @click="cancelRollcall">
            点呼を中止する
          </UiButton>
        </div>
      </div>

      <!-- 村の開始/廃村 -->
      <div v-if="isPrologue || isRollcalling">
        <hr class="border-line-soft my-2" />
        <strong class="block mb-1 text-fg">村の開始/廃村</strong>
        <p v-if="isRollcalling" class="mb-1 text-fg">{{ currentDoneRollcallCount }}</p>
        <div class="flex gap-1">
          <UiButton button-type="primary" :disabled="!canStartVillage" @click="startVillage">
            村を開始する
          </UiButton>
          <UiButton
            button-type="danger"
            :disabled="!canCancelVillage"
            @click="confirmCancelVillage"
          >
            廃村する（確認）
          </UiButton>
        </div>
      </div>
    </div>
  </div>

  <!-- キック確認ダイアログ -->
  <UiModal v-model="isKickConfirmOpen" title="キック確認">
    <p class="text-fg">本当に退村させますか？</p>
    <template #footer>
      <UiButton button-type="secondary" @click="isKickConfirmOpen = false">キャンセル</UiButton>
      <UiButton button-type="danger" @click="kick">キックする</UiButton>
    </template>
  </UiModal>

  <!-- 廃村確認ダイアログ -->
  <UiModal v-model="isCancelVillageConfirmOpen" title="廃村確認">
    <p class="text-fg">本当に廃村しますか？</p>
    <template #footer>
      <UiButton button-type="secondary" @click="isCancelVillageConfirmOpen = false">
        キャンセル
      </UiButton>
      <UiButton button-type="danger" @click="cancelVillage">廃村する</UiButton>
    </template>
  </UiModal>
</template>

<script setup lang="ts">
import UiModal from "~/components/ui/modal/Modal.vue";
import UiButton from "~/components/ui/button/index.vue";
import UiFormSelect from "~/components/ui/form/FormSelect.vue";

import CreatorMessageInput from "~/components/pages/village/creator/CreatorMessageInput.vue";
import type { components } from "~/lib/api/schema";
import { VILLAGE_STATUS } from "~/lib/api/village-status-constants";

type SituationAsParticipantView = components["schemas"]["SituationAsParticipantView"];
type VillageView = components["schemas"]["VillageView"];

const villageStore = useVillageStore();
const situation = computed(() => villageStore.situation as SituationAsParticipantView | null);
const village = computed(() => villageStore.village as VillageView | null);
const { apiCall } = useApi();
const toast = useToast();

const submitting = ref(false);
const participantId = ref<number | null>(null);
const message = ref("");
const isKickConfirmOpen = ref(false);
const isCancelVillageConfirmOpen = ref(false);

const messageInputRef = ref<{ isLengthOver: boolean } | null>(null);

const isPrologue = computed(() => village.value?.status.code === VILLAGE_STATUS.PROLOGUE);
const isRollcalling = computed(() => village.value?.status.code === VILLAGE_STATUS.ROLLCALLING);

const participantOptions = computed(() => {
  if (!village.value) return [];
  const dummyCharaId = village.value.setting.charachip.dummy_chara_id;
  return village.value.participants.member_list
    .filter((p) => p.chara.id !== dummyCharaId)
    .map((p) => ({ label: p.chara.name.name, value: p.id }));
});

const canKick = computed(() => situation.value?.creator.available_kick ?? false);
const canStartRollcall = computed(
  () => !submitting.value && (situation.value?.creator.available_start_roll_call ?? false),
);
const canCancelRollcall = computed(
  () => !submitting.value && (situation.value?.creator.available_cancel_roll_call ?? false),
);
const canStartVillage = computed(
  () => !submitting.value && (situation.value?.creator.available_start_village ?? false),
);
const canCancelVillage = computed(
  () => !submitting.value && (situation.value?.creator.available_cancel_village ?? false),
);
const canCreatorSay = computed(
  () => !submitting.value && (situation.value?.creator.available_creator_say ?? false),
);

const currentDoneRollcallCount = computed(() => {
  if (!village.value) return "";
  const max = village.value.participants.count - 1;
  const done = village.value.participants.member_list.filter((p) => p.done_roll_call).length;
  return `点呼済み ${done}/${max}`;
});

const isLengthOver = computed(() => messageInputRef.value?.isLengthOver ?? false);

const canSay = computed(() => {
  if (message.value == null || message.value.trim() === "") return false;
  return !isLengthOver.value;
});

const confirmKick = () => {
  isKickConfirmOpen.value = true;
};

const kick = async () => {
  submitting.value = true;
  isKickConfirmOpen.value = false;
  try {
    await apiCall(`/creator/village/${villageStore.villageId}/kick`, {
      method: "POST",
      body: { target_id: participantId.value },
    });
  } catch (error: unknown) {
    const fetchError = error as { status?: number; data?: { message?: string } };
    if (fetchError.status === 404 && fetchError.data) {
      toast.add({ message: fetchError.data.message ?? "エラーが発生しました", type: "error" });
    }
  } finally {
    submitting.value = false;
  }
};

const startRollcall = async () => {
  submitting.value = true;
  try {
    await apiCall(`/creator/village/${villageStore.villageId}/start-rollcall`, { method: "POST" });
  } catch (error: unknown) {
    const fetchError = error as { status?: number; data?: { message?: string } };
    if (fetchError.status === 404 && fetchError.data) {
      toast.add({ message: fetchError.data.message ?? "エラーが発生しました", type: "error" });
    }
  } finally {
    submitting.value = false;
  }
};

const cancelRollcall = async () => {
  submitting.value = true;
  try {
    await apiCall(`/creator/village/${villageStore.villageId}/cancel-rollcall`, { method: "POST" });
  } catch (error: unknown) {
    const fetchError = error as { status?: number; data?: { message?: string } };
    if (fetchError.status === 404 && fetchError.data) {
      toast.add({ message: fetchError.data.message ?? "エラーが発生しました", type: "error" });
    }
  } finally {
    submitting.value = false;
  }
};

const startVillage = async () => {
  submitting.value = true;
  try {
    await apiCall(`/creator/village/${villageStore.villageId}/start-village`, { method: "POST" });
  } catch (error: unknown) {
    const fetchError = error as { status?: number; data?: { message?: string } };
    if (fetchError.status === 404 && fetchError.data) {
      toast.add({ message: fetchError.data.message ?? "エラーが発生しました", type: "error" });
    }
  } finally {
    submitting.value = false;
  }
};

const confirmCancelVillage = () => {
  isCancelVillageConfirmOpen.value = true;
};

const cancelVillage = async () => {
  submitting.value = true;
  isCancelVillageConfirmOpen.value = false;
  try {
    await apiCall(`/creator/village/${villageStore.villageId}/cancel`, { method: "POST" });
  } catch (error: unknown) {
    const fetchError = error as { status?: number; data?: { message?: string } };
    if (fetchError.status === 404 && fetchError.data) {
      toast.add({ message: fetchError.data.message ?? "エラーが発生しました", type: "error" });
    }
  } finally {
    submitting.value = false;
  }
};

const say = async () => {
  try {
    await apiCall(`/creator/village/${villageStore.villageId}/say`, {
      method: "POST",
      body: { message: message.value },
    });
    message.value = "";
  } catch {
    toast.add({ message: "発言失敗", type: "error" });
  }
};
</script>
