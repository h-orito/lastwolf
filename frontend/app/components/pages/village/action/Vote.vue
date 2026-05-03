<template>
  <div>
    <hr class="border-gray-200 my-2" />
    <p class="mb-2 font-bold">投票</p>
    <p class="mb-2">
      投票対象を選択してください。<br />全員が投票する前なら投票し直す事もできます。<br /><span
        class="text-red-600"
        >投票しないと突然死するため、必ず投票してください。</span
      >
    </p>
    <p v-if="currentVoteTarget" class="mb-2">
      <strong>{{ currentVoteTarget }}</strong
      >に投票しています。
    </p>

    <div class="mb-2">
      <label class="block text-xs mb-1">対象</label>
      <div class="flex gap-1">
        <UiFormSelect
          v-model="participantId"
          :options="targetOptions"
          placeholder="選択してください"
          class="flex-1"
        />
        <button
          class="px-2 py-1 text-sm bg-gray-200 text-gray-700 rounded hover:bg-gray-300 active:bg-gray-400 whitespace-nowrap"
          @click="openSelectModal"
        >
          画像で選択
        </button>
      </div>
    </div>

    <UiButton button-type="primary" :disabled="!canSubmit || submitting" @click="setVote">
      投票する
    </UiButton>

    <!-- 参加者選択モーダル -->
    <UiParticipantSelectModal
      v-model="isOpenSelectModal"
      :participants="targetList"
      @select="selectParticipant"
    />
  </div>
</template>

<script setup lang="ts">
import UiParticipantSelectModal from "~/components/ui/chara-select/ParticipantSelectModal.vue";
import UiButton from "~/components/ui/button/index.vue";
import UiFormSelect from "~/components/ui/form/FormSelect.vue";

import type { components } from "~/lib/api/schema";

type SituationAsParticipantView = components["schemas"]["SituationAsParticipantView"];
type VillageParticipantView = components["schemas"]["VillageParticipantView"];

const villageStore = useVillageStore();
const situation = computed(() => villageStore.situation as SituationAsParticipantView | null);
const { apiCall } = useApi();
const toast = useToast();

const submitting = ref(false);
const participantId = ref<number | null>(situation.value?.vote.target?.id ?? null);
const isOpenSelectModal = ref(false);

const targetList = computed((): VillageParticipantView[] => {
  return situation.value?.vote.target_list ?? [];
});

const targetOptions = computed(() => {
  return targetList.value.map((p) => ({
    label: p.chara.name.name,
    value: p.id,
  }));
});

const canSubmit = computed(() => participantId.value != null);

const currentVoteTarget = computed(() => {
  return situation.value?.vote.target?.chara.name.name ?? "";
});

const openSelectModal = () => {
  isOpenSelectModal.value = true;
};

const selectParticipant = (id: number) => {
  participantId.value = id;
};

const setVote = async () => {
  submitting.value = true;
  try {
    await apiCall(`/village/${villageStore.villageId}/vote`, {
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
</script>
