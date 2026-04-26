# Nuxt 2 → Nuxt 4 移行計画

## 概要

LASTWOLFのフロントエンドをNuxt 2からNuxt 4へ移行する。
UIライブラリはBuefyを廃止し、Tailwind CSS中心の実装に切り替える。
機能・UIUXは全て現行と同一を維持する。

## 参考プロジェクト

`.reference/firewolf-ui` をアーキテクチャ・規約・ライブラリ選定の基準とする。

---

## 移行方針

| 項目 | 現行 (Nuxt 2) | 移行後 (Nuxt 4) |
|------|--------------|----------------|
| フレームワーク | Nuxt 2 + Vue 2 | Nuxt 4 + Vue 3 |
| UIライブラリ | Buefy (Bulma) | Tailwind CSS v4 |
| 状態管理 | Vuex 3 | Pinia |
| コンポーネント記法 | Class-based (vue-property-decorator) | Composition API (script setup) |
| API通信 | @nuxtjs/axios | $fetch + useApi composable |
| Firebase | v7 (直接import) | v12 (nuxt-vuefire) |
| フォームバリデーション | vee-validate v3 | vee-validate v4 + yup |
| アイコン | Font Awesome | @heroicons/vue |
| 日付処理 | dayjs (plugin) | dayjs (直接import) |
| チャート | chart.js + vue-chartjs | chart.js + vue-chartjs (v3対応版) |
| CSS | SCSS (Bulmaベース) | Tailwind CSS v4 |
| パッケージマネージャ | npm | pnpm |
| Lint/Format | ESLint v6 + Prettier | Vite+ (`vp check`) |
| PWA | @nuxtjs/pwa | @vite-pwa/nuxt |
| Google Analytics | @nuxtjs/google-analytics | Nuxt 4対応実装 |

---

## ディレクトリ構造（移行後）

firewolf-uiに準拠した構造。

```
lastwolf-ui/
├── .old-nuxt2/           ← 既存Nuxt2コードを退避
├── app/                  ← Nuxt 4アプリケーション本体
│   ├── app.vue
│   ├── spa-loading-template.html
│   ├── assets/
│   │   └── css/
│   │       └── main.css  ← Tailwind CSS import + CSS変数
│   ├── components/
│   │   ├── ui/           ← 再利用可能UIコンポーネント (Buefy代替)
│   │   │   ├── button/
│   │   │   ├── form/
│   │   │   ├── modal/
│   │   │   ├── feedback/ ← Toast, LoadingSpinner等
│   │   │   ├── navigation/
│   │   │   └── icon/
│   │   ├── layout/       ← NavBar, Footer, GoogleAds等
│   │   └── pages/        ← ページ固有コンポーネント
│   │       ├── index/
│   │       ├── village/
│   │       │   ├── action/
│   │       │   ├── message/
│   │       │   ├── progress/
│   │       │   └── filter/
│   │       ├── create-village/
│   │       ├── village-setting/
│   │       ├── charachip/
│   │       ├── player-record/
│   │       └── rule/
│   ├── composables/      ← useApi, useAuth, useToast等
│   │   └── village/      ← 村ページ専用composables
│   │       └── action/   ← 各アクション専用composables
│   ├── layouts/
│   │   ├── default.vue
│   │   ├── top.vue       ← トップページ用 (広告なし等)
│   │   └── village.vue   ← 村ページ専用レイアウト
│   ├── lib/
│   │   └── api/
│   │       ├── types.ts  ← APIラッパー型定義
│   │       └── schema.ts ← openapi-typescriptで自動生成
│   ├── middleware/
│   │   └── auth.global.ts ← 認証チェック (authenticated.js移行)
│   ├── pages/            ← ルーティング定義のみ (薄いラッパー)
│   ├── plugins/
│   │   └── auth.client.ts
│   ├── stores/           ← Pinia stores
│   │   ├── auth.ts
│   │   ├── village.ts
│   │   └── village-message.ts
│   └── utils/
│       ├── toast.ts
│       └── constants.ts  ← consts/consts.tsを移行
├── public/               ← static/から移行
├── server/
├── nuxt.config.ts
├── package.json
├── tsconfig.json
├── eslint.config.js      ← vide-plus設定
└── .env
```

