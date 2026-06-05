---
id: 17
title: 進行中フェーズの残り時間を +30 秒する村建て向け機能を追加
type: enhancement
status: open
---

## 背景・現状

進行中フェーズ（昼 / 投票 / 夜）の残り時間が迫って議論や投票が間に合わないケースで、現状は村建てが介入する手段がない。決着がもつれているのに時間切れで強制日付変更、というケースが救えない。

GM（村建て / 管理者）向けに「現在のフェーズの残り時間を +30 秒する」操作を追加して、進行裁量を持たせたい。

既存の類似実装が `DebugController` にある:

- `backend/src/main/kotlin/com/ort/lastwolf/api/controller/DebugController.kt:148-164` の `change-day`（最新日の残り時間を 10 秒に固定）
- ロジックは `villageDayBhv.selectEntityWithDeletedCheck` → `endDatetime = ...` → `update` の 3 行
- ただし環境ガード `"local" != env` でローカル専用。本番では使えない

進行判定側は `village.days.latestDay().endDatetime` を見て自然にループ継続するため、`endDatetime` を +30s 更新すれば日付変更が走らず延長される（`ProgressDomainService.kt:68`, `EpilogueDomainService.kt:75`, `RollCallingDomainService.kt:107`）。

## 対応方針

### 1. API 追加（村建て向け endpoint）

`CreatorController` に新規 endpoint を追加:

```
POST /creator/village/{villageId}/extend-phase
```

処理:

1. 権限チェック（既存の `村建てか管理者` ガードを踏襲）
2. `CreatorDomainService` の判定で進行中フェーズかつ未終了であることを確認
3. `village.days.latestDay()` の `endDatetime` に **+30 秒**
4. シスメで「村建ての操作によりフェーズの残り時間を30秒延長しました。」を流す（要文言確認）

### 2. ドメイン側

- `CreatorDomainService` に `isAvailableExtendPhase(village, player)` を追加し、`VillageCreatorSituation` にも `isAvailableExtendPhase` / `@JsonProperty("available_extend_phase")` を生やす
- 判定条件案:
  - 既存 `isAvailableCreatorSetting` ガード（管理者 / 村建て / 未終了）
  - `village.status.isProgress()` のみ true（タイトルが「進行中に」と限定しているため、点呼中・募集中・決着・エピローグ・廃村は false）
  - 連打抑制の要否は要確認 → 下記 §3
- `Village` モデル側に `extendCurrentPhase(seconds: Long): Village` のような pure な「最新日 endDatetime を +N 秒した Village を返す」メソッドを追加し、Controller からは domain 経由で呼ぶ
- シスメ生成は `Village.createCreatorCancelVillageMessage()` と並べて `createCreatorExtendPhaseMessage(seconds)` を追加

### 3. 連打抑制の要否（要確認ポイント）

タイトルは「+30秒」固定だが、無制限連打を許すかが要確認:

- **Option A (連打 OK / 制約なし)**: 村建ての裁量に完全に委ねる。シンプル。悪用される懸念は GM 性善説でカバー
- **Option B (1 フェーズあたり N 回)**: VillageDay に延長回数カラム追加 or 別テーブルで集計。スキーマ変更が伴う
- **Option C (インターバル)**: 最後の延長時刻から 30 秒経過しないと再度叩けない。状態管理が複雑

最小スコープなら **A**。`B` は別 Issue 切り出し推奨。Issue 着手時にユーザーに確認。

### 4. フロント

`frontend/app/components/pages/village/creator/Creator.vue` に「+30秒」ボタンを追加:

- 表示制御: `situation.creator.available_extend_phase` フラグ
- 配置: 既存の「村の開始/廃村」セクション周辺、もしくは「進行中」セクション
- 連打抑制（クライアント側）: API 応答完了まで disabled（既存の `submitting` パターン踏襲）
- 押下後、村情報の再フェッチ（既存パターン踏襲）でタイマーが更新される

`ProgressBar.vue` のタイマーは `endDatetime` 起点で `setInterval` 更新しているため、村情報再フェッチ後に自動的に +30s 反映される（追加実装不要のはず、要確認）。

