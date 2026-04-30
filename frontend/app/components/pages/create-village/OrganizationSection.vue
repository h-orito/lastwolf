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
        :error="!!errors.organization"
      />
      <template v-if="errors.organization" #error>
        {{ errors.organization }}
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

interface FormData {
  organization: string;
  availableDummySkill: boolean;
  availableSkillRequest: boolean;
}

interface Props {
  form: FormData;
  errors: Partial<Record<keyof FormData, string>>;
}

defineProps<Props>();
</script>
