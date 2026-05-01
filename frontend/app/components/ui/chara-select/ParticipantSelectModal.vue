<template>
  <BaseModal v-model="isOpen" title="画像から選択">
    <div class="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-5">
      <button
        v-for="p in participants"
        :key="p.id"
        type="button"
        class="flex flex-col items-center rounded-lg border border-gray-200 p-2 hover:border-blue-400 hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-colors"
        @click="selectParticipant(p)"
      >
        <img
          :src="p.chara.image.image_url"
          :alt="p.chara.name.name"
          :width="p.chara.image.width"
          :height="p.chara.image.height"
          :class="p.dead ? 'opacity-30' : ''"
          class="mb-1"
          loading="lazy"
        />
        <p class="text-center text-xs text-gray-700">{{ p.chara.name.name }}</p>
        <p v-if="p.dead" class="text-center text-xs text-red-600">
          {{ `${p.dead.village_day.day}d${p.dead.reason}` }}
        </p>
      </button>
    </div>
  </BaseModal>
</template>

<script setup lang="ts">
import BaseModal from "~/components/ui/modal/Modal.vue";
import type { components } from "~/lib/api/schema";

type VillageParticipantView = components["schemas"]["VillageParticipantView"];

const props = defineProps<{
  modelValue: boolean;
  participants: VillageParticipantView[];
}>();

const emit = defineEmits<{
  "update:modelValue": [value: boolean];
  select: [participantId: number];
}>();

const isOpen = computed({
  get: () => props.modelValue,
  set: (v) => emit("update:modelValue", v),
});

const selectParticipant = (p: VillageParticipantView) => {
  emit("select", p.id);
  isOpen.value = false;
};
</script>
