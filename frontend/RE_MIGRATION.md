# LASTWOLF Nuxt4 移行計画 (再始動)

## 概要

FIREWOLFベースの失敗した移行を破棄し、**元のLASTWOLF (.old-nuxt2) を起点**としてNuxt4へ移行する。

### 基本方針

| 項目                   | 現行 (.old-nuxt2)                     | 移行後                               |
| ---------------------- | ------------------------------------- | ------------------------------------ |
| フレームワーク         | Nuxt2 + Vue2                          | Nuxt4 + Vue3                         |
| UIライブラリ           | Buefy (Bulma)                         | Tailwind CSS v4 (自作コンポーネント) |
| コンポーネント記法     | Class-based (nuxt-property-decorator) | Composition API (script setup)       |
| 状態管理               | Vuex 3                                | Pinia                                |
| API通信                | @nuxtjs/axios                         | $fetch + useApi composable           |
| Firebase               | v7 (直接import)                       | v12 (nuxt-vuefire)                   |
| フォームバリデーション | vee-validate v3                       | vee-validate v4 + yup                |
| アイコン               | Font Awesome                          | @heroicons/vue                       |
| 日付処理               | dayjs (plugin)                        | dayjs (直接import)                   |
| チャート               | chart.js v2 + vue-chartjs v3          | chart.js v4 + vue-chartjs v5         |
| CSS                    | SCSS (Bulmaベース)                    | Tailwind CSS v4                      |

### 作業の優先順位

1. `.old-nuxt2` の実装・UIを完全に再現することを最優先
2. Buefyコンポーネントの代替自作時は `.reference/firewolf-ui/app/components/ui/` を参考
3. **FIREWOLFのビジネスロジックは混入しない**（UIパターンのみ参照）
4. 移行完了後に `.reference/firewolf-ui/app/composables/` を参考にcomposable化を検討

### 現状の資産

- `nuxt.config.ts` ... Nuxt4設定済み、そのまま使用
- `package.json` ... 依存関係は整備済み、そのまま使用
- `eslint.config.js` ... 設定済み、そのまま使用
- `app/lib/api/openapi.json` ... LASTWOLFのOpenAPI仕様、そのまま使用
- `app/lib/api/schema.ts` ... openapi.jsonから自動生成された型定義、そのまま使用
- `app/lib/api/types.ts` ... 削除して後で必要に応じて再作成
- `app/lib/api/message-constants.ts` ... メッセージ種別定数、内容確認の上で使用
- `app/lib/api/village-status-constants.ts` ... 村ステータス定数、内容確認の上で使用
- `app/` (上記以外) ... 全て削除して一から再実装

### API型定義の方針

`.old-nuxt2/@types/` の型定義ファイル群は **使用しない**。
全ての型は `app/lib/api/schema.ts` (OpenAPI自動生成) から取得する。

```typescript
// 型の使用例
import type { components } from "~/lib/api/schema";

type VillageView = components["schemas"]["VillageView"];
type MessagesView = components["schemas"]["MessagesView"];
```

`app/lib/api/types.ts` は削除し、必要になった時点でschema.tsからの再エクスポートを必要最小限で再作成する。

---

## ディレクトリ構造（目標）

