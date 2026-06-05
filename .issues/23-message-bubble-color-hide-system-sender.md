---
id: 23
title: メッセージ会話バブルの bg/border 色味調整 + システム発言者名「システム」の非表示
type: design
status: open
base_branch: feature/dark-design
---

## 背景・現状

UI ダーク化シリーズで会話バブル（発言系）を Black & Blood directional lighting で実装済み（`Message.vue` の scoped `.msg-*`）。実機で見て **bg / border の色味を調整したい**（具体方向はユーザーと iterative に詰める）。

- 会話バブル（normal / wolf / mason / mono / grave / seer）: ロール色を ~14% 混ぜた elev ベース + 左下 L 字 rim + 外側 halo。
- システムメッセージ（`from` 無し）の発言者名が **「システム」** と表示される（`Message.vue:84` の `return "システム"`）。情報通知箱（info_*）では発言者名は不要なので非表示にしたい。

## 対応方針

1. **会話バブルの色味調整**（メイン）
   - `Message.vue` scoped の `.msg-normal` / `.msg-wolf` / `.msg-mason` / `.msg-mono` / `.msg-grave` / `.msg-seer` の bg（`color-mix` のロール色割合）・border（L 字 rim の stop / `normal` の line-bright 枠）・halo を調整。
   - 具体値はユーザーフィードバックで決める。`var(--color-*)` トークンを単一情報源にし **rgba ハードコード禁止**を維持。
2. **システム発言者名「システム」の非表示**
   - `fromName` の `from` 無しフォールバックで「システム」を表示しない。ヘッダーの `flex-1` spacer は維持して `[狼]` 等のタグ・時刻の右寄せレイアウトを保つ。
   - **`CREATOR_SAY` の「村建て」はゲーム主の発言として残す**（消すのは literal「システム」のみ）。

## スコープ・注意

- 色味調整の対象は **会話バブルのみ**。`info_*`（firewolf dark 準拠のシステム通知箱）の配色は今回スコープ外。
- 個人識別カラー（`message-color.ts`）は変更しない。
- 本文の AA コントラスト（`text-fg` / `text-fg-secondary`）を維持。
- UI ダーク化シリーズの一部 → **`feature/dark-design` 向け**（main に直接出さない）。

## 影響範囲

- `frontend/app/components/pages/village/message/Message.vue` — `fromName`（81-85行）/ scoped `.msg-*`（312-536行）
- 必要に応じて `frontend/DESIGN.md`「チャットメッセージ」節を更新

## 動作確認

- `pnpm lint:fix && pnpm format && pnpm type-check` / `pnpm build`
- E2E 未整備のため目視: 村画面チャットで各 variant の bg/border が意図通りか、システム通知に「システム」が出ないこと、村建て発言は「村建て」が残ること、タグ・時刻の右寄せが崩れないこと

## release-note

- 対象外（dark-design シリーズのサブ PR は個別 release-note を追加せず、`feature/dark-design` → `main` 統合 PR で一括追記する運用）

## 関連

- `frontend/app/components/pages/village/message/Message.vue:81`（`fromName`）/ `:312`（`.msg-*`）
- `frontend/app/assets/css/main.css` の `--color-sysmsg-*`、`frontend/DESIGN.md`「チャットメッセージ」節
- PR #6（Chat Message ロール色刷新）/ PR #16（Phase 5）