### 5. 秒数の定数化

`30` は将来変更の可能性があるため定数として `Village` の companion か `CreatorDomainService` 内に切り出す。API パラメータで秒数を受ける必要は今回なし（固定で OK）。

## スコープ・注意

- **進行中（`isProgress()`）のみ**。プロローグ / 点呼中 / 決着 / エピローグ / 廃村は対象外（タイトル準拠）
- 権限: 既存 `creator setting` ガード踏襲（村建て + 管理者）
- 連打制限はデフォルト **なし**（Option A）で実装。必要なら Issue 着手時に変更
- スキーマ変更は **避ける**（VillageDay に延長回数を追加するなら別 Issue）
- 既存の日付変更ロジック / バッチが `endDatetime` 更新後も整合的に動くこと（基本は `endDatetime` を見るだけなので問題ない想定）
- 秒数は固定 30。API で可変にする / フロントから秒数選択させる、は今回スコープ外

## 影響範囲

- バックエンド:
  - `backend/src/main/kotlin/com/ort/lastwolf/api/controller/CreatorController.kt`（新 endpoint）
  - `backend/src/main/kotlin/com/ort/lastwolf/domain/service/creator/CreatorDomainService.kt`（`isAvailableExtendPhase` 追加）
  - `backend/src/main/kotlin/com/ort/lastwolf/domain/model/myself/participant/VillageCreatorSituation.kt`（フィールド追加）
  - `backend/src/main/kotlin/com/ort/lastwolf/domain/model/village/Village.kt`（`extendCurrentPhase` + シスメ生成）
  - `backend/src/main/kotlin/com/ort/lastwolf/application/service/VillageService.kt`（必要に応じて）
- フロント:
  - `frontend/app/components/pages/village/creator/Creator.vue`（ボタン追加）
  - 必要なら `frontend/app/lib/api/` の型定義 / クライアント追加
- 動作確認のみ:
  - `frontend/app/components/pages/village/progress/ProgressBar.vue`（再フェッチ後タイマー更新）
  - `backend/src/main/kotlin/com/ort/lastwolf/domain/service/daychange/ProgressDomainService.kt`（延長後の日付変更条件が破綻しない）

## 動作確認

- backend:
  - `./gradlew test`（既存テストが落ちないこと）
  - DebugController の `change-day` で残り時間を 10 秒にした上で、新 endpoint を叩いて 40 秒に延びることを確認
  - 進行中以外（プロローグ / 点呼中 / 決着 / エピローグ / 廃村）で 403 or 400 が返ることを確認
  - 村建てでない一般プレイヤーが叩いて 403 が返ることを確認
- frontend:
  - `pnpm lint:fix && pnpm format && pnpm type-check && pnpm build`
  - `pnpm dev` で進行中の村に村建てログインし、「+30秒」ボタンが表示・押下できる
  - 押下後 ProgressBar の残り時間が伸びている / シスメが流れている
  - 募集中・点呼中・決着・エピローグ・廃村ではボタンが非表示
- E2E: なし（#11 で整備予定）

## release-note

ユーザー（村建て / 管理者）視点の機能追加のため記載対象。

例: 「進行中フェーズの残り時間を +30 秒できる村建て向け機能を追加しました」

## 関連

- `backend/src/main/kotlin/com/ort/lastwolf/api/controller/DebugController.kt:148` — 参考実装（残り 10 秒固定）
- `backend/src/main/kotlin/com/ort/lastwolf/api/controller/CreatorController.kt` — 追加先のコントローラ
- `backend/src/main/kotlin/com/ort/lastwolf/domain/service/creator/CreatorDomainService.kt:79` — `isAvailable*` 系判定の置き場所
- `backend/src/main/kotlin/com/ort/lastwolf/domain/model/village/VillageDay.kt:13` — `endDatetime`
- `frontend/app/components/pages/village/progress/ProgressBar.vue:19` — タイマー表示
- Issue #16 — 同じく Creator 系の機能拡張（廃村の進行中許可）
