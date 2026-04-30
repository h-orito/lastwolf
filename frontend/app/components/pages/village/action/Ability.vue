<template>
  <div>
    <hr class="border-gray-200 my-2" />
    <p class="mb-2 font-bold">能力行使</p>
    <p class="mb-2">
      <span v-for="(line, idx) in abilityMessageLines" :key="idx">
        <!-- eslint-disable-next-line vue/no-v-html -->
        <span v-html="line" /><br />
      </span>
    </p>

    <div class="mb-2">
      <label class="block text-xs mb-1">対象</label>
      <div class="flex gap-1">
        <UiFormSelect
          v-model="participantId"
          :options="targetOptions"
          placeholder="選択してください"
          class="flex-1"
        />
        <button
          class="px-2 py-1 text-sm bg-[#3991f4] text-white rounded hover:bg-[#2c7ae0] whitespace-nowrap"
          @click="openSelectModal"
        >
          画像で選択
        </button>
      </div>
    </div>

    <UiButton button-type="primary" :disabled="!canSubmit || submitting" @click="confirmSetAbility">
      {{ abilityButtonString }}
    </UiButton>

    <!-- 参加者選択モーダル -->
    <UiModal v-model="isOpenSelectModal" title="画像から選択">
      <div class="flex flex-wrap">
        <div
          v-for="p in targetList"
          :key="p.id"
          class="text-center border border-gray-200 rounded-2xl p-1 m-1 w-40 cursor-pointer hover:border-[#3991f4] hover:font-bold text-xs"
          @click="selectParticipant(p.id)"
        >
          <img
            :src="p.chara.image.image_url"
            :alt="p.chara.name.name"
            :class="p.dead ? 'opacity-30' : ''"
            class="mx-auto"
          />
          <p :style="charaNameStyle(p)">{{ p.chara.name.name }}</p>
          <p v-if="p.dead" class="text-red-600">
            {{ `${p.dead.village_day.day}d${p.dead.reason}` }}
          </p>
        </div>
      </div>
    </UiModal>

    <!-- 確認ダイアログ -->
    <UiModal v-model="isConfirmOpen" title="確認">
      <p>対象は{{ confirmTargetName }}でよろしいですか？</p>
      <template #footer>
        <button
          class="px-3 py-1 text-sm bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
          @click="isConfirmOpen = false"
        >
          キャンセル
        </button>
        <UiButton button-type="primary" @click="setAbility">
          {{ abilityButtonString }}
        </UiButton>
      </template>
    </UiModal>
  </div>
</template>

<script setup lang="ts">
import UiModal from "~/components/ui/modal/Modal.vue";
import UiButton from "~/components/ui/button/index.vue";
import UiFormSelect from "~/components/ui/form/FormSelect.vue";

import type { components } from "~/lib/api/schema";
import { getMessageColor } from "~/lib/api/message-color";

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

const abilityMessageLines = computed(() => {
  let message = "";
  const type = props.abilityType;
  if (type === "ATTACK") {
    message = "襲撃対象を選択してください。";
  } else if (type === "DIVINE") {
    message = "占う対象を選択してください。";
  } else if (type === "GUARD") {
    message = "護衛対象を選択してください。";
  }
  message += "\n一度決定すると取り消すことができないため注意してください。";
  if (type === "GUARD" && !village.value?.setting.rules.available_same_target_guard) {
    message += "\nまた、この村では、2日連続同じ対象を護衛できないため注意してください。";
  }
  if (type === "ATTACK") {
    message += "\n襲撃は誰か1人が行使すると他の人は操作不可能になります。\n";
  }
  message += "\n能力行使しなかった場合突然死するため、必ず能力を行使してください。";
  if (type === "ATTACK") {
    message += "\n襲撃は誰か1人が行使すれば全員突然死しません。";
  }
  return message.replace(/\n/gm, "<br>").split("<br>");
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

const charaNameStyle = (p: VillageParticipantView) => {
  if (!village.value) return {};
  const color = getMessageColor(village.value, p);
  return color ? { color } : {};
};

const openSelectModal = () => {
  isOpenSelectModal.value = true;
};

const selectParticipant = (id: number) => {
  participantId.value = id;
  isOpenSelectModal.value = false;
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
