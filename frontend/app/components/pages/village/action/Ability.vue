<template>
  <div>
    <hr class="border-line-soft my-2" />
    <p class="mb-2 font-bold text-fg">能力行使</p>
    <p class="mb-2 text-fg">
      <span v-for="(line, idx) in abilityMessageLines" :key="idx">
        <span :class="line.isWarning ? 'text-wolf' : ''">{{ line.text }}</span
        ><br />
      </span>
    </p>

    <div class="mb-2">
      <label class="block text-xs mb-1 text-fg">対象</label>
      <div class="flex gap-1">
        <UiFormSelect
          v-model="participantId"
          :options="targetOptions"
          placeholder="選択してください"
          class="flex-1"
        />
        <UiButton button-type="secondary" @click="openSelectModal">画像で選択</UiButton>
      </div>
    </div>

    <UiButton button-type="primary" :disabled="!canSubmit || submitting" @click="confirmSetAbility">
      {{ abilityButtonString }}
    </UiButton>

    <!-- 参加者選択モーダル -->
    <UiParticipantSelectModal
      v-model="isOpenSelectModal"
      :participants="targetList"
      @select="selectParticipant"
    />

    <!-- 確認ダイアログ -->
    <UiModal v-model="isConfirmOpen" title="確認">
      <p class="text-fg">対象は{{ confirmTargetName }}でよろしいですか？</p>
      <template #footer>
        <UiButton button-type="secondary" @click="isConfirmOpen = false">キャンセル</UiButton>
        <UiButton button-type="primary" @click="setAbility">
          {{ abilityButtonString }}
        </UiButton>
      </template>
    </UiModal>
  </div>
</template>

<script setup lang="ts">
import UiModal from "~/components/ui/modal/Modal.vue";
import UiParticipantSelectModal from "~/components/ui/chara-select/ParticipantSelectModal.vue";
import UiButton from "~/components/ui/button/index.vue";
import UiFormSelect from "~/components/ui/form/FormSelect.vue";

import type { components } from "~/lib/api/schema";
type SituationAsParticipantView = components["schemas"]["SituationAsParticipantView"];
type VillageView = components["schemas"]["VillageView"];
type VillageParticipantView = components["schemas"]["VillageParticipantView"];

interface Props {
  abilityType: string;
}

const props = defineProps<Props>();

const villageStore = useVillageStore();
const situation = computed(() => villageStore.situation as SituationAsParticipantView | null);
const village = computed(() => villageStore.village as VillageView | null);
const { apiCall } = useApi();
const toast = useToast();

const submitting = ref(false);
const participantId = ref<number | null>(null);
const isOpenSelectModal = ref(false);
const isConfirmOpen = ref(false);
const confirmTargetName = ref("");

const targetList = computed((): VillageParticipantView[] => {
  return (
    situation.value?.ability.list.find((a) => a.type.code === props.abilityType)?.target_list ?? []
  );
});

const targetOptions = computed(() => {
  return targetList.value.map((p) => ({
    label: p.chara.name.name,
    value: p.id,
  }));
});

const canSubmit = computed(() => participantId.value != null);

interface AbilityMessageLine {
  text: string;
  isWarning: boolean;
}

const abilityMessageLines = computed((): AbilityMessageLine[] => {
  const type = props.abilityType;
  const lines: AbilityMessageLine[] = [];

  if (type === "ATTACK") {
    lines.push({ text: "襲撃対象を選択してください。", isWarning: false });
  } else if (type === "DIVINE") {
    lines.push({ text: "占う対象を選択してください。", isWarning: false });
  } else if (type === "GUARD") {
    lines.push({ text: "護衛対象を選択してください。", isWarning: false });
  }
  lines.push({
    text: "一度決定すると取り消すことができないため注意してください。",
    isWarning: false,
  });
  if (type === "GUARD" && !village.value?.setting.rules.available_same_target_guard) {
    lines.push({
      text: "また、この村では、2日連続同じ対象を護衛できないため注意してください。",
      isWarning: false,
    });
  }
  if (type === "ATTACK") {
    lines.push({
      text: "襲撃は誰か1人が行使すると他の人は操作不可能になります。",
      isWarning: false,
    });
    lines.push({ text: "", isWarning: false });
  }
  lines.push({ text: "", isWarning: false });
  lines.push({
    text: "能力行使しなかった場合突然死するため、必ず能力を行使してください。",
    isWarning: true,
  });
  if (type === "ATTACK") {
    lines.push({ text: "襲撃は誰か1人が行使すれば全員突然死しません。", isWarning: false });
  }
  return lines;
});

const abilityButtonString = computed(() => {
  switch (props.abilityType) {
    case "ATTACK":
      return "襲う";
    case "DIVINE":
      return "占う";
    case "GUARD":
      return "護衛する";
    default:
      return "決定";
  }
});

const openSelectModal = () => {
  isOpenSelectModal.value = true;
};

const selectParticipant = (id: number) => {
  participantId.value = id;
};

const confirmSetAbility = () => {
  const target = targetList.value.find((p) => p.id === participantId.value);
  if (!target) return;
  confirmTargetName.value = target.chara.name.name;
  isConfirmOpen.value = true;
};

const setAbility = async () => {
  submitting.value = true;
  isConfirmOpen.value = false;
  try {
    await apiCall(`/village/${villageStore.villageId}/ability`, {
      method: "POST",
      body: {
        target_id: participantId.value,
        ability_type: props.abilityType,
      },
    });
  } catch (error: unknown) {
    const fetchError = error as { status?: number; data?: { message?: string } };
    if (fetchError.status === 404 && fetchError.data) {
      toast.add({ message: fetchError.data.message ?? "エラーが発生しました", type: "error" });
    }
  } finally {
    submitting.value = false;
  }
};
</script>
