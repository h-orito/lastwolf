---
id: 11
title: E2E テストを Playwright で構築する（基盤整備）
type: build
status: open
---

## 背景・現状

- リポジトリに `e2e/` ディレクトリは存在するが `.gitkeep` のみで中身が無く、E2E テスト基盤が未整備
- 現状はユーザー手動確認に頼っており、UI ダーク化（#3-#7）やブロック・通報機能（#8/#9）追加で回帰検知の必要性が増している
- 既存 Issue の「動作確認」セクションでも「既存 E2E で検知できるか」を毎回問うているが、実体が無い

## 対応方針

### ゴール（本 Issue の範囲）
- Playwright 一式を `e2e/` 配下にセットアップして、「最小 1 シナリオがローカルで安定して通る」状態を作る
- ローカル実行のみ。**CI 統合はスコープ外**

### スタック・構成案
- Playwright（TypeScript）
- パッケージマネージャ: frontend と揃える（pnpm 推定、要確認）
- ディレクトリ:
  - `e2e/playwright.config.ts`
  - `e2e/tests/` 配下に spec ファイル
  - `e2e/fixtures/` でログイン済みストレージ等を共通化
  - `e2e/pages/` で Page Object Model（任意。最小では省略可）
- 対象 URL: ローカル dev サーバ
  - frontend: `http://localhost:<frontend-port>` （Playwright が叩く先）
  - backend: `http://localhost:<backend-port>` （別ポート、frontend から API 呼ばれる）
  - ポート番号は frontend / backend それぞれの起動スクリプトを確認して `playwright.config.ts` の `baseURL` と env で扱う
- ブラウザ: Chromium のみで開始。Firefox / WebKit は後続

### 初回シナリオ（最小 1 本でよい）
- スモーク: トップページが開けて、主要要素（ロゴ / ログイン導線 等）が表示される
- 追加候補（本 Issue or 後続）:
  - ログイン → 村一覧表示
  - 村建て → 入村

### バックエンド・DB 構成
- backend / frontend は **別ポートで起動**（既存の開発フローと同じ）
- **DB は共通**（dev で使っているローカル DB をそのまま使う）
  - 専用の E2E DB は立てない
  - テスト用シードデータの投入はスコープ外（既存 dev データを前提とした read 系シナリオから始める）
- E2E 実行前提:
  1. backend を起動
  2. frontend dev server を起動
  3. `playwright test` を実行
- Playwright の `webServer` 機能で frontend / backend を自動起動するかは要検討（手起動でも可。重ければ初期は手起動）

### ログイン状態の作り方（Firebase Twitter OAuth 対策）
- 本アプリは Firebase Auth の Twitter ログインを採用しており、E2E で Twitter UI を駆動するのは現実的でない（ボット検知 / CAPTCHA / 2FA / 外部 UI セレクタ不安定）
- **採用方針: Custom Token によるログインバイパス**
  - Firebase Admin SDK で `createCustomToken(uid)` を発行
  - Playwright の `setup` project で `page.evaluate` 内から `signInWithCustomToken` を呼ぶ
  - 完了後 `storageState({ path, indexedDB: true })` で保存（Firebase Auth は IndexedDB に状態を持つので `indexedDB: true` 必須、Playwright ≥ 1.51）
  - 以降のテストは `storageState` を読み込んでログイン済みで始まる
- 前提準備:
  - 本番 Firebase プロジェクト内に **E2E 専用ユーザー（uid 固定）** を `admin.auth().createUser` で作っておく（Twitter 経由ではなく）
  - **service account JSON** を取得（git 管理しない。`.gitignore` 追加。CI 不要なので環境変数経由のローカル運用で十分）
  - frontend 側はソースコード変更不要（本番経路のまま Custom Token で署名するだけ）
- 構成イメージ:
  ```
  e2e/
    auth.setup.ts        # Custom Token 発行 → signInWithCustomToken → storageState 保存
    .auth/user.json      # 生成物（gitignore）
    .secrets/service-account.json  # gitignore
    playwright.config.ts # setup project + storageState 参照
  ```
- 本 Issue で「Custom Token によるログイン setup」も含めてセットアップする（初回スモークがログイン要否どちらでも、土台は作る）

## スコープ・注意

- スコープ内: Playwright のセットアップ、初回スモーク 1 本（ローカル実行）
- スコープ外: **CI 統合**、全機能の網羅的シナリオ、Visual Regression、E2E 専用 DB / シード整備（後続 Issue で必要に応じて）
- 注意:
  - flaky テストにしないため、要素特定は role / data-testid 優先。CSS クラスや tailwind クラス名 selector は禁止
  - DB を dev と共有するため、E2E が **データを書き換える系シナリオ** だと dev 環境を汚す。初期は read 系 or 副作用の小さいシナリオに限定する
  - frontend / backend / DB の起動順、ポート競合に注意（dev で既に使っている既定ポートを E2E でも流用する想定）
  - **service account JSON / E2E ユーザー uid を絶対に git にコミットしない**。`.gitignore` 追加と README に取得手順記載
  - **E2E 専用ユーザーで dev DB に副作用を残す可能性** に留意（村建てなど書き込み系をテストし始めたら別途データクリーンアップ戦略が必要）
  - 将来 CI に乗せたくなったタイミングで、DB を docker で隔離するなど別 Issue を立てる前提

## 影響範囲

- 新規:
  - `e2e/package.json`（`@playwright/test`, `firebase-admin` を含む）
  - `e2e/playwright.config.ts`（setup project + `storageState` 参照）
  - `e2e/auth.setup.ts`（Custom Token 発行 → `signInWithCustomToken` → `storageState({ indexedDB: true })`）
  - `e2e/tests/smoke.spec.ts`（初回。ログイン済み状態前提でよい）
  - `e2e/.gitignore`（`test-results/`, `playwright-report/`, `node_modules/`, `.auth/`, `.secrets/`）
- 変更:
  - ルート `README.md` に E2E 実行手順を追記（backend / frontend 起動 → `playwright test` の手順）
  - 既存 Issue テンプレ / `.issues/README.md` の動作確認チェックリストに「E2E 追加」項目をどう運用するか追記
- 変更なし:
  - `.github/workflows/` （CI 統合は本 Issue ではやらない）

## 動作確認

- backend / frontend をローカル起動した状態で `playwright test`（コマンドは確定後 README 記載）が成功する
- 故意に壊してみて trace / screenshot / レポートがローカルに出力されることを確認
- 手動確認:
  - [ ] ローカルで `playwright test` が成功
  - [ ] `playwright test --ui` でデバッグできる
  - [ ] 失敗時に HTML レポートが `playwright-report/` に生成される
  - [ ] frontend と backend が別ポートで起動した状態で API 呼び出しが通っている（スモークが API を叩く場合）
  - [ ] `auth.setup.ts` 実行後 `.auth/user.json` が生成され、本テストがログイン済み状態で開始される
  - [ ] `.auth/user.json` を削除して再実行すると setup から走り直す
  - [ ] service account JSON / `.auth/` が git 管理外になっている

## release-note

- 対象外（内部基盤）

## 関連

- 既存 `e2e/` ディレクトリ（`.gitkeep` のみ）
- 関連 Issue: 今後の全 Issue の「動作確認」セクションに影響（実体ができることで「既存 E2E で検知できるか」の問いに答えられるようになる）
- 後続候補: CI 統合、E2E 専用 DB / シード整備、Visual Regression、認証込みフロー、複数ブラウザ実行、人狼ゲーム進行 E2E