```
app/
├── app.vue
├── spa-loading-template.html
├── assets/
│   └── css/
│       └── main.css          # Tailwind CSS import
├── components/
│   ├── ui/                   # Buefy代替・再利用UIコンポーネント
│   │   ├── button/
│   │   │   └── index.vue     # b-button 代替
│   │   ├── form/
│   │   │   ├── FormInput.vue      # b-input 代替
│   │   │   ├── FormNumber.vue     # b-numberinput 代替
│   │   │   ├── FormSelect.vue     # b-select 代替
│   │   │   ├── FormSwitch.vue     # b-switch 代替
│   │   │   └── FormGroup.vue      # b-field 代替
│   │   ├── modal/
│   │   │   └── Modal.vue     # b-modal 代替
│   │   └── feedback/
│   │       ├── Toast.vue          # b-toast 代替
│   │       └── LoadingSpinner.vue # b-loading 代替
│   ├── layout/
│   │   ├── NavBar.vue
│   │   └── GoogleAds.vue
│   └── pages/
│       ├── toppage/               # トップページ専用
│       │   ├── VillageList.vue
│       │   ├── Footer.vue
│       │   ├── ModalKampa.vue
│       │   ├── ModalPolicy.vue
│       │   └── ModalTerm.vue
│       ├── village/               # 村ページ専用
│       │   ├── participants/
│       │   │   ├── Participants.vue
│       │   │   └── Participant.vue
│       │   ├── progress/
│       │   │   ├── Progress.vue
│       │   │   ├── ProgressBar.vue
│       │   │   ├── CurrentSituation.vue
│       │   │   ├── ModalVillageInfo.vue
│       │   │   └── Myself.vue
│       │   ├── message/
│       │   │   ├── Messages.vue
│       │   │   ├── DayMessages.vue
│       │   │   ├── Message.vue
│       │   │   └── AliveParticipants.vue
│       │   ├── message-input/
│       │   │   └── MessageInput.vue
│       │   ├── action/
│       │   │   ├── Action.vue
│       │   │   ├── Ability.vue
│       │   │   ├── Commit.vue
│       │   │   ├── Leave.vue
│       │   │   ├── Participate.vue
│       │   │   ├── Rollcall.vue
│       │   │   ├── SkillRequest.vue
│       │   │   ├── Vote.vue
│       │   │   ├── CharaSelectModal.vue
│       │   │   └── ParticipantSelectModal.vue
│       │   ├── creator/
│       │   │   ├── Creator.vue
│       │   │   └── CreatorMessageInput.vue
│       │   ├── day-change/
│       │   │   └── ModalFirstDay.vue
│       │   ├── complete-village-list/
│       │   │   └── CompleteVillageList.vue
│       │   └── debug/
│       │       └── Debug.vue
│       ├── record/                # プレイヤー戦績
│       │   ├── CampRecords.vue
│       │   ├── SkillRecords.vue
│       │   └── ParticipateVillageList.vue
│       ├── setting/               # 村設定
│       │   ├── Setting.vue
│       │   ├── VillageName.vue
│       │   ├── Charachip.vue
│       │   ├── DummyChara.vue
│       │   ├── Organization.vue
│       │   ├── JoinPassword.vue
│       │   ├── Notification.vue
│       │   ├── StartDatetime.vue
│       │   └── ModalConfirm.vue
│       └── rule/                  # ルール説明
│           ├── Skill.vue
│           └── Ability.vue
├── composables/
│   ├── useApi.ts
│   ├── useAuth.ts
│   └── useToast.ts
├── layouts/
│   ├── default.vue               # NavBar付きレイアウト
│   └── top.vue                   # トップページ用レイアウト
├── lib/
│   └── api/
│       ├── openapi.json          # そのまま維持（LASTWOLFのOpenAPI仕様）
│       ├── schema.ts             # そのまま維持（openapi.jsonから自動生成）
│       ├── types.ts              # 削除→必要最小限で再作成
│       ├── message-constants.ts  # メッセージ種別定数
│       └── village-status-constants.ts  # 村ステータス定数
├── middleware/
│   └── authenticated.ts
├── pages/
│   ├── index.vue
│   ├── about.vue
│   ├── faq.vue
│   ├── release-note.vue
│   ├── rule.vue
│   ├── charachip-list.vue
│   ├── charachip.vue
│   ├── google-auth.vue
│   ├── player-record.vue
│   ├── village-list.vue
│   ├── create-village.vue
│   ├── village-setting.vue
│   └── village.vue
├── stores/
│   ├── auth.ts                   # Vuex auth → Pinia
│   ├── village.ts                # Vuex village → Pinia
│   └── messages.ts               # Vuex messages → Pinia
└── utils/
    └── seo.ts
```

