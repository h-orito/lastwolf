<template>
  <div>
    <hr class="border-line-soft my-2" />
    <p class="mb-2 font-bold text-fg">退村</p>
    <p class="mb-2 text-fg">参加を取りやめたい場合は退村することができます。</p>
    <UiButton button-type="danger" @click="confirmLeave">退村する</UiButton>

    <!-- 確認ダイアログ -->
    <UiModal v-model="isConfirmOpen" title="退村確認">
      <p class="text-fg">本当に退村しますか？</p>
      <template #footer>
        <UiButton button-type="secondary" @click="isConfirmOpen = false">キャンセル</UiButton>
        <UiButton button-type="danger" @click="leave">退村する</UiButton>
      </template>
    </UiModal>
  </div>
</template>

<script setup lang="ts">
import UiModal from "~/components/ui/modal/Modal.vue";
import UiButton from "~/components/ui/button/index.vue";

const villageStore = useVillageStore();
const { apiCall } = useApi();
const toast = useToast();

const isConfirmOpen = ref(false);

const confirmLeave = () => {
  isConfirmOpen.value = true;
};

const leave = async () => {
  try {
    await apiCall(`/village/${villageStore.villageId}/leave`, { method: "POST" });
    toast.add({ message: "退村しました", type: "info" });
    isConfirmOpen.value = false;
    location.reload();
  } catch {
    // エラーは無視
  }
};
</script>
