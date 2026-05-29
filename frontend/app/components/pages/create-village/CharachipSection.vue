<template>
  <div class="space-y-4">
    <h2 class="doc-section-heading">キャラチップ</h2>

    <!-- キャラチップ選択 -->
    <UiFormFormGroup label="キャラチップ" required>
      <UiFormSelect
        v-model="form.charachipId"
        :options="charachipOptions"
        :error="!!errors.charachipId"
        @change="onCharachipChange"
      />
      <template v-if="errors.charachipId" #error>
        {{ errors.charachipId }}
      </template>
    </UiFormFormGroup>

    <!-- ダミーキャラ選択 -->
    <div>
      <UiFormFormGroup label="ダミーキャラ" required>
        <UiFormSelect
          v-model="form.dummyCharaId"
          :options="charaOptions"
          :error="!!errors.dummyCharaId"
        />
        <template v-if="errors.dummyCharaId" #error>
          {{ errors.dummyCharaId }}
        </template>
      </UiFormFormGroup>
      <div class="mt-2 flex justify-end">
        <UiButton
          button-type="secondary"
          :disabled="charas.length === 0"
          @click="isCharaSelectModalOpen = true"
        >
          画像から選ぶ
        </UiButton>
      </div>
    </div>

    <!-- キャラ選択モーダル -->
    <UiCharaSelectCharaSelectModal
      v-model="isCharaSelectModalOpen"
      :charas="charas"
      @select="onCharaSelect"
    />
  </div>
</template>

<script setup lang="ts">
import UiButton from "~/components/ui/button/index.vue";
import UiFormSelect from "~/components/ui/form/FormSelect.vue";

import type { components } from "~/lib/api/schema";
import UiFormFormGroup from "~/components/ui/form/FormGroup.vue";
import UiCharaSelectCharaSelectModal from "~/components/ui/chara-select/CharaSelectModal.vue";

type CharachipView = components["schemas"]["CharachipView"];
type Chara = components["schemas"]["Chara"];

interface CharachipOption {
  label: string;
  value: number;
}

interface CharaOption {
  label: string;
  value: number;
}

interface FormData {
  charachipId: number;
  dummyCharaId: number;
}

interface Props {
  form: FormData;
  errors: Partial<Record<keyof FormData, string>>;
  charachips: CharachipView[];
  charas: Chara[];
}

const props = defineProps<Props>();
const emit = defineEmits<{
  "load-charas": [charachipId: number];
}>();

const isCharaSelectModalOpen = ref(false);

const charachipOptions = computed<CharachipOption[]>(() => {
  return props.charachips.map((c: CharachipView) => ({
    label: c.name,
    value: c.id,
  }));
});

const charaOptions = computed<CharaOption[]>(() => {
  return props.charas.map((c: Chara) => ({
    label: c.name.name,
    value: c.id,
  }));
});

const onCharachipChange = () => {
  emit("load-charas", props.form.charachipId);
};

const onCharaSelect = (chara: Chara) => {
  props.form.dummyCharaId = chara.id;
};
</script>
