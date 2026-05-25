# LASTWOLF Design System

`lastwolf.webp`（赤グローの黒い狼）の世界観をベースにした **Black & Blood** ダークテーマ。

Phase 0 で方針合意（Issue #1）→ Phase 2 で月夜（steel-blue）系から **血赤（blood-red）系へピボット** (2026-05)。  
旧 steel/moon トークンは廃止し、blood/ember/bone に置き換え済み。

## デザイン方針

- **トーン**: ゴシック × ミステリー（"ホラー寄り" ではなく品のある重厚感）。月明かりよりも血の温度
- **directional lighting**: 黒い面に **右上から赤光が差し込む** イメージ。左下にもごく薄く赤が射す
- **rim glow**: パネル / ボタンの border は黒→赤のグラデで、上辺・右辺が「光って見える」
- **可読性**: 日本語本文を最優先。WCAG AA（4.5:1）を維持
- **ヒーロー画像**: `lastwolf.webp` の赤いオーラがそのままページの主光源を担う

## 色の役割

- **血赤 (blood)** — アクション主体（primary ボタン / "村に入る" / "投票"）
- **燃え赤 (ember)** — rim ハイライト・glow 専用（テキスト色には使わない）
- **深赤 (blood-deep)** — outline・danger 縁・装飾文字
- **金 (gold)** — 神秘・神託の限定アクセント（占い結果 / 装飾ラベル `№`）
- **骨白 (bone)** — 主役・名前（ロゴ / プレイヤー名 / primary テキスト）

## パレット

CSS variables 形式。Phase 1 で `frontend/app/assets/css/main.css` および Tailwind theme に落とし込む。

Tailwind v4 の `@theme` で定義する。これにより `bg-deep` / `text-fg` / `border-line-soft` / `text-wolf` のような utility が自動生成され、コンポーネント側でセマンティックに参照できる。

```css
@theme {
  /* Surface（背景・面）— warm-dark ベース */
  --color-deep: #050202; /* 最暗部 / ページ bg ベース */
  --color-base: #0a0404; /* 一段上 */
  --color-elev: #100808; /* カード等の浮き面 */
  --color-soft: #181010; /* もう一段浮く面 */

  /* Line（枠線） */
  --color-line-soft: #2a1818;
  --color-line-bright: #3a2424;

  /* Fg（テキスト） */
  --color-fg: #f4f1e8; /* 本文・タイトル（warm white = bone） */
  --color-fg-secondary: #a9a4a0; /* 補助テキスト */
  --color-fg-muted: #5a5550; /* 装飾・disabled・placeholder 限定 */

  /* Accent */
  --color-bone: #f4f1e8; /* 骨白 = warm white（旧 moon） */
  --color-blood: #e02e2e; /* 主アクセント = 血赤 */
  --color-blood-deep: #8b1a1a; /* 深い静脈赤 / outline 用 */
  --color-ember: #ff5b3a; /* 燃焼ハイライト（rim glow 専用） */
  --color-wine: #3a1414; /* 赤系 surface tint */
  --color-gold: #c9b87a; /* 神秘・神託（占い結果） */

  /* Role（役職色 / 漆黒下で 4.5:1 以上を満たす） */
  --color-wolf: #d8606b; /* 人狼（くすんだ血） */
  --color-mason: #8dc296; /* 共有（苔緑） */
  --color-mono: #95a3b5; /* 独白（静寂の灰） */
  --color-grave: #8cc0d3; /* 墓下（幽霊水色） */
  --color-seer: #d4c283; /* 占い（淡金 = gold 系） */
  --color-medium: #beadde; /* 霊媒（青紫） */
}
```

> 命名規則: Tailwind v4 慣習に合わせて CSS variable 側の prefix は最小化（`--color-deep` / `--color-fg` 等）。Tailwind utility としては `bg-deep` / `text-fg` / `border-line-soft` / `bg-bone` / `text-blood` のように `bg-` / `text-` / `border-` prefix を付けて参照する。

## タイポグラフィ

- **見出し（日本語）**: `Noto Serif JP`（既存 `Spotlight.vue` の `游明朝` と整合）
- **本文**: `Noto Sans JP`
- **装飾ラテン（短文のみ）**: `Cinzel` ─ "Augury" "Séance" "Cast vote" "№ 1247" など
  - 1 行 30 文字以内、本文には使わない

Google Fonts CDN 経由で読み込む（Phase 1 で `nuxt.config.ts` に追加）。

## 主要コンポーネントの方針

### ボタン (`components/ui/button/index.vue`)