---

## Phase別タスク一覧

### Phase 1: app/ 初期化・基盤構築

**目的**: 空のNuxt4 app構造を作成し、動作確認できる状態にする

- [ ] `app/` 以下のファイルを削除（`app/lib/api/` 配下は除く）
- [ ] `app/lib/api/types.ts` を削除
- [ ] `app/app.vue` を作成（最小実装）
- [ ] `app/spa-loading-template.html` を作成
- [ ] `app/assets/css/main.css` を作成（Tailwind CSS import + CSS変数定義）
- [ ] `pnpm dev` で起動確認

---

### Phase 2: API型定義の整理

**目的**: 型定義ファイルを整理し、全ての型をOpenAPI生成の `schema.ts` から取得する体制にする

**方針**:

- `app/lib/api/openapi.json` / `schema.ts` はそのまま維持
- `app/lib/api/types.ts` を削除（Phaseが進む中で必要になったら都度追加）
- `.old-nuxt2/@types/` は **参照のみ**（型名の対応確認用）、ファイルとしては移行しない

- [ ] `app/lib/api/types.ts` を削除
- [ ] `app/lib/api/message-constants.ts` の内容が `.old-nuxt2` と整合しているか確認
- [ ] `app/lib/api/village-status-constants.ts` の内容が `.old-nuxt2` と整合しているか確認

**型の参照方法（各コンポーネント実装時に従う）**:

```typescript
import type { components } from "~/lib/api/schema";

type VillageView = components["schemas"]["VillageView"];
type MessagesView = components["schemas"]["MessagesView"];
// ...必要な型をその都度 components['schemas']['XXX'] で取得する
```

---

### Phase 3: 共通UIコンポーネント (Buefy代替)

**目的**: Buefyコンポーネントの自作代替を作成する
**参考**: `.reference/firewolf-ui/app/components/ui/`

#### ボタン

- [ ] `app/components/ui/button/index.vue`
  - `b-button` 代替
  - type prop: `primary` | `secondary` | `danger` | `ghost`
  - loading, disabled 対応
  - FIREWOLF参考: `firewolf-ui/app/components/ui/button/index.vue`

#### フォーム

- [ ] `app/components/ui/form/FormGroup.vue`
  - `b-field` 代替（label, エラーメッセージ表示）
  - FIREWOLF参考: `firewolf-ui/app/components/ui/form/FormGroup.vue`
- [ ] `app/components/ui/form/FormInput.vue`
  - `b-input` 代替（text, password, email, textarea対応）
  - FIREWOLF参考: `firewolf-ui/app/components/ui/form/FormInput.vue`
- [ ] `app/components/ui/form/FormNumber.vue`
  - `b-numberinput` 代替
  - FIREWOLF参考: `firewolf-ui/app/components/ui/form/FormNumberInput.vue`
- [ ] `app/components/ui/form/FormSelect.vue`
  - `b-select` 代替
  - FIREWOLF参考: `firewolf-ui/app/components/ui/form/FormSelect.vue`
- [ ] `app/components/ui/form/FormSwitch.vue`
  - `b-switch` 代替（トグルスイッチ）
  - FIREWOLF参考: `firewolf-ui/app/components/ui/form/FormSwitch.vue`

#### モーダル

- [ ] `app/components/ui/modal/Modal.vue`
  - `b-modal` 代替（teleport to body、オーバーレイ付き）
  - FIREWOLF参考: `firewolf-ui/app/components/ui/modal/Modal.vue`

#### フィードバック

- [ ] `app/components/ui/feedback/Toast.vue`
  - `this.$buefy.toast.open()` 代替
  - FIREWOLF参考: `firewolf-ui/app/components/ui/feedback/Toast.vue`
- [ ] `app/components/ui/feedback/LoadingSpinner.vue`
  - `b-loading` 代替
  - FIREWOLF参考: `firewolf-ui/app/components/ui/feedback/LoadingSpinner.vue`

---

