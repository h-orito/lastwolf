# LASTWOLF Design System

`top.jpg`（月夜の狼）の世界観から色を抽出した、漆黒基調 × 月色アクセントのダークテーマ。

Phase 0 で方針合意済み（Issue #1）。Phase 1 以降で実装を進める。

## デザイン方針

- **トーン**: ゴシック × ミステリー（"ホラー寄り" ではなく品のある重厚感）
- **面**: 漆黒基調。色は線・縁・装飾で乗せる
- **アクセント**: `top.jpg` から抽出した月の銀光・スチールブルー・淡金
- **可読性**: 日本語本文を最優先。WCAG AA（テキスト 4.5:1）を維持
- **ヒーロー画像**: `top.jpg` を残し、グラデで下端を `bg-deep` に落として本体と接続

## 色の役割

- **青系 (steel)** — アクション主体（primary ボタン / "村に入る" / "確定"）
- **金 (gold)** — 神秘・神託の限定アクセント（占い結果 / 装飾ラベル `№` / カード上端のグラデ線の一部）
- **月白 (moon)** — 主役・名前（ロゴ / プレイヤー名 / primary テキスト）

## パレット

CSS variables 形式。Phase 1 で `frontend/app/assets/css/main.css` および Tailwind theme に落とし込む。

```css
:root {
  /* 背景・面 (漆黒基調) */
  --color-bg-deep: #050609;
  --color-bg-base: #0a0c12;
  --color-bg-elev: #10131a;
  --color-bg-soft: #161a24;
  --color-border-soft: #1f2530;
  --color-border-bright: #2d3848;

  /* テキスト */
  --color-text-primary: #ecedf0;
  --color-text-secondary: #8a96a8;
  --color-text-muted: #525c6e;

  /* アクセント (top.jpg 由来) */
  --color-accent-moon: #f0eed8; /* 月の中心（温白） */
  --color-accent-glow: #fff8e0; /* 月のハイライト */
  --color-accent-halo: #c4d0dc; /* 月の暈 */
  --color-accent-steel: #6f95bd; /* 雲色（主アクセント） */
  --color-accent-steel-deep: #456185; /* 既存テキストシャドウと同色 */
  --color-accent-gold: #c9b87a; /* 月の暖色派生（神秘・神託） */

  /* ロール色（漆黒下で埋もれないよう明度を調整） */
  --color-role-wolf: #d8606b; /* 人狼（くすんだ血） */
  --color-role-mason: #8dc296; /* 共有（苔緑） */
  --color-role-mono: #95a3b5; /* 独白（静寂の灰） */
  --color-role-grave: #8cc0d3; /* 墓下（幽霊水色） */
  --color-role-seer: #d4c283; /* 占い（淡金 = gold 系） */
  --color-role-medium: #beadde; /* 霊媒（青紫） */
}
```

## タイポグラフィ

- **見出し（日本語）**: `Noto Serif JP`（既存 `Spotlight.vue` の `游明朝` と整合）
- **本文**: `Noto Sans JP`
- **装飾ラテン（短文のみ）**: `Cinzel` ─ "Augury" "Séance" "Cast vote" "№ 1247" など
  - 1 行 30 文字以内、本文には使わない

Google Fonts CDN 経由で読み込む（Phase 1 で `nuxt.config.ts` に追加）。

## 主要コンポーネントの方針

### ボタン (`components/ui/button/index.vue`)

| variant   | 背景                                        | 文字             | 縁                          |
| --------- | ------------------------------------------- | ---------------- | --------------------------- |
| primary   | `linear-gradient(180deg, #2c4566, #15263a)` | `moon`           | `steel`                     |
| secondary | `bg-elev`                                   | `text-secondary` | `border-soft`               |
| danger    | `linear-gradient(180deg, #8a2934, #4f161e)` | `#fce4e6`        | `role-wolf`                 |
| ghost     | transparent                                 | `text-secondary` | `border-soft`               |
| disabled  | `bg-soft`                                   | `text-muted`     | `border-soft` + opacity 0.5 |

