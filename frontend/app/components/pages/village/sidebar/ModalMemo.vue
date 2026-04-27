<template>
  <Modal v-model="isModalOpen" title="メモ">
    <div class="space-y-4">
      <!-- 説明文 -->
      <p class="text-sm text-gray-600 dark:text-gray-400">
        端末に保存され、ブラウザのデータを削除すると消えます。<br />
        自動保存されないため、下部の保存ボタンの押し忘れにご注意ください。
      </p>

      <!-- タブ -->
      <div class="border-b border-gray-200 dark:border-gray-700">
        <nav class="-mb-px flex space-x-4" aria-label="Tabs">
          <button
            v-for="tab in tabs"
            :key="tab.id"
            type="button"
            class="border-b-2 px-3 py-2 text-sm font-medium whitespace-nowrap transition-colors"
            :class="[
              activeTab === tab.id
                ? 'border-(--ui-primary) text-(--ui-primary)'
                : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300',
              tab.disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer',
            ]"
            :disabled="tab.disabled"
            @click="!tab.disabled && (activeTab = tab.id)"
          >
            {{ tab.label }}
          </button>
        </nav>
      </div>

      <!-- メモ入力エリア -->
      <div class="space-y-2">
        <FormTextarea
          v-model="memoTexts[activeTab]"
          :rows="15"
          placeholder="1000文字まで保存できます。"
          size="sm"
        />
        <div class="flex items-center justify-between">
          <p
            class="text-right text-xs"
            :class="
              isCharExceeded ? 'text-red-600 dark:text-red-400' : 'text-gray-500 dark:text-gray-400'
            "
          >
            {{ counter }}
          </p>
          <UiButton color="primary" size="sm" @click="copyToClipboard">
            クリップボードにコピー
          </UiButton>
        </div>
      </div>
    </div>

    <template #footer>
      <UiButton color="secondary" variant="outline" @click="close"> 閉じる </UiButton>
      <UiButton color="primary" @click="save">保存する</UiButton>
      <UiButton color="primary" @click="saveAndClose">保存して閉じる</UiButton>
    </template>
  </Modal>
</template>

<script setup lang="ts">
import Modal from "~/components/ui/modal/Modal.vue";
import FormTextarea from "~/components/ui/form/FormTextarea.vue";
import UiButton from "~/components/ui/button/index.vue";
import { useVillage } from "~/composables/village/useVillage";
import { useVillageMemo } from "~/composables/village/useVillageMemo";
import { useToast } from "~/composables/useToast";

// Props
interface Props {
  isOpen: boolean;
}

const props = defineProps<Props>();

// Emits
const emit = defineEmits<{
  close: [];
}>();

// Types
type TabId = 1 | 2 | 3;

// Composables
const { villageId } = useVillage();
const { getMemo, saveMemo } = useVillageMemo();
const toast = useToast();

// State
const activeTab = ref<TabId>(1);
const memoTexts = reactive<Record<1 | 2 | 3, string>>({
  1: "",
  2: "",
  3: "",
});

// タブ定義
const tabs = [
  { id: 1 as const, label: "メモ1", disabled: false },
  { id: 2 as const, label: "メモ2", disabled: false },
  { id: 3 as const, label: "メモ3", disabled: false },
];

// Modal制御
const isModalOpen = computed({
  get: () => props.isOpen,
  set: (value) => {
    if (!value) {
      emit("close");
    }
  },
});

// 現在の文字数（改行を除く）
const currentCharCount = computed(() => {
  return memoTexts[activeTab.value].replace(/\n/g, "").length;
});

// 文字数超過判定
const isCharExceeded = computed(() => currentCharCount.value > 1000);

// 文字数カウンター（改行を除いた文字数）
const counter = computed(() => {
  const text = memoTexts[activeTab.value];
  const lineCount = text.split("\n").length;
  return `行数: ${lineCount}, 文字数: ${currentCharCount.value}/1000`;
});

// モーダル表示時にメモを読み込む
watch(
  () => props.isOpen,
  (isOpen) => {
    if (isOpen) {
      loadMemos();
    }
  },
);

/**
 * メモを読み込む
 */
const loadMemos = () => {
  if (!villageId.value) return;

  memoTexts[1] = getMemo(villageId.value, 1);
  memoTexts[2] = getMemo(villageId.value, 2);
  memoTexts[3] = getMemo(villageId.value, 3);
};

/**
 * メモを保存
 */
const save = () => {
  if (!villageId.value) return;

  saveMemo(villageId.value, 1, memoTexts[1]);
  saveMemo(villageId.value, 2, memoTexts[2]);
  saveMemo(villageId.value, 3, memoTexts[3]);

  toast.add({
    message: "メモを保存しました",
    type: "success",
  });
};

/**
 * メモを保存して閉じる
 */
const saveAndClose = () => {
  save();
  close();
};

/**
 * クリップボードにコピー（メモ1-3用）
 */
const copyToClipboard = async () => {
  try {
    await navigator.clipboard.writeText(memoTexts[activeTab.value]);
    toast.add({
      message: "クリップボードにコピーしました",
      type: "success",
    });
  } catch (err) {
    console.error("クリップボードへのコピーに失敗しました:", err);
    toast.add({
      message: "クリップボードへのコピーに失敗しました",
      type: "error",
    });
  }
};

/**
 * モーダルを閉じる
 */
const close = () => {
  emit("close");
};
</script>
