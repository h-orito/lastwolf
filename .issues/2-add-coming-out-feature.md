---
id: 2
title: カミングアウト機能（CO・結果報告・まとめ表）の追加
type: enhancement
status: open
---

## 背景・現状

- 現状、プレイヤーが「自分は◯◯役職です」と明示的に宣言する CO（カミングアウト）機能が存在しない
- 占い結果・霊能結果なども、自由発言として書き込むしかなく、構造化された情報として記録・集計できない
- 結果整理表が無いため、村全体で誰が何を CO したか・結果は何かを一覧化できない
- 観戦者やまとめ役にとっても、ログを遡らないと判定状況が把握できず UX が悪い

## 対応方針

機能を 3 つに分けて実装する。

### A. CO（役職カミングアウト）

- プレイヤーは **最大 2 役職まで** CO 可能（途中で役職を変えるケース・両立 CO のケースを想定）
- CO は専用 API で登録・更新・解除する
- 公開発言扱いとし、発言ログにも残す（または専用メッセージタイプを新設）
- 自分が CO していない状態 / 1 役職 CO / 2 役職 CO を取り得る
- 各プレイヤーに対し「CO 中役職リスト」を保持

→ 仕様詳細（要確認）:
- 「2 役職まで」の意味: 同時に 2 つ宣言できるか（例: 占い + 共有）/ それとも CO を 2 回更新できるという意味か → **同時 2 役職保持の想定**で進める
- CO 可能な役職は全役職か、それとも結果を伴う役職に限定するか → **全役職許可**で進める
- 死亡後の CO 可否 / エピローグでの強制公開 → 既存仕様に従う（要確認）

### B. 能力結果報告

- 占い師 / 霊能者 / 狩人 / その他結果が出る役職について、結果を構造化して報告できる
- 報告内容: `日付` `対象者` `判定結果（白/黒/◯/×等）` + 任意コメント
- 報告は CO 中の役職に対してのみ可能（CO していない役職の結果は報告できない）
- 報告内容は公開発言として流れに乗りつつ、構造化データとして保持

→ 既存実装の `domain/model/skill/`, `domain/model/ability/`, `MessageType` を活用し、新規 MessageType（例: `CO発言` `CO結果報告`）を追加する想定

### C. 結果まとめ表

- 村ページに「CO まとめ表」を表示
- 行 = プレイヤー、列 = 日付（または役職）
- 各プレイヤーの CO 役職 / 各日の能力結果報告 を表形式で一覧
- 観戦者・参加者問わず閲覧可能（仕様確認: 進行中の表示制限がある場合は後述）
- レスポンシブ対応（スマホで横スクロール or 縦持ち時の表現を別途検討）

## スコープ・注意

- **新規 DB スキーマ追加**が必要になる可能性が高い（CO 履歴 / 能力結果報告テーブル）
  - 既存の `dbflute_lastwolfdb` の運用に従う（要確認）
- 既存の発言・能力・役職モデルとの整合を要確認
- CO の取り消し / 上書きの仕様は要確認（履歴を残すか、現在値だけ持つか）
- ゲーム進行ロジック（投票・襲撃・能力等）には**影響を与えない**（純粋な情報レイヤーの追加）
- 1 PR で全てやると差分が巨大化する → **Phase 分割を推奨**:
  - Phase 1: DB スキーマ + ドメイン + API（A の CO のみ）
  - Phase 2: 能力結果報告（B）
  - Phase 3: まとめ表 UI（C）
  - 各 Phase で別 Issue 起票

## 影響範囲

backend:
- `backend/dbflute_lastwolfdb/`（スキーマ追加）
- `backend/src/main/kotlin/com/ort/lastwolf/domain/model/` 配下に新規 model 追加
- `backend/src/main/kotlin/com/ort/lastwolf/domain/model/message/MessageType.kt`
- `backend/src/main/kotlin/com/ort/lastwolf/api/controller/`（CO 関連 endpoint 追加）
- `backend/src/main/kotlin/com/ort/lastwolf/api/view/`（VillageView 拡張で CO 情報を含める）
- `backend/src/main/kotlin/com/ort/lastwolf/application/` の coordinator / service

frontend:
- `frontend/app/lib/api/openapi.json` / `schema.ts` 再生成
- `frontend/app/components/pages/village/` 配下に CO 入力 UI + まとめ表
- `frontend/app/stores/` で CO 状態を保持
- `frontend/app/pages/village.vue` 関連

## 動作確認

- backend: 既存テストパス、追加で CO 登録/更新/解除 + 結果報告の単体テスト
- frontend: `pnpm lint` / `pnpm type-check` / `pnpm build`
- E2E: 既存 Playwright に CO 操作シナリオを追加
- 手動確認:
  - 1 役職 CO → 結果報告できる
  - 2 役職 CO（例: 占い + 共有）できる、3 役職目はエラー
  - CO 解除できる
  - まとめ表が CO/結果に追従する
  - 観戦者からの見え方が想定通り

## release-note

- カミングアウト機能を追加: 最大 2 役職まで CO 可能・能力結果を構造化報告・まとめ表で一覧表示

## 関連

- `backend/src/main/kotlin/com/ort/lastwolf/domain/model/skill/Skill.kt`
- `backend/src/main/kotlin/com/ort/lastwolf/domain/model/ability/AbilityType.kt`
- `backend/src/main/kotlin/com/ort/lastwolf/domain/model/message/MessageType.kt`
- `backend/src/main/kotlin/com/ort/lastwolf/domain/model/message/Message.kt`
- `frontend/app/components/pages/village/participants/Participants.vue`
- `frontend/app/components/pages/village/progress/CurrentSituation.vue`
