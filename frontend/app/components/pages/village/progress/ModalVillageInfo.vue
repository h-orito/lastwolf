<template>
  <UiModal v-model="isOpen" title="村の情報" @close="close">
    <div v-if="village" class="text-xs">
      <table class="w-full border-collapse">
        <thead>
          <tr class="bg-gray-100">
            <th class="border border-gray-300 px-3 py-2 text-left">設定</th>
            <th class="border border-gray-300 px-3 py-2 text-left">値</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(setting, idx) in settings" :key="idx" class="odd:bg-white even:bg-gray-50">
            <td class="border border-gray-300 px-3 py-1 align-top">
              <div class="flex items-center gap-1">
                <span>{{ setting.name }}</span>
                <button
                  v-if="setting.description"
                  class="text-gray-400 hover:text-gray-600 text-xs"
                  @click="toggleDescription(idx)"
                >
                  [?]
                </button>
              </div>
              <!-- 説明の展開 -->
              <div
                v-if="setting.description && openDescriptionIdx === idx"
                class="mt-1 text-gray-600 text-xs whitespace-pre-wrap"
              >
                {{ setting.description }}
              </div>
            </td>
            <!-- eslint-disable-next-line vue/no-v-html -->
            <td
              class="border border-gray-300 px-3 py-1"
              v-html="setting.value.replace(/\n/g, '<br />')"
            />
          </tr>
        </tbody>
      </table>
    </div>
    <template #footer>
      <button
        class="px-4 py-2 text-sm bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
        @click="close"
      >
        閉じる
      </button>
    </template>
  </UiModal>
</template>

<script setup lang="ts">
import UiModal from "~/components/ui/modal/Modal.vue";

import type { components } from "~/lib/api/schema";
import { VILLAGE_STATUS } from "~/lib/api/village-status-constants";

type VillageView = components["schemas"]["VillageView"];

interface Props {
  modelValue: boolean;
  charachipName?: string | null;
}

interface Emits {
  (e: "update:modelValue", value: boolean): void;
  (e: "close"): void;
}

const props = withDefaults(defineProps<Props>(), {
  charachipName: null,
});
const emit = defineEmits<Emits>();

const isOpen = computed({
  get: () => props.modelValue,
  set: (v: boolean) => emit("update:modelValue", v),
});

const villageStore = useVillageStore();
const village = computed(() => villageStore.village as VillageView | null);

const openDescriptionIdx = ref<number | null>(null);

const toggleDescription = (idx: number) => {
  openDescriptionIdx.value = openDescriptionIdx.value === idx ? null : idx;
};

interface Setting {
  name: string;
  value: string;
  description?: string | null;
}

const settings = computed((): Setting[] => {
  if (!village.value) return [];
  const list: Setting[] = [];

  list.push({
    name: "村の作成者",
    value: `@${village.value.creator_player.twitter_user_name}`,
    description: "村の作成者です。",
  });

  addCapacitySetting(list, village.value);
  addOrganizationSetting(list, village.value);
  addTimeSetting(list, village.value);
  if (props.charachipName) addCharachipSetting(list, village.value);
  addRuleSetting(list, village.value);
  addPasswordSetting(list, village.value);

  return list;
});

const addCapacitySetting = (list: Setting[], v: VillageView) => {
  if (v.status.code === VILLAGE_STATUS.PROLOGUE || v.status.code === VILLAGE_STATUS.CANCEL) {
    list.push({
      name: "人数",
      value: `${v.setting.capacity.min}人`,
      description: "この人数が集まると点呼や進行中に遷移できます。\nダミーを含む人数です。",
    });
  } else {
    list.push({ name: "人数", value: `${v.participants.count}人` });
  }
};

const addTimeSetting = (list: Setting[], v: VillageView) => {
  const timeSetting = v.setting.time;
  if (v.status.code === VILLAGE_STATUS.PROLOGUE) {
    list.push({ name: "開始予定日時", value: timeSetting.start_datetime });
  }
  list.push({
    name: "昼時間",
    value: `${timeSetting.noon_seconds}秒`,
    description: "議論時間です。",
  });
  list.push({
    name: "投票時間",
    value: `${timeSetting.vote_seconds}秒`,
    description: "投票時間です。",
  });
  list.push({
    name: "夜時間",
    value: `${timeSetting.night_seconds}秒`,
    description: "能力者が能力行使を行う時間です。",
  });
};

const addCharachipSetting = (list: Setting[], v: VillageView) => {
  if (!props.charachipName) return;
  list.push({ name: "キャラチップ", value: props.charachipName });
  const dummyMember = v.participants.member_list.find(
    (m) => m.chara.id === v.setting.charachip.dummy_chara_id,
  );
  if (dummyMember) {
    list.push({
      name: "ダミーキャラ",
      value: dummyMember.chara.name.name,
      description:
        "最初に人狼に襲撃されるキャラです。\n1日目の人狼の襲撃はこのキャラに固定されます。",
    });
  }
};

const addOrganizationSetting = (list: Setting[], v: VillageView) => {
  const org = v.setting.organizations.organization[v.setting.capacity.min];
  list.push({
    name: "編成",
    value: org ?? "",
    description: "この村の配役です。役職詳細は仕様ページを参照ください。",
  });
};

const addRuleSetting = (list: Setting[], v: VillageView) => {
  const rules = v.setting.rules;
  list.push({
    name: "役職希望",
    value: rules.available_skill_request ? "有効" : "無効",
    description:
      "「有効」の場合、割り当てられる役職の希望を出すことができます（自分以外の希望は見られません）。\n他に誰も希望していなかった場合はその役職が割り当てられます。",
  });
  list.push({
    name: "ダミー役欠け",
    value: rules.available_dummy_skill ? "あり" : "なし",
    description:
      "「あり」の場合、ダミーキャラに村人以外の役職が割り当てられる可能性があります。\n「なし」の場合、必ず村人が割り当てられます。",
  });
  list.push({
    name: "連続護衛",
    value: rules.available_same_target_guard ? "あり" : "なし",
    description:
      "「あり」の場合、狩人が2日連続で同じ対象を護衛できます。\n「なし」の場合、前日護衛した対象を翌日護衛することはできません。",
  });
  list.push({
    name: "初日白通知",
    value: rules.first_divine_nowolf ? "あり" : "なし",
    description:
      "「あり」の場合、1日目夜の占いは人狼と妖狐以外からランダムで選択・行使されます。\n「なし」の場合、1日目夜も占い師が対象を選択して占うことができます。",
  });
  list.push({
    name: "GM制",
    value: rules.creator_game_master ? "あり" : "なし",
    description:
      "「あり」の場合、村作成者がGMとなり、進行中もプレイヤー情報、役職、発言を見ることができます。\n「なし」の場合、村作成者も一般視点となり、プレイヤーとして参加可能となります。",
  });
  list.push({
    name: "昼沈黙時間",
    value: rules.silent_seconds != null ? `${rules.silent_seconds}秒` : "なし",
    description: "設定した場合、昼時間の開始数秒間は発言できない状態になります。",
  });
};

const addPasswordSetting = (list: Setting[], v: VillageView) => {
  list.push({
    name: "入村パスワード",
    value: v.setting.password.join_password_required ? "あり" : "なし",
    description: "「あり」の場合、参加する際にパスワード入力が必要になります。",
  });
};

const close = () => {
  emit("close");
  emit("update:modelValue", false);
};
</script>
