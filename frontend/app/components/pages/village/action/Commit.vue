<template>
  <div>
    <hr class="border-gray-200 my-2" />
    <p class="mb-2 font-bold">時短希望</p>
    <p class="mb-1">
      全員が時短希望すると残り時間が残っていても{{ nextNoonnight }}に進行できます。<br />
      全員が時短希望する前なら取り消す事もできます。
    </p>
    <p class="mb-2">
      あなたは時短を希望<strong>{{ isCurrentCommitting ? "しています" : "していません" }}</strong
      >。
    </p>
    <UiButton button-type="primary" :disabled="submitting" @click="setCommit">
      {{ isCurrentCommitting ? "時短希望を取り消す" : "時短希望する" }}
    </UiButton>
  </div>
</template>

<script setup lang="ts">
import UiButton from "~/components/ui/button/index.vue";

import type { components } from "~/lib/api/schema";

type SituationAsParticipantView = components["schemas"]["SituationAsParticipantView"];
type VillageDay = components["schemas"]["VillageDay"];

const villageStore = useVillageStore();
const situation = computed(() => villageStore.situation as SituationAsParticipantView | null);
const latestDay = computed(() => villageStore.latestDay as VillageDay | null);
const { apiCall } = useApi();
const toast = useToast();

const submitting = ref(false);

const nextNoonnight = computed(() => {
  const code = latestDay.value?.noon_night.code;
  return code === "NOON" ? "投票時間" : "議論時間";
});

const isCurrentCommitting = computed(() => {
  return situation.value?.commit.committing ?? false;
});

const setCommit = async () => {
  submitting.value = true;
  try {
    await apiCall(`/village/${villageStore.villageId}/commit`, {
      method: "POST",
      body: { commit: !isCurrentCommitting.value },
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
