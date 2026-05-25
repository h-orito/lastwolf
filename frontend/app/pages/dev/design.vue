<template>
  <div class="min-h-dvh bg-deep text-fg">
    <header class="border-b border-line-soft bg-base px-6 py-6">
      <div class="mx-auto max-w-5xl">
        <h1 class="font-serif text-2xl font-bold text-moon">LASTWOLF Design Preview</h1>
        <p class="mt-1 text-sm text-fg-secondary">
          dev のみ閲覧可。ダークデザイントークン適用後の各 UI
          コンポーネントを並べて視覚確認するためのページ。
        </p>
        <nav class="mt-3 flex flex-wrap gap-3 text-xs">
          <a href="#tokens" class="text-steel hover:underline">tokens</a>
          <a href="#buttons" class="text-steel hover:underline">buttons</a>
          <a href="#forms" class="text-steel hover:underline">forms</a>
          <a href="#modal" class="text-steel hover:underline">modal</a>
          <a href="#toast" class="text-steel hover:underline">toast</a>
          <a href="#loading" class="text-steel hover:underline">loading</a>
          <a href="#messages" class="text-steel hover:underline">messages</a>
          <a href="#chara-select" class="text-steel hover:underline">chara-select</a>
        </nav>
      </div>
    </header>

    <main class="mx-auto max-w-5xl space-y-12 px-6 py-8">
      <!-- ===================== Tokens ===================== -->
      <section id="tokens" class="space-y-4">
        <h2 class="font-serif text-xl text-moon">Tokens</h2>
        <div class="grid grid-cols-2 gap-3 sm:grid-cols-4 md:grid-cols-6">
          <div
            v-for="t in tokens"
            :key="t.label"
            class="rounded border border-line-soft bg-elev p-3 text-left"
          >
            <div :class="['mb-2 h-12 w-full rounded', t.bg]" />
            <div class="text-xs font-medium text-fg">{{ t.label }}</div>
            <div class="text-xs text-fg-secondary">{{ t.hex }}</div>
          </div>
        </div>
      </section>

      <!-- ===================== Buttons ===================== -->
      <section id="buttons" class="space-y-4">
        <h2 class="font-serif text-xl text-moon">Buttons</h2>

        <div class="space-y-3 rounded border border-line-soft bg-elev p-4">
          <div class="text-xs text-fg-secondary">variant（和文ラベル / 実運用の主シナリオ）</div>
          <div class="flex flex-wrap gap-3">
            <BaseButton button-type="primary">決定</BaseButton>
            <BaseButton button-type="secondary">キャンセル</BaseButton>
            <BaseButton button-type="danger">退村する</BaseButton>
            <BaseButton button-type="ghost">閉じる</BaseButton>
          </div>

          <div class="mt-4 text-xs text-fg-secondary">variant（英字ラベル）</div>
          <div class="flex flex-wrap gap-3">
            <BaseButton button-type="primary">Primary</BaseButton>
            <BaseButton button-type="secondary">Secondary</BaseButton>
            <BaseButton button-type="danger">Danger</BaseButton>
            <BaseButton button-type="ghost">Ghost</BaseButton>
          </div>

          <div class="mt-4 text-xs text-fg-secondary">loading</div>
          <div class="flex flex-wrap gap-3">
            <BaseButton button-type="primary" loading>送信中</BaseButton>
            <BaseButton button-type="secondary" loading>処理中</BaseButton>
            <BaseButton button-type="danger" loading>退村中</BaseButton>
            <BaseButton button-type="ghost" loading>読込中</BaseButton>
          </div>

          <div class="mt-4 text-xs text-fg-secondary">disabled</div>
          <div class="flex flex-wrap gap-3">
            <BaseButton button-type="primary" disabled>決定</BaseButton>
            <BaseButton button-type="secondary" disabled>キャンセル</BaseButton>
            <BaseButton button-type="danger" disabled>退村する</BaseButton>
            <BaseButton button-type="ghost" disabled>閉じる</BaseButton>
          </div>

          <div class="mt-4 text-xs text-fg-secondary">block</div>
          <div class="flex flex-col gap-2">
            <BaseButton button-type="primary" block>村に入る</BaseButton>
            <BaseButton button-type="secondary" block>キャンセル</BaseButton>
          </div>
        </div>
      </section>

      <!-- ===================== Forms ===================== -->
      <section id="forms" class="space-y-4">
        <h2 class="font-serif text-xl text-moon">Forms</h2>

        <div class="grid gap-4 rounded border border-line-soft bg-elev p-4 md:grid-cols-2">
          <FormGroup label="テキスト" required>
            <FormInput v-model="formText" placeholder="プレースホルダ" />
            <template #help>補助テキスト（text-fg-secondary）</template>
          </FormGroup>

          <FormGroup label="エラー時">
            <FormInput v-model="formText" placeholder="入力" error />
            <template #error>エラーメッセージ（text-wolf）</template>
          </FormGroup>

          <FormGroup label="無効">
            <FormInput v-model="formText" placeholder="入力できません" disabled />
          </FormGroup>

          <FormGroup label="textarea">
            <FormInput v-model="formTextarea" type="textarea" placeholder="複数行" :rows="3" />
          </FormGroup>

          <FormGroup label="select">
            <FormSelect
              v-model="formSelect"
              :options="selectOptions"
              placeholder="選択してください"
            />
          </FormGroup>

          <FormGroup label="number">
            <FormNumber v-model="formNumber" :min="0" :max="100" />
          </FormGroup>

          <FormGroup label="switch">
            <FormSwitch v-model="formSwitch" label="通知を有効にする" description="補助説明" />
          </FormGroup>

          <FormGroup label="switch (disabled)">
            <FormSwitch
              v-model="formSwitchDisabled"
              label="無効スイッチ"
              description="押せない状態"
              disabled
            />
          </FormGroup>
        </div>
      </section>

      <!-- ===================== Modal ===================== -->
      <section id="modal" class="space-y-4">
        <h2 class="font-serif text-xl text-moon">Modal</h2>
        <div class="flex flex-wrap gap-3 rounded border border-line-soft bg-elev p-4">
          <BaseButton button-type="primary" @click="showModalA = true">タイトルのみ</BaseButton>
          <BaseButton button-type="secondary" @click="showModalB = true"
            >タイトル + フッター</BaseButton
          >
          <BaseButton button-type="ghost" @click="showModalC = true">タイトルなし</BaseButton>
        </div>

        <BaseModal v-model="showModalA" title="タイトル例">
          <p>
            本体は <code class="text-steel">bg-elev</code> +
            <code class="text-steel">text-fg</code>。
          </p>
          <p class="mt-2 text-fg-secondary">補助テキストは text-fg-secondary。</p>
        </BaseModal>

        <BaseModal v-model="showModalB" title="確認">
          <p>削除してよろしいですか？</p>
          <template #footer>
            <BaseButton button-type="ghost" @click="showModalB = false">キャンセル</BaseButton>
            <BaseButton button-type="danger" @click="showModalB = false">削除</BaseButton>
          </template>
        </BaseModal>

        <BaseModal v-model="showModalC">
          <p>title prop なしの本文だけのモーダル。</p>
        </BaseModal>
      </section>

      <!-- ===================== Toast ===================== -->
      <section id="toast" class="space-y-4">
        <h2 class="font-serif text-xl text-moon">Toast</h2>
        <div class="flex flex-wrap gap-3 rounded border border-line-soft bg-elev p-4">
          <BaseButton button-type="secondary" @click="fireToast('info')">info</BaseButton>
          <BaseButton button-type="primary" @click="fireToast('success')">success</BaseButton>
          <BaseButton button-type="danger" @click="fireToast('error')">error</BaseButton>
        </div>
      </section>

      <!-- ===================== Loading ===================== -->
      <section id="loading" class="space-y-4">
        <h2 class="font-serif text-xl text-moon">Loading</h2>
        <div class="rounded border border-line-soft bg-elev p-4">
          <p class="mb-3 text-xs text-fg-secondary">
            inline 表示（コンテナ高さ依存。本番では fixed モードで全画面オーバーレイ）
          </p>
          <div class="relative h-40 overflow-hidden rounded border border-line-soft bg-base">
            <LoadingSpinner message="読み込み中..." />
          </div>
        </div>
      </section>

      <!-- ===================== Messages ===================== -->
      <section id="messages" class="space-y-4">
        <h2 class="font-serif text-xl text-moon">Chat Messages</h2>
        <div class="space-y-1 rounded border border-line-soft bg-base p-2">
          <ChatMessage
            v-for="(m, idx) in sampleMessages"
            :key="idx"
            :message="m.message"
            :start="messageStart"
            :is-prologue="false"
            :is-epilogue="false"
            :color="m.color"
          />
        </div>
      </section>

      <!-- ===================== Chara select ===================== -->
      <section id="chara-select" class="space-y-4">
        <h2 class="font-serif text-xl text-moon">Chara Select</h2>
        <div class="flex flex-wrap gap-3 rounded border border-line-soft bg-elev p-4">
          <BaseButton button-type="secondary" @click="showCharaSelect = true"
            >CharaSelectModal</BaseButton
          >
          <BaseButton button-type="secondary" @click="showParticipantSelect = true"
            >ParticipantSelectModal</BaseButton
          >
        </div>

        <CharaSelectModal
          v-model="showCharaSelect"
          :charas="sampleCharas"
          @select="onSelectChara"
        />
        <ParticipantSelectModal
          v-model="showParticipantSelect"
          :participants="sampleParticipants"
          @select="onSelectParticipant"
        />
      </section>
    </main>
  </div>