### モーダル (`components/ui/modal/Modal.vue`)

- オーバーレイ: `bg-black/75`（既存と同じ）
- 本体: `bg-elev` + `border-steel`
- 上端に 4 色グラデバー（`steel-deep → steel → gold → moon → steel-deep`）
- ヘッダー: `bg-soft`、ラテン装飾タイトル（例: `Cast vote`）
- 本体: 日本語見出し（Noto Serif JP）+ 本文（Noto Sans JP）
- フッター: `bg-deep`、右寄せボタン

### チャットメッセージ

**既存の背景塗りは廃止**。背景は全種 `bg-elev` に統一し、ロール色は以下で表現:

- **アバターリング**: 該当ロール色の box-shadow / グラデ
- **上ボーダー（または左ボーダー）**: 該当ロール色
- **小タグ**: ラテン装飾（`WOLF` / `MASON` / `GRAVE` 等、Cinzel）または日本語（`人狼` / `共有` / `墓下`）

| ロール     | 旧（背景塗り） | 新（線/タグ）                          |
| ---------- | -------------- | -------------------------------------- |
| 通常発言   | `#ffffff`      | 上ボーダー `text-secondary`            |
| 人狼会話   | `#f2cece`      | 上ボーダー + リング `role-wolf`        |
| 共有者会話 | `#cef2ce`      | 上ボーダー + リング `role-mason`       |
| 独り言     | `#dddddd`      | 左ボーダー dotted `role-mono`、italic  |
| 墓下発言   | `#ceedf2`      | 上ボーダー dashed `role-grave`、italic |
| 観戦発言   | `#f2f2ce`      | 上ボーダー dashed `role-seer`（淡金）  |

> ⚠ 観戦発言は占い師ロールと同じ `--color-role-seer`（淡金）を流用している。視覚的に色相が近い（既存も `#f2f2ce` / 占いシステムは緑系→新方針で淡金）ため共有とした。Phase 1 で「観戦と占い師の発話が同画面に並ぶケース」がある場合は、専用トークン `--color-role-spectate` を分離すること。

#### 既存実装との差分（Phase 2 着手時の注意）

既存の実装は以下の構造になっており、Phase 2 で **置き換え** が必要:

- `frontend/app/components/pages/village/message/Message.vue` — Tailwind の `text-red-600` / `text-green-600` / `text-blue-600` / `text-pink-600` / `text-gray-600` を直接付与（`messageClasses`）。`messageStyle` で `props.color`（個人識別カラー）をインライン適用
- `frontend/app/components/pages/village/message/DayMessages.vue` — 上記 `Message` の親、ロールごとの分岐ロジックを保持
- `frontend/app/lib/api/message-color.ts` — プレイヤーごとの個人識別カラー（`#f00` / `#00f` / `#000088` 等の固定 10 色）。**ダーク背景で著しく沈む色を含むため、Phase 1 で再検討必須**
- `frontend/app/assets/css/main.css` の `--color-{normal,werewolf,mason,monologue,grave,spectate}-say` — 事実上未使用（dead config）。Phase 1 で削除し、新ロール色体系（`--color-role-*`）に統一

### システム通知

- **占い結果（Augury）**: 縁 `gold`、背景に薄い `gold` グラデ
- **霊媒結果（Séance）**: 縁 `role-medium`、背景に薄い `role-medium` グラデ
- **夜開始（Night）**: 上下ボーダー `role-wolf`、中央に放射 `role-wolf` グラデ、`夜の鐘が鳴る` 等の日本語見出し

### カード（村一覧など）

- 背景: `linear-gradient(180deg, bg-elev, bg-soft)`
- 縁: `border-soft`、`border-radius: 4px`
- 上端 1px のグラデ線でステータスを示唆（`進行中=steel系` / `プロローグ=gold系` / `エピローグ=wolf系`）
- ステータスバッジは小タグで明示

### ヘッダー