**Strategy A — Directional Glow（pill）**: 黒い物体に右上から赤光が当たっているように見せる。primary は塗り赤に見えるが内部は黒ベースで radial 赤を重ねる構成。danger は枠線赤（取り返しのつかない操作）。

共通: `border-radius: 999px`（pill）、`border: 1px solid transparent`、focus は `ring-blood`。モバイル前提のため `:active` が主要な押下フィードバック。

タイポグラフィ: `font-sans`（Noto Sans JP）+ `font-normal` + `tracking-wide`。
ボタンラベルはほぼ和文短文（「決定」「キャンセル」「投票」「次へ」等）のため明朝化は採用しない（短文・密度高で読みづらく感じやすい）。
代わりに `font-medium` → `font-normal` で太字感を抜き、`tracking-wide` で密度を下げて、Black & Blood directional lighting の重厚感に対し文字が「素のゴシック太字」で浮いて見える問題を解消する。
コントラスト: 非 disabled 状態の文字色（`#fff` / `text-fg` / `#ff8484` / `text-fg-secondary`）は漆黒ベース上で 4.5:1 を大きく上回るため AA を満たす。disabled 状態（`text-fg-muted` + `opacity-55`）は WCAG 2.1 SC 1.4.3 で適用除外（inactive UI components）。font-weight 変更（500→400）は WCAG コントラスト計算に影響しない。

| variant   | 背景の構成                                                                        | 文字                | 縁 (border-box gradient)                               |
| --------- | --------------------------------------------------------------------------------- | ------------------- | ------------------------------------------------------ |
| primary   | 黒ベース + 右上から radial(ember→blood→透明) + 左下に弱 radial(blood) + 黒 linear | `#fff`              | 225deg: ember 0% → blood 18% → 黒 → 微 blood-deep 100% |
| secondary | 黒の半透明 linear-gradient                                                        | `text-fg`           | 225deg: bone 22% → blood 30% → 黒 → blood-deep 100%    |
| danger    | 微赤の半透明 linear-gradient                                                      | `#ff8484`           | 225deg: ember 0% → blood 22% → blood-deep 50% → 100%   |
| ghost     | transparent                                                                       | `text-fg-secondary` | なし                                                   |
| disabled  | `bg-soft`                                                                         | `text-fg-muted`     | なし、opacity 0.55 + cursor-not-allowed                |

primary / danger の hover では ember / blood の明度を上げ、外側の box-shadow を強める。

実装: `frontend/app/components/ui/button/index.vue` の `<style scoped>` を参照。

### フォーム (`components/ui/form/*`)

ボタンと同じ **directional lighting** をフォーム要素にも展開する。複数行スタックされる場合があるため、ボタンより rim と glow は控えめに。

#### FormInput / FormSelect

- 形: `border-radius: 10px`、`border: 1px solid transparent`
- 通常: ページ bg `#050202` から明確に持ち上がる base (`linear-gradient 135deg` rgba(36,22,22,.95)→rgba(20,12,12,.95)) + 視認できる強さの 225deg 赤 rim (bone 55% → blood 35% → 黒 → blood-deep 35%) + わずかな inset top highlight。**入力欄であることが一目で分かる必要があるため、focus 相当の rim 明度を baseline にしている**
- hover: ベース・rim とも 1 段明るく（focus 中は無効化）
- focus: 右上 corner に radial 赤光 `radial-gradient(at 100% -20%, rgba(255,120,100,.28)…)` を上乗せ、base と rim をさらに明るく、外側 `box-shadow: 0 0 0 3px rgba(224,46,46,.2), 0 0 22px -6px rgba(224,46,46,.5)` の blood halo
- 優先順位: `disabled > error > readonly`（error は readonly と同時指定でも表示）
- error: 「明らかに不正」と一目で分かる強さ。赤い base (`linear-gradient(135deg, rgba(80,22,22,.95), rgba(44,12,12,.95))`) + 全周ほぼ均一な blood ring (225deg を ember → blood .95 → .85 → .9 と高彩度に閉ループ) + 常時 outer halo (`0 0 0 1px rgba(224,46,46,.45)` thin rim + `0 0 18px -2px rgba(224,46,46,.6)` glow) + 強い inset blood glow。normal の rim 主張に埋もれないため彩度を一段上げる
- error + focus: 右上から radial 赤光が上乗せ、base/rim/halo すべて一段強める
- readonly: 通常より沈ませ、rim の bone 成分を弱める（focus rim は出さない）
- disabled: opacity `0.55`、cursor `not-allowed`、rim ほぼ消す
- placeholder: `placeholder-fg-muted`
- 実装: `<style scoped>` 内に `.br-input-*` / `.br-select-*` クラスとして閉じる（BaseButton の `.btn-*-glow` と同手法）

