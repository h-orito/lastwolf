<template>
  <div>
    <hr class="border-gray-200 my-2" />
    <p class="mb-2 font-bold">投票</p>
    <p class="mb-2">
      投票対象を選択してください。<br />全員が投票する前なら投票し直す事もできます。<br />投票しないと突然死するため、必ず投票してください。
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
          class="px-2 py-1 text-sm bg-[#3991f4] text-white rounded hover:bg-[#2c7ae0] whitespace-nowrap"
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
    <UiModal v-model="isOpenSelectModal" title="画像から選択">
      <div class="flex flex-wrap">
        <div
          v-for="p in targetList"
          :key="p.id"
          class="text-center border border-gray-200 rounded-2xl p-1 m-1 w-40 cursor-pointer hover:border-[#3991f4] hover:font-bold text-xs"
          @click="selectParticipant(p.id)"
        >
          <img
            :src="p.chara.image.image_url"
            :alt="p.chara.name.name"
            :class="p.dead ? 'opacity-30' : ''"
            class="mx-auto"
          />
          <p>{{ p.chara.name.name }}</p>
          <p v-if="p.dead" class="text-red-600">
            {{ `${p.dead.village_day.day}d${p.dead.reason}` }}
          </p>
        </div>
      </div>
    </UiModal>
  </div>
</template>

<script setup lang="ts">
import UiModal from "~/components/ui/modal/Modal.vue";
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
  isOpenSelectModal.value = false;
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