- 背景: `linear-gradient(180deg, bg-soft, bg-base)` + 上端 1px の `gold` グラデ線
- ロゴ: 月白テキスト + 既存テキストシャドウ色 `#456185` を継承
- アバター: 以下のコニックグラデで月の色順を回す（`brightness(0.75) saturate(0.8)` のフィルタを適用して落ち着かせる）
  ```css
  background: conic-gradient(
    from 180deg,
    var(--color-accent-steel-deep) 0deg,
    var(--color-accent-steel) 90deg,
    var(--color-accent-halo) 180deg,
    var(--color-accent-moon) 240deg,
    var(--color-accent-gold) 300deg,
    var(--color-accent-steel-deep) 360deg
  );
  filter: brightness(0.75) saturate(0.8);
  ```

## 影響範囲（Phase 1 以降で実装）

- `frontend/app/assets/css/main.css` — CSS variables 全面更新。**既存の `--color-{normal,werewolf,mason,monologue,grave,spectate}-say` および `--color-{private,seer,psychic,werewolf,mason,creator}-system-*` は事実上 dead なので Phase 1 で削除**
- `frontend/nuxt.config.ts` — `theme-color` を `#050609` に、PWA manifest の `background_color` も
- `frontend/app/layouts/default.vue` / `layouts/top.vue` — `background-color` を `bg-deep` に
- `frontend/app/components/layout/NavBar.vue` — 上記ヘッダー方針
- `frontend/app/components/ui/**` — 上記コンポーネント方針
- `frontend/app/components/pages/**` — ページ固有部品の刷新
- `frontend/app/components/pages/village/message/Message.vue` / `DayMessages.vue` — ロール色を Tailwind 直書き（`text-red-600` 等）から新トークン（`role-*`）に置換（Phase 2 で対応）
- `frontend/app/lib/api/message-color.ts` — 個人識別カラー 10 色（`#f00` / `#00f` / `#000088` 等）はダーク背景で沈む色を含むため、Phase 1 でダーク対応版に差し替え

## アクセシビリティ

- 本文テキストは bg ペアで 4.5:1 以上を確認
  - `text-primary #ecedf0` on `bg-deep #050609` ≈ 16.3:1 ✅
  - `text-secondary #8a96a8` on `bg-deep #050609` ≈ 7.3:1 ✅
  - `text-muted #525c6e` on `bg-deep #050609` ≈ 3.2:1 → **本文・通常テキストには使用禁止**
- `text-muted` の許容用途は以下に限定:
  - 区切り装飾（`·` `—` `─` `№` 等の記号）
  - disabled ボタン / disabled フィールドのラベル（インタラクション不可が自明な場合）
  - フォーム placeholder
  - 上記以外のメタ情報・補助情報はサイズに関わらず `text-secondary` を使う
- ロール色のテキスト利用時はサイズ 13px 以上 + 周囲のコントラスト確保を必須化
- focus ring は `steel` を使用（`focus-visible:ring-[#6f95bd]`）

## 採用しなかった方向性（参考）

- **藍基調案**: 面まで青で染める案。柔らかいが、漆黒の引き締まりと装飾の効きを優先して不採用
- **蝋燭と血**: 暖色支配の案。`top.jpg` と地続きにならず不採用
- **ステンドグラスの紫/赤**: 装飾感は採用、色相は `top.jpg` 由来に置き換え

## Phase 計画

| Phase | 対象                                                                                                  | 状態     |
| ----- | ----------------------------------------------------------------------------------------------------- | -------- |
| 0     | デザイン方針合意（本書）                                                                              | 完了     |
| 1     | デザイントークン整備（CSS variables / Tailwind theme / フォント読込 / `message-color.ts` ダーク対応） | 起票予定 |
| 2     | `components/ui/` 配下の base component 刷新                                                           | 起票予定 |
| 3     | `layouts/` と `pages/index.vue` 等トップ周りの刷新 + 村画面の情報設計                                 | 起票予定 |
| 4     | 各機能ページ（村一覧・キャラチップ等）の刷新                                                          | 起票予定 |
| 5     | 細部のアニメーション・トランジション（任意）                                                          | 起票予定 |
