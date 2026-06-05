# 次セッションへの申し送り

## TL;DR

- main 最新マージ PR: **PR #11 (root `.gitignore` に `.serena/` 追加 / tooling)** マージ済 (2026-05-29)。機能系の直近は PR #7 (Issue #16 / 廃村機能, 2026-05-26)
- `feature/dark-design` 最新: **PR #16 (Issue #7 / Phase 5「モーション」- ページ遷移 + reduced-motion ガード)** マージ済 (2026-06-05)
- Phase 1 ✅ / Phase 2 ✅ / Phase 3 ✅ / Phase 4 (#6) ✅ / **Phase 5 (#7) ✅ 完了**。**UI ダーク化シリーズ Phase 1-5 が全完了**
- 次の着手候補:
  - **`feature/dark-design` → `main` 統合 PR（本命・残る唯一のシリーズ作業）** — Phase 1-5 + 派生 (#13/#14/#15) がすべて積まれた。統合 PR で **release-note にデザイン刷新エントリを一括追記**すること（シリーズのサブ PR #8/#10/#12/#13/#14/#16 は個別 release-note を追加していない）。`frontend/app/pages/release-note.vue` のリスト先頭に追記。**ユーザー手動確認待ち**（後述）を統合前に消化推奨
  - UI ダーク化と独立: #2 / #8 / #9 / #10 / #11 / #12 / #17 / #18 / #19 / #20 は main 向けで並行着手可
  - 共通クラス（main.css 集約済）: `.panel` / `.panel-compact` / `.registry` / `.section-heading` + `.section-title` / `.doc-section-heading` + `.doc-sub-heading` / `.doc-table` + `.row-stripe` / `.text-link` / `registry-creator`。フォーム本文は default レイアウトの `text-center` を `text-left` で打ち消す（見出しは `.section-heading` 側で中央寄せ）
- 着手は `/ship-issue <番号>`（ワークフローは skill が標準化済み）
- 開始プロンプト: `.issues/HANDOFF.md を読んで、未着手 Issue があれば着手、なければ派生 nits の整理を提案してください`

## ⚠️ Phase 2 完了時のデザイン方針ピボット (2026-05-26)

- **steel-blue（月夜）系から Black & Blood（黒地に赤光が差し込む directional lighting）に全面ピボット**
- 旧 `top.jpg` を `lastwolf.webp` / `lastwolf-mobile.webp`（赤グロー狼）に差し替え
- 旧トークン `steel / steel-deep / moon / halo / glow` を削除、新トークン `blood / blood-deep / ember / bone / wine` を追加
- ボタンは pill rounded-full、directional 黒+赤グラデで rim glow が光る構造
- 詳細は `frontend/DESIGN.md` 参照

## ⚠️ UI ダーク化シリーズの運用ルール

**Phase 1-5 (Issue #3 ✅, #4 ✅, #5 ✅, #6 ✅, #7 ✅) は単体で main にマージしない**。途中で main にマージすると本番が中途半端な状態になるため、統合ブランチで束ねる:

- **統合ブランチ**: `feature/dark-design`（main から派生）
- **各 Phase のワークフロー**:
  1. `feature/dark-design` から作業ブランチを切る（例: `design/13-input-switch-refine`）
  2. PR は **base = `feature/dark-design`** で作成（`gh pr create --base feature/dark-design ...`）
  3. pr-reviewer / レビュー反映 / squash merge は通常通り（merge 先は `feature/dark-design`）
- **最終統合 PR**: Phase 1-5 (#3〜#7 ✅) + 派生 (#13 ✅ / #14 ✅ / #15 ✅) すべて積まれた。あとは `feature/dark-design` → `main` の PR を出して一括リリースするのみ
- 既にマージ済みの PR #1 (Phase 0 / DESIGN.md のみ) は方針合意ドキュメントなので main にあって問題なし
- **#2 (CO 機能) / #8 (ブロック機能) / #9 (通報) / #11 (E2E) / #12 (村作成プリセット) はこのシリーズと無関係なので通常通り main 向け PR**

## ワークフロー

- **1 Issue 消化**: `/ship-issue [番号]` skill を使用（`~/.claude/skills/ship-issue/SKILL.md`）
  - ブランチ作成 → 実装 → lint/build/test → release-note → PR → pr-reviewer → 反映 → squash merge → 後片付け までを標準化
- **Issue 追加**: `/add-issue <タイトル>` skill を使用（`~/.claude/skills/add-issue/SKILL.md`）
- **PR レビュー**: PR 作成後に `Agent({ subagent_type: "pr-reviewer", prompt: "PR #XX" })`。実装意図は渡さない
- 詳細手順: `.issues/README.md`

## 必ず守るルール

- **PR レビュー指摘は省略しない**: must/should-fix 反映、nits も基本反映。スコープ外は PR 本文に明記
- **同パターンが他にないか必ず grep**: 修正は単点でなく面で
- **dead config を疑う**: 設定変更前に grep で利用箇所を確認
- **frontend のコード規約**: `frontend/.claude/rules/code-style.md` 参照。`any` / `as any` / `as unknown` / `@ts-ignore` / `// eslint-disable` 禁止
- **コミット前**: `pnpm lint:fix && pnpm format && pnpm type-check`（frontend）
- **デザインの単一情報源**: `frontend/DESIGN.md`。色・タイポ・コンポーネント方針はここ参照。逸脱する場合は DESIGN.md を更新してから
- **`/dev/*` ページは `middleware: dev-only` でガードする**（本番 404）。Phase 2 で `/dev/design`, `/dev/button-proposals`, `/dev/black-red-proposal` を追加済み

## 動作確認の標準セット

frontend:
- `lint`: `pnpm lint`（oxlint）
- `build`: `pnpm build`
- `test`: `pnpm test:run`（unit）/ `pnpm test:e2e`（E2E）
- `type-check`: `pnpm type-check`

backend: (未調査・必要時に補完)

## 派生課題（未着手）

- **`lib/api/message-color.ts` の個人識別 10 色のコントラスト**: ピボット後の `bg-elev #100808` 上で 4.5:1 を満たすか未検証
- **`message-role.ts` の LOVERS_SAY / SECRET_SAY / PRIVATE_FOX / PRIVATE_SYMPATHIZER / PRIVATE_LOVERS の扱い**: 現状 normal フォールバック。DESIGN.md でロール色を定義するか別 Issue 化検討（message-role.ts にコメント追記済）
- **FormInput / FormSelect の rgba ハードコード**: directional lighting のチューニング値が token に直接マップできない（warm peach / warm dark）ため未変換のまま。Phase 4 等で必要なら専用トークン化を検討
- **Ability.vue の `abilityMessageLines` の exhaustive switch**: 将来 abilityType 追加時に無音 UI になるリスク。defaul ケース対応は Phase 4 等で
- **`<a :href>` の URL スキーム検証なし（XSS）**: PR #13 レビューで `charachip.vue` の `charachip.description_url` が `javascript:` スキームだと XSS になりうる点を指摘（API スキーマにプロトコル制約なし）。charachip だけでなくアプリ全体の `<a :href>`（姉妹サイトリンク等）に共通する横断課題のため単点修正は見送り。`http(s):` のみ許可する共通ヘルパ or directive を別 Issue 化して面で対応する想定
- **記録系の `toPercent` 重複**: `player-record.vue` / `record/CampRecords.vue` / `record/SkillRecords.vue` に同一の `toPercent` がコピーされている（PR #13 では挙動非変更のため未統合）。composable or util への切り出し余地
- **PreviewModal の `submitting` が即解除**: `create()` が `emit("create")` を await しないため `submitting.value = false` が即実行され、loading 表示が機能していない（PR #14 レビュー nit、既存挙動でスコープ外）。成功時は親が `window.location.href` で遷移するため実害は小だが、emit を async 契約にして await すれば loading が効く
- **village store の composable 経由化**: `Message.vue` 等の村画面コンポーネントが `useVillageStore()` を直接呼んでいる（code-style.md「store は composables 経由」に違反）。`Message.vue` だけでなく `Participants/Progress/Creator/DayMessages` 等 村画面全体に横断する既存課題。`useVillage()` 的な composable を整備して一括で寄せるのが筋（PR #17 レビューで繰り返し指摘 / 単点修正は見送り）

## ユーザー手動確認待ち（本番デプロイ後）

- **PR #16 (Phase 5 モーション)**: E2E 未整備のため目視確認依頼。①ページ遷移 fade が**全遷移（トップ⇄他ページ含む）**で効き、**白フラッシュ・間延びが無い**こと（要 dev 再起動 / リロードでなく NuxtLink 遷移）。②**レイアウト統合の副作用チェック**: 旧 `top.vue` を削除し `default.vue` が `route.path === "/"` でのみ NavBar 非表示にする方式に変更したため、トップで NavBar が出ない/他ページで NavBar が出る/トップ⇄他で NavBar が即時に出入りする動きが許容範囲か。③OS のモーション低減 ON で遷移 fade が止まること。※ Spotlight 揺らぎ・メッセージ fade-in は実装後にユーザー判断で**不採用**（削除済）
- **PR #3 (Black & Blood ピボット)**: E2E でカバーできていないので、main 統合後にトップ・モーダル・各種ボタン・Toast の見え方を目視確認
- **PR #4 (Form 洗練)**: 実機で focus 時の blood halo の強さが眩しくないか、複数行 stack 時に rim が騒がしくないかの最終チェック
- **PR #13 (詳細系ダーク化)**: E2E 未整備のため目視確認依頼。`/charachip?id=<id>`（パネル化・キャラセルがダークセル枠になっているか / 取得失敗時メッセージ）、`/player-record?id=<id>`（4 パネル分割・戦績テーブル 3 種が doc-table 罫線で読めるか / 村名リンクの blood ホバー / 取得失敗と「見つかりませんでした」の出し分け）
- **PR #14 (設定系ダーク化)**: E2E 未整備のため目視確認依頼。`/create-village`（単一 panel + 各セクション doc-section-heading、**datetime-local の native ピッカー/カレンダーアイコンがダークで読めるか** = `color-scheme: dark` の効き、note box、確認→PreviewModal の doc-table と `?` トグル、村作成まで一連）、`/village-setting?id=<id>`（戻るボタン secondary、既存設定の読込→変更）、バリデーションエラー時の blood エラー box。フォーム本文・箇条書きが左寄せ・見出しが中央なのも確認

## 完了済み

- **PR #16** (Issue #7 / Phase 5「モーション」, feature/dark-design, 2026-06-05) — **Phase 5 完了 = UI ダーク化シリーズ Phase 1-5 全完了**。控えめなモーション + アクセシビリティ:
  - **ページ遷移 fade**: `app.pageTransition` (`name: "page"` / `out-in`) を配線（従来 `main.css` の `.page-*` は定義のみで dead だった）。leave 0.12s / enter 0.22s + `translateY(8px)→0`、transform/opacity のみ
  - **レイアウト統合（重要）**: トップ⇄他ページ（最頻動線）でページ遷移が効かない問題の構造的解決。原因は**トップだけ別レイアウト** (`layout: top`)。`top.vue` と `default.vue` の差分は **NavBar 有無のみ**だったため `top.vue` を削除し `default.vue` に統合、`route.path === "/"` のときだけ NavBar を非表示にして旧 top を再現。これでレイアウト swap が消滅し全遷移で pageTransition が一貫適用。**`layoutTransition` は不採用**（out-in だとレイアウトが一旦消え、その隙間で**グローバル背景の白が露出**＝`.site-bg` はレイアウト側のみが持ち html/body にダーク指定が無いため「一瞬真っ白＋間延び」になった）
  - **prefers-reduced-motion**: `main.css` にグローバル `@media (prefers-reduced-motion: reduce)` ガード（`*` に `animation/transition-duration: 0.01ms !important`）。個別実装のガード漏れを防ぐ単一の防波堤
  - **不採用（ユーザー判断で削除）**: Spotlight 血光の揺らぎ（ヒーロー画像の赤オーラと被る）/ メッセージ fade-in（不要との判断）。当初実装したが実機確認後に撤去
  - レビュー（pr-reviewer）: should-fix「TransitionGroup の no-appear remount で一括アニメーションするのでは」は **Vue 3.5.33 のソース（resolveTransitionHooks の state.isMounted ガード）で検証し棄却**（その後メッセージ fade-in 自体を削除したため moot）
  - **派生メモ**: html/body にダーク背景指定が無い（白フラッシュの遠因）。今は単一レイアウト + min-height:100dvh で実害無いが、将来 layoutTransition 等を入れるなら `html, body { background: var(--color-deep) }` を先に敷くこと
- **PR #14** (Issue #6 / Phase 4「設定系」, feature/dark-design, 2026-05-31) — **Phase 4 完了**。村作成 / 村設定変更 + create-village セクション群をダーク化:
  - **create-village.vue / village-setting.vue**: light `<hr border-gray-200>` 区切り → 単一 `.panel` + `.section-heading` h1。各セクションは `.doc-section-heading`（左 h2）で区切る（doc ページの multi-panel ではなく、フォームは 1 タスク = 1 panel という判断。5 セクションを個別 panel にすると glow カードが煩雑なため）
  - **本文の左寄せ**: panel 化で元の `text-left` コンテナを外したため、default レイアウトの `.site-content text-center` を箇条書き・ラベル・note が継承して中央寄せになっていた → 本文コンテナに `text-left` 付与（見出しは `.section-heading` 側で中央維持）。**この罠は他のフォーム系ページ刷新でも再発しうるので注意**
  - **create-village/* セクション**: 見出し `text-base font-semibold` → `.doc-section-heading`（BasicInfo の「時間」は `.doc-sub-heading`）。注意書き box `bg-blue-50` → `border-line-soft bg-soft text-fg`、仕様リンク → `.text-link`
  - **datetime-local 対応**: BasicInfoSection の生 `<input type=datetime-local>` を `UiFormInput type=datetime-local` に置換。`FormInput` の type union に `datetime-local` 追加 + min/max を `number|string` に + `.br-input` に `color-scheme: dark`（number spinner / datetime native ピッカーをダーク描画）
  - **PreviewModal**: light table → `.doc-table` + `.row-stripe`、`?` トグルをダーク。value セルの `v-html="...replace(\n→<br>)"` を `whitespace-pre-line` に置換（同出力で村名・編成の user 入力由来 XSS を撤去）
  - バリデーションエラー box を blood ダーク（`border-blood-deep` + `bg-wine/40`）に、戻るボタンを `UiButton secondary :to` に
  - レビュー反映: `startDatetime` の no-op `.replace("T","T")` 撤去（両ページ）、village-setting の未使用 `charachipErrors` 削除
- **PR #13** (Issue #6 / Phase 4「詳細系」, feature/dark-design, 2026-05-30) — キャラチップ詳細 / 戦績ページ + 記録テーブルをダーク化:
  - **charachip.vue**: light `bg-gray-100` section → `.panel` + `.section-heading`。キャラ表示セルを旧 `.chara-select-box`（`#ccc` border / 16px radius）から `CharaSelectModal` と同じダークセル（`rounded-lg` / `border-line-soft` / `bg-elev`）に統一し scoped style を撤去。状態表示を charachip-list と同じ `hasError` 3 分岐に拡充（従来は catch が `console.error` のみで取得失敗も「見つかりませんでした」に落ちていた）。`description_url` リンクに `rel="noopener"`
  - **player-record.vue**: 各セクションを個別 `.panel` + 中央寄せ `.section-heading` に分割（about/rule パターン）。プレイヤー名 h1 + 総合戦績を profile header に。レビュー反映で `hasError` を追加し ローディング/取得失敗/データなし/データあり の 4 分岐に（charachip と統一）
  - **record/CampRecords・SkillRecords・ParticipateVillageList**: light table（`bg-white`/`border-gray-300`/`odd:even:`）→ `.doc-table` + `.row-stripe`。村名リンク `text-blue-600` → `.text-link`、空状態 `text-gray-500` → `text-fg-muted`。空文言を文脈に合わせ修正（陣営戦績/役職戦績がありません）
  - **id 型ガード**: `charachip.vue` の `charachipId` を `typeof id === "string"` ガードに（配列クエリで不正 URL になるのを防止、player-record と同パターン）
  - **chart.js**: `package.json` に依存はあるが `app/` で未使用を確認（Issue 記載の「記録系の chart.js ダーク対応」は不要だった）
  - **release-note は統合 PR に集約**: dark-design シリーズのサブ PR (#8/#10/#12/#13) は個別 release-note を追加せず、`feature/dark-design` → `main` 統合 PR で一括追記する運用
  - 派生 nit（未対応・スコープ外）: `description_url` 等 `<a :href>` の URL スキーム検証なし（XSS）/ `toPercent` 重複 → 「派生課題」に記録
- **PR #12** (Issue #6 / Phase 4「6b 一覧系」, feature/dark-design, 2026-05-29) — 終了した村一覧 / キャラチップ一覧をダーク化:
  - **village-list**: light table → `panel` + `section-heading` + `registry`。既存 `CompleteVillageList` を再利用しトップの「最近終了した村」と統一。ローディング / 取得失敗 / 空状態を `hasError` で 3 分岐（rule.vue と同じ文言）
  - **charachip-list**: light table → `panel` + `doc-table`（rule 役職表と同パターン）+ `.text-link` / `.row-stripe`。状態表示も 3 分岐（table 系は registry-state でなく text-fg-muted、意図をコメント明記）
  - **完了村 registry 改善（ユーザー要望）**: 作成者を表示（VillageList と同じ「作成者:」形式）、勝利陣営を「村人陣営」→「**村人陣営勝利**」に（引分は「引分」）。`registry-creator` / `registry-creator-label` を VillageList と共用のため main.css に集約。`CompleteVillageList` に `label` prop 追加（nav aria-label を文脈別に：トップ「最近終了した村一覧」/ 村一覧ページ「終了した村一覧」）。**トップの「最近終了した村」欄も同表示に変化**
  - 派生 nit（未対応・スコープ外）: 「引分」リテラルが `CompleteVillageList` / `ParticipateVillageList` 等に散在 → 定数化の余地。`CompleteVillageList` が `toppage/` にあるが複数ページ参照になったため `components/ui/` 等への移設検討余地
- **PR #11** (tooling, main, 2026-05-29) — root `.gitignore` に `.serena/` 追加。Serena MCP の repo 直下 `.serena/` が `git status` に出ていた（`.serena` の記述は `frontend/.gitignore` のみで frontend 配下にしか効かなかった）。追跡ファイルは無く `git rm` 不要
- **PR #10** (Issue #6 / Phase 4「6a 静的ページ」, feature/dark-design, 2026-05-28) — about / rule / faq / release-note / google-auth をダーク化。各 h2 を個別 `.panel` に分割、本文は `text-left`（default レイアウトの `.site-content text-center` を打ち消す）、`.doc-table` で罫線可視化。`RuleAbility`（能力行使）も `text-left` 追加で左寄せに統一
- **PR #8** (Issue #5 / Phase 3, feature/dark-design, 2026-05-28) — トップページ panel デザイン + 村画面 panel-compact + Message 視覚刷新 + Form 視認性強化:
  - **トップページ刷新**: `.panel` クラス（rounded 28px + 右上 blood rim + ember halo）を main.css に集約。`layouts/top.vue` / `layouts/default.vue` の bg を `.site-bg` 共通クラス（warm-dark gradient + 右上 blood bloom）に統一
  - **新コンポーネント `TopHeader.vue`**: 明朝 LASTWOLF + 右上ログイン状態（sm+ でニックネーム、xs ではアイコンのみ）
  - **`.registry` (古書名簿) パターン**: Intro / 村一覧 / 最近終了した村で共通利用。`[№/Roman numeral] [短い罫] [Title + Meta] [→]` の grid 構造。ホバーで血赤 hairline が左から滲む
  - **`.section-heading`** (中央寄せ和文タイトル + 下細線) を共通化
  - **VillageList / CompleteVillageList**: 表 → registry。ステータスをロール色 (prologue=gold / rollcalling=seer / in_progress=blood / epilogue=wolf / completed/cancel=muted) で識別、募集中は `count/max人` 形式
  - **IndexFooter Colophon**: 多行 dl → 1 行 imprint (中点区切り) + `✦ LASTWOLF ✦` Cinzel mark
  - **PWA / favicon**: `lastwolf-mobile.webp` の狼顔 (380x380 / cy=320) をクロップして favicon.ico (multi-size) / icon-192 / icon-512 / apple-touch-icon を再生成
  - **村画面 panel-compact**: 新クラス `.panel-compact` (border-radius 14px、halo は `.panel` の約 1/2)。Participants / Progress / Messages / Creator / Debug に適用、bg-soft ヘッダ撤去でグラデーション通し
  - **Message 視覚刷新**: `message-role.ts` を「会話系」「情報通知系」の 2 系統に再分類
    - 会話系 (wolf / mason / mono / grave / seer / creator): base 染色 (color-mix wolf/mason/etc 6-14% in elev) + L 字 rim floor 上げ + ロール色 halo
    - 情報通知系 (info_wolf / info_fanatic / info_village / info_psychic / info_system): bg なし、全周ロール色 border、ロール色テキスト
    - PRIVATE_MASON は info_village (緑) に移動 (システム生成通知系として PRIVATE_SEER/WISE/GURU/CORONER と統合)
  - **発言間 gap 0.4rem** を DayMessages.vue に
  - **Form 視認性**: FormInput / FormSelect の rim gradient 40% 帯 (旧 bone 10% で透明) を blood-deep 40% に底上げ、base bg 明度アップ、内側 ember inset glow 追加
  - **MessageInput**: 生 input → UiFormInput、左端に ChatBubbleOvalLeftEllipsisIcon を絶対配置で「チャット入力欄」と識別。強調トグルを UiFormInput と同じ二層 bg で OFF/Hover/ON 3 状態の視認性確保
  - **CreatorMessageInput**: 生 textarea → UiFormInput type="textarea"
  - **ModalKampa**: 旧 `bg-[#3991f4]` ボタン → `UiButton secondary as="a" target="_blank"` (rel auto-attach)、Twitter リンク → `.text-link`
  - **dev pages 整備**: dev/design.vue の 32 箇所の `<BaseButton>` → `<UiButton>` (auto-import 名修正)、廃止 token (text-moon/text-steel) → text-bone/text-blood
- **PR #7** (Issue #16, main, 2026-05-26) — 廃村機能を募集中・点呼中・進行中・決着すべてで実行可能に拡張:
  - `CreatorDomainService#isAvailableCancelVillage` を「村建て or GM（ダミー枠）or 管理者」+「未終了 (`!isFinished()`)」で判定するよう刷新。Situation フラグと API 認可で同じ判定を共有
  - 新設 `assertCancelVillage(village, player, user)` で domain 層に権限+ステータスを集約。Controller は assert を呼ぶだけに簡素化。`@Transactional(rollbackFor = [Exception::class])` を `cancel` メソッドに付与し `updateVillageDifference` + `registerMessage` の 2 段書き込みを atomic 化
  - `convertToSituation` に `user: LastwolfUser?` を追加（authority 判定が必要）。`isAvailableCreatorSetting` は依然「creator/dummy のみ」維持、廃村だけ別経路で管理者を一級市民化（運営介入は廃村に限る設計）
  - `dummyParticipant()!!` を `?: return false` で null-safe 化（`isAvailableCreatorSetting` / `isViewableSpoiler`）。`isAvailableModifySetting` を `assertModifySetting` 経由に再整理して domain 層に対称的な assert を持つ
  - フロント `Creator.vue` の「村の開始/廃村」ブロックを「村の開始」「廃村」の 2 セクションに分離。廃村セクションは `situation.creator.available_cancel_village` 直参照で表示判定。確認モーダル本文に「この操作は元に戻せません。」を表示
  - フロントの cancel error handler を 4xx 全般 toast に拡張（`fetchError.status > 0` ガード、`ApiCallError` interface を新設して `as` キャストの安全性を担保）
  - 派生 Issue #18 (廃村メッセージ文言) / #19 (廃村後フロント状態更新) / #20 (CreatorController の Coordinator 統一+`@Transactional` 整理) を起票
- **PR #6** (Issue #14, feature/dark-design) — Chat Message のロール表現を Black & Blood directional lighting で刷新:
  - 全 variant 共通: `rounded-lg` + `border: 1px solid transparent` + BaseButton と同じ padding-box / border-box 手法。配色は `color-mix(in srgb, var(--color-X) N%, transparent)` で CSS 変数を単一情報源化（rgba ハードコード禁止）
  - 会話・独り言系（wolf / fanatic / mason / mono / grave / seer / creator）: 左下角中心の **L 字 rim**（`radial-gradient(ellipse 100% 100% at 0% 100%) border-box`）+ 両コーナー bg radial
  - システム系（system / village_info / psychic_info）: **全周 solid rim**（情報通知として枠強調）+ 左下のみの bg radial
  - 新 variant: `fanatic`（くすんだ橙 `--color-fanatic: #d8906b`、PRIVATE_FANATIC を WOLF_CODES から独立）/ `system`（白系 bone、PUBLIC_SYSTEM / PRIVATE_SYSTEM）/ `village_info`（緑 mason、村陣営の役職通知）/ `psychic_info`（水色 grave、霊媒結果）
  - 名前色 override: wolf → text-wolf、fanatic → text-fanatic、mason → text-mason、grave → text-grave（閉じた特別な場では個人識別カラーよりロール色優先）
  - creator: 旧 gold + 上端 rim → 紫系（medium）+ 他 variant と同じ L 字 rim に統一
  - mono: 透過 bg + L 字灰 rim、左下 radial を絞って本文（text-fg-secondary）の可読性を確保。他 variant と違い `linear-gradient(elev, elev)` 補完層を省略
  - DESIGN.md「チャットメッセージ」節を新方針に書き換え（variant 表 / 名前色 override / 役職限定システム通知の色分け）
  - dev/design#messages のサンプル文を新仕様に更新（system / village_info / psychic_info / fanatic を目視可能）
- **PR #5** (Issue #15, feature/dark-design) — BaseButton のタイポグラフィと variant 視認性を Black & Blood 世界観に合わせて調整:
  - タイポグラフィ: `font-medium` → `font-normal` + `tracking-wide` で太字感と密度を抜く。`font-family` は sans のまま（和文短文ボタンで明朝は崩れやすい）。`antialiased` を base に付与し明色文字 × ダーク BG の halation で太く見える現象を緩和
  - 角丸: `rounded-full`（pill）→ `rounded-lg`（8px）に縮小。FormInput (10px) と近い角丸でコンポーネント間調和を取りピル過剰さを回避
  - variant 視認性: 初期実装の secondary / danger / ghost が「disabled っぽく」見える課題に対し、secondary rim を 22%/18%/12% → 55%/40%/25%/40% に増強 + bone inset highlight 追加、danger の base 不透明度 0.35 → 0.85 + inset blood glow 2 段 + 文字 `#ff8484` → `#fff`、ghost の文字 `text-fg-secondary` → `text-fg`。primary > danger ≈ secondary > ghost > disabled の明度ヒエラルキー維持
  - dev/design Buttons セクションに和文ラベル variant 例（決定 / キャンセル / 退村する / 閉じる / 村に入る 等）追加
  - DESIGN.md「ボタン」節にタイポグラフィ方針 / コントラスト方針 / variant 表（実値）/ 2026-05-26 調整メモを追記
- **PR #1** (Issue #1 / Phase 0, main) — UI ダークテーマ方針合意。`frontend/DESIGN.md` 追加。`top.jpg` から抽出したパレット（漆黒基調 + 月色アクセント）、青系=アクション / 金=神秘・神託 / 月白=主役 の役割分離を確定。Phase 1-5 を Issue #3-#7 に展開
- **PR #2** (Issue #3 / Phase 1, feature/dark-design) — デザイントークン整備。`main.css` を `@theme` で書き直し（surface / line / fg / accent / role）、dead config 削除、フォント（Noto Sans/Serif JP + Cinzel）読込、`theme-color` と PWA manifest を `#050609` に、layouts 背景を `var(--color-deep)` に、`message-color.ts` の個人識別 10 色をダーク対応に
- **PR #4** (Issue #13, feature/dark-design) — FormInput / FormSelect / FormSwitch を Black & Blood directional に洗練。BaseButton と同じ padding-box + border-box 二重背景手法を `<style scoped>` 内の `.br-*` クラスで閉じた。Input/Select は「入力欄であることが一目で分かる」ため focus 相当の rim 明度を baseline に、focus でさらに radial 赤光 + 外側 halo。error は赤い base + 全周高彩度 blood ring + 常時 outer halo で normal と明確に区別。Switch on は track 内部を暗いまま rim 全周を blood で閉じ、2 段 halo（近距離 blood + 遠距離 ember bloom）で活性を主張。FormGroup の required スターを `text-wolf` → `text-blood`。DESIGN.md に Form 節追加。優先順位は `disabled > error > readonly`（readonly+error は error 表示維持）
- **PR #3** (Issue #4 / Phase 2, feature/dark-design) — `components/ui/*` 全面刷新 + チャットメッセージのロール色マッピング新方式に。中盤で「古い iOS / Bootstrap っぽい」フィードバックを受け、**Black & Blood directional lighting に全面ピボット**:
  - 新トークン: `blood #e02e2e` / `blood-deep #8b1a1a` / `ember #ff5b3a` / `bone #f4f1e8` / `wine #3a1414`、旧 `steel/moon/halo/glow` 削除
  - BaseButton: pill rounded-full + 黒ベースに右上から赤光が差し込む directional gradient (4 variant + scoped style)
  - Modal: `modal-card` で directional rim + 7 色グラデバー (transparent → blood-deep → ember → blood-deep → transparent)
  - Form / Toast / chara-select: 新パレット追従（focus blood, info ember, danger blood）
  - Spotlight: text-shadow を blood-deep + ember halo に
  - 新画像 `lastwolf.webp`（赤グロー狼）採用、OGP も差し替え
  - dev preview pages: `/dev/design` `/dev/button-proposals` `/dev/black-red-proposal` (middleware: dev-only)
