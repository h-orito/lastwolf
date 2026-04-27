<template>
  <div class="content">
    <ul class="list-inside list-disc space-y-2">
      <li>
        発言種別ごとに1日に発言できる回数と最大文字数が制限されます。<br />
        （村の設定で変更できます。以下はデフォルト値です。）
        <ul class="mt-1 ml-6 list-inside list-disc">
          <li>通常発言は1日に20回、1回に200文字まで</li>
          <li>人狼の囁きは1日に40回、1回に200文字まで</li>
          <li>死者の呻きは1日に40回、1回に200文字まで</li>
          <li>独り言は1日に100回、1回に200文字まで</li>
          <li>なお、プロローグ、エピローグは発言回数が制限されません。</li>
        </ul>
      </li>
      <li>
        村の設定で更新後沈黙時間が制限されている村では、進行中のみ、通常発言できない時間帯があります。
      </li>
      <li>
        発言中にアンカー文字列を含めると、クリックすることでその発言を表示することができます。
        <ul class="mt-1 ml-6 list-inside list-disc">
          <li>&gt;&gt;1 通常発言へのアンカー</li>
          <li>&gt;&gt;*1 人狼の囁きへのアンカー</li>
          <li>&gt;&gt;=1 共鳴発言へのアンカー</li>
          <li>&gt;&gt;?1 恋人発言へのアンカー</li>
          <li>&gt;&gt;+1 死者の呻きへのアンカー</li>
          <li>&gt;&gt;-1 独り言へのアンカー（エピローグ後のみ）</li>
          <li>&gt;&gt;s1 秘話へのアンカー（エピローグ後のみ）</li>
          <li>&gt;&gt;a1 アクションへのアンカー</li>
          <li>いずれのアンカーも、自分が見られない発言はクリックしても発言が表示されません。</li>
        </ul>
      </li>
    </ul>
    <div class="mt-4 space-y-2 border border-gray-200 p-4">
      <MessageCard :message="normalSay" />
      <MessageCard :message="werewolfSay" />
      <MessageCard :message="sympathizeSay" />
      <MessageCard :message="loversSay" />
      <MessageCard :message="monologueSay" />
      <MessageCard :message="graveSay" />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { MessageView, VillageParticipantView } from "~/lib/api/types";
import { MESSAGE_TYPE } from "~/lib/api/message-constants";
import MessageCard from "~/components/pages/village/message/MessageCard.vue";

const dummyParticipant: VillageParticipantView = {
  id: 1,
  chara: {
    id: 1,
    name: {
      name: "ピギー",
      short_name: "ピギー",
      full_name: "[着] きぐるみ ピギー",
    },
    charachip_id: 1,
    image: {
      width: 50,
      height: 77,
      image_url: "https://wolfort.net/wmansion/6/000_A.png",
    },
  },
  done_roll_call: false,
};

const createMessage = (type: string, text: string): MessageView => {
  return {
    from: dummyParticipant,
    time: {
      village_day_id: 1,
      day: 1,
      datetime: "2000/01/01 23:59:59",
      unix_time_milli: 1,
    },
    content: {
      type: { code: type, name: "" },
      text,
      is_strong: false,
    },
  };
};

const normalSay = computed(() =>
  createMessage(
    MESSAGE_TYPE.NORMAL_SAY,
    "通常発言です。\n参加していない人も含め全員が見ることができます。",
  ),
);

const werewolfSay = computed(() =>
  createMessage(
    MESSAGE_TYPE.WEREWOLF_SAY,
    "人狼の囁きです。\n進行中は一部の役職しか見ることができません。\nエピローグを迎えると全員が見ることができます。",
  ),
);

const sympathizeSay = computed(() =>
  createMessage(
    MESSAGE_TYPE.SYMPATHIZE_SAY,
    "共鳴発言です。\n進行中は一部の役職しか見ることができません。\nエピローグを迎えると全員が見ることができます。",
  ),
);

const loversSay = computed(() =>
  createMessage(
    MESSAGE_TYPE.LOVERS_SAY,
    "恋人発言です。\n進行中は恋絆がついた人しか見ることができません。\nエピローグを迎えると全員が見ることができます。",
  ),
);

const monologueSay = computed(() =>
  createMessage(
    MESSAGE_TYPE.MONOLOGUE_SAY,
    "独り言です。\n進行中は自分しか見ることができません。\nエピローグを迎えると全員が見ることができます。",
  ),
);

const graveSay = computed(() =>
  createMessage(
    MESSAGE_TYPE.GRAVE_SAY,
    "死者の呻きです。\n進行中は死亡した人しか見ることができません。\nエピローグを迎えると全員が見ることができます。",
  ),
);
</script>