### Phase 4: レイアウト

**目的**: ページのベースレイアウトを整備する

**移行元**:

- `.old-nuxt2/layouts/default.vue`
- `.old-nuxt2/layouts/top-layout.vue`
- `.old-nuxt2/layouts/navbar.vue`

- [ ] `app/layouts/default.vue` - NavBar + main slot（通常ページ用）
- [ ] `app/layouts/top.vue` - トップページ用（広告配置が異なる等）
- [ ] `app/components/layout/NavBar.vue`
  - `.old-nuxt2/layouts/navbar.vue` を移行
  - BuefyのナビバーコンポーネントをTailwindで自作
- [ ] `app/components/layout/GoogleAds.vue`
  - `.old-nuxt2/components/common/google-ads.vue` を移行

---

### Phase 5: 状態管理 (Vuex → Pinia)

**目的**: VuexストアをPiniaに移行する

**移行元**:

- `.old-nuxt2/store/modules/auth.ts`
- `.old-nuxt2/store/modules/village.ts`
- `.old-nuxt2/store/modules/messages.ts`

#### auth store

- [ ] `app/stores/auth.ts`
  - state: `authenticated`, `player`, `photoUrl`, `user`
  - actions: `loginout(user)` (Cookieへのidtoken保存含む)
  - Firebase auth onAuthStateChanged の監視処理

#### village store

- [ ] `app/stores/village.ts`
  - state: `villageId`, `village`, `situation`, `participantIdImgMap`
  - actions: `initVillage`, `terminateVillage`, `refreshVillage`, `refreshSituation`
  - Firebase Realtime DB のリアルタイム監視

#### messages store

- [ ] `app/stores/messages.ts`
  - state: `messages` (村のメッセージ一覧)
  - Firebase Realtime DB のリアルタイム監視

---

### Phase 6: composables & utils

**目的**: API通信・認証・通知の共通処理をcomposableに切り出す

**参考**: `.reference/firewolf-ui/app/composables/`

- [ ] `app/composables/useApi.ts`
  - `@nuxtjs/axios` + cookie認証 → `$fetch` + Bearer token
  - baseURL自動付与、認証ヘッダー自動付与
  - FIREWOLF参考: `firewolf-ui/app/composables/useApi.ts`
- [ ] `app/composables/useAuth.ts`
  - Firebase auth状態のreactive wrapper
  - FIREWOLF参考: `firewolf-ui/app/composables/useAuth.ts`
- [ ] `app/composables/useToast.ts`
  - Toast通知composable
  - FIREWOLF参考: `firewolf-ui/app/composables/useToast.ts`
- [ ] `app/middleware/authenticated.ts`
  - `.old-nuxt2/middleware/authenticated.js` を移行
- [ ] `app/utils/seo.ts`
  - SEO metadataヘルパー関数

---

### Phase 7: シンプルなページ移行

**目的**: 依存関係が少ないページを移行し、基盤の動作確認をする

各ページの移行手順:

1. `.old-nuxt2/pages/` のVue2コンポーネントを読む
2. Composition API (script setup) に書き直す
3. Buefyコンポーネント → Phase 3で作成した自作コンポーネントに置き換え
4. Vuexストア参照 → Phase 5で作成したPiniaストアに置き換え

- [ ] `app/pages/about.vue` - `.old-nuxt2/pages/about.vue` を移行
- [ ] `app/pages/faq.vue` - `.old-nuxt2/pages/faq.vue` を移行
- [ ] `app/pages/release-note.vue` - `.old-nuxt2/pages/release-note.vue` を移行
- [ ] `app/pages/rule.vue` - `.old-nuxt2/pages/rule.vue` を移行
  - 対応コンポーネント: `app/components/pages/rule/Skill.vue`, `Ability.vue`
- [ ] `app/pages/charachip-list.vue` - `.old-nuxt2/pages/charachip-list.vue` を移行
- [ ] `app/pages/charachip.vue` - `.old-nuxt2/pages/charachip.vue` を移行
- [ ] `app/pages/google-auth.vue` - `.old-nuxt2/pages/google-auth.vue` を移行

