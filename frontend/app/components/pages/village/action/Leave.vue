<template>
  <div>
    <hr class="border-gray-500 my-2" />
    <p class="mb-2 font-bold">退村</p>
    <p class="mb-2">参加を取りやめたい場合は退村することができます。</p>
    <UiButtonIndex button-type="danger" @click="confirmLeave">退村する</UiButtonIndex>

    <!-- 確認ダイアログ -->
    <UiModalModal v-model="isConfirmOpen" title="退村確認">
      <p>本当に退村しますか？</p>
      <template #footer>
        <button
          class="px-4 py-2 text-sm bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
          @click="isConfirmOpen = false"
        >
          キャンセル
        </button>
        <UiButtonIndex button-type="danger" @click="leave">退村する</UiButtonIndex>
      </template>
    </UiModalModal>
  </div>
</template>

<script setup lang="ts">
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
