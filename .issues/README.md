# Issues

ローカル Issue 管理ディレクトリ。`.issues/` は `.gitignore` 対象（ローカル管理）。完了した Issue はファイルごと削除する運用。

`/ship-issue [番号]` skill で 1 Issue = 1 PR を消化する。

## ステータス凡例

- `open` 未着手
- `in-progress` 対応中
- `wontfix` 対応しない（要理由）

完了したものは一覧から削除＆ファイル削除する。

## 一覧

| # | タイトル | type | status |
| --- | --- | --- | --- |
| 2 | カミングアウト機能（CO・結果報告・まとめ表）の追加 | enhancement | open |
| 8 | ブロック機能（特定ユーザーを自分の建てた村に入れない）の追加 | enhancement | open |
| 9 | 通報機能と管理者向け通報一覧ページの追加 | enhancement | open |
| 10 | チャット欄の min-height を viewport いっぱいに（スマホ 100vh 相当 / PC も縦いっぱい） | design | open |
| 11 | E2E テストを Playwright で構築する（基盤整備） | build | open |
| 12 | 村作成画面に短期人狼の定番ルールセット（12B 等）プリセットを追加 | enhancement | open |
| 17 | 進行中フェーズの残り時間を +30 秒する村建て向け機能を追加 | enhancement | open |
| 18 | 廃村メッセージ文言を進行中・決着でも違和感ない内容に調整する | enhancement | open |
| 19 | 廃村実行後のフロント側状態更新（リダイレクト or 自動再取得） | enhancement | open |
| 20 | CreatorController のエンドポイントを Coordinator 経由に統一する | refactor | open |
| 22 | PC 版村画面で参加者・進行カラムを 1/3 に、チャット側を 2/3 にする | enhancement | open |
| 23 | メッセージ会話バブルの bg/border 色味調整 + システム発言者名「システム」の非表示 | design | open |
| 24 | ユーザー表示設定機能の追加（文字サイズ / 画像表示モード: 非表示・0.5倍・通常） | enhancement | open |
| 25 | チャット入力欄を画面最下部に固定表示する（残り時間バー・ナビとの兼ね合いで要調整） | enhancement | open |

## 関連の依存・順序メモ

- **UI ダーク化 Phase（#3 ✅ → #4 ✅ → #5 ✅ → #6 ✅ → #7 ✅）は順番依存**。前 Phase の成果物に積み上げる構造。**Phase 1-5 すべて完了**、残りは `feature/dark-design` → `main` 統合 PR
  - #3 (トークン整備) は他の Phase の前提【完了】
  - #4 (base component + Black & Blood ピボット) は #5, #6 で利用される【完了 / PR #3 マージ済】
  - #5 の村画面情報設計はユーザー素材（スクショ赤入れ / draw.io / テキスト構造化）が前提なので着手前に相談
- **UI ダーク化シリーズは `feature/dark-design` 統合ブランチで束ねる**（main に直接マージしない、詳細は `HANDOFF.md`）
- #2 (カミングアウト機能) は UI ダーク化と独立。並行着手可（main 向け）
- #8 (ブロック機能) は UI ダーク化と独立。並行着手可（main 向け）
- #9 (通報機能 + 管理者ページ) は UI ダーク化と独立。#8 と概念は近いが別レイヤー（運営制限 vs 私的ブロック）。管理者ロール判定が未整備なら前提整備が必要
- #10 (チャット欄 min-height) は #3 (デザイントークン) で `--header-h` 等の variable が整備された後にやる方が手戻り少。逆順だと暫定値で書いて後で書き直しになる → **UI ダーク化シリーズに含めて `feature/dark-design` 向けにする想定**
- #11 (E2E 基盤) は他 Issue と独立で先行できる。完了すると以降の Issue の「動作確認」セクションで「E2E で検知できるか」が実体ある問いになる。早めに着手すると UI ダーク化シリーズの回帰検知に効く
- #12 (村作成プリセット) は UI ダーク化と独立。並行着手可（main 向け）。ただし #6 (Phase 4 各機能ページ刷新) で村作成画面も触る可能性が高いので、衝突回避のため順序整理した方がよい場合あり
- #13 Form 洗練 / #14 Chat Message 洗練 / #15 BaseButton 洗練 は完了済。Phase 2 派生は完了し、次は Phase 3 (#5) へ
- #17 (フェーズ +30秒) は UI ダーク化と独立。Creator 系機能拡張。Issue #16（廃村機能）で確立した認可・assert パターン（`assertCancelVillage` / `convertToSituation` に `user` 渡し）を流用可能
- #21 (画像を PC でも 1/2 表示) は **#24 に統合してクローズ済**（削除）。キャラ画像サイズは #24 の画像表示モードで一元管理し、**デフォルトを「0.5 倍」**とする（＝旧 #21 の意図を default で踏襲）
- **#25 (チャット入力欄を最下部固定) と #10 (チャット欄 min-height を viewport いっぱいに) は同じ固定フッター／`padding-bottom` 計算領域（`village.vue:56-90` / style `:440-454`）を触る**。別々に書くと余白計算が二重管理になりやすい。どちらかを先に入れてもう一方をその上で調整するか、まとめて対応するか着手前に整理する。#25 は「残り時間バー・ナビとの積み重ね要調整」前提で実機試行が必要

