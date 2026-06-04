<template>
  <div class="min-h-dvh bg-deep text-fg">
    <header class="border-b border-line-soft bg-base px-6 py-6">
      <div class="mx-auto max-w-5xl">
        <h1 class="font-serif text-2xl font-bold text-bone">LASTWOLF Design Preview</h1>
        <p class="mt-1 text-sm text-fg-secondary">
          dev のみ閲覧可。ダークデザイントークン適用後の各 UI
          コンポーネントを並べて視覚確認するためのページ。
        </p>
        <nav class="mt-3 flex flex-wrap gap-3 text-xs">
          <a href="#tokens" class="text-blood hover:underline">tokens</a>
          <a href="#buttons" class="text-blood hover:underline">buttons</a>
          <a href="#panels" class="text-blood hover:underline">panels</a>
          <a href="#forms" class="text-blood hover:underline">forms</a>
          <a href="#modal" class="text-blood hover:underline">modal</a>
          <a href="#toast" class="text-blood hover:underline">toast</a>
          <a href="#loading" class="text-blood hover:underline">loading</a>
          <a href="#messages" class="text-blood hover:underline">messages</a>
          <a href="#chara-select" class="text-blood hover:underline">chara-select</a>
        </nav>
      </div>
    </header>

    <main class="mx-auto max-w-5xl space-y-12 px-6 py-8">
      <!-- ===================== Tokens ===================== -->
      <section id="tokens" class="space-y-4">
        <h2 class="font-serif text-xl text-bone">Tokens</h2>
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
        <h2 class="font-serif text-xl text-bone">Buttons</h2>

        <div class="space-y-3 rounded border border-line-soft bg-elev p-4">
          <div class="text-xs text-fg-secondary">variant（和文ラベル / 実運用の主シナリオ）</div>
          <div class="flex flex-wrap gap-3">
            <UiButton button-type="primary">決定</UiButton>
            <UiButton button-type="secondary">キャンセル</UiButton>
            <UiButton button-type="danger">退村する</UiButton>
            <UiButton button-type="ghost">閉じる</UiButton>
          </div>

          <div class="mt-4 text-xs text-fg-secondary">variant（英字ラベル）</div>
          <div class="flex flex-wrap gap-3">
            <UiButton button-type="primary">Primary</UiButton>
            <UiButton button-type="secondary">Secondary</UiButton>
            <UiButton button-type="danger">Danger</UiButton>
            <UiButton button-type="ghost">Ghost</UiButton>
          </div>

          <div class="mt-4 text-xs text-fg-secondary">loading</div>
          <div class="flex flex-wrap gap-3">
            <UiButton button-type="primary" loading>送信中</UiButton>
            <UiButton button-type="secondary" loading>処理中</UiButton>
            <UiButton button-type="danger" loading>退村中</UiButton>
            <UiButton button-type="ghost" loading>読込中</UiButton>
          </div>

          <div class="mt-4 text-xs text-fg-secondary">disabled</div>
          <div class="flex flex-wrap gap-3">
            <UiButton button-type="primary" disabled>決定</UiButton>
            <UiButton button-type="secondary" disabled>キャンセル</UiButton>
            <UiButton button-type="danger" disabled>退村する</UiButton>
            <UiButton button-type="ghost" disabled>閉じる</UiButton>
          </div>

          <div class="mt-4 text-xs text-fg-secondary">block</div>
          <div class="flex flex-col gap-2">
            <UiButton button-type="primary" block>村に入る</UiButton>
            <UiButton button-type="secondary" block>キャンセル</UiButton>
          </div>
        </div>
      </section>

      <!-- ===================== Panels ===================== -->
      <section id="panels" class="space-y-4">
        <h2 class="font-serif text-xl text-bone">Panels</h2>
        <p class="text-xs text-fg-secondary">
          村画面の各カードに使う <code>.panel-compact</code>。rim は四隅が ember→blood で光り、辺は
          blood-deep floor で繋ぐ対称構成。ヘッダは
          <code>.panel-compact-header</code> の発光グラデ線で content と区切る。
        </p>

        <div class="grid gap-4 md:grid-cols-2">
          <!-- 参加者カード相当 -->
          <div class="panel-compact text-fg text-xs">
            <div class="panel-compact-header">参加者</div>
            <div class="px-3 py-2 space-y-1">
              <div class="flex items-center justify-between">
                <span>太郎</span><span class="text-fg-secondary">村人</span>
              </div>
              <div class="flex items-center justify-between">
                <span>花子</span><span class="text-fg-secondary">占い師</span>
              </div>
              <div class="flex items-center justify-between text-fg-muted">
                <span>次郎</span><span>（死亡）</span>
              </div>
            </div>
          </div>

          <!-- 進行カード相当（中に input） -->
          <div class="panel-compact text-fg text-xs">
            <div class="panel-compact-header">進行</div>
            <div class="px-3 py-2 space-y-2">
              <p>2日目 / 昼</p>
              <FormInput v-model="formText" placeholder="発言を入力" />
              <FormSelect
                v-model="formSelect"
                :options="selectOptions"
                placeholder="投票先を選択"
              />
              <div class="text-right">
                <UiButton button-type="primary">発言</UiButton>
              </div>
            </div>
          </div>
        </div>

        <p class="pt-2 text-xs text-fg-secondary">
          比較: 大型 <code>.panel</code>（トップ / ドキュメントページ用 = 従来の directional 維持）
        </p>
        <div class="panel px-5 py-5 text-fg">
          <div class="section-heading"><h3 class="section-title">大型パネル</h3></div>
          <p class="text-sm text-fg-secondary">
            directional lighting（右上から赤光）を保持。村カードの対称 rim とは別系統。
          </p>
        </div>
      </section>

      <!-- ===================== Forms ===================== -->
      <section id="forms" class="space-y-4">
        <h2 class="font-serif text-xl text-bone">Forms</h2>

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
        <h2 class="font-serif text-xl text-bone">Modal</h2>
        <div class="flex flex-wrap gap-3 rounded border border-line-soft bg-elev p-4">
          <UiButton button-type="primary" @click="showModalA = true">タイトルのみ</UiButton>
          <UiButton button-type="secondary" @click="showModalB = true"
            >タイトル + フッター</UiButton
          >
          <UiButton button-type="ghost" @click="showModalC = true">タイトルなし</UiButton>
        </div>

        <BaseModal v-model="showModalA" title="タイトル例">
          <p>
            本体は <code class="text-blood">bg-elev</code> +
            <code class="text-blood">text-fg</code>。
          </p>
          <p class="mt-2 text-fg-secondary">補助テキストは text-fg-secondary。</p>
        </BaseModal>

        <BaseModal v-model="showModalB" title="確認">
          <p>削除してよろしいですか？</p>
          <template #footer>
            <UiButton button-type="ghost" @click="showModalB = false">キャンセル</UiButton>
            <UiButton button-type="danger" @click="showModalB = false">削除</UiButton>
          </template>
        </BaseModal>

        <BaseModal v-model="showModalC">
          <p>title prop なしの本文だけのモーダル。</p>
        </BaseModal>
      </section>

      <!-- ===================== Toast ===================== -->
      <section id="toast" class="space-y-4">
        <h2 class="font-serif text-xl text-bone">Toast</h2>
        <div class="flex flex-wrap gap-3 rounded border border-line-soft bg-elev p-4">
          <UiButton button-type="secondary" @click="fireToast('info')">info</UiButton>
          <UiButton button-type="primary" @click="fireToast('success')">success</UiButton>
          <UiButton button-type="danger" @click="fireToast('error')">error</UiButton>
        </div>
      </section>

      <!-- ===================== Loading ===================== -->
      <section id="loading" class="space-y-4">
        <h2 class="font-serif text-xl text-bone">Loading</h2>
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
        <h2 class="font-serif text-xl text-bone">Chat Messages</h2>
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
        <h2 class="font-serif text-xl text-bone">Chara Select</h2>
        <div class="flex flex-wrap gap-3 rounded border border-line-soft bg-elev p-4">
          <UiButton button-type="secondary" @click="showCharaSelect = true"
            >CharaSelectModal</UiButton
          >
          <UiButton button-type="secondary" @click="showParticipantSelect = true"
            >ParticipantSelectModal</UiButton
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
import UiButton from "~/components/ui/button/index.vue";
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
      "通常発言。bg-elev のみ、上端に hairline。",
      "村人A",
    ),
    color: "#ff8585",
  },
  {
    message: makeMessage(
      MESSAGE_TYPE.WEREWOLF_SAY,
      "人狼会話。右上 + 左下の両コーナーから血色が差し込む。",
      "狼B",
    ),
    color: "#8ab4ff",
  },
  {
    message: makeMessage(
      MESSAGE_TYPE.PRIVATE_FANATIC,
      "狂信者への通知。firewolf 同様 WEREWOLF と同じ赤グループ（暗赤グレー bg + 赤枠）。",
      null,
    ),
    color: null,
  },
  {
    message: makeMessage(
      MESSAGE_TYPE.SYMPATHIZE_SAY,
      "共有者会話。右上 + 左下の両コーナーから苔緑が差し込む。",
      "共D",
    ),
    color: "#86c990",
  },
  {
    message: makeMessage(
      MESSAGE_TYPE.MONOLOGUE_SAY,
      "独り言。背景透過、左下から mono 灰がうっすら + italic。",
      "村人E",
    ),
    color: null,
  },
  {
    message: makeMessage(
      MESSAGE_TYPE.GRAVE_SAY,
      "墓下発言。左下から grave 色が湧き上がる + italic。",
      "亡霊F",
    ),
    color: "#88d0ff",
  },
  {
    message: makeMessage(
      MESSAGE_TYPE.SPECTATE_SAY,
      "観戦発言。線なし、右上から淡 seer グラデのみ。",
      "観戦G",
    ),
    color: null,
  },
  {
    message: makeMessage(
      MESSAGE_TYPE.CREATOR_SAY,
      "村建て発言。firewolf 同様システム箱扱い: 紫 bg #403340 + 紫枠 #c0f。",
      null,
    ),
    color: null,
  },
  {
    message: makeMessage(
      MESSAGE_TYPE.PRIVATE_WEREWOLF,
      "人狼への通知（襲撃先等）。firewolf dark werewolf: 暗赤グレー bg + 赤枠。",
      null,
    ),
    color: null,
  },
  {
    message: makeMessage(
      MESSAGE_TYPE.PRIVATE_SEER,
      "占い結果のシステム通知。firewolf dark seer: 暗緑グレー bg + 緑枠。",
      null,
    ),
    color: null,
  },
  {
    message: makeMessage(
      MESSAGE_TYPE.PRIVATE_PSYCHIC,
      "霊媒結果のシステム通知。firewolf dark psychic: 暗青グレー bg + 青枠。",
      null,
    ),
    color: null,
  },
  {
    message: makeMessage(
      MESSAGE_TYPE.PRIVATE_FOX,
      "妖狐への私信。firewolf fox: 暗赤グレー bg + くすんだ黄枠 #c9c934。",
      null,
    ),
    color: null,
  },
  {
    message: makeMessage(
      MESSAGE_TYPE.PRIVATE_MASON,
      "共有者/共鳴者への通知。firewolf 橙: bg #404033 + 橙枠 #fa0。",
      null,
    ),
    color: null,
  },
  {
    message: makeMessage(
      MESSAGE_TYPE.PRIVATE_LOVERS,
      "恋人への私信。firewolf ピンク: bg #404033 + 桃枠 #f0a。",
      null,
    ),
    color: null,
  },
  {
    message: makeMessage(
      MESSAGE_TYPE.PUBLIC_SYSTEM,
      "全体システム通知（PUBLIC: 投票結果 / 開始終了等）。bg なし（くすんでない）+ 白枠。",
      null,
    ),
    color: null,
  },
  {
    message: makeMessage(
      MESSAGE_TYPE.PRIVATE_SYSTEM,
      "個別システム通知（PRIVATE）。くすんだグレー bg #404040 + 薄灰枠。",
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
