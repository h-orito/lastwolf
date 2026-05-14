<template>
  <div>
    <hr class="border-gray-200 my-2" />
    <p class="mb-2 font-bold">点呼</p>
    <p v-if="!rollcalling" class="mb-2">準備ができたら準備完了を押してください。</p>
    <p v-if="rollcalling" class="mb-2">他の方が準備完了するまでお待ちください。</p>
    <UiButton button-type="primary" @click="rollcall">
      {{ rollcalling ? "準備完了を取り消す" : "準備完了" }}
    </UiButton>
  </div>
</template>

<script setup lang="ts">
import UiButton from "~/components/ui/button/index.vue";

import type { components } from "~/lib/api/schema";

type SituationAsParticipantView = components["schemas"]["SituationAsParticipantView"];

const villageStore = useVillageStore();
const situation = computed(() => villageStore.situation as SituationAsParticipantView | null);
const { apiCall } = useApi();
const toast = useToast();

const rollcalling = computed(() => situation.value?.roll_call.done_roll_call ?? false);

const rollcall = async () => {
  try {
    const done = !rollcalling.value;
    await apiCall(`/village/${villageStore.villageId}/rollcall`, {
      method: "POST",
      body: { rollcall: done },
    });
    toast.add({
      message: done ? "準備完了しました" : "準備完了をキャンセルしました",
      type: "info",
    });
  } catch {
    // エラーは無視
  }
};
</script>
