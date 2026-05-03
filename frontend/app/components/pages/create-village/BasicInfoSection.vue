<template>
  <div class="space-y-4">
    <!-- 村名 -->
    <UiFormFormGroup label="村名" required>
      <UiFormFormInput
        v-model="form.villageName"
        type="text"
        placeholder="村名"
        :maxlength="40"
        required
        :error="!!errors.villageName"
      />
      <template v-if="errors.villageName" #error>
        {{ errors.villageName }}
      </template>
    </UiFormFormGroup>

    <hr class="border-gray-200" />
    <h2 class="text-base font-semibold">時間</h2>

    <!-- 注意書き -->
    <div class="bg-blue-50 border border-blue-200 rounded p-3 text-xs">
      <ul class="list-disc pl-4 space-y-1">
        <li>開始は村建てによる操作でしか行えないため、開始予定日時は参加者への案内用です。</li>
      </ul>
    </div>

    <!-- 開始日時 -->
    <UiFormFormGroup label="開始予定日時" required>
      <input
        v-model="form.startDatetime"
        type="datetime-local"
        class="block w-full rounded border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-[#3991f4] focus:outline-none focus:ring-2 focus:ring-[#3991f4]/20"
        :min="minDatetime"
        required
      />
    </UiFormFormGroup>

    <!-- 昼時間 -->
    <UiFormFormGroup label="昼時間（秒）" required>
      <UiFormFormNumber
        v-model="form.noonSeconds"
        :min="180"
        :max="3600"
        :step="1"
        :error="!!errors.noonSeconds"
        required
      />
      <template v-if="errors.noonSeconds" #error>
        {{ errors.noonSeconds }}
      </template>
    </UiFormFormGroup>

    <!-- 投票時間 -->
    <UiFormFormGroup label="投票時間（秒）" required>
      <UiFormFormNumber
        v-model="form.voteSeconds"
        :min="60"
        :max="600"
        :step="1"
        :error="!!errors.voteSeconds"
        required
      />
      <template v-if="errors.voteSeconds" #error>
        {{ errors.voteSeconds }}
      </template>
    </UiFormFormGroup>

    <!-- 夜時間 -->
    <UiFormFormGroup label="夜時間（秒）" required>
      <UiFormFormNumber
        v-model="form.nightSeconds"
        :min="120"
        :max="1200"
        :step="1"
        :error="!!errors.nightSeconds"
        required
      />
      <template v-if="errors.nightSeconds" #error>
        {{ errors.nightSeconds }}
      </template>
    </UiFormFormGroup>
  </div>
</template>

<script setup lang="ts">
import UiFormFormGroup from "~/components/ui/form/FormGroup.vue";
import UiFormFormInput from "~/components/ui/form/FormInput.vue";
import UiFormFormNumber from "~/components/ui/form/FormNumber.vue";

interface FormData {
  villageName: string;
  startDatetime: string;
  noonSeconds: number;
  voteSeconds: number;
  nightSeconds: number;
}

interface Props {
  form: FormData;
  errors: Partial<Record<keyof FormData, string>>;
}

defineProps<Props>();

// 最小日時（現在時刻）
const minDatetime = computed(() => {
  const now = new Date();
  now.setSeconds(0, 0);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}T${pad(now.getHours())}:${pad(now.getMinutes())}`;
});
</script>
