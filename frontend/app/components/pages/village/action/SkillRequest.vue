<template>
  <div>
    <hr class="border-gray-500 my-2" />
    <p class="mb-2 font-bold">役職希望</p>
    <p class="mb-2">
      役職希望を変更することができます。<br />現在の希望は<strong> {{ currentRequest }} </strong
      >です。
    </p>

    <div v-if="situation?.skill_request.available_skill_request" class="mb-2">
      <label class="block text-xs mb-1">役職第1希望</label>
      <UiFormSelect v-model="firstRequestSkillCode" :options="skillOptions" />
    </div>
    <div v-if="situation?.skill_request.available_skill_request" class="mb-2">
      <label class="block text-xs mb-1">役職第2希望</label>
      <UiFormSelect v-model="secondRequestSkillCode" :options="skillOptions" />
    </div>

    <UiButton button-type="primary" :disabled="!canSubmit || submitting" @click="change">
      変更する
    </UiButton>
  </div>
</template>

<script setup lang="ts">
import UiButton from "~/components/ui/button/index.vue";
import UiFormSelect from "~/components/ui/form/FormSelect.vue";

import type { components } from "~/lib/api/schema";

type SituationAsParticipantView = components["schemas"]["SituationAsParticipantView"];

const villageStore = useVillageStore();
const situation = computed(() => villageStore.situation as SituationAsParticipantView | null);
const { apiCall } = useApi();

const submitting = ref(false);
const firstRequestSkillCode = ref<string>(
  situation.value?.skill_request.skill_request?.first.code ?? "LEFTOVER",
);
const secondRequestSkillCode = ref<string>(
  situation.value?.skill_request.skill_request?.second.code ?? "LEFTOVER",
);

const skillOptions = computed(() => {
  return (
    situation.value?.skill_request.selectable_skill_list.map((s) => ({
      label: s.name,
      value: s.code,
    })) ?? []
  );
});

const canSubmit = computed(() => {
  return firstRequestSkillCode.value != null && secondRequestSkillCode.value != null;
});

const currentRequest = computed(() => {
  const req = situation.value?.skill_request.skill_request;
  if (!req) return "";
  return `${req.first.name} / ${req.second.name}`;
});

const change = async () => {
  submitting.value = true;
  try {
    await apiCall(`/village/${villageStore.villageId}/change-skill`, {
      method: "POST",
      body: {
        first_request_skill: firstRequestSkillCode.value,
        second_request_skill: secondRequestSkillCode.value,
      },
    });
    location.reload();
  } catch {
    // エラーは無視
  } finally {
    submitting.value = false;
  }
};
</script>