---

## Phase 0: 準備

### 0-1. Nuxt2コードの退避

```bash
# 既存コードを .old-nuxt2 に退避
mkdir .old-nuxt2
git mv assets .old-nuxt2/
git mv components .old-nuxt2/
git mv consts .old-nuxt2/
git mv layouts .old-nuxt2/
git mv middleware .old-nuxt2/
git mv pages .old-nuxt2/
git mv plugins .old-nuxt2/
git mv static .old-nuxt2/
git mv store .old-nuxt2/
git mv @types .old-nuxt2/
git mv nuxt.config.ts .old-nuxt2/
git mv tsconfig.json .old-nuxt2/
git mv package.json .old-nuxt2/
git mv package-lock.json .old-nuxt2/
```

ESLintの除外設定に `.old-nuxt2/**/*` を追加する（firewolf-uiに同様の設定あり）。

### 0-2. ブランチ確認

現在のブランチ `feature/nuxt4` で作業を継続する。

---

## Phase 1: プロジェクトセットアップ

### 1-1. package.json作成

**採用パッケージ**（firewolf-ui準拠）:

```json
{
  "dependencies": {
    "@heroicons/vue": "^2.2.0",
    "@pinia/nuxt": "^0.5.5",
    "@vee-validate/yup": "^4.15.1",
    "@vite-pwa/nuxt": "^1.1.0",
    "@vueuse/core": "^13.0.0",
    "chart.js": "^4.x",
    "dayjs": "^1.11.x",
    "firebase": "^12.x",
    "nuxt": "^4.0.3",
    "nuxt-vuefire": "^1.1.0",
    "pinia": "^2.2.7",
    "vee-validate": "^4.15.1",
    "vue": "latest",
    "vue-chartjs": "^5.x",
    "vuefire": "^3.2.2",
    "yup": "^1.7.0"
  },
  "devDependencies": {
    "@nuxt/eslint": "^1.9.0",
    "@tailwindcss/vite": "^4.x",
    "openapi-typescript": "^7.x",
    "tailwindcss": "^4.x",
    "typescript": "^5.x",
    "vite-plus": "latest",
    "vue-tsc": "^3.x"
  }
}
```

**廃止パッケージ**:
- `nuxt-buefy`, `@fortawesome/fontawesome-free-webfonts` → Tailwind + @heroicons/vue
- `@nuxtjs/axios` → $fetch (Nuxt組み込み)
- `nuxt-property-decorator`, `vue-property-decorator` → Composition API
- `@nuxtjs/dotenv` → Nuxt 4のruntimeConfig
- `@nuxtjs/style-resources` → 不要 (Tailwind CSS)
- `node-sass`, `sass-loader` → 不要 (Tailwind CSS)
- `vuexfire` → nuxt-vuefire
- `nuxt-clipboard2` → Clipboard API / VueUse useClipboard
- `vue-scrollto` → VueUse useScroll または scrollIntoView
- `vue-datetime` → 独自実装 or dayjs + 独自UI
- `cookie-universal-nuxt` → Nuxt 4の useCookie

### 1-2. nuxt.config.ts作成

firewolf-uiのnuxt.config.tsに準拠しつつLASTWOLF固有設定を適用。

主要設定:
- `ssr: false` (SPA維持)
- `compatibilityDate: '2025-xx-xx'`
- `vuefire` 設定 (Firebase)
- `runtimeConfig.public.apiBaseUrl` (axios.baseURLの代替)
- PWA設定 (@vite-pwa/nuxt)
- Tailwind CSS (vite plugin)
- `@pinia/nuxt`, `@nuxt/eslint`, `nuxt-vuefire`