`FormSelect` のドロップダウン矢印は `disabled` で `text-fg-muted`、それ以外は `text-blood/80`（rim の主役色と統一）。ネイティブ `<option>` のドロップダウン背景は `color-scheme: dark` で OS / ブラウザに dark テーマを伝える。

#### FormSwitch

ボタンと同じ思想で、on 時は **黒ベース + 内側の赤 glow + rim**:

- track off: `linear-gradient(135deg, rgba(20,12,12,.95), rgba(10,6,6,.95))` + 弱 bone hairline rim + 内側ドロップシャドウで沈める
- track on: 黒ベース (`linear-gradient(135deg, #200a0a, #100404)`) + 右側から `radial-gradient` で blood/ember を差し込む + **全周クリアな blood rim**（225deg を ember 0% → blood .9 15% → .75 40% → blood-deep .7 70% → blood .75 100% と閉ループ）+ `inset 0 0 10px rgba(224,46,46,.5)` の inset blood glow + 外側 halo を 2 段に（`0 0 0 1px rgba(224,46,46,.35)` の thin rim + `0 0 18px -2px rgba(224,46,46,.75)` の近距離 + `0 0 32px -6px rgba(255,91,58,.4)` の遠距離 ember bloom）。track 内部は暗いまま、rim と halo で活性を主張する
- knob: `bg-bone` + on 時は内側に微かな赤いリフレクション
- focus: 既存の `ring-blood + ring-offset-base` を維持（同色化を避けるため offset で base 色のギャップを挟む）

#### FormGroup

- ラベル: `text-fg`
- help: `text-fg-secondary`
- error: `text-wolf`（既存維持）
- required スター: **`text-blood`**（`text-wolf` は役職色、エラーマーカーには blood の方が意図が明確）

### モーダル (`components/ui/modal/Modal.vue`)

- オーバーレイ: `bg-black/75`
- 本体: 黒ベース + 右上から radial 赤光 + border が 225deg 赤グラデの directional rim
- 上端に細い 7 色グラデバー（`transparent → blood-deep → blood → ember → blood → blood-deep → transparent`）
- ヘッダー: `bg-soft`、ラテン装飾タイトル可（例: `Cast vote`）
- フッター: `bg-deep`、右寄せボタン
- 外側 box-shadow に `rgba(224,46,46,0.4)` で halo を落とす

### チャットメッセージ

**既存の背景塗りは廃止**。背景は全種 `bg-elev` に統一し、ロール色は以下で表現:

- **アバターリング**: 該当ロール色の box-shadow / グラデ
- **上ボーダー（または左ボーダー）**: 該当ロール色
- **小タグ**: ラテン装飾（`WOLF` / `MASON` / `GRAVE` 等、Cinzel）または日本語（`人狼` / `共有` / `墓下`）

| ロール     | 旧（背景塗り） | 新（線/タグ）                                     |
| ---------- | -------------- | ------------------------------------------------- |
| 通常発言   | `#ffffff`      | 上ボーダー `border-fg-secondary`                  |
| 人狼会話   | `#f2cece`      | 上ボーダー + リング `border-wolf` / `ring-wolf`   |
| 共有者会話 | `#cef2ce`      | 上ボーダー + リング `border-mason` / `ring-mason` |
| 独り言     | `#dddddd`      | 左ボーダー dotted `border-mono`、italic           |
| 墓下発言   | `#ceedf2`      | 上ボーダー dashed `border-grave`、italic          |
| 観戦発言   | `#f2f2ce`      | 上ボーダー dashed `border-seer`（淡金）           |

> ⚠ 観戦発言は占い師ロールと同じ `--color-seer`（淡金）を流用している。視覚的に色相が近い（既存も `#f2f2ce` / 占いシステムは緑系→新方針で淡金）ため共有とした。Phase 1 で「観戦と占い師の発話が同画面に並ぶケース」がある場合は、専用トークン `--color-spectate` を分離すること。

#### 既存実装との差分（Phase 2 着手時の注意）

既存の実装は以下の構造になっており、Phase 2 で **置き換え** が必要:

