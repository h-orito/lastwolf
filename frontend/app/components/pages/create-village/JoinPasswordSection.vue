<template>
  <div class="space-y-4">
    <h2 class="doc-section-heading">参加パスワード</h2>

    <UiFormFormGroup label="参加パスワード（任意）">
      <UiFormFormInput
        v-model="form.joinPassword"
        type="text"
        placeholder="参加パスワード（任意）"
        :maxlength="20"
        :error="!!errors.joinPassword"
      />
      <template v-if="errors.joinPassword" #error>
        {{ errors.joinPassword }}
      </template>
    </UiFormFormGroup>
  </div>
</template>

<script setup lang="ts">
import UiFormFormGroup from "~/components/ui/form/FormGroup.vue";
import UiFormFormInput from "~/components/ui/form/FormInput.vue";

interface FormData {
  joinPassword: string;
}

interface Props {
  form: FormData;
  errors: Partial<Record<keyof FormData, string>>;
}

defineProps<Props>();
</script>
