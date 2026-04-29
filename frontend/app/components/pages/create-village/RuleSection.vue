<template>
  <div class="space-y-4">
    <h2 class="text-base font-semibold">詳細ルール</h2>

    <!-- 注意書き -->
    <div class="bg-blue-50 border border-blue-200 rounded p-3 text-xs">
      <ul class="list-disc pl-4 space-y-1">
        <li>
          初日白通知の場合、初日の占いのみ人狼と妖狐以外の役職からランダムで対象が選ばれます。
        </li>
      </ul>
    </div>

    <!-- 連続護衛 -->
    <UiFormFormSwitch
      v-model="form.availableSameTargetGuard"
      label="連続護衛"
      :description="
        form.availableSameTargetGuard ? '2日連続同一対象を護衛可能' : '前日護衛した人は護衛できない'
      "
    />

    <!-- 初日白通知 -->
    <UiFormFormSwitch
      v-model="form.firstDivineNowolf"
      label="初日白通知"
      :description="form.firstDivineNowolf ? '初日ランダム白占い' : '初日から占い対象を選択'"
    />

    <!-- GM制 -->
    <UiFormFormSwitch
      v-model="form.creatorGameMaster"
      label="GM制"
      :description="
        form.creatorGameMaster
          ? '村建てが神視点（全発言/役職確認可能）'
          : '村建てが一般視点で、自身も参加可能'
      "
    />

    <!-- 昼沈黙時間 -->
    <UiFormFormGroup label="昼沈黙時間（秒）">
      <UiFormFormNumber
        v-model="form.silentSeconds"
        :min="0"
        :max="20"
        :step="1"
        :error="!!errors.silentSeconds"
      />
      <template v-if="errors.silentSeconds" #error>
        {{ errors.silentSeconds }}
      </template>
    </UiFormFormGroup>
  </div>
</template>

<script setup lang="ts">
import UiFormFormGroup from "~/components/ui/form/FormGroup.vue";
import UiFormFormNumber from "~/components/ui/form/FormNumber.vue";
import UiFormFormSwitch from "~/components/ui/form/FormSwitch.vue";

interface FormData {
  availableSameTargetGuard: boolean;
  firstDivineNowolf: boolean;
  creatorGameMaster: boolean;
  silentSeconds: number;
}

interface Props {
  form: FormData;
  errors: Partial<Record<keyof FormData, string>>;
}

defineProps<Props>();
</script>