## 進行中の Phase 計画

UI 人狼世界観モダナイズ（Issue #1 で方針合意済み、`frontend/DESIGN.md` 参照）

| Phase | Issue | 対象 | 状態 |
| --- | --- | --- | --- |
| 0 | (#1) | デザイン方針合意 | 完了（PR #1, main） |
| 1 | (#3) | デザイントークン整備（CSS variables / Tailwind theme / フォント / message-color.ts） | 完了（PR #2, feature/dark-design） |
| 2 | (#4) | `components/ui/` 配下の base component 刷新 + チャットメッセージ + Black & Blood ピボット | 完了（PR #3, feature/dark-design） |
| 3 | (#5) | `layouts/` + `pages/index.vue` 等トップ周り + 村画面 panel + Message 視覚刷新 | 完了（PR #8, feature/dark-design） |
| 4 | #6 | 各機能ページ（村一覧・キャラチップ・記録 等）の刷新 | 完了（PR #10/#12/#13/#14, feature/dark-design） |
| 5 | #7 | アニメーション・トランジション（任意） | 完了（PR #16, feature/dark-design） |
| 統合 | - | feature/dark-design → main の最終 PR（Phase 1-5 完了後） | 未着手 |

## 作業フロー

`/ship-issue [番号]` skill が標準化済み。要点のみ:

### 1. ブランチを切る

```
<type>/<issue-number>-<short-slug>
```

`type` は Issue frontmatter の `type` に合わせる:
- `bug` → `fix`
- `design` / `refactor` → `refactor`
- `a11y` / `code-quality` → `refactor` または `chore`
- `enhancement` / `build` → `chore`
- `performance` → `perf`

### 2. 実装

Issue の「対応案」を踏まえて修正。スコープ外には踏み込まない。

### 3. 動作確認

各プロジェクトの CLAUDE.md で定義された lint / build / test を実行。E2E がある場合は既存 E2E 実行 → 追加可能なら追加 → 困難なら PR 本文に手動確認手順を明記。

### 4. コミット

Conventional Commits。末尾に Issue 番号:

```
fix: <変更内容> (#14)
```

### 5. PR を作る

```
gh pr create --title "<conventional commit と同じ>" --body "<テンプレ>"
```

PR 本文テンプレ:

```
closes .issues/XX-<slug>.md

## 変更内容
- ...

## 動作確認
- [ ] lint
- [ ] build （該当時）
- [ ] 既存 E2E （該当時）
- [ ] 追加 E2E: <シナリオ名> （該当時）
- [ ] ユーザー手動確認依頼: <手順> （該当時）
```

### 6. レビュー（pr-reviewer サブエージェント）

PR 作成直後に `pr-reviewer` サブエージェントを呼び出す。実装意図や重点観点は **渡さない**:

```
Agent({ subagent_type: "pr-reviewer", prompt: "PR #XX" })
```

サブエージェントは `.reviews/PR-XX.md` にレビュー結果を書き出す。

反映フロー:
1. `.reviews/PR-XX.md` を読む
2. must-fix / should-fix を修正コミット → push
3. nits は採否を判断
4. 反映が必要だった場合は `pr-reviewer` を再呼び出し
5. ユーザーに簡潔に報告
6. `.reviews/PR-XX.md` を削除

### 7. マージ後

- ユーザー確認の上 squash merge
- `.issues/XX-<slug>.md` を削除
- README の一覧表から該当行を削除
- `.issues/HANDOFF.md` を更新

## 並行作業（git worktree）

レビュー待ちの間に次の Issue 着手したい場合などは worktree 利用可。注意:

- ポート競合（dev server / DB）に注意
- 共有スキーマ / 共有 codegen 出力は worktree を分けない
