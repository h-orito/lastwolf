<template>
  <Modal :model-value="isOpen" title="村作成確認" @close="handleClose">
    <div class="space-y-6">
      <!-- 設定一覧テーブル -->
      <div v-if="settings.length > 0" class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <tbody class="divide-y divide-gray-200 bg-white">
            <template v-for="(setting, index) in settings" :key="index">
              <tr class="hover:bg-gray-50">
                <td class="px-4 py-3 text-sm font-medium whitespace-nowrap text-gray-900">
                  {{ setting.name }}
                  <button
                    v-if="setting.description"
                    class="ml-1 text-blue-600 hover:text-blue-800"
                    @click="toggleDescription(index)"
                  >
                    <Icon name="i-heroicons-question-mark-circle" />
                  </button>
                </td>
                <td
                  class="px-4 py-3 text-sm text-gray-700"
                  v-html="setting.value.replace(/\n/g, '<br />')"
                />
              </tr>
              <tr v-show="expandedDescriptions[index]">
                <td colspan="2" class="bg-gray-50 px-4 py-3 text-sm text-gray-600">
                  <p v-html="setting.description?.replace(/\n/g, '<br />')"></p>
                </td>
              </tr>
            </template>
          </tbody>
        </table>
      </div>
    </div>

    <!-- モーダルフッターのアクションボタン -->
    <template #footer>
      <div class="flex justify-end gap-3">
        <button
          type="button"
          class="rounded-md bg-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-400 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:outline-none"
          @click="handleClose"
        >
          戻る
        </button>
        <button
          type="button"
          :disabled="isSubmitting"
          class="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:bg-gray-400"
          @click="handleCreate"
        >
          <span v-if="isSubmitting">作成中...</span>
          <span v-else>{{ saveLabel }}</span>
        </button>
      </div>
    </template>
  </Modal>
</template>

<script setup lang="ts">
import type { CreateVillageFormData } from "./types";
import type { Chara } from "~/lib/api/types";
import Icon from "~/components/ui/icon/Icon.vue";
import Modal from "~/components/ui/modal/Modal.vue";

interface Setting {
  name: string;
  value: string;
  description?: string;
}

interface Props {
  isOpen: boolean;
  formData: CreateVillageFormData;
  charachipName?: string;
  dummyChara?: Chara | null;
  saveLabel?: string;
  isSubmitting?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  charachipName: "",
  dummyChara: null,
  saveLabel: "村を作成する",
  isSubmitting: false,
});

const emit = defineEmits<{
  close: [];
  create: [];
}>();

// 説明文の展開状態を管理
const expandedDescriptions = ref<Record<number, boolean>>({});

// 設定一覧の生成
const settings = computed<Setting[]>(() => {
  const result: Setting[] = [];

  // 村名
  result.push({
    name: "村名",
    value: props.formData.villageName,
  });

  // 定員
  addCapacitySetting(result);

  // 時間設定
  addTimeSetting(result);

  // キャラチップ設定
  addCharachipSetting(result);

  // 編成設定
  addOrganizationSetting(result);

  // ルール設定
  addRuleSetting(result);

  // パスワード設定
  addPasswordSetting(result);

  return result;
});

// 定員設定の追加
const addCapacitySetting = (settings: Setting[]) => {
  settings.push({
    name: "最低人数",
    value: `${props.formData.capacityMin}人`,
    description:
      "開始予定日時時点でこの人数が集まると進行中に遷移します（集まらなければ廃村となります）。\nダミーを含む人数です。",
  });

  settings.push({
    name: "最大人数",
    value: `${props.formData.capacityMax}人`,
    description: "この人数まで参加することができます。\nダミーを含む人数です。",
  });
};

