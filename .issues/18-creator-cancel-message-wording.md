---
id: 18
title: 廃村メッセージ文言を進行中・決着でも違和感ない内容に調整する
type: enhancement
status: open
---

## 背景・現状

Issue #16 (PR #7) で点呼中・進行中・決着でも廃村できるようになり、かつ「管理者ロール」も Situation フラグ上で廃村可能な一級市民として扱うようになったが、廃村時に投稿されるシステムメッセージはプロローグ時代・村建て前提の文言のままハードコードされている。**管理者が廃村した場合も「村建ての操作により廃村しました。」と出る問題を含む**。

- `backend/src/main/kotlin/com/ort/lastwolf/domain/model/village/Village.kt:34`
  ```kotlin
  creatorCancelMessage = "村建ての操作により廃村しました。"
  ```

進行中の村でこのメッセージが出ると、参加者からは「村建てが進行を打ち切った」のか「管理者がトラブル対応で介入した」のかが文面から区別できない。状況によっては参加者の混乱や不満を招く可能性がある。

## 対応方針

### 1. 文言の中立化（最小案）

「村建ての操作により廃村しました。」→ 「廃村しました。」など主語を抜いた中立的な文言に変更。

- メリット: 1 行変更で済む。状況依存の分岐不要
- デメリット: 「誰の判断で廃村されたのか」が一切伝わらない

### 2. 操作者（村建て / 管理者）別の文言分岐

`CreatorController#cancel` で操作者の権限（管理者か村建てか）を判定し、`createCreatorCancelVillageMessage` に渡して文言を切り替える:

- 村建て: 「村建ての判断により廃村しました。」
- 管理者: 「運営の判断により廃村しました。」

- メリット: 参加者に状況が伝わる
- デメリット: ドメインメソッド `createCreatorCancelVillageMessage` のシグネチャ変更が必要

### 3. ステータス別の文言分岐

`village.status` を見て文言を切り替える:

- 募集中: 「村建ての操作により廃村しました。」（従来通り）
- 点呼中・進行中・決着: 「進行中の村が廃村されました。」など

- メリット: 進行が始まってからの廃村が「特別なイベント」として明示される
- デメリット: 操作主体 (`#2` 案) の方が情報量として有用かもしれない

### 推奨

`#2` (操作者別) + `#3` (ステータス考慮) の組み合わせが最も親切だが、最小スコープなら `#1` で十分。実装前にユーザーに確認。

## スコープ・注意

- 変更対象はドメインモデルとシステムメッセージの文言のみ。権限ロジックや status 遷移には触らない
- 既存の廃村フローへの影響は文言のみ。テストは（あれば）期待文言の更新で済む

## 影響範囲

- `backend/src/main/kotlin/com/ort/lastwolf/domain/model/village/Village.kt`（`creatorCancelMessage` / `createCreatorCancelVillageMessage`）
- 案 #2 を取る場合は `backend/src/main/kotlin/com/ort/lastwolf/api/controller/CreatorController.kt:58-74` も（操作者権限を渡す）

## 動作確認

- backend: `./gradlew test` で既存テストが落ちないこと
- backend: ローカル起動で「進行中の村を村建てが廃村」「進行中の村を管理者が廃村」を再現し、想定通りのシステムメッセージが投稿されることを確認

## release-note

ユーザー視点の文言変更のため記載対象（軽微）。

## 関連

- Issue #16 / PR #7（点呼中・進行中・決着でも廃村可能化）
- `backend/src/main/kotlin/com/ort/lastwolf/domain/model/village/Village.kt:34` — 文言ハードコード箇所
- `backend/src/main/kotlin/com/ort/lastwolf/api/controller/CreatorController.kt:58` — 廃村 API
