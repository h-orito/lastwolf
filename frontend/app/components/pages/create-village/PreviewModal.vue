<template>
  <UiModalModal v-model="isOpen" title="村作成確認" @close="close">
    <div class="text-sm">
      <div v-if="param" class="overflow-x-auto">
        <table class="w-full border-collapse bg-white">
          <thead>
            <tr class="bg-gray-100">
              <th class="border border-gray-300 px-3 py-2 text-left">設定</th>
              <th class="border border-gray-300 px-3 py-2 text-left"></th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="setting in settings"
              :key="setting.name"
              class="odd:bg-white even:bg-gray-50"
            >
              <td class="border border-gray-300 px-3 py-1 align-top font-medium">
                <div class="flex items-start gap-1">
                  <span>{{ setting.name }}</span>
                  <button
                    v-if="setting.description"
                    type="button"
                    class="text-gray-400 hover:text-gray-600 text-xs mt-0.5"
                    :title="setting.description"
                    @click="toggleDescription(setting.name)"
                  >
                    ?
                  </button>
                </div>
                <div
                  v-if="openDescriptions.has(setting.name) && setting.description"
                  class="mt-1 text-xs text-gray-500 whitespace-pre-line"
                >
                  {{ setting.description }}
                </div>
              </td>
              <td
                class="border border-gray-300 px-3 py-1"
                v-html="setting.value.replace(/\n/g, '<br />')"
              />
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <template #footer>
      <UiButtonIndex button-type="secondary" @click="close">戻る</UiButtonIndex>
      <UiButtonIndex
        button-type="primary"
        :disabled="submitting"
        :loading="submitting"
        @click="create"
      >
        {{ saveLabel }}
      </UiButtonIndex>
    </template>
  </UiModalModal>
</template>

<script setup lang="ts">
import UiModalModal from "~/components/ui/modal/Modal.vue";
import UiButtonIndex from "~/components/ui/button/index.vue";

interface Setting {
  name: string;
  value: string;
  description?: string;
}

interface VillageParam {
  village_name: string;
  setting: {
    time: {
      start_datetime: string;
      noon_seconds: number;
      vote_seconds: number;
      night_seconds: number;
    };
    organization: {
      organization: string;
    };
    charachip: {
      dummy_chara_id: number;
      charachip_id: number;
    };
    rule: {
      open_vote: boolean;
      available_skill_request: boolean;
      open_skill_in_grave: boolean;
      visible_grave_message: boolean;
      available_suddenly_death: boolean;
      available_commit: boolean;
      available_dummy_skill: boolean;
      available_same_target_guard: boolean;
      first_divine_nowolf: boolean;
      creator_game_master: boolean;
      silent_seconds: number | null;
      join_password: string;
    };
  };
}

interface Props {
  modelValue: boolean;
  param: VillageParam | null;
  charachipName: string;
  dummyCharaName: string;
  saveLabel: string;
}

const props = defineProps<Props>();
const emit = defineEmits<{
  "update:modelValue": [value: boolean];
  create: [];
}>();

const isOpen = computed({
  get: () => props.modelValue,
  set: (value: boolean) => emit("update:modelValue", value),
});

const submitting = ref(false);
const openDescriptions = ref<Set<string>>(new Set());

const toggleDescription = (name: string) => {
  const newSet = new Set(openDescriptions.value);
  if (newSet.has(name)) {
    newSet.delete(name);
  } else {
    newSet.add(name);
  }
  openDescriptions.value = newSet;
};

const settings = computed<Setting[]>(() => {
  if (!props.param) return [];

  const list: Setting[] = [];
  const p = props.param;

  list.push({ name: "村名", value: p.village_name });

  // 人数
  list.push({
    name: "人数",
    value: `${p.setting.organization.organization.length}人`,
    description: "この人数参加するとゲームを開始できます。\nダミーを含む人数です。",
  });

  // 時間
  const time = p.setting.time;
  const start = time.start_datetime.replace("T", " ").slice(0, 16);
  list.push({ name: "開始日時", value: start });
  list.push({
    name: "昼時間",
    value: `${time.noon_seconds}秒`,
    description: "投票先を決める議論時間です。",
  });
  list.push({
    name: "投票時間",
    value: `${time.vote_seconds}秒`,
    description: "投票する時間です。",
  });
  list.push({
    name: "夜時間",
    value: `${time.night_seconds}秒`,
    description: "能力者が能力を行使する時間です。",
  });

  // キャラチップ
  if (props.charachipName) {
    list.push({ name: "キャラチップ", value: props.charachipName });
    list.push({
      name: "ダミーキャラ",
      value: props.dummyCharaName,
      description:
        "最初に人狼に襲撃されるキャラです。\n1日目の人狼の襲撃はこのキャラに固定されます。",
    });
  }

  // 編成
  list.push({
    name: "編成",
    value: p.setting.organization.organization,
    description: "配役です。役職詳細は仕様ページを参照ください。",
  });

  // ルール
  const rule = p.setting.rule;
  list.push({
    name: "役職希望",
    value: rule.available_skill_request ? "有効" : "無効",
    description:
      "「有効」の場合、割り当てられる役職の希望を出すことができます（自分以外の希望は見られません）。\n他に誰も希望していなかった場合はその役職が割り当てられます。",
  });
  list.push({
    name: "ダミー役欠け",
    value: rule.available_dummy_skill ? "あり" : "なし",
    description:
      "「あり」の場合、ダミーキャラに村人以外の役職が割り当てられる可能性があります。\n「なし」の場合、必ず村人が割り当てられます。",
  });
  list.push({
    name: "連続護衛",
    value: rule.available_same_target_guard ? "あり" : "なし",
    description:
      "「あり」の場合、狩人が2日連続で同じ対象を護衛できます。\n「なし」の場合、前日護衛した対象を翌日護衛することはできません。",
  });
  list.push({
    name: "初日白通知",
    value: rule.first_divine_nowolf ? "あり" : "なし",
    description:
      "「あり」の場合、1日目夜の占いは人狼と妖狐以外からランダムで選択・行使されます。\n「なし」の場合、1日目夜も占い師が対象を選択して占うことができます。",
  });
  list.push({
    name: "GM制",
    value: rule.creator_game_master ? "あり" : "なし",
    description:
      "「あり」の場合、村作成者がGMとなり、進行中もプレイヤー情報、役職、発言を見ることができます。\n「なし」の場合、村作成者も一般視点となり、プレイヤーとして参加可能となります。",
  });
  list.push({
    name: "昼沈黙時間",
    value: rule.silent_seconds != null ? `${rule.silent_seconds}秒` : "なし",
    description: "設定した場合、昼時間の開始数秒間は発言できない状態になります。",
  });
  list.push({
    name: "入村パスワード",
    value: rule.join_password && rule.join_password.length > 0 ? rule.join_password : "なし",
    description: "「あり」の場合、参加する際にパスワード入力が必要になります。",
  });

  return list;
});

const close = () => {
  isOpen.value = false;
};

const create = async () => {
  submitting.value = true;
  emit("create");
  submitting.value = false;
};
</script>
