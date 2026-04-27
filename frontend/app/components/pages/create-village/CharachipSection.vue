<template>
  <div class="rounded-lg bg-white p-6 shadow">
    <h2 class="mb-4 text-lg font-semibold">キャラチップ</h2>

    <Alert
      v-if="!props.readonlyMode"
      type="warning"
      icon="alert"
      description="村作成後は変更できません。"
      class="mb-4"
    />

    <!-- キャラチップ選択 -->
    <div class="mb-6">
      <label class="mb-2 block text-sm font-medium text-gray-700">
        使用するキャラチップ
        <span v-if="!props.readonlyMode" class="text-red-500">*</span>
      </label>
      <FormMultiSelect
        v-model="selectedCharachipIds"
        :options="charachips"
        value-attribute="id"
        label-attribute="name"
        class="w-full"
        :disabled="props.readonlyMode"
        :error="!props.readonlyMode && !!errors?.charachipIds"
        @change="onCharachipChange"
      />
      <p v-if="!props.readonlyMode && errors?.charachipIds" class="mt-1 text-xs text-red-600">
        {{ errors.charachipIds }}
      </p>
      <p v-else-if="!props.readonlyMode" class="mt-2 text-xs text-gray-500">
        複数のキャラチップを選択できます
      </p>
    </div>

    <!-- ダミーキャラ選択 -->
    <div class="mb-6">
      <label class="mb-2 block text-sm font-medium text-gray-700">
        ダミーキャラクター
        <span v-if="!props.readonlyMode" class="text-red-500">*</span>
      </label>
      <FormSelect
        v-model="selectedDummyCharaId"
        :options="charasSelectable"
        placeholder="ダミーキャラクターを選択"
        :disabled="props.readonlyMode || charas.length === 0"
        class="w-full"
        :error="!props.readonlyMode && !!errors?.dummyCharaId"
        @change="onDummyCharaChange"
      />
      <div v-if="!props.readonlyMode" class="mt-2 flex justify-end">
        <UiButton
          size="sm"
          color="primary"
          :disabled="charas.length === 0"
          @click="openCharaSelectModal"
        >
          画像から選ぶ
        </UiButton>
      </div>
      <p v-if="!props.readonlyMode && errors?.dummyCharaId" class="mt-1 text-xs text-red-600">
        {{ errors.dummyCharaId }}
      </p>
      <p v-else-if="!props.readonlyMode && charas.length === 0" class="mt-1 text-xs text-red-500">
        先にキャラチップを選択してください
      </p>
    </div>

    <!-- キャラ選択モーダル -->
    <CharaSelectModal
      v-if="!props.readonlyMode"
      :is-open="isCharaSelectModalOpen"
      :charas="charas"
      @select="handleCharaSelect"
      @close="isCharaSelectModalOpen = false"
    />
  </div>
</template>

<script setup lang="ts">
import Alert from "~/components/ui/feedback/Alert.vue";
import UiButton from "~/components/ui/button/index.vue";
import CharaSelectModal from "~/components/ui/chara-select/CharaSelectModal.vue";
import FormMultiSelect from "~/components/ui/form/FormMultiSelect.vue";
import FormSelect from "~/components/ui/form/FormSelect.vue";
import type { DeepReadonly } from "vue";
import type { CharachipView, CharachipsView, Chara } from "~/lib/api/types";
import type { CreateVillageFormData } from "./types";

// Props & Emits
const props = defineProps<{
  formData: CreateVillageFormData;
  errors?: Partial<Record<string, string | undefined>>;
  readonlyMode?: boolean;
}>();

const emit = defineEmits<{
  "update:field": [
    field: keyof CreateVillageFormData,
    value: CreateVillageFormData[keyof CreateVillageFormData],
  ];
  "validate:field": [field: keyof CreateVillageFormData];
}>();

// キャラチップ一覧
const charachips = ref<CharachipView[]>([]);
const charas = ref<Chara[]>([]);

// 選択されたキャラチップID
const selectedCharachipIds = computed({
  get: () => props.formData.charachipIds,
  set: (ids: (string | number)[]) => {
    const numericIds = ids.map((id) => Number(id));
    emit("update:field", "charachipIds", numericIds);
  },
});

// キャラチップ変更時の処理
const onCharachipChange = () => {
  validateField("charachipIds");
  loadCharasByCharachipIds(props.formData.charachipIds);
};

// ダミーキャラ候補
const charasSelectable = computed(() =>
  charas.value.map((c) => ({
    value: c.id,
    label: c.name.name,
  })),
);

// ダミーキャラ選択値（IDのみ）
const selectedDummyCharaId = computed({
  get: () => props.formData.dummyCharaId,
  set: (id: string | number | null | undefined) => {
    const numId = Number(id);
    emit("update:field", "dummyCharaId", numId);
  },
});

// ダミーキャラ変更時のバリデーション
const onDummyCharaChange = () => {
  validateField("dummyCharaId");
};

// フィールドバリデーション
const validateField = (field: keyof CreateVillageFormData) => {
  emit("validate:field", field);
};

// キャラ選択モーダル
const isCharaSelectModalOpen = ref(false);

const openCharaSelectModal = () => {
  isCharaSelectModalOpen.value = true;
};

const handleCharaSelect = (chara: DeepReadonly<Chara> | Chara) => {
  selectedDummyCharaId.value = chara.id;
  isCharaSelectModalOpen.value = false;
};

// キャッシュ付きAPI
const { fetchMasterWithCache } = useCachedApi();

const loadCharachips = async () => {
  try {
    const response = await fetchMasterWithCache<CharachipsView>(
      "charachip-list",
      "/charachip/list",
    );
    if (response) {
      charachips.value = response.list || [];
    }
  } catch (error) {
    console.error("Failed to load charachips:", error);
  }
};

// 選択されたキャラチップのキャラクター一覧を取得（charachip.chara_listから）
const loadCharasByCharachipIds = async (charachipIds: number[]) => {
  if (charachipIds.length === 0) {
    charas.value = [];
    return;
  }

  try {
    const selected = charachips.value.filter((c) => charachipIds.includes(c.id));
    charas.value = selected.flatMap((c) => c.chara_list);

    // 現在選択中のダミーキャラが存在しない場合は最初のキャラを選択
    const dummyCharaId = selectedDummyCharaId.value;
    if (!charas.value.some((c) => c.id === dummyCharaId)) {
      selectedDummyCharaId.value = charas.value[0]?.id || 0;
    }
  } catch (error) {
    console.error("Failed to load charas:", error);
  }
};

// 初期化
onMounted(async () => {
  await loadCharachips();
  await loadCharasByCharachipIds(props.formData.charachipIds);
});
</script>
