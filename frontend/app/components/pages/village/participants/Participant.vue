<template>
  <div class="inline-block align-top text-center mb-2" :style="isDispPlayer ? 'width: 100%' : ''">
    <!-- プレイヤー情報表示モード -->
    <div v-if="isDispPlayer" class="flex">
      <div class="mr-2">
        <img
          :src="participant.chara.image.image_url"
          :alt="participant.chara.name.name"
          :class="participant.dead ? 'opacity-30' : ''"
          style="width: 50px; height: 77px"
        />
      </div>
      <div class="text-left flex-1">
        <div class="flex">
          <p :style="charaNameStyle">
            {{ participant.chara.name.name }}
          </p>
          <p v-if="participant.skill" class="ml-1">
            {{ participant.skill.name }}
          </p>
          <p v-if="participant.dead" class="text-wolf ml-1">
            {{ `${participant.dead.village_day.day}d${participant.dead.reason}` }}
          </p>
          <p v-if="isFirstVictim" class="ml-1">ダミー</p>
        </div>
        <p v-if="participant.player">
          {{ `${participant.player.nickname}@${participant.player.twitter_user_name}` }}
        </p>
        <!-- 外部リンクボタン: UiButton は a / NuxtLink + target="_blank" の場合に rel="noopener noreferrer" を自動付与する（components/ui/button/index.vue） -->
        <div class="mt-1 flex gap-1">
          <UiButton
            v-if="participant.player"
            button-type="secondary"
            :to="{ path: '/player-record', query: { id: participant.player.id } }"
            target="_blank"
          >
            戦績
          </UiButton>
          <UiButton
            v-if="participant.player"
            button-type="secondary"
            as="a"
            :href="`https://twitter.com/${participant.player.twitter_user_name}`"
            target="_blank"
          >
            Twitter
          </UiButton>
        </div>
      </div>
    </div>
    <!-- 通常表示モード -->
    <div v-else>
      <img
        :src="participant.chara.image.image_url"
        :alt="participant.chara.name.name"
        :class="participant.dead ? 'opacity-30' : ''"
        style="width: 50px; height: 77px"
      />
      <p :style="charaNameStyle">{{ participant.chara.name.name }}</p>
      <p v-if="participant.skill" class="text-xs">
        {{ participant.skill.name }}
      </p>
      <p v-if="participant.dead" class="text-wolf text-xs">
        {{ `${participant.dead.village_day.day}d${participant.dead.reason}` }}
      </p>
      <p v-if="doneRollcall" class="text-mason text-xs">準備完了</p>
      <p v-if="isFirstVictim" class="text-xs">ダミー</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { components } from "~/lib/api/schema";
import { VILLAGE_STATUS } from "~/lib/api/village-status-constants";
import { getMessageColor } from "~/lib/api/message-color";

type VillageParticipantView = components["schemas"]["VillageParticipantView"];
type VillageView = components["schemas"]["VillageView"];

interface Props {
  participant: VillageParticipantView;
  isDispPlayer: boolean;
}

const props = defineProps<Props>();

const villageStore = useVillageStore();
const village = computed(() => villageStore.village as VillageView | null);

const situation = computed(() => villageStore.situation);

const isMyself = computed(() => {
  if (!situation.value?.participate.myself) return false;
  return situation.value.participate.myself.id === props.participant.id;
});

const isFirstVictim = computed(() => {
  if (!village.value) return false;
  const dummyCharaId = village.value.setting.charachip.dummy_chara_id;
  return props.participant.chara.id === dummyCharaId;
});

const doneRollcall = computed(() => {
  if (!village.value) return false;
  return (
    village.value.status.code === VILLAGE_STATUS.ROLLCALLING && props.participant.done_roll_call
  );
});

const charaNameStyle = computed(() => {
  if (!village.value) return {};
  const color = getMessageColor(village.value, props.participant);
  const fontWeight = isMyself.value ? "bold" : "normal";
  return color ? { color, fontWeight } : { fontWeight };
});
</script>