</template>

<script setup lang="ts">
import BaseButton from "~/components/ui/button/index.vue";
import BaseModal from "~/components/ui/modal/Modal.vue";
import FormGroup from "~/components/ui/form/FormGroup.vue";
import FormInput from "~/components/ui/form/FormInput.vue";
import FormSelect from "~/components/ui/form/FormSelect.vue";
import FormNumber from "~/components/ui/form/FormNumber.vue";
import FormSwitch from "~/components/ui/form/FormSwitch.vue";
import LoadingSpinner from "~/components/ui/feedback/LoadingSpinner.vue";
import ChatMessage from "~/components/pages/village/message/Message.vue";
import CharaSelectModal from "~/components/ui/chara-select/CharaSelectModal.vue";
import ParticipantSelectModal from "~/components/ui/chara-select/ParticipantSelectModal.vue";
import { MESSAGE_TYPE } from "~/lib/api/message-constants";
import type { components } from "~/lib/api/schema";

definePageMeta({
  middleware: "dev-only",
  layout: false,
});

useHead({
  title: "Design Preview",
});

type MessageView = components["schemas"]["MessageView"];
type Chara = components["schemas"]["Chara"];
type VillageParticipantView = components["schemas"]["VillageParticipantView"];

// ===== Tokens =====
const tokens = [
  { label: "deep", hex: "#050609", bg: "bg-deep border border-line-soft" },
  { label: "base", hex: "#0a0c12", bg: "bg-base" },
  { label: "elev", hex: "#10131a", bg: "bg-elev" },
  { label: "soft", hex: "#161a24", bg: "bg-soft" },
  { label: "line-soft", hex: "#1f2530", bg: "bg-line-soft" },
  { label: "line-bright", hex: "#2d3848", bg: "bg-line-bright" },
  { label: "fg", hex: "#ecedf0", bg: "bg-fg" },
  { label: "fg-secondary", hex: "#8a96a8", bg: "bg-fg-secondary" },
  { label: "fg-muted", hex: "#525c6e", bg: "bg-fg-muted" },
  { label: "moon", hex: "#f0eed8", bg: "bg-moon" },
  { label: "halo", hex: "#c4d0dc", bg: "bg-halo" },
  { label: "steel", hex: "#6f95bd", bg: "bg-steel" },
  { label: "steel-deep", hex: "#456185", bg: "bg-steel-deep" },
  { label: "gold", hex: "#c9b87a", bg: "bg-gold" },
  { label: "wolf", hex: "#d8606b", bg: "bg-wolf" },
  { label: "mason", hex: "#8dc296", bg: "bg-mason" },
  { label: "mono", hex: "#95a3b5", bg: "bg-mono" },
  { label: "grave", hex: "#8cc0d3", bg: "bg-grave" },
  { label: "seer", hex: "#d4c283", bg: "bg-seer" },
  { label: "medium", hex: "#beadde", bg: "bg-medium" },
];

