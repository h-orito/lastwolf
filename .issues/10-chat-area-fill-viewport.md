---
id: 10
title: チャット欄の min-height を viewport いっぱいに（スマホ 100vh 相当 / PC も縦いっぱい）
type: design
status: open
---

## 背景・現状

- 村画面のチャット欄が短いと、画面下部に大きな空白が出てしまい没入感が削がれる
- 特にスマホで顕著（アドレスバー込みで画面が広いので空白が目立つ）
- PC でも縦の余白が活かしきれていない

## 対応方針

- チャット欄（メッセージ表示領域）の `min-height` を viewport 高さに合わせる
  - スマホ: `100vh` 相当（ただしモバイルブラウザのアドレスバー伸縮対策として `100dvh` を優先候補）
  - PC: 共通 header / 村名 header の高さを引いた残り全部
- ヘッダ高さは固定値ハードコードではなく CSS variable で扱う（既存 token 連携。#3 のデザイントークンと整合）
- 実装イメージ:
  - `min-height: calc(100dvh - var(--header-h) - var(--village-header-h))` の形
  - `dvh` 非対応ブラウザの fallback として `vh` も併記、もしくは JS で `--vh` を更新
- スクロール挙動: チャット内部スクロールが必要なら `min-height` ではなく `height` で固定する方が良いケースもあるため要検証

## スコープ・注意

- スコープ外: チャット欄以外のページレイアウト全体の見直し（村一覧など）
- 注意:
  - iOS Safari のアドレスバー伸縮で `100vh` が overshoot する既知問題 → `100dvh` で対応。Safari 古いバージョンの fallback は別途検討
  - キーボード起動時（スマホ）に入力欄が隠れないか確認。`vh` 系は visualViewport の影響を受けない点に注意
  - PWA / standalone モードでも崩れないか確認
  - 既存の sticky な村名 header / 共通 header / 入力欄（フッタ）と組み合わせて高さ計算が破綻しないこと

## 影響範囲

- frontend:
  - 村画面のチャット表示コンポーネント（`frontend/app/components` または `frontend/app/pages` 配下の村ページ）
  - 共通 layout（`frontend/app/layouts`）の header / 村名 header 高さ取得方法
  - 関連 CSS（`100dvh` / CSS variable / Tailwind の任意ユーティリティ）

## 動作確認

- frontend: lint / build
- 手動確認:
  - [ ] スマホ実機 / DevTools モバイルモードで、チャット欄が画面いっぱいに広がる
  - [ ] iOS Safari でアドレスバーが伸縮しても破綻しない
  - [ ] スマホでソフトキーボード起動時に入力欄が隠れない
  - [ ] PC（広い viewport）でも縦余白が出ない
  - [ ] 共通 header / 村名 header が重ならず、高さ計算が正しい
  - [ ] チャット内スクロールが従来どおり動く
  - [ ] PWA standalone モードでも崩れない（該当時）

## release-note

- 村画面のチャット欄を画面の縦幅いっぱいに表示するように調整。スマホ / PC ともに余白が減って読みやすくなります。

## 関連

- frontend の村画面 / layout（着手時に具体ファイル特定）
- 関連 Issue: #3（デザイントークン整備。`--header-h` 等の variable はそこと揃える）/ #5（村画面の情報設計刷新）
- どちらか先行する Phase の成果物に乗せる方が手戻りが少ないので、着手順は #3 → 本 Issue を推奨（要相談）
