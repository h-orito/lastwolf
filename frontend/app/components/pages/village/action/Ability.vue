<template>
  <ActionPanel :title="ability.type.name" :panel-key="panelKey">
    <!-- 現在のセット先 -->
    <p class="text-sm text-gray-700 dark:text-gray-300">
      現在の{{ ability.type.name }}先: {{ currentTargetName }}
    </p>

    <!-- エラーメッセージ -->
    <div
      v-if="abilityError"
      class="rounded-md bg-red-50 p-3 text-sm text-red-700 dark:bg-red-900/20 dark:text-red-400"
    >
      {{ abilityError }}
    </div>

    <!-- ターゲット選択 -->
    <FormGroup label="対象">
      <FormSelect
        v-model="selectedTargetId"
        :options="targetOptions"
        :disabled="!canSelectTarget"
        placeholder="選択してください"
        size="sm"
      />
    </FormGroup>

    <!-- セットボタン -->
    <div class="flex justify-end">
      <UiButton :disabled="!canSubmit" :loading="submitting" @click="handleSetAbility">
        {{ ability.type.name }}セットする
      </UiButton>
    </div>
  </ActionPanel>
</template>

<script setup lang="ts">
import type { DeepReadonly } from "vue";
import ActionPanel from "./ActionPanel.vue";
import FormGroup from "~/components/ui/form/FormGroup.vue";
import FormSelect from "~/components/ui/form/FormSelect.vue";
import UiButton from "~/components/ui/button/index.vue";
import { useAbility } from "~/composables/village/action/useAbility";
import { useActionReset } from "~/composables/village/action/useActionReset";
import type { components } from "~/lib/api/schema";

type VillageAbilitySituationView = components["schemas"]["VillageAbilitySituationView"];

interface Props {
  ability: DeepReadonly<VillageAbilitySituationView> | VillageAbilitySituationView;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  complete: [abilityName: string];
}>();

// Composables
const { submitting, error: abilityError, setAbility, clearError } = useAbility();
const { onReset } = useActionReset();

// パネルキー（能力タイプコードを使用）
const panelKey = computed(() => `ability-${props.ability.type.code}`);

// 現在のターゲットの名前
const currentTargetName = computed(() => {
  return "なし";
});

// ターゲットリスト（セレクトボックス用）
const targetOptions = computed(() => {
  const options: Array<{ label: string; value: number | string }> = [];

  if (props.ability.available_no_target) {
    options.push({ label: "なし", value: "none" });
  }

  props.ability.target_list.forEach((p) => {
    options.push({
      label: p.chara.name.name,
      value: p.id,
    });
  });

  return options;
});

// 選択されたターゲットID
const selectedTargetId = ref<number | string | null>(
  props.ability.available_no_target ? "none" : null,
);

// ターゲット選択可能かどうか
const canSelectTarget = computed(() => {
  if (!props.ability.usable) return false;
  // ターゲットリストが空の場合は選択不可（Nuxt2版と同様）
  return props.ability.target_list.length > 0;
});

// 送信可能かどうか
const canSubmit = computed(() => {
  if (submitting.value) return false;
  if (!props.ability.usable) return false;
  // ターゲットリストが空の場合は送信不可（Nuxt2版と同様）
  if (props.ability.target_list.length === 0) return false;
  // 「なし」が許可されている場合は、ターゲット未選択でもOK
  if (props.ability.available_no_target) {
    return true;
  }
  // 「なし」が許可されていない場合は、ターゲットが選択されている必要がある
  return selectedTargetId.value != null && selectedTargetId.value !== "none";
});

// 能力セット実行
const handleSetAbility = async () => {
  if (!canSubmit.value) return;

  clearError();

  // 'none'の場合はnullとして送信
  const targetId =
    selectedTargetId.value === "none" ? null : (selectedTargetId.value as number | null);
  const success = await setAbility(props.ability.type.code, targetId);

  if (success) {
    emit("complete", props.ability.type.name);
  }
};

// リセット処理を登録
onReset(() => {
  clearError();
  selectedTargetId.value = props.ability.available_no_target ? "none" : null;
});
</script>