// ===== Form state =====
const formText = ref("");
const formTextarea = ref("複数行のサンプル入力\n二行目");
const formSelect = ref<string | number | null>(null);
const formNumber = ref(42);
const formSwitch = ref(true);
const formSwitchDisabled = ref(false);
const selectOptions = [
  { label: "選択肢 A", value: "a" },
  { label: "選択肢 B", value: "b" },
  { label: "選択肢 C", value: "c" },
];

// ===== Modal state =====
const showModalA = ref(false);
const showModalB = ref(false);
const showModalC = ref(false);

// ===== Toast =====
const { add: addToast } = useToast();
const fireToast = (type: "info" | "success" | "error") => {
  const messages = {
    info: "情報メッセージのサンプル",
    success: "保存しました",
    error: "通信に失敗しました",
  };
  addToast({ message: messages[type], type });
};

// ===== Messages mock =====
const messageStart = "2026-05-25T12:00:00.000Z";
const baseTime = 1748172000000;

const makeMessage = (code: string, text: string, fromName: string | null): MessageView => ({
  from: fromName
    ? ({
        id: 1,
        chara: {
          id: 1,
          name: { name: fromName, short_name: fromName, full_name: fromName },
          charachip_id: 0,
          image: { width: 60, height: 60, image_url: "" },
        },
        done_roll_call: false,
      } satisfies VillageParticipantView)
    : undefined,
  time: {
    village_day_id: 1,
    day: 1,
    datetime: new Date(baseTime).toISOString(),
    unix_time_milli: baseTime + 30000,
  },
  content: {
    type: { code, name: code },
    text,
    is_strong: false,
  },
});

