<template>
  <div class="rounded bg-[#fafafa] text-xs mb-2">
    <div class="bg-[#363636] text-white px-3 py-2 rounded-t font-bold">デバッグ</div>
    <div class="px-3 py-2 space-y-2">
      <!-- 村取得 -->
      <div>
        <UiButton button-type="primary" @click="fetchDebugVillage">村取得</UiButton>
      </div>

      <!-- ダミーログイン -->
      <div>
        <label class="block text-xs mb-1">ダミーログイン</label>
        <div class="flex gap-1">
          <UiFormSelect
            v-model="playerId"
            :options="playerOptions"
            :disabled="!debugVillage"
            class="flex-1"
          />
          <UiButton button-type="primary" :disabled="!debugVillage" @click="dummyLogin">
            でログインする
          </UiButton>
        </div>
      </div>

      <!-- 参加させる -->
      <div>
        <label class="block text-xs mb-1">参加させる</label>
        <div class="flex gap-1">
          <UiFormSelect
            v-model="participateCharaNum"
            :options="participateMemberNumOptions"
            :disabled="!isPrologue"
            class="flex-1"
          />
          <UiButton button-type="primary" :disabled="!isPrologue" @click="debugParticipate">
            参加させる
          </UiButton>
        </div>
      </div>

      <!-- 全員点呼 -->
      <div>
        <UiButton button-type="primary" :disabled="!debugVillage" @click="allRollcall">
          全員点呼
        </UiButton>
      </div>

      <!-- 残り10秒 -->
      <div>
        <UiButton button-type="primary" :disabled="!debugVillage" @click="changeDay">
          残り10秒にする
        </UiButton>
      </div>

      <!-- 指定処刑 -->
      <div>
        <label class="block text-xs mb-1">指定処刑</label>
        <div class="flex gap-1">
          <UiFormSelect
            v-model="executionParticipantId"
            :options="voteTargetOptions"
            :disabled="!isVoteTime"
            class="flex-1"
          />
          <UiButton
            button-type="primary"
            :disabled="!isVoteTime || !executionParticipantId"
            @click="allVote"
          >
            全員投票
          </UiButton>
        </div>
      </div>

      <!-- 引分投票 -->
      <div>
        <UiButton button-type="primary" :disabled="!isVoteTime" @click="allDrawVote">
          引分投票
        </UiButton>
      </div>

      <!-- メッセージ削除 -->
      <div>
        <UiButton button-type="danger" @click="allDelete">メッセージ削除</UiButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import UiButton from "~/components/ui/button/index.vue";
import UiFormSelect from "~/components/ui/form/FormSelect.vue";

import type { components } from "~/lib/api/schema";
import { VILLAGE_STATUS } from "~/lib/api/village-status-constants";

type DebugVillageView = components["schemas"]["DebugVillageView"];
type VillageParticipantView = components["schemas"]["VillageParticipantView"];

const villageStore = useVillageStore();
const { apiCall } = useApi();

const debugVillage = ref<DebugVillageView | null>(null);
const playerId = ref<number>(0);
const executionParticipantId = ref<number | null>(null);
const participateCharaNum = ref<number>(0);

const isPrologue = computed(() => debugVillage.value?.status.code === VILLAGE_STATUS.PROLOGUE);

const isVoteTime = computed(() => {
  if (!debugVillage.value) return false;
  const days = debugVillage.value.days.list;
  const lastDay = days[days.length - 1];
  return lastDay?.noon_night.code.startsWith("VOTE") ?? false;
});

const playerOptions = computed(() => {
  if (!debugVillage.value) return [];
  const list = [];
  for (let i = 1; i <= 18; i++) {
    const participant = debugVillage.value.participants.member_list.find((p) => p.player?.id === i);
    const name = participant ? dummyLoginCharaName(participant) : `未参加: player_id: ${i}`;
    list.push({ label: name, value: i });
  }
  return list;
});

const voteTargetOptions = computed(() => {
  if (!isVoteTime.value || !debugVillage.value) return [];
  return debugVillage.value.participants.member_list
    .filter((p) => !p.dead)
    .map((p) => ({ label: p.chara.name.name, value: p.id }));
});

const participateMemberNumOptions = computed(() => {
  if (!debugVillage.value) return [];
  const min = debugVillage.value.setting.capacity.min - 1;
  const max = debugVillage.value.setting.capacity.max - 1;
  const list = [];
  for (let i = min; i <= max; i++) {
    list.push({ label: `${i}人`, value: i });
  }
  return list;
});

const dummyLoginCharaName = (participant: VillageParticipantView): string => {
  if (!participant.skill) {
    return participant.chara.name.name;
  }
  return `${participant.chara.name.name}: ${participant.skill.name}`;
};

const fetchDebugVillage = async () => {
  try {
    debugVillage.value = await apiCall<DebugVillageView>(
      `/admin/village/${villageStore.villageId}`,
    );
    if (playerOptions.value[0]) {
      playerId.value = playerOptions.value[0].value;
    }
    if (participateMemberNumOptions.value[0]) {
      participateCharaNum.value = participateMemberNumOptions.value[0].value;
    }
  } catch {
    // エラーは無視
  }
};

const dummyLogin = async () => {
  await apiCall(`/admin/village/${debugVillage.value!.id}/dummy-login`, {
    method: "POST",
    body: { target_id: playerId.value },
  });
  location.reload();
};

const debugParticipate = async () => {
  await apiCall(`/admin/village/${debugVillage.value!.id}/participate`, {
    method: "POST",
    body: { participate_count: participateCharaNum.value },
  });
};

const allRollcall = async () => {
  await apiCall(`/admin/village/${debugVillage.value!.id}/all-rollcall`, { method: "POST" });
};

const changeDay = async () => {
  await apiCall(`/admin/village/${debugVillage.value!.id}/change-day`, { method: "POST" });
  location.reload();
};

const allDelete = async () => {
  await apiCall(`/admin/village/1/message`, { method: "DELETE" });
};

const allDrawVote = async () => {
  await apiCall(`/admin/village/${debugVillage.value!.id}/all-draw-vote`, { method: "POST" });
};

const allVote = async () => {
  await apiCall(
    `/admin/village/${debugVillage.value!.id}/all-vote/${executionParticipantId.value}`,
    { method: "POST" },
  );
};
</script>
