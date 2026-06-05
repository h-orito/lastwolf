---
id: 22
title: PC 版村画面で参加者・進行カラムを 1/2 でなく 1/3 に、チャット側を 2/3 にする
type: enhancement
status: open
---

## 背景・現状

PC 版（`md` 以上）の村画面は、左カラム（参加者 + 進行）と右カラム（チャット）を 1:1 で並べている。

`frontend/app/pages/village.vue:32-50`:

```html
<!-- デスクトップ: 2カラムレイアウト / モバイル: 1カラム -->
<div class="md:flex md:gap-4">
  <!-- 左カラム: 参加者 + 進行 -->
  <div class="md:w-1/2" id="participants-area">
    <Participants />
    <div id="progress-area"><Progress /></div>
  </div>

  <!-- 右カラム: メッセージ + 村建て + デバッグ -->
  <div class="md:w-1/2" id="messages-area">
    <Messages ref="messagesRef" />
    ...
  </div>
</div>
```

参加者・進行は情報量が限られるのに対し、チャットは可読性・1 画面あたりの発言量が UX の中心。1:1 だとチャット幅が狭く、PC の横幅を活かせていない。チャット側を広げて閲覧性を上げたい。

## 対応方針

PC（`md` 以上）の 2 カラム幅比を **1/2 : 1/2 → 1/3 : 2/3** に変更する。

- 左カラム（`#participants-area`）: `md:w-1/2` → `md:w-1/3`
- 右カラム（`#messages-area`）: `md:w-1/2` → `md:w-2/3`

モバイル（`md` 未満）は従来どおり 1 カラム積み上げ（`md:` プレフィックスのみ変更するので影響なし）。`md:gap-4` のガターはそのまま。

## スコープ・注意

- 変更は `frontend/app/pages/village.vue` の 2 つの `md:w-1/2` クラスのみ。子コンポーネント（`Participants` / `Progress` / `Messages` / `Creator`）の内部レイアウトには踏み込まない。
- 左カラムが 1/3 に狭まることで、参加者一覧・進行パネル内の要素（キャラ画像・ボタン・テーブル等）が窮屈にならないか、横スクロール・折り返し崩れが出ないか PC 幅で確認する。
- チャット側（Issue #21 の画像 1/2 化と同時期に触る可能性あり）。#21 と独立してマージ可能だが、`village/message` 配下の見た目確認は両者まとめて行うと効率的。

## 影響範囲

- `frontend/app/pages/village.vue:34`（左カラム `md:w-1/2` → `md:w-1/3`）
- `frontend/app/pages/village.vue:42`（右カラム `md:w-1/2` → `md:w-2/3`）

## 動作確認

- `pnpm lint:fix && pnpm format && pnpm type-check`
- 手動: 村画面を PC 幅（>=768px）で開き、左:右 ≒ 1:2 になっていること。左カラムの参加者・進行パネルが破綻していないこと。モバイル幅では従来どおり 1 カラム積み上げのままであること。
- 既存 E2E ではカラム幅の検証は無い見込み。手動確認で代替。

## release-note

- PC 版の村画面で、チャット欄をより広く（参加者・進行 1/3 : チャット 2/3）表示するようにレイアウトを調整しました。

## 関連

- `frontend/app/pages/village.vue:32-50`
- 関連 Issue: #21（message のキャラ画像を PC でも 1/2 サイズ表示）、#10（チャット欄の縦レイアウト）
