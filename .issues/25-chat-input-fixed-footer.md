---
id: 25
title: チャット入力欄を画面最下部に固定表示する（残り時間バー・ナビとの積み重ねは試行して要調整）
type: enhancement
status: open
---

## 背景・現状

チャット入力欄（`MessageInput`）は現状、チャットパネル内のインラインに置かれている。

- `app/components/pages/village/message/Messages.vue:41` で、日付タブ配下の「強調発言フィルタ」と「メッセージ一覧（`DayMessages`）」の**間**に `<MessageInput />` が描画される（＝メッセージ一覧の上、ページ内通常フロー）。
- メッセージを読み進めて下へスクロールすると入力欄が画面外へ流れ、発言したいときに上へ戻る必要がある。

一方で、`app/pages/village.vue:56-90` には**既に画面最下部固定のフッター**が存在する:

- `fixed bottom-0 left-0 w-full bg-base z-50` のコンテナ
- 中身: `ProgressBar`（残り時間プログレスバー、進行中のみ表示）＋ モバイル用セクションナビ（`md:hidden` の 参加者/進行/チャット ボタン）
- wrapper 側はこの固定フッター分の余白を `padding-bottom` で確保（`village.vue` style: モバイル 50px / 進行中 100px、PC は進行中 50px、いずれも `env(safe-area-inset-bottom)` 加算）

入力欄も最下部固定にしたいが、**この既存固定フッター（残り時間バー＋ナビ）と高さ・積み重ね・余白がぶつかる**。ユーザーからも「残り時間との兼ね合いがあるため試行して要調整」と明示されており、一発で決め切らず実機で詰める前提の Issue。

## 対応方針

`MessageInput` をインラインから外し、**viewport 最下部の固定領域に 1 インスタンスだけ**配置する。既存固定フッターと縦に積み重ねる。

- `MessageInput` は `villageStore`（situation / village / latestDay）だけに依存し、日付タブの `day` には依存しないため、`Messages.vue` の各日タブ内描画から `village.vue` の固定フッター領域へ移設可能。
- 積み重ね順（下→上）の案: `safe-area` → モバイルナビ → 残り時間バー → **チャット入力欄**（最上段）。PC はナビ無しなので 残り時間バー＋入力欄の 2 段。
  - 入力欄を残り時間バーの上に置くか下に置くかは実機で要調整（タイトル明記の「兼ね合い」）。
- 固定フッター総高さの増加に合わせて `village.vue` の wrapper `padding-bottom` を再計算（入力欄高さ + バー + ナビ + safe-area）。最後のメッセージが固定入力欄に隠れないことが必須。

### 試行・要調整ポイント（実装中に詰める）

1. **積み重ね順と z-index**: 入力欄／残り時間バー／ナビの上下関係。バーは進行中のみ表示なので、非表示時に隙間が出ないようにする。
2. **padding-bottom の動的さ**: 入力欄の表示有無・残り時間バーの有無（進行中のみ）・ナビ有無（モバイルのみ）で必要余白が変わる。固定値ベタ書きだと崩れるため、状態別に出し分ける（既存 `.village-in-progress` 分岐の拡張）。
3. **入力欄の表示条件**: `canSay` が false（観戦・死亡・沈黙時間・プロローグ等で発言不可）のときは固定入力欄を**畳む/非表示**にして空のバーを残さない。現状 `MessageInput` 内は disabled 表示のままなので、固定化では出し分けを検討。
4. **モバイルのセクション表示**: モバイルは参加者/進行/チャットをセクションナビで切替える縦積み。入力欄を常時最下部固定にすると、参加者・進行セクション閲覧中も入力欄が出る。これを「常時表示」とするか「チャットセクション選択時のみ」とするかは要調整。
5. **モバイルのソフトキーボード**: 入力欄フォーカス時に iOS Safari 等でキーボードが固定要素を押し上げ/被せる問題。`env(safe-area-inset-bottom)` は既存だが `visualViewport` 対応の要否を実機確認。
6. **送信後スクロール**: 入力欄が固定化されメッセージ一覧が独立スクロールになった場合、発言後に最新位置を保つ挙動の確認（現状はインラインのため自然）。

## スコープ・注意

- スコープは**村チャットの入力欄を最下部固定にする UI 変更**まで。発言ロジック（`say()` / `canSay` / messageType 判定）の中身は変えない。
- Creator 用入力（`creator/CreatorMessageInput.vue`）は別物。今回は通常発言の `MessageInput` のみ対象（Creator 入力の固定化はスコープ外）。
- 既存固定フッター（`ProgressBar` + ナビ）の構造・`padding-bottom` 計算に手を入れるため、**#10（チャット欄 min-height を viewport いっぱいに）と同じ領域**を触る。順序整理が必要（下記「関連」）。
- 規約遵守: `as any` / `@ts-ignore` 禁止、store 直接参照禁止（composables 経由）。

## 影響範囲

- 変更: `app/pages/village.vue`（固定フッター領域に `MessageInput` を移設、`padding-bottom` 再計算、積み重ね/z-index）
- 変更: `app/components/pages/village/message/Messages.vue:41`（インラインの `<MessageInput />` を撤去）
- 変更（必要時）: `app/components/pages/village/message-input/MessageInput.vue`（固定配置前提の余白・幅・disabled 時の畳み込み調整）
- 参照: `app/components/pages/village/progress/ProgressBar.vue`（残り時間バーの高さ・表示条件）

## 動作確認

- `pnpm lint:fix && pnpm format && pnpm type-check`
- 手動（実機・複数幅で試行）:
  - PC 幅: 入力欄が最下部固定。残り時間バー（進行中）と重ならず、最後のメッセージが隠れない。
  - モバイル幅: 入力欄＋残り時間バー＋セクションナビが破綻なく積み重なる。キーボード表示時に入力欄が隠れない。
  - 発言不可状態（観戦/死亡/沈黙/プロローグ・エピローグ）で固定入力欄が適切に畳まれる/無効化される。
  - 進行中 / 非進行中（残り時間バー有無）の両方で `padding-bottom` が適正。
- 既存 E2E では検知困難。#11（E2E 基盤）完了後に「入力欄が固定表示される / 最後のメッセージが隠れない」スモークを追加検討。当面は手動確認。

## release-note

- 村のチャット入力欄を画面最下部に固定表示するようにし、スクロール位置に関わらずすぐ発言できるようにしました。

## 関連

- `app/components/pages/village/message/Messages.vue:41`（現在のインライン配置）
- `app/pages/village.vue:56-90`（既存の固定フッター = 残り時間バー + ナビ）、`village.vue` style `:440-454`（`padding-bottom` 計算）
- `app/components/pages/village/message-input/MessageInput.vue`（入力欄本体）
- 関連 Issue: **#10（チャット欄 min-height を viewport いっぱいに）= 同じ固定フッター/余白領域を触るため順序整理が必要**、#22（PC カラム幅 1/3:2/3）、#24（ユーザー表示設定＝同じ村チャット周り）、#11（E2E 基盤）