- `frontend/app/components/pages/village/message/Message.vue` — Tailwind の `text-red-600` / `text-green-600` / `text-blue-600` / `text-pink-600` / `text-gray-600` を直接付与（`messageClasses`）。`messageStyle` で `props.color`（個人識別カラー）をインライン適用
- `frontend/app/components/pages/village/message/DayMessages.vue` — 上記 `Message` の親、ロールごとの分岐ロジックを保持
- `frontend/app/lib/api/message-color.ts` — プレイヤーごとの個人識別カラー（`#f00` / `#00f` / `#000088` 等の固定 10 色）。**ダーク背景で著しく沈む色を含むため、Phase 1 で再検討必須**
- `frontend/app/assets/css/main.css` の `--color-{normal,werewolf,mason,monologue,grave,spectate}-say` — 事実上未使用（dead config）。Phase 1 で削除し、新ロール色体系（`--color-{wolf,mason,mono,grave,seer,medium}`）に統一

### システム通知

- **占い結果（Augury）**: 縁 `border-gold`、背景に薄い `gold` グラデ
- **霊媒結果（Séance）**: 縁 `border-medium`、背景に薄い `medium` グラデ
- **夜開始（Night）**: 上下ボーダー `border-wolf`、中央に放射 `wolf` グラデ、`夜の鐘が鳴る` 等の日本語見出し

### カード（村一覧など）

- 背景: `linear-gradient(180deg, var(--color-elev), var(--color-soft))`
- 縁: `border-line-soft`、`border-radius: 4px`
- 上端 1px のグラデ線でステータスを示唆（`進行中=steel系` / `プロローグ=gold系` / `エピローグ=wolf系`）
- ステータスバッジは小タグで明示

### ヘッダー

- 背景: `linear-gradient(180deg, var(--color-soft), var(--color-base))` + 上端 1px の `gold` グラデ線
- ロゴ: 月白テキスト + 既存テキストシャドウ色 `#456185` を継承
- アバター: 以下のコニックグラデで月の色順を回す（`brightness(0.75) saturate(0.8)` のフィルタを適用して落ち着かせる）
  ```css
  background: conic-gradient(
    from 180deg,
    var(--color-steel-deep) 0deg,
    var(--color-steel) 90deg,
    var(--color-halo) 180deg,
    var(--color-moon) 240deg,
    var(--color-gold) 300deg,
    var(--color-steel-deep) 360deg
  );
  filter: brightness(0.75) saturate(0.8);
  ```

## 影響範囲（Phase 1 以降で実装）

- `frontend/app/assets/css/main.css` — CSS variables 全面更新。**既存の `--color-{normal,werewolf,mason,monologue,grave,spectate}-say` および `--color-{private,seer,psychic,werewolf,mason,creator}-system-*` は事実上 dead なので Phase 1 で削除**
- `frontend/nuxt.config.ts` — `theme-color` を `#050609` に、PWA manifest の `background_color` も
- `frontend/app/layouts/default.vue` / `layouts/top.vue` — `background-color` を `var(--color-deep)` に
- `frontend/app/components/layout/NavBar.vue` — 上記ヘッダー方針
- `frontend/app/components/ui/**` — 上記コンポーネント方針
- `frontend/app/components/pages/**` — ページ固有部品の刷新
- `frontend/app/components/pages/village/message/Message.vue` / `DayMessages.vue` — ロール色を Tailwind 直書き（`text-red-600` 等）から新トークン（`text-wolf` / `text-mason` 等）に置換（Phase 2 で対応）
- `frontend/app/lib/api/message-color.ts` — 個人識別カラー 10 色（`#f00` / `#00f` / `#000088` 等）はダーク背景で沈む色を含むため、Phase 1 でダーク対応版に差し替え

## アクセシビリティ

- 本文テキストは bg ペアで 4.5:1 以上を確認
  - `text-fg #f4f1e8` on `bg-deep #050202` ≈ 16:1 ✅
  - `text-fg-secondary #a9a4a0` on `bg-deep #050202` ≈ 9:1 ✅
  - `text-fg-muted #5a5550` on `bg-deep #050202` ≈ 3.1:1 → **本文・通常テキストには使用禁止**
- `text-fg-muted` の許容用途は以下に限定:
  - 区切り装飾（`·` `—` `─` `№` 等の記号）
  - disabled ボタン / disabled フィールドのラベル（インタラクション不可が自明な場合）
  - フォーム placeholder
  - 上記以外のメタ情報・補助情報はサイズに関わらず `text-fg-secondary` を使う
- ロール色のテキスト利用時はサイズ 13px 以上 + 周囲のコントラスト確保を必須化
- focus ring は `blood` を使用（`focus-visible:ring-blood`）
- `--color-ember #ff5b3a` は **rim glow / box-shadow / radial-gradient の中心 等専用**。`text-ember` のベタ塗り文字用途は彩度が高すぎて疲れるため避ける

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
