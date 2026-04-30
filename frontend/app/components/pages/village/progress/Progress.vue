<template>
  <div class="rounded bg-[#fafafa] text-xs mb-2">
    <div class="bg-[#363636] text-white px-3 py-2 rounded-t font-bold">進行</div>
    <div class="px-3 py-2">
      <ProgressBar ref="progressBarRef" />
      <CurrentSituation />
      <Myself />
      <Action />
      <hr class="border-gray-200 my-2" />
      <div class="text-right">
        <button
          class="px-3 py-1 text-xs bg-[#3991f4] text-white rounded hover:bg-[#2c7ae0]"
          @click="openVillageInfoModal"
        >
          村の設定を確認する
        </button>
      </div>
      <ModalVillageInfo
        v-model="isOpenVillageInfoModal"
        :charachip-name="charachipName"
        @close="closeVillageInfoModal"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import ProgressBar from "~/components/pages/village/progress/ProgressBar.vue";
import CurrentSituation from "~/components/pages/village/progress/CurrentSituation.vue";
import Myself from "~/components/pages/village/progress/Myself.vue";
import Action from "~/components/pages/village/action/Action.vue";
import ModalVillageInfo from "~/components/pages/village/progress/ModalVillageInfo.vue";
import type { components } from "~/lib/api/schema";

type VillageView = components["schemas"]["VillageView"];

const villageStore = useVillageStore();
const village = computed(() => villageStore.village as VillageView | null);
const { apiCall } = useApi();

const progressBarRef = ref<{ refreshTimer: () => void } | null>(null);
const isOpenVillageInfoModal = ref(false);
const charachipName = ref<string | null>(null);

const openVillageInfoModal = async () => {
  if (!charachipName.value && village.value) {
    const charachipId = village.value.setting.charachip.charachip_id;
    try {
      const charachip = await apiCall<{ name: string }>(`/charachip/${charachipId}`);
      charachipName.value = charachip.name;
    } catch {
      charachipName.value = null;
    }
  }
  isOpenVillageInfoModal.value = true;
};

const closeVillageInfoModal = () => {
  isOpenVillageInfoModal.value = false;
};

const refreshTimer = () => {
  progressBarRef.value?.refreshTimer();
};

defineExpose({ refreshTimer });
</script>
