<template>
  <div class="mb-2">
    <strong class="text-xs">{{ filteringStr }}</strong>
    <br />
    <div class="flex flex-wrap">
      <div
        v-for="participant in aliveParticipants"
        :key="participant.id"
        class="inline-block cursor-pointer relative mr-1 mb-1"
        @click="filter(participant.id)"
      >
        <img
          :src="participant.chara.image.image_url"
          :alt="participant.chara.name.name"
          :width="Math.floor(participant.chara.image.width * 0.67)"
          :height="Math.floor(participant.chara.image.height * 0.67)"
          class="align-top"
        />
        <p
          class="absolute bottom-0 w-full text-center text-white text-xs"
          style="background-color: rgba(51, 51, 51, 0.7)"
        >
          {{ `${messageCount(participant)}回` }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { components } from "~/lib/api/schema";

type VillageView = components["schemas"]["VillageView"];
type VillageParticipantView = components["schemas"]["VillageParticipantView"];
type VillageDay = components["schemas"]["VillageDay"];
type MessageView = components["schemas"]["MessageView"];

interface Props {
  day: VillageDay;
  filteringId: number | null;
}

interface Emits {
  (e: "filter", payload: { participantId: number }): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const villageStore = useVillageStore();
const village = computed(() => villageStore.village as VillageView | null);
const messagesStore = useMessagesStore();

const isNight = computed(() => props.day.noon_night.code === "NIGHT");

const dayMessages = computed((): MessageView[] => {
  const allMessages = (messagesStore.messages?.list ?? []) as MessageView[];
  return allMessages.filter((m) => m.time.village_day_id === props.day.id);
});

const aliveParticipants = computed((): VillageParticipantView[] => {
  if (!village.value) return [];
  if (props.filteringId) {
    return village.value.participants.member_list.filter((p) => p.id === props.filteringId);
  }
  if (props.day.is_epilogue) {
    return village.value.participants.member_list;
  }
  return village.value.participants.member_list.filter((p) => {
    return !p.dead || p.dead.village_day.id > props.day.id;
  });
});

const filteringStr = computed(() => {
  if (!props.filteringId) return "個人抽出";
  const name = village.value?.participants.member_list.find((m) => m.id === props.filteringId)
    ?.chara.name.name;
  return `個人抽出（抽出中: ${name}）（再クリックで解除）`;
});

const messageCount = (participant: VillageParticipantView): number => {
  return dayMessages.value.filter((m) => m.from?.id === participant.id).length;
};

const filter = (participantId: number) => {
  emit("filter", { participantId });
};
</script>