---

### Phase 8: 中程度の複雑さのページ

- [ ] `app/pages/index.vue`
  - `.old-nuxt2/pages/index.vue` を移行
  - 対応コンポーネント:
    - `app/components/pages/toppage/VillageList.vue`（`.old-nuxt2/components/toppage/village-list.vue`）
    - `app/components/pages/toppage/Footer.vue`（`.old-nuxt2/components/toppage/footer.vue`）
    - `app/components/pages/toppage/ModalKampa.vue`（`.old-nuxt2/components/toppage/modal-kampa.vue`）
    - `app/components/pages/toppage/ModalPolicy.vue`（`.old-nuxt2/components/toppage/modal-policy.vue`）
    - `app/components/pages/toppage/ModalTerm.vue`（`.old-nuxt2/components/toppage/modal-term.vue`）
    - `app/components/parts/LinkButton.vue`（`.old-nuxt2/components/parts/link-button.vue`）

- [ ] `app/pages/village-list.vue`
  - `.old-nuxt2/pages/village-list.vue` を移行（存在する場合）
  - `complete-village-list` コンポーネント含む

- [ ] `app/pages/player-record.vue`
  - `.old-nuxt2/pages/player-record.vue` を移行
  - 対応コンポーネント:
    - `app/components/pages/record/CampRecords.vue`
    - `app/components/pages/record/SkillRecords.vue`
    - `app/components/pages/record/ParticipateVillageList.vue`

- [ ] `app/pages/create-village.vue`
  - `.old-nuxt2/pages/create-village.vue` を移行
  - vee-validate v4 + yup でフォームバリデーション
  - `vue-datetime` → 代替実装（TailwindのDatePicker or 自作）

- [ ] `app/pages/village-setting.vue`
  - `.old-nuxt2/pages/village-setting.vue` を移行
  - 対応コンポーネント: `app/components/pages/setting/` 以下全て
    - Setting.vue
    - VillageName.vue
    - Charachip.vue
    - DummyChara.vue
    - Organization.vue
    - JoinPassword.vue
    - Notification.vue
    - StartDatetime.vue
    - ModalConfirm.vue

---

### Phase 9: 村ページ（最も複雑）

**目的**: メインの村ページとその全コンポーネントを移行する

- [ ] `app/pages/village.vue`
  - `.old-nuxt2/pages/village.vue` を移行
  - Vuex village/auth/messages store → Pinia
  - Firebase Realtime DB のリアルタイム同期

#### 村ページコンポーネント群

**参加者エリア**

- [ ] `app/components/pages/village/participants/Participants.vue`
- [ ] `app/components/pages/village/participants/Participant.vue`

**進行状況エリア**

- [ ] `app/components/pages/village/progress/Progress.vue`
- [ ] `app/components/pages/village/progress/ProgressBar.vue`
- [ ] `app/components/pages/village/progress/CurrentSituation.vue`
- [ ] `app/components/pages/village/progress/ModalVillageInfo.vue`
- [ ] `app/components/pages/village/progress/Myself.vue`

**メッセージエリア**

- [ ] `app/components/pages/village/message/Messages.vue`
- [ ] `app/components/pages/village/message/DayMessages.vue`
- [ ] `app/components/pages/village/message/Message.vue`
- [ ] `app/components/pages/village/message/AliveParticipants.vue`

**メッセージ入力**

- [ ] `app/components/pages/village/message-input/MessageInput.vue`

**アクション**

- [ ] `app/components/pages/village/action/Action.vue`
- [ ] `app/components/pages/village/action/Ability.vue`
- [ ] `app/components/pages/village/action/Commit.vue`
- [ ] `app/components/pages/village/action/Leave.vue`
- [ ] `app/components/pages/village/action/Participate.vue`
- [ ] `app/components/pages/village/action/Rollcall.vue`
- [ ] `app/components/pages/village/action/SkillRequest.vue`
- [ ] `app/components/pages/village/action/Vote.vue`
- [ ] `app/components/pages/village/action/CharaSelectModal.vue`
- [ ] `app/components/pages/village/action/ParticipantSelectModal.vue`

