---
id: 20
title: CreatorController のエンドポイントを Coordinator 経由に統一する
type: refactor
status: open
---

## 背景・現状

`CreatorController` の各エンドポイントは Coordinator 呼び出しと DomainService 直接呼び出しが混在しており、レイヤリングが不揃い:

- `startVillage`, `startRollCall`, `cancelRollCall`, `say`, `sayConfirm` → `VillageCoordinator` 経由
- `kick` → 直接 `villageService.updateVillageDifference + messageService.registerLeaveMessage` を Controller 内で組み立て
- `cancel` → 直接 `creatorDomainService.assertCancelVillage + villageService + messageService`（Issue #16 PR #7 で追加）

PR #7 の pr-reviewer から「cancel だけ Controller → DomainService 直接呼び出しになっておりレイヤー上の例外」と指摘された。

`VillageController` の `assertModifySetting / modifySetting` も同様で、`Coordinator` 側で `creatorDomainService.isAvailableModifySetting` を直接 if 判定しており、domain 側に `assertModifySetting` が存在しない。一方 `assertCancelVillage` は domain 側にある。`assert*` のパターンが揃っていない。

## 対応方針

### 1. CreatorController のエンドポイントを Coordinator メソッドに集約

`VillageCoordinator` に以下を追加:

- `kickParticipant(villageId, user, targetParticipantId)`
- `cancelVillage(villageId, user)`
- 既存 `startVillage / startRollCall / cancelRollCall / creatorSay / confirmToCreatorSay` と並列

Controller は Coordinator メソッドを呼ぶだけにする。これにより:
- レイヤリングが統一される（Controller → Coordinator → DomainService）
- **transaction boundary（`@Transactional`）が Coordinator に揃う**（現状 `kick / cancel` は Controller 直書きのため `@Transactional` が無く、`village 更新` と `message 登録` が別 transaction で動く可能性がある）
- ビジネスロジックの所在が明確になる

### 2. domain layer の assert メソッド整備

`CreatorDomainService` に以下を追加し、`Coordinator` は assert を呼ぶ形に揃える:

- `assertModifySetting(village, player)` （現状 Coordinator 側で `if (!isAvailableModifySetting(...))` でロールアップしている）
- `assertKick(village, player)` （現状未整備）

`assert*` パターンが揃うことで、将来「Coordinator と DomainService で判定ロジックがズレる」リスクを排除。

## スコープ・注意

- 振る舞いは一切変えない。純リファクタ
- transaction 境界を Coordinator に揃えるため `@Transactional` の付け替えが発生する
- 既存テスト (`./gradlew test`) で回帰検知

## 影響範囲

- `backend/src/main/kotlin/com/ort/lastwolf/api/controller/CreatorController.kt`
- `backend/src/main/kotlin/com/ort/lastwolf/api/controller/VillageController.kt`（assertModifySetting / modifySetting）
- `backend/src/main/kotlin/com/ort/lastwolf/application/coordinator/VillageCoordinator.kt`
- `backend/src/main/kotlin/com/ort/lastwolf/domain/service/creator/CreatorDomainService.kt`

## 動作確認

- backend: `./gradlew test` 既存テスト通過
- backend: `./gradlew compileKotlin --rerun-tasks` 通過
- backend: ローカルで各 creator エンドポイント (kick / cancel / start-village / start-rollcall / cancel-rollcall / say / say-confirm / setting / setting-confirm) を叩いて挙動が変わらないことを目視

## release-note

純内部リファクタのため対象外。

## 関連

- Issue #16 / PR #7 — cancel エンドポイント追加で Controller → DomainService 直接呼びの不整合が顕在化
- `backend/src/main/kotlin/com/ort/lastwolf/api/controller/CreatorController.kt` — kick / cancel が直書き
- `backend/src/main/kotlin/com/ort/lastwolf/application/coordinator/VillageCoordinator.kt:127` — assertModifySetting が `isAvailableModifySetting` を直接呼ぶ形
