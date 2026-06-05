---
id: 24
title: ユーザー表示設定機能の追加（文字サイズ / 画像表示モード: 非表示・0.5倍・通常 など）
type: enhancement
status: open
---

## 背景・現状

閲覧者ごとの表示の好み（文字の大きさ、キャラ画像の大きさ）を調整する手段が無く、全員一律の表示になっている。特に村のチャット画面は端末・視力・好みによって最適な文字サイズ・画像サイズが異なるため、ユーザー側で調整できるようにしたい。

現状のインフラ調査結果（着手前提として重要）:

- **localStorage / sessionStorage の利用は app 内に皆無**（新規導入になる）
- Pinia ストアは `auth` / `messages` / `village` の 3 つのみ、いずれも**インメモリで永続化なし**（`pinia-plugin-persistedstate` 等も未導入）
- **バックエンドにユーザー設定 API は存在しない**（`schema.ts` に該当なし）
- レイアウトは `app/layouts/default.vue` の 1 つ
- キャラ画像サイズは現状 `Message.vue` がビューポート幅で分岐（モバイルのみ 1/2）。当初「PC でも常時 1/2」を別 Issue #21 として起票していたが、**本機能の画像表示モードに統合して #21 はクローズ（削除）**。キャラ画像サイズは本機能で一元管理し、`Message.vue` 内のビューポート幅分岐（`isMobile` / `onMounted`）は本機能の画像モード適用に置き換える

## 対応方針

**localStorage に保存するクライアント専用のユーザー表示設定**を新規追加する（バックエンド変更なし＝この機能は 1 PR で完結させる）。設定 UI は**村画面内に設定ボタン**を置き、モーダルで開く。

### 設定項目（v1）

1. **文字サイズ**: 例 小 / 標準 / 大（標準を 1.0 とした倍率、またはサイズ段階）。**デフォルト = 標準（1.0）**
2. **画像表示モード**: 非表示 / 0.5 倍 / 通常。**デフォルト = 0.5 倍**（旧 #21「PC でも 1/2」の意図を default で踏襲。初回ロード時のフォールバックもこの値）
3. （「など」= 将来拡張前提。store / モーダルを項目追加しやすい構造にしておく）

### 実装構成（案）

1. **設定ストア + 永続化**: `app/stores/displaySettings.ts`（Pinia）に設定状態を保持し、localStorage に read/write。
   - `import.meta.client` / `onMounted` で SSR 時の `localStorage` 参照を回避（Nuxt SSR）。初期描画は default 値、クライアントで保存値を hydrate。
   - **プロジェクト規約「store は composables 経由で使う」**に従い、`app/composables/useDisplaySettings.ts` を作成してコンポーネントからはそちら経由で参照・更新する。
2. **設定モーダル**: `app/components/ui/modal/` の既存 `Modal.vue` を使い、村画面用の表示設定モーダルを追加（在村の `ModalVillageInfo.vue` / `ModalFirstDay.vue` がモーダル実装の先例）。
3. **入口ボタン**: `app/pages/village.vue` の村名ヘッダー（`:5-29`、X シェアボタンの隣あたり）に歯車アイコンボタンを追加し、モーダルを開く。
4. **設定の適用（村チャット）**:
   - 文字サイズ: メッセージ本文に CSS 変数（例 `--msg-font-scale`）を効かせる形でコンテナに適用。`Message.vue` / `Messages.vue`。
   - 画像表示モード: `Message.vue` のキャラ画像レンダリングを設定値で分岐
     - 非表示: `<img>` ブロックを描画しない
     - 0.5 倍: `Math.floor(w/2)` / `Math.floor(h/2)`
     - 通常: 原寸

### デフォルト値・既存挙動との整合（決定済）

- **画像表示モードの初期値 = 0.5 倍**（PC / モバイル問わず）。これにより旧 #21「PC でも 1/2 表示」の意図はデフォルト値として満たされる。
- **文字サイズの初期値 = 標準（1.0）**。
- `Message.vue:129-142` の `isMobile` / `onMounted` によるビューポート幅分岐は撤去し、画像サイズは本機能の画像モード（保存値 or デフォルト 0.5 倍）から算出する単一ロジックに統一する。`isMobile` が画像サイズ以外で参照されていないことを確認のうえ削除。

## スコープ・注意

- スコープは**村チャット画面への文字サイズ・画像モード適用**まで。アプリ全体の文字サイズ適用や、村以外のページへの展開は v1 スコープ外（拡張余地として store 構造だけ汎用にしておく）。
- 永続化は localStorage のみ。**端末間同期はしない**（同期が必要になったら別 Issue でバックエンド設定 API を新設）。
- SSR ガードを忘れない（`localStorage` を server で触ると例外）。ハイドレーション不一致（初期 default → クライアント保存値）でのちらつきに注意。
- 規約遵守: `as any` / `@ts-ignore` 等は禁止。設定値は union 型等で明示的に型定義する。store 直接参照禁止（composables 経由）。

## 影響範囲

- 新規: `app/stores/displaySettings.ts`
- 新規: `app/composables/useDisplaySettings.ts`
- 新規: 表示設定モーダル（`app/components/pages/village/` 配下 or `app/components/ui/modal/` 配下）
- 変更: `app/pages/village.vue`（ヘッダーに設定ボタン + モーダル設置）
- 変更: `app/components/pages/village/message/Message.vue`（文字サイズ・画像モード適用）
- 変更（必要時）: `app/components/pages/village/message/Messages.vue`（コンテナへの font-scale 変数付与）

## 動作確認

- `pnpm lint:fix && pnpm format && pnpm type-check`
- 手動:
  - 村画面の設定ボタン → モーダルで文字サイズ・画像モードを変更 → 即時にチャット表示へ反映される
  - 画像モード: 非表示でキャラ画像が消える / 0.5 倍で半分 / 通常で原寸
  - リロード後も設定が保持される（localStorage）
  - ログイン前後・別端末で破綻しない（同期しないことの確認）
- 既存 E2E では検知不可の見込み。#11（E2E 基盤）完了後ならモーダル開閉 + localStorage 反映の E2E 追加余地あり。当面は手動確認。

## release-note

- 村のチャット画面に「表示設定」を追加しました。文字サイズと、キャラ画像の表示（非表示 / 0.5 倍 / 通常）をお好みに合わせて変更できます（設定はお使いのブラウザに保存されます）。

## 関連

- `app/pages/village.vue:5-29`（村名ヘッダー / X シェアボタン＝設定ボタン設置候補）
- `app/components/pages/village/message/Message.vue:129-142`（画像サイズ算出ロジック＝本機能で置き換え対象）
- `app/stores/auth.ts`（Pinia store の書き方の先例）
- 関連 Issue: **#21（画像を PC でも 1/2 表示）は本機能に統合してクローズ済（削除）**、#22（PC カラム幅）、#10（チャット欄縦レイアウト）、#11（E2E 基盤）
