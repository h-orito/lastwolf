<template>
  <div class="space-y-4">
    <h2 class="text-base font-semibold">編成</h2>

    <!-- 注意書き -->
    <div class="bg-blue-50 border border-blue-200 rounded p-3 text-xs">
      <ul class="list-disc pl-4 space-y-1">
        <li>
          役職1文字略称は
          <NuxtLink to="/rule#skill" target="_blank" class="text-blue-600 hover:text-blue-800"
            >仕様</NuxtLink
          >を参照してください。
        </li>
        <li>ダミー役欠けなしの場合、村人を1名以上含めてください。</li>
        <li>ダミー役欠けありの場合、噛まれて死亡する役職を1名以上含めてください。</li>
        <li>狼系役職を1名以上含めてください。</li>
        <li>狼系役職が過半数を超えないようにしてください。</li>
        <li>最小で5人、最大で999人設定することができます。</li>
      </ul>
    </div>

    <!-- 編成入力 -->
    <UiFormFormGroup label="編成" required>
      <UiFormFormInput
        v-model="form.organization"
        type="text"
        placeholder="編成"
        :maxlength="999"
        required
        :error="!!displayOrganizationError"
      />
      <template v-if="displayOrganizationError" #error>
        {{ displayOrganizationError }}
      </template>
    </UiFormFormGroup>

    <!-- 役欠け -->
    <UiFormFormSwitch
      v-model="form.availableDummySkill"
      label="役欠け"
      description="ダミー役欠けをありにする"
    />

    <!-- 役職希望 -->
    <UiFormFormSwitch
      v-model="form.availableSkillRequest"
      label="役職希望"
      description="役職希望ありにする"
    />
  </div>
</template>

<script setup lang="ts">
import UiFormFormGroup from "~/components/ui/form/FormGroup.vue";
import UiFormFormInput from "~/components/ui/form/FormInput.vue";
import UiFormFormSwitch from "~/components/ui/form/FormSwitch.vue";
import type { components } from "~/lib/api/schema";

type Skill = components["schemas"]["Skill"];
type SkillsView = components["schemas"]["SkillsView"];

interface FormData {
  organization: string;
  availableDummySkill: boolean;
  availableSkillRequest: boolean;
}

interface Props {
  form: FormData;
  errors: Partial<Record<keyof FormData, string>>;
}

const props = defineProps<Props>();

const { apiCall } = useApi();

const skillShortNames = ref<string[]>([]);

onMounted(async () => {
  try {
    const data = await apiCall<SkillsView>("/skill/list");
    skillShortNames.value = data.list.map((s: Skill) => s.short_name);
  } catch {
    // スキル一覧取得失敗時はクライアントバリデーションをスキップ
  }
});

const localOrganizationError = computed(() => {
  const org = props.form.organization;

  if (!org) return "編成を入力してください";

  if (org.length < 5 || org.length > 999) return "最低5人、最大999人です";

  if (skillShortNames.value.length > 0) {
    const hasInvalid = org.split("").some((c) => !skillShortNames.value.includes(c));
    if (hasInvalid) return "不明な役職が存在しています";
  }

  if (!props.form.availableDummySkill && !org.includes("村")) {
    return "役欠けなしの場合村人を1名以上含めてください";
  }

  return null;
});

const displayOrganizationError = computed(
  () => localOrganizationError.value ?? props.errors.organization ?? null,
);
</script>