環境変数名をNuxt 4規約に合わせる:
- `FIREBASE_API_KEY` → `NUXT_PUBLIC_FIREBASE_API_KEY`
- `FIREBASE_AUTH_DOMAIN` → `NUXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `LASTWOLF_API_BASEURL` → `NUXT_PUBLIC_API_BASE_URL`
- `ENV` → `NUXT_PUBLIC_ENV`

### 1-3. Vite+ 設定

**Vite+** (https://viteplus.dev) はVoidZero製のWeb開発統合CLIツール。npmパッケージではなくグローバルインストールするCLI。

**内部構成**:
- **Oxlint** (Rust製, ESLint互換, ~50-100x高速) でlint
- **Oxfmt** (Rust製, Prettier互換) でformat
- **tsgo** で型チェック

**インストール** (開発者が各自の環境に一度だけ実行):
```bash
# macOS / Linux
curl -fsSL https://vite.plus | bash

# Windows (PowerShell)
irm https://vite.plus/ps1 | iex
```

**ローカルパッケージ**として `vite-plus` を `package.json` に追加する:
```bash
vp add -D vite-plus
```

**主要コマンド**:
```bash
vp check          # format + lint + type-check を一括実行 (コミット前に実行)
vp check --fix    # 自動修正付き
vp lint           # lintのみ
vp fmt            # formatのみ
vp dev            # 開発サーバー起動 (pnpm dev の代替)
vp build          # ビルド (pnpm build の代替)
vp install        # 依存関係インストール (pnpm install の代替)
```

**package.json スクリプトの整理**:
Vite+の組み込みコマンドを使うため、`lint`, `format`, `type-check` スクリプトは `vp check` に集約。
`dev`, `build`, `preview` も `vp` 経由で実行可能。

**注意**: `@nuxt/eslint` との併用について
- Vite+ のOxlintはESLint互換ルールを持つが、Nuxt固有のESLintルール (`@nuxt/eslint` が生成) との統合を確認する
- 必要に応じて `eslint.config.js` を残し、`vp check` がそれを参照する形にする

### 1-4. Tailwind CSS v4 設定

`app/assets/css/main.css` に `@import 'tailwindcss'` を追加。

firewolf-uiのCSS変数（発言色、システムメッセージ色等）をそのまま移植:
- `--color-say-*` 系変数
- `--color-system-*` 系変数
- `--color-lovers-*` 系変数
- `--ui-primary`, `--ui-info`, `--ui-success`, `--ui-warning`, `--ui-error`

ダークモードは `.dark` クラスベース:
```css
@custom-variant dark (&:where(.dark, .dark *));
```

### 1-5. TypeScript設定

firewolf-uiのtsconfig.jsonに準拠。

---

## Phase 2: コアインフラ

### 2-1. アプリケーションルート

`app/app.vue` - Nuxt 4エントリポイント (NuxtPage + Toast Provider配置)

`app/spa-loading-template.html` - SPAローディング画面
（`.old-nuxt2/static/html/loading-indicator.html` を参考に実装）

### 2-2. Pinia Stores

**`app/stores/auth.ts`**  
firewolf-uiの実装をそのまま参考に移植。  
現行Vuex `auth` モジュールの状態・アクションを移行:
- `user`, `player`, `photoUrl` → `user`, `myselfPlayer`
- Cookie管理 (`id-token`, `id-token-check-date`)
- `getAuthToken()` メソッド

**`app/stores/village.ts`**  
現行Vuex `village` モジュールから移行:
- `village`, `situation`, `participantIdImgMap`
- Firebase Realtime Databaseのリアルタイム購読はcomposableへ移動

**`app/stores/village-message.ts`**  
現行Vuex `messages` モジュールから移行:
- `nightMessages`, `noonMessages`
- Firebase Realtime Databaseのリアルタイム購読はcomposableへ移動

### 2-3. Firebase設定

`nuxt-vuefire` + `nuxt.config.ts` の `vuefire` セクションで設定。  
`app/lib/firebase/auth.ts` - 現行 `plugins/firebase.js` のAuth操作を移植。

### 2-4. useApi Composable

`app/composables/useApi.ts`  
firewolf-uiの実装を参考に移植:
- 認証トークン自動付与
- エラーハンドリング (status 499はビジネスエラーとして再スロー)
- `baseURL` は `useRuntimeConfig().public.apiBaseUrl`

### 2-5. useAuth Composable

`app/composables/useAuth.ts`  
firewolf-uiの実装を参考に移植。Google/Twitterサインイン対応。

### 2-6. useToast Composable

`app/composables/useToast.ts` + `app/utils/toast.ts`  
firewolf-uiの実装をそのまま移植。Buefy Toastの代替。

### 2-7. 認証Middleware

`app/middleware/auth.global.ts`  
現行 `middleware/authenticated.js` を移植。  
認証必須ページ: `/create-village`, `/village-setting`

### 2-8. バージョンチェック

現行 `middleware/version.js` の機能をcomposableかpluginとして移植。  
APIの `/version` エンドポイントを呼び出し、クライアントバージョンが古い場合にリロード促す。

### 2-9. 認証Plugin

`app/plugins/auth.client.ts`  
firewolf-uiの実装を参考に移植。クライアントサイドのみで認証状態を初期化。

### 2-10. APIスキーマ・型定義

`app/lib/api/schema.ts` - openapi-typescriptで自動生成  
`app/lib/api/types.ts` - ラッパー型定義 (firewolf-uiのtypes.tsに準拠)

現行 `@types/*.d.ts` の型定義を `types.ts` のラッパー型として整理。

---

## Phase 3: UIコンポーネントライブラリ (Buefy代替)

Buefyコンポーネントを廃止し、Tailwind CSSベースの独自コンポーネントを実装。

### 3-1. ui/modal/

**`Modal.vue`** - モーダル基本実装 (Buefy `b-modal` 代替)  
firewolf-uiの実装を参考に移植。

使用箇所:
- `components/action/chara-select-modal.vue` (キャラ選択)
- `components/action/participant-select-modal.vue` (参加者選択)
- `components/day-change/modal-first-day.vue` (初日案内)
- `components/setting/modal-confirm.vue` (確認ダイアログ)
- `components/progress/modal-village-info.vue` (村情報)
- `components/toppage/modal-kampa.vue`, `modal-policy.vue`, `modal-term.vue`

### 3-2. ui/form/

Buefy `b-field`, `b-input`, `b-select`, `b-switch`, `b-checkbox` の代替:

- **`TextField.vue`** - テキスト入力 (b-input代替)
- **`NumberField.vue`** - 数値入力
- **`SelectField.vue`** - セレクトボックス (b-select代替)
- **`SwitchField.vue`** - トグルスイッチ (b-switch代替)
- **`CheckboxField.vue`** - チェックボックス
- **`TextareaField.vue`** - テキストエリア
- **`FormField.vue`** - フォームフィールドラッパー (b-field代替、バリデーションメッセージ表示)
- **`DatetimeField.vue`** - 日時入力 (vue-datetimeの代替)

vee-validate v4 + yup でバリデーション統合。

### 3-3. ui/feedback/

- **`Toast.vue`** - トースト通知 (Buefy Toast代替)、useToastと連携
- **`LoadingSpinner.vue`** - ローディング表示 (b-loading代替)

### 3-4. ui/button/

- **`BaseButton.vue`** - 基本ボタン (b-button代替)

### 3-5. ui/icon/

- **`Icon.vue`** - アイコンコンポーネント (@heroicons/vue ラッパー)
- Font Awesome → heroiconsに置き換え

### 3-6. layout/

- **`NavBar.vue`** - ナビゲーションバー (layouts/navbar.vue移行)
- **`NavBarSlider.vue`** - ナビゲーションスライダー (必要に応じて)
- **`GoogleAds.vue`** - Google広告 (components/common/google-ads.vue移行)
- **`KampaModal.vue`** - 投げ銭モーダル。**firewolf-uiからそのまま移植**（旧Nuxt2版はAmazon iFrameを含む古い実装のため使用しない）
- **`PolicyModal.vue`** - プライバシーポリシー
- **`TermModal.vue`** - 利用規約

---

## Phase 4: レイアウト移行

### 4-1. app/layouts/default.vue

現行 `layouts/default.vue` + `layouts/navbar.vue` を統合。  
GoogleAds、NavBar配置。

### 4-2. app/layouts/village.vue

現行 `pages/village.vue` の複雑なレイアウト構造を専用レイアウトとして分離（firewolf-ui参照）。  
ヘッダー・フッターの固定表示、スクロール制御。

### 4-3. app/layouts/top.vue (任意)

トップページ固有のレイアウトが必要な場合に作成。

---

## Phase 5: ページ移行

各ページは `app/pages/` に薄いラッパーとして配置し、実装はコンポーネントに委譲。  
移行順は依存関係の少ないものから着手。

> **注意**: `pages/google-auth.vue` は移行しない。  
> 旧Nuxt2ではOAuthリダイレクトフローのコールバックページとして存在していたが、  
> Nuxt 4 + nuxt-vuefire では `signInWithPopup` によるポップアップ方式に変わるため不要。  
> 認証フローは `app/plugins/auth.client.ts` と各コンポーネント内のサインインUI で完結する。

### 5-1. about.vue・faq.vue・rule.vue・release-note.vue

静的コンテンツページ。BuefyのレイアウトクラスをTailwindに置換するのみ。

- `components/rule/ability.vue` → `components/pages/rule/RuleAbility.vue`
- `components/rule/skill.vue` → `components/pages/rule/RuleSkill.vue`

### 5-2. charachip-list.vue・charachip.vue

キャラチップ一覧・詳細ページ。API呼び出しをuseApi経由に変更。

### 5-3. player-record.vue

プレイヤー戦績ページ。  
チャート表示: chart.js + vue-chartjs (v4対応版)  
- `components/record/camp-records.vue`
- `components/record/skill-records.vue`
- `components/record/participate-village-list.vue`

### 5-4. village-list.vue

村一覧ページ。  
- `components/toppage/village-list.vue` → `components/pages/index/VillageCard.vue` 等

### 5-5. index.vue (トップページ)

トップページ。  
- 村一覧、ポリシー、規約モーダル
- カンパモーダル: firewolf-uiの `KampaModal.vue` をそのまま使用（旧Nuxt2版は使用しない）
- Google/Twitterサインインへの導線

### 5-6. create-village.vue

村作成ページ（認証必須）。  
最も多くのフォームコンポーネントを使用する。  
vee-validate v4 + yup でバリデーション実装。

- `components/setting/` 配下全コンポーネントを `components/pages/create-village/` に移行
- `components/form/validation/` → vee-validate v4 + FormField.vue に置き換え

### 5-7. village-setting.vue

村設定変更ページ（認証必須）。  
create-villageと類似のフォーム構成。

### 5-8. village.vue (村ページ) ← 最難関

最も複雑なページ。Firebase Realtime Databaseのリアルタイム購読あり。

**移行方針**:
- レイアウト: `app/layouts/village.vue`を活用
- Firebase RTDB購読: Vuex actionsからcomposablesへ移行
  - `composables/village/useVillage.ts` (村情報・状況取得)
  - `composables/village/useMessage.ts` (メッセージ購読)
  - `composables/village/useVillagePolling.ts` (更新チェック)

**コンポーネント移行**:
- `components/message/` → `components/pages/village/message/`
- `components/action/` → `components/pages/village/action/`
- `components/participants/` → `components/pages/village/`
- `components/progress/` → `components/pages/village/`
- `components/creator/` → `components/pages/village/action/creator/`
- `components/message-input/` → `components/pages/village/action/`
- `components/debug/` → `components/pages/village/action/admin/`
- `components/complete-village-list/` → `components/pages/village/`

**アクション系composables**:
- `composables/village/action/useSay.ts` - 発言
- `composables/village/action/useVote.ts` - 投票
- `composables/village/action/useAbility.ts` - 能力
- `composables/village/action/useCommit.ts` - コミット
- `composables/village/action/useParticipate.ts` - 参加
- `composables/village/action/useLeave.ts` - 退村
- `composables/village/action/useSkillRequest.ts` - 役職希望

---

## Phase 6: アセット・静的ファイル移行

### 6-1. 静的ファイル

`static/` → `public/`

- 画像ファイル (image/)
- PWAアイコン (image/icons/)
- OGP画像 (image/ogp/)

### 6-2. CSS移行

SCSS (Bulmaベース) → Tailwind CSS:

| SCSS変数 | Tailwind/CSS変数 |
|---------|----------------|
| `$primary: #3991f4` | `--ui-primary: #3991f4` |
| `$normal-say: #ffffff` | `--color-say-normal: #ffffff` |
| `$werewolf-say: #f2cece` | `--color-say-werewolf: #f2cece` |
| ... | ... |

Bulmaのスペーシングクラス (`is-marginless` 等) → Tailwindユーティリティに置換。

### 6-3. Bulmaクラス → Tailwind置換対応表 (主なもの)

| Bulma | Tailwind相当 |
|-------|------------|
| `container` | `max-w-5xl mx-auto px-4` |
| `columns`, `column` | `flex`, `flex-col` 等 |
| `is-flex` | `flex` |
| `is-centered` | `justify-center` |
| `has-text-centered` | `text-center` |
| `button is-primary` | `btn-primary` (独自クラス) |
| `card` | `rounded shadow p-4` 等 |
| `modal` | Modal.vue |
| `notification` | Toast.vue |
| `tag` | `inline-flex rounded px-2 text-sm` 等 |
| `b-tabs` | 独自TabNavigation実装 |

---

## Phase 7: 品質管理・仕上げ

### 7-1. コード品質

```bash
vp check
# または自動修正あり
vp check --fix
```

- `as any`, `as unknown`, `@ts-ignore` の使用禁止
- `// eslint-disable` の使用禁止
- Store直接使用禁止 → composables経由

### 7-2. SEO・メタ設定

nuxt.config.tsの `app.head` に移植:
- OGP設定
- サイト説明・キーワード
- noindexルール (本番環境以外)
- `NUXT_PUBLIC_ENV !== 'production'` の場合にnoindex

### 7-3. サイトマップ

nitroのprerender + sitemap対応。

### 7-4. PWA

`@vite-pwa/nuxt` で現行PWA設定を再現。

### 7-5. Google Analytics

Nuxt 4対応の実装 (useScriptGoogleAnalytics 等) に置き換え。

---

## 移行時の注意事項

### Firebase Realtime Database

現行は `vuexfire` でVuexとFirebase RTDBを結合している。  
Nuxt 4では `nuxt-vuefire` がFirestoreを主にサポート。  
RTDBのリアルタイム購読は `onValue` を直接composableで使用する実装に変更。

```typescript
// composables/village/useVillage.ts
import { ref as dbRef, onValue } from 'firebase/database'
import { useFirebaseApp } from 'vuefire'
```

### vue-datetime 代替

現行の日時入力 (`vue-datetime`) は Vue 3非対応。  
`<input type="datetime-local">` でネイティブ実装する。

### vue-chartjs v3 → v5

Vue 3対応の `vue-chartjs` v5 + `chart.js` v4 に移行。  
APIは類似しているが、一部変更あり。

### スクロール制御

`vue-scrollto` → `VueUse` の `useScroll` または `element.scrollIntoView()` に置き換え。

### クリップボード

`nuxt-clipboard2` → `VueUse` の `useClipboard` に置き換え。

---

## 移行完了条件

- [ ] 全11ページが動作すること (google-auth.vueは廃止、village-setting.vueを含む)
- [ ] Firebase認証 (Twitter) が動作すること
- [ ] Firebase Realtime Databaseのリアルタイム購読が動作すること
- [ ] 全APIエンドポイントへの通信が動作すること
- [ ] PWAとして動作すること
- [ ] `pnpm lint && pnpm format && pnpm type-check` がエラーなしで完了すること
- [ ] ビルドが成功すること
