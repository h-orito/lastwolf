---
id: 19
title: 廃村実行後のフロント側状態更新（リダイレクト or 自動再取得）
type: enhancement
status: open
---

## 背景・現状

廃村 API (`POST /creator/village/{villageId}/cancel`) は `void` を返すだけで、フロント側 (`Creator.vue#cancelVillage`) も成功時に何もしない:

- `backend/src/main/kotlin/com/ort/lastwolf/api/controller/CreatorController.kt:58-74` — レスポンスボディなし（リダイレクト指示や更新後 village も返さない）
- `frontend/app/components/pages/village/creator/Creator.vue:255-268` — `apiCall` 後に `submitting=false` するだけ。`villageStore` の再取得 / トップへのリダイレクト / トーストなし

結果として、廃村実行後も村画面は廃村前の status のまま表示され、参加者が混乱する可能性がある（次のポーリング or 手動リロードで初めて廃村反映）。

**Issue #16 (PR #7) で進行中・決着でも廃村可能になったことで、この既存の挙動の不親切さがより顕在化する**。プロローグ時にも同じ問題は存在するが、進行中の村ではプレイヤーが画面を開きっぱなしになっているケースが多いため影響範囲が広がる。

## 対応方針

### 案 A: 廃村後にトップページへリダイレクト

`cancelVillage` 成功後に `navigateTo('/')` で村一覧に戻す。最小変更で確実に状態破棄。

- メリット: 廃村された村画面を見続けるという中途半端な状態を防げる
- デメリット: 自分が操作したユーザーは自然だが、他参加者は次のポーリングまで反映されない（API 自体の話）

### 案 B: 廃村成功時に villageStore.refetch() を呼ぶ

`villageStore` の村情報・situation を再取得し、UI が「廃村」状態を反映する。村画面で「この村は廃村されました」表示を出す前提。

- メリット: 操作した本人にも他のタブにも反映できる（厳密にはタブごとに再取得が必要）
- デメリット: 廃村状態の村画面表示を別途整える必要がある

### 案 C: バックエンドからリダイレクト URL を返す

API レスポンスに `redirect_url: "/"` を含めてフロントが従う。スキーマ変更が必要。

### 推奨

最小スコープなら案 A。`villageStore` の再取得実装が既にあるなら案 B も低コスト。実装前に確認。

## 他参加者への波及

廃村は村建て or 管理者の操作だが、参加者は別端末で同じ村を開いているケースが想定される。これらは引き続きポーリング (`dayChangeIfNeeded` 経由) で次回更新時に廃村が反映される。ただし `DayChangeDomainService` は廃村を no-op で処理するため、フロントが「村ステータスが廃村に変わった」ことを検知して画面更新する仕組みが既にあるかは別途要確認。

## スコープ・注意

- 廃村 API 自体のシグネチャ・権限ロジックには触らない（Issue #16 と分離）
- フロントの遷移 / 再取得が中心
- 廃村された村画面の UI（「この村は廃村されました」表示）が必要なら、合わせて整える

## 影響範囲

- `frontend/app/components/pages/village/creator/Creator.vue`（`cancelVillage` 関数の成功時処理）
- 場合により `frontend/app/.../villageStore`（再取得ロジック確認）
- 場合により `frontend/app/pages/village/[id]/index.vue` 周り（廃村状態の表示制御）

## 動作確認

- frontend: `pnpm lint:fix && pnpm format && pnpm type-check && pnpm build`
- 操作: 廃村実行 → 期待通りリダイレクト or 状態更新されることを目視
- 他参加者視点: 別タブで村画面を開いた状態で廃村実行 → ポーリングで状態反映されることを確認

## release-note

ユーザー体験の改善のため記載対象。

例: 「廃村実行後に村画面が自動で更新されるようになりました」

## 関連

- Issue #16 / PR #7（進行中・決着でも廃村可能化）
- `frontend/app/components/pages/village/creator/Creator.vue:249` — `cancelVillage` 関数
- `backend/src/main/kotlin/com/ort/lastwolf/api/controller/CreatorController.kt:58` — `/cancel` API
