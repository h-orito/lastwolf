<template>
  <p v-if="village" class="text-xs leading-relaxed">
    <span v-for="(messageLine, idx) in currentSituationLines" :key="idx">
      <!-- eslint-disable-next-line vue/no-v-html -->
      <span v-html="messageLine" /><br />
    </span>
  </p>
</template>

<script setup lang="ts">
import type { components } from "~/lib/api/schema";
import { VILLAGE_STATUS } from "~/lib/api/village-status-constants";
import dayjs from "dayjs";

type VillageView = components["schemas"]["VillageView"];
type VillageDay = components["schemas"]["VillageDay"];

const villageStore = useVillageStore();
const village = computed(() => villageStore.village as VillageView | null);
const latestDay = computed(() => villageStore.latestDay);

const currentDay = computed(() => {
  if (!village.value || !latestDay.value) return "";
  const day = latestDay.value;
  if (day.is_epilogue) {
    return `現在 <strong> エピローグ </strong>です。\n`;
  }
  return `現在 <strong> ${day.day}日目${day.noon_night.name} </strong>です。\n`;
});

const currentSituationLines = computed(() => {
  if (!village.value || !latestDay.value) return [];
  const v = village.value;
  const day = latestDay.value;
  let description = "";

  if (isInProgress(v)) {
    description = currentDay.value + createDescription(v, day);
  } else {
    description = createDescription(v, day);
  }

  return description.replace(/\n/gm, "<br>").split("<br>");
});

const isInProgress = (v: VillageView) => v.status.code === VILLAGE_STATUS.IN_PROGRESS;

const createDescription = (v: VillageView, day: VillageDay): string => {
  const daychangeDatetime = dayjs(day.end_datetime).format("YYYY/MM/DD HH:mm");

  if (isPrologue(v) && !isFullMember(v)) {
    return `参加者を募集しています。\n参加する方はトップページからログインして参加してください。\n${daychangeDatetime}開始予定です。`;
  } else if (isPrologue(v) && isFullMember(v)) {
    return `参加者が集まりました。\n村建てが点呼を開始するまでお待ちください。\n${daychangeDatetime}開始予定です。`;
  } else if (isRollcalling(v) && !isAllRollcall(v)) {
    return `点呼中です。\n参加者は準備完了ボタンを押してお待ちください。\n${daychangeDatetime}開始予定です。`;
  } else if (isRollcalling(v) && isAllRollcall(v)) {
    return `全員準備が完了しました。\n村建てが村を開始するまでお待ちください。\n${daychangeDatetime}開始予定です。`;
  } else if (isInProgress(v) && isNight(day)) {
    return "夜時間です。\n能力者は能力を行使してください。\n残り時間がなくなったら夜が明けます。";
  } else if (isInProgress(v) && isNoon(day)) {
    return `昼時間です。\n議論で怪しい人を見つけましょう。\n残り時間がなくなったら投票に移ります。`;
  } else if (isInProgress(v) && isFirstVote(day)) {
    return `投票時間です。\n人狼と思わしき人に投票しましょう。\n全員が投票すると夜に移ります。`;
  } else if (isInProgress(v) && isSecondVote(day)) {
    return `2回目の投票です。\n人狼と思わしき人に投票しましょう。\n全員が投票すると夜に移ります。`;
  } else if (isInProgress(v) && isLastVote(day)) {
    return `3回目の投票です。\n人狼と思わしき人に投票しましょう。\nこの投票で処刑者が決定しないと引き分けとなります。`;
  } else if (isEpilogue(v)) {
    return `決着がつきました。感想等を語り合いましょう。\n${daychangeDatetime}に村が終了します。`;
  } else if (isComplete(v)) {
    return `この村は終了しました。`;
  } else if (isCanceled(v)) {
    return `この村は廃村しました。`;
  }
  return "";
};

const isPrologue = (v: VillageView) => v.status.code === VILLAGE_STATUS.PROLOGUE;
const isRollcalling = (v: VillageView) => v.status.code === VILLAGE_STATUS.ROLLCALLING;
const isEpilogue = (v: VillageView) => v.status.code === VILLAGE_STATUS.EPILOGUE;
const isComplete = (v: VillageView) => v.status.code === VILLAGE_STATUS.COMPLETED;
const isCanceled = (v: VillageView) => v.status.code === VILLAGE_STATUS.CANCEL;

const isNoon = (day: VillageDay) => day.noon_night.code === "NOON";
const isNight = (day: VillageDay) => day.noon_night.code === "NIGHT";
const isFirstVote = (day: VillageDay) => day.noon_night.code === "VOTE_FIRST";
const isSecondVote = (day: VillageDay) => day.noon_night.code === "VOTE_SECOND";
const isLastVote = (day: VillageDay) => day.noon_night.code === "VOTE_THIRD";

const isFullMember = (v: VillageView) => {
  return v.setting.capacity.min === v.participants.count;
};

const isAllRollcall = (v: VillageView) => {
  return (
    v.participants.member_list.filter((p) => p.done_roll_call).length >= v.participants.count - 1
  );
};
</script>