const sampleMessages: { message: MessageView; color: string | null }[] = [
  {
    message: makeMessage(
      MESSAGE_TYPE.NORMAL_SAY,
      "通常発言のサンプル。fg ベースで読みやすい。",
      "村人A",
    ),
    color: "#ff8585",
  },
  {
    message: makeMessage(
      MESSAGE_TYPE.WEREWOLF_SAY,
      "人狼会話のサンプル。上ボーダー＋アバターリングが wolf。",
      "狼B",
    ),
    color: "#8ab4ff",
  },
  {
    message: makeMessage(MESSAGE_TYPE.PRIVATE_FANATIC, "狂信者の私語。タグは [信] が残る。", "狂C"),
    color: null,
  },
  {
    message: makeMessage(MESSAGE_TYPE.SYMPATHIZE_SAY, "共有者会話のサンプル。", "共D"),
    color: "#86c990",
  },
  {
    message: makeMessage(
      MESSAGE_TYPE.MONOLOGUE_SAY,
      "独り言サンプル。dotted 左ボーダー + italic。",
      "村人E",
    ),
    color: null,
  },
  {
    message: makeMessage(
      MESSAGE_TYPE.GRAVE_SAY,
      "墓下発言サンプル。dashed 上ボーダー + italic。",
      "亡霊F",
    ),
    color: "#88d0ff",
  },
  {
    message: makeMessage(
      MESSAGE_TYPE.SPECTATE_SAY,
      "観戦発言サンプル。dashed 上ボーダー（seer 色）。",
      "観戦G",
    ),
    color: null,
  },
  {
    message: makeMessage(MESSAGE_TYPE.CREATOR_SAY, "村建てメッセージ。上ボーダーが gold。", null),
    color: null,
  },
  {
    message: makeMessage(
      MESSAGE_TYPE.PRIVATE_SEER,
      "占い結果のシステム通知（normal フォールバック）。",
      null,
    ),
    color: null,
  },
];

// ===== Chara select mock =====
const sampleCharas: Chara[] = Array.from({ length: 6 }, (_, i) => ({
  id: i + 1,
  name: { name: `キャラ${i + 1}`, short_name: `C${i + 1}` },
  charachip_id: 0,
  image: {
    width: 60,
    height: 60,
    image_url: `https://placehold.co/60x60/10131a/8a96a8?text=C${i + 1}`,
  },
}));

const sampleParticipants: VillageParticipantView[] = sampleCharas.slice(0, 4).map((c) => ({
  id: c.id,
  chara: {
    id: c.id,
    name: { name: c.name.name, short_name: c.name.short_name, full_name: c.name.name },
    charachip_id: 0,
    image: c.image,
  },
  done_roll_call: false,
}));

const showCharaSelect = ref(false);
const showParticipantSelect = ref(false);
const onSelectChara = (_chara: Chara) => {
  addToast({ message: `${_chara.name.name} を選択`, type: "success" });
};
const onSelectParticipant = (id: number) => {
  addToast({ message: `participantId=${id} を選択`, type: "success" });
};
</script>