**クリエイター**

- [ ] `app/components/pages/village/creator/Creator.vue`
- [ ] `app/components/pages/village/creator/CreatorMessageInput.vue`

**日替わり**

- [ ] `app/components/pages/village/day-change/ModalFirstDay.vue`

**完了村一覧**

- [ ] `app/components/pages/village/complete-village-list/CompleteVillageList.vue`

**デバッグ**

- [ ] `app/components/pages/village/debug/Debug.vue`

---

### Phase 10: composables化（FIREWOLF参考）

**目的**: 村ページのロジックをcomposableに分離する（可読性・テスト性向上）

**参考**: `.reference/firewolf-ui/app/composables/village/`

移行完了後に、以下のcomposableへの切り出しを検討:

- [ ] `app/composables/village/useVillage.ts` - 村データ管理
- [ ] `app/composables/village/useMessage.ts` - メッセージ表示・フィルタリング
- [ ] `app/composables/village/useSayInput.ts` - 発言入力状態管理
- [ ] `app/composables/village/useVillageNavigation.ts` - 日付ナビゲーション
- [ ] `app/composables/village/useVillagePolling.ts` - 定期更新
- [ ] `app/composables/village/useVillageRefresh.ts` - 手動更新
- [ ] `app/composables/village/useVillageSayStatus.ts` - 発言可能状態
- [ ] `app/composables/village/useVillageMessageFilter.ts` - メッセージフィルター
- [ ] `app/composables/village/useVillageTimer.ts` - タイマー
- [ ] `app/composables/village/useVillageMemo.ts` - メモ機能
- [ ] `app/composables/village/useUserSettings.ts` - ユーザー設定
- [ ] `app/composables/village/useAnchorMessage.ts` - アンカーメッセージ

---

### Phase 11: 最終調整・品質確認

- [ ] SEOメタデータ確認（各ページのuseHead設定）
- [ ] PWA動作確認
- [ ] サイトマップ確認（`server/routes/sitemap.xml.ts`）
- [ ] レスポンシブデザイン確認
- [ ] 全ページ動作確認
- [ ] `pnpm lint` でlintエラーなし確認
- [ ] `pnpm type-check` で型エラーなし確認

---

## 移行時の変換ルール

### Vue2 → Vue3 記法変換

```vue
<!-- Vue2 (Class-based) -->
<script lang="ts">
import { Component, Prop, Vue } from "nuxt-property-decorator";

@Component({ components: { Foo } })
export default class MyComponent extends Vue {
  @Prop() value!: string;

  get computed() {
    return this.value;
  }
  method() {
    /* ... */
  }
  mounted() {
    /* ... */
  }
}
</script>

<!-- Vue3 (Composition API) -->
<script setup lang="ts">
const props = defineProps<{ value: string }>();

const computed = computed(() => props.value);
function method() {
  /* ... */
}
onMounted(() => {
  /* ... */
});
</script>
```

### Vuex → Pinia 変換

```typescript
// Vue2: this.$store.state.auth.player
// Vue3: const { player } = storeToRefs(useAuthStore())

// Vue2: this.$store.dispatch('LOGINOUT', { user })
// Vue3: const { loginout } = useAuthStore(); loginout(user)
```

### Buefy → 自作コンポーネント 対応表

| Buefy                        | 自作コンポーネント       |
| ---------------------------- | ------------------------ |
| `<b-button>`                 | `<UiButton>`             |
| `<b-input>`                  | `<UiFormInput>`          |
| `<b-select>`                 | `<UiFormSelect>`         |
| `<b-switch>`                 | `<UiFormSwitch>`         |
| `<b-field>`                  | `<UiFormGroup>`          |
| `<b-numberinput>`            | `<UiFormNumber>`         |
| `<b-modal>`                  | `<UiModal>`              |
| `this.$buefy.toast.open()`   | `useToast().showToast()` |
| `this.$buefy.loading.open()` | `<UiLoadingSpinner>`     |