// 時間設定の追加
const addTimeSetting = (settings: Setting[]) => {
  const startDate = new Date(props.formData.startDatetime);
  const formattedDate = `${startDate.getFullYear()}-${String(startDate.getMonth() + 1).padStart(2, "0")}-${String(startDate.getDate()).padStart(2, "0")} ${String(startDate.getHours()).padStart(2, "0")}:${String(startDate.getMinutes()).padStart(2, "0")}`;

  settings.push({
    name: "開始日時",
    value: formattedDate,
  });

  settings.push({
    name: "更新間隔",
    value: "24時間",
    description: "実際にこの時間が経過すると村の1日が進行します。",
  });

  const silentHours =
    !props.formData.silentHours || props.formData.silentHours === 0
      ? "なし"
      : `${props.formData.silentHours}時間`;

  settings.push({
    name: "更新後沈黙時間",
    value: silentHours,
    description:
      "進行中の更新後に通常発言が不可能になる時間です。\nなしの場合はいつでも発言できます。\n通常発言以外（独り言や死者の呻き、人狼の囁き等）はいつでも発言できます。",
  });
};

// キャラチップ設定の追加
const addCharachipSetting = (settings: Setting[]) => {
  if (!props.charachipName) return;

  settings.push({
    name: "キャラチップ",
    value: props.charachipName,
  });

  if (props.dummyChara) {
    settings.push({
      name: "ダミーキャラ",
      value: props.dummyChara.name.name,
      description:
        "最初に人狼に襲撃されるキャラです。\n1日目の人狼の襲撃はこのキャラに固定されます。",
    });
  }
};

// 編成設定の追加
const addOrganizationSetting = (settings: Setting[]) => {
  const org = props.formData.organization;
  if (!org) return;

  // organizationは既に「10人：狼狼占霊狩狂村村村村」の形式で保存されているため、そのまま使用
  settings.push({
    name: "編成",
    value: org,
    description: "人数に応じた配役です。役職詳細は仕様ページを参照ください。",
  });
};

// ルール設定の追加
const addRuleSetting = (settings: Setting[]) => {
  const formData = props.formData;

  // 役職希望
  settings.push({
    name: "役職希望",
    value: formData.availableSkillRequest ? "有効" : "無効",
    description:
      "「有効」の場合、割り当てられる役職の希望を出すことができます（自分以外の希望は見られません）。\n他に誰も希望していなかった場合はその役職が割り当てられます。",
  });

  // 突然死
  settings.push({
    name: "突然死",
    value: formData.availableSuddenlyDeath ? "あり" : "なし",
    description:
      "「あり」の場合、日付更新のタイミングで、前日に一度も通常発言をしなかった生存者が突然死します。",
  });

  // 時短希望
  settings.push({
    name: "時短希望",
    value: formData.availableCommit ? "あり" : "なし",
    description:
      "「あり」の場合、生存者全員が時短を希望すると、日付が更新されます。\n時短により余った時間は翌日に繰り越されます。",
  });

  // 連続護衛
  settings.push({
    name: "連続護衛",
    value: formData.availableGuardSameTarget ? "可能" : "不可",
    description:
      "「可能」の場合、同じ人を2日連続で護衛することができます。\n「不可」の場合、同じ人を2日連続で護衛することができません。",
  });

  // 墓下公開
  settings.push({
    name: "墓下公開",
    value: formData.openSkillInGrave ? "あり" : "なし",
    description: "「あり」の場合、死亡した役職が墓下で公開されます。",
  });

  // 墓下見学会話公開
  settings.push({
    name: "墓下見学会話公開",
    value: formData.visibleGraveMessage ? "あり" : "なし",
    description: "「あり」の場合、進行中に生存者が死者の呻きや見学発言を参照できます。",
  });

  // ダミー役欠け
  settings.push({
    name: "ダミー役欠け",
    value: formData.availableDummySkill ? "あり" : "なし",
    description:
      "「あり」の場合、ダミーキャラに村人以外の役職が割り当てられる可能性があります。\n「なし」の場合、必ず村人が割り当てられます。",
  });
};

// パスワード設定の追加
const addPasswordSetting = (settings: Setting[]) => {
  settings.push({
    name: "入村パスワード",
    value:
      props.formData.joinPassword && props.formData.joinPassword.length > 0
        ? props.formData.joinPassword
        : "なし",
    description: "「あり」の場合、参加する際にパスワード入力が必要になります。",
  });
};

// 説明文の展開/折りたたみ
const toggleDescription = (index: number) => {
  expandedDescriptions.value[index] = !expandedDescriptions.value[index];
};

// モーダルを閉じる
const handleClose = () => {
  emit("close");
};

// 村を作成
const handleCreate = () => {
  emit("create");
};
</script>
