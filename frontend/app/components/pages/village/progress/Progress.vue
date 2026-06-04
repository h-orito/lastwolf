<template>
  <div class="panel-compact text-fg text-xs mb-2">
    <div class="panel-compact-header">進行</div>
    <div class="px-3 py-2">
      <CurrentSituation />
      <Myself />
      <Action />
      <hr class="border-line-soft my-2" />
      <div class="text-right">
        <UiButton button-type="secondary" @click="openVillageInfoModal">
          村の設定を確認する
        </UiButton>
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
import CurrentSituation from "~/components/pages/village/progress/CurrentSituation.vue";
import Myself from "~/components/pages/village/progress/Myself.vue";
import Action from "~/components/pages/village/action/Action.vue";
import ModalVillageInfo from "~/components/pages/village/progress/ModalVillageInfo.vue";
import type { components } from "~/lib/api/schema";

type VillageView = components["schemas"]["VillageView"];

const villageStore = useVillageStore();
const village = computed(() => villageStore.village as VillageView | null);
const { apiCall } = useApi();

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
</script>