### axios → $fetch 変換

```typescript
// Vue2 (axios経由)
const { data } = await this.$axios.get("/lastwolf/village", {
  headers: { Authorization: `Bearer ${token}` },
});

// Vue3 ($fetch経由)
const { apiCall } = useApi();
const data = await apiCall<Village>("/village");
```

### Font Awesome → Heroicons 変換

| Font Awesome クラス  | Heroicons コンポーネント        |
| -------------------- | ------------------------------- |
| `fa-twitter`         | TwitterIcon (カスタムSVG)       |
| `fa-sign-in-alt`     | ArrowRightOnRectangleIcon       |
| `fa-sign-out-alt`    | ArrowLeftOnRectangleIcon        |
| `fa-search`          | MagnifyingGlassIcon             |
| `fa-times`           | XMarkIcon                       |
| `fa-check`           | CheckIcon                       |
| `fa-chevron-up/down` | ChevronUpIcon / ChevronDownIcon |
| `fa-moon`            | MoonIcon                        |
| `fa-sun`             | SunIcon                         |

### CSS クラス変換 (Bulma → Tailwind)

| Bulma                  | Tailwind                  |
| ---------------------- | ------------------------- |
| `columns`              | `flex flex-wrap`          |
| `column`               | `flex-1`                  |
| `section`              | `py-8 px-4`               |
| `container`            | `max-w-5xl mx-auto`       |
| `is-size-7`            | `text-xs`                 |
| `is-size-6`            | `text-sm`                 |
| `is-size-5`            | `text-base`               |
| `is-size-4`            | `text-lg`                 |
| `is-size-3`            | `text-2xl`                |
| `has-text-left`        | `text-left`               |
| `has-text-centered`    | `text-center`             |
| `has-background-light` | `bg-gray-100`             |
| `has-text-white`       | `text-white`              |
| `title is-5`           | `text-xl font-bold`       |
| `subtitle`             | `text-lg`                 |
| `content`              | （そのまま or prose）     |
| `m-b-10`               | `mb-2.5`                  |
| `p-t-5`                | `pt-1.5`                  |
| `button is-primary`    | `btn-primary`（カスタム） |

---

## 注意事項

### Firebase Realtime Database

`.old-nuxt2` では Firebase v7 の `database()` + `ref()` + `.on('value', ...)` パターンを使用。
Nuxt4 + nuxt-vuefire では同様にFirebase v12 の `getDatabase()` + `ref()` + `onValue()` を使用する。

```typescript
// Firebase v7 (old)
import firebase from "~/plugins/firebase";
const db = firebase.database();
const villageRef = db.ref(`/village/${villageId}`);
villageRef.on("value", (snapshot) => {
  /* ... */
});

// Firebase v12 (new)
import { getDatabase, ref, onValue } from "firebase/database";
const db = getDatabase();
const villageRef = ref(db, `/village/${villageId}`);
onValue(villageRef, (snapshot) => {
  /* ... */
});
```

### Cookie → Firebaseトークン管理

`.old-nuxt2` ではidTokenをCookieに保存してaxiosで送信していた。
Nuxt4では nuxt-vuefire の `useCurrentUser()` + `getIdToken()` を使用する。

### vue-datetime の代替

`.old-nuxt2/pages/create-village.vue` で使用している `vue-datetime` は Vue3非対応。
Tailwind CSSで自作するか、Vue3対応の日時入力ライブラリ（例: `vue-datepicker-next`）を使用する。

---

_作成日: 2026-04-28_
_ベース: .old-nuxt2 (LASTWOLF Nuxt2実装)_
_参照: .reference/firewolf-ui (FIREWOLFのUI・Composition APIパターン)_
