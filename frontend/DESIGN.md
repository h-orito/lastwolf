# LASTWOLF Design System

`lastwolf.webp`（赤グローの黒い狼）の世界観をベースにした **Black & Blood** ダークテーマ。

Phase 0 で方針合意（Issue #1）→ Phase 2 で月夜（steel-blue）系から **血赤（blood-red）系へピボット** (2026-05)。  
旧 steel/moon トークンは廃止し、blood/ember/bone に置き換え済み。

## デザイン方針

- **トーン**: ゴシック × ミステリー（"ホラー寄り" ではなく品のある重厚感）。月明かりよりも血の温度
- **directional lighting**: 黒い面に **右上から赤光が差し込む** イメージ。左下にもごく薄く赤が射す
  - ただし**情報密度が高く左右に並ぶ小型カード（`.panel-compact`）とフォーム入力（FormInput / FormSelect）は例外**で、**四隅対称の rim glow** を使う。directional 単一 rim だと「右上だけ光り左下／左側が暗い」と視認性を損ねるため（2026-06 村画面レビュー）。大型 `.panel`（トップ / ドキュメント）は従来どおり directional を維持
- **rim glow**: パネル / ボタンの border は黒→赤のグラデで、上辺・右辺が「光って見える」（directional の場合）。対称版は **辺・四隅とも blood で均一に光らせ**、四隅にだけ ember bloom を僅かに上乗せして暖色を足す（辺が暗いと「枠が弱い／見づらい」ため floor を blood まで底上げ）
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
  --color-medium: #beadde; /* 霊媒・村建て（青紫） */
  --color-fanatic: #d8906b; /* 狂信（くすんだ橙） */
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

**Flat（2026-06 視認性刷新）**: directional 赤グロー（黒ベース + 右上赤光）は「何ボタンか一目で分からない」課題があったため廃止。**border=bg のフラットな単色面**に統一し、色面の違い（赤 / グレー）と文字色で variant を即座に判別できるようにする。

共通: `border-radius: 8px`（`rounded-lg`）、`border: 1px solid`（色は variant の bg と同色＝フラット）、focus は `ring-blood`。モバイル前提のため `:active`／`:hover`（`filter: brightness(1.12)`）が押下フィードバック。

タイポグラフィ: `font-sans`（Noto Sans JP）+ **`font-semibold`** + `tracking-wide`。フラット面では文字の視認性を最優先するため、旧 directional 版の `font-normal` から weight を底上げ（重厚な背景グラデが無くなり「素のゴシック太字」問題が解消したため太字でも浮かない）。和文短文ラベル中心のため明朝化は不採用。
コントラスト: primary 白文字（`#fff` on `#c62f2f`）≈ 5.5:1 ✅ / secondary 白文字（`#fff` on `#474242`）≈ 8.5:1 ✅ / danger 赤文字（`#ff6b6b` on `#474242`）≈ **3.5:1**（AA 4.5 にやや届かない既知のトレードオフ。グレー地に赤文字という指定上、これ以上はグレーを暗く or 赤を明るくする必要がある）。disabled（`text-fg-muted` + `opacity-55`）は WCAG 2.1 SC 1.4.3 で適用除外。

| variant   | 背景                                             | 文字（color）   | 縁 (border)                             |
| --------- | ------------------------------------------------ | --------------- | --------------------------------------- |
| primary   | `#c62f2f`（赤）                                  | `#fff`          | bg と同色（flat）                       |
| secondary | `#474242`（灰）                                  | `#fff`          | bg と同色（flat）                       |
| danger    | `#474242`（灰）                                  | `#ff6b6b`（赤） | bg と同色（flat）                       |
| ghost     | transparent / hover `bg-elev` / active `bg-soft` | `text-fg`       | なし                                    |
| disabled  | `bg-soft`                                        | `text-fg-muted` | なし、opacity 0.55 + cursor-not-allowed |

hover は全 variant 共通で `filter: brightness(1.12)` による一段明るさ（box-shadow / glow は持たない＝フラット維持）。secondary と danger は bg を同じグレーで共有し、文字色（白 / 赤）で区別する。

実装: `frontend/app/components/ui/button/index.vue` の `<style scoped>`（`.btn-primary` / `.btn-secondary` / `.btn-danger`）を参照。

### フォーム (`components/ui/form/*`)

ボタンと同じ **directional lighting** をフォーム要素にも展開する。複数行スタックされる場合があるため、ボタンより rim と glow は控えめに。

#### FormInput / FormSelect

- 形: `border-radius: 10px`、`border: 1px solid transparent`
- 通常: ページ bg `#050202` から明確に持ち上がる base (`linear-gradient 135deg` rgba(44,26,26,.96)→rgba(28,16,16,.96)) + **辺・四隅とも均一に光る赤 rim**（`blood .58` の floor linear で全辺を光らせ、各コーナーに `radial-gradient(ellipse 50% 75% at <corner>, ember .75 → blood .5 → transparent)` を 4 枚上乗せ）+ わずかな inset top highlight。**入力欄であることが一目で分かる必要があるため、focus 相当の rim 明度を baseline にしている**。2026-06 に旧 225deg 単一 rim（右上ピーク → 左下が暗い）から対称版へ変更、さらに floor を blood-deep → blood に底上げ（村画面レビュー: 「右だけ光り左が暗い」→「辺も同色で均一に」）
- hover: ベース・rim とも 1 段明るく（focus 中は無効化）
- focus: 上辺中央から radial 赤光 `radial-gradient(ellipse 120% 150% at 50% -35%, rgba(255,120,100,.24)…)`（左右対称）を上乗せ、四隅 rim と floor をさらに明るく、外側 `box-shadow: 0 0 0 3px rgba(224,46,46,.22), 0 0 24px -6px rgba(224,46,46,.55)` の blood halo
- 優先順位: `disabled > error > readonly`（error は readonly と同時指定でも表示）
- error: 「明らかに不正」と一目で分かる強さ。赤い base (`linear-gradient(135deg, rgba(80,22,22,.95), rgba(44,12,12,.95))`) + 全周ほぼ均一な blood ring (225deg を ember → blood .95 → .85 → .9 と高彩度に閉ループ) + 常時 outer halo (`0 0 0 1px rgba(224,46,46,.45)` thin rim + `0 0 18px -2px rgba(224,46,46,.6)` glow) + 強い inset blood glow。normal の rim 主張に埋もれないため彩度を一段上げる
- error + focus: 右上から radial 赤光が上乗せ、base/rim/halo すべて一段強める
- readonly: 通常より沈ませ、rim の bone 成分を弱める（focus rim は出さない）
- disabled: opacity `0.55`、cursor `not-allowed`、rim ほぼ消す
- placeholder: `placeholder-fg-muted`
- 実装: `<style scoped>` 内に `.br-input-*` / `.br-select-*` クラスとして閉じる（BaseButton の `.btn-*` と同手法）

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

**2026-06 に firewolf のダークモードへ準拠**（旧 Black & Blood の directional rim / halo / アバターリングは撤去）。会話系（発言）と情報通知系（システム）で構造を分ける:

- **会話系（normal / wolf / mason / mono / grave / seer + 村建て）**: レイアウトは「アバター ｜ 名前行 / 本文ボックス」の 2 段。`.msg` 全体は無装飾で、**本文ボックスにだけ** firewolf dark の bg/border/color を付ける（淡パステル地 + 黒文字）。本文ボックスは `rounded border p-2` + **`flex-1`**（右側がアバターより低いとき縦に伸びて高さを合わせる。flex の `min-height:auto` により画像が低くても padding は潰れない）。名前・種別(roleTag)・時間は名前行に置き lastwolf 配色のまま。
- **情報通知系（info\_\*）**: `.msg` 全体を firewolf dark の **フラットな塗り箱**（暗グレー bg + 原色 border + 白系テキスト）。レイアウトは「本文 + 種別 + 時間」の 1 行。発言者名は出さない（旧「システム」表記を撤去）。本文が長ければ本文だけ折返し、種別・時間は `items-baseline` で 1 行目に残す。

#### 会話系 本文ボックス（firewolf dark / コード単位）

色は firewolf `SayMessage.vue` の `messageClass`（dark）に忠実。値は `main.css` の `--color-say-*`。本文文字は黒 `#0a0a0a`（lovers / creator を除く）。lastwolf の roleVariant ではなく **発言コード単位**で割り当てる（normal / lovers / secret を区別するため）。

| コード                          | bg        | 文字      | border    |
| ------------------------------- | --------- | --------- | --------- |
| NORMAL_SAY                      | `#fff`    | `#0a0a0a` | `#d1d5db` |
| WEREWOLF_SAY                    | `#f2aeae` | `#0a0a0a` | `#f2aeae` |
| SYMPATHIZE_SAY                  | `#aef2ae` | `#0a0a0a` | `#aef2ae` |
| LOVERS_SAY                      | `#edcece` | `#cc2222` | `#edcece` |
| MONOLOGUE_SAY / PRIVATE_ABILITY | `#aaa`    | `#0a0a0a` | `#aaa`    |
| GRAVE_SAY                       | `#a9edf7` | `#0a0a0a` | `#a9edf7` |
| SPECTATE_SAY                    | `#f2f2ae` | `#0a0a0a` | `#f2f2ae` |
| SECRET_SAY                      | `#aa99aa` | `#0a0a0a` | `#aa99aa` |
| CREATOR_SAY                     | `#403340` | `#eee`    | `#c0f`    |

- mono / grave の本文 italic は廃止（2026-06、通常字形に統一）。
- 名前色 override（wolf=`text-wolf` / mason=`text-mason` / grave=`text-grave`）と個人識別カラー（`message-color.ts` の 10 色）は名前行に維持（本文ボックスの色とは別系統）。

#### システム通知 塗り箱（firewolf dark 準拠）

bg は暗いグレー系（陣営ごとに微かな色味）、border は firewolf の原色、本文・名前は白系（`text-fg`）。中間グレー bg 上ではミュート役職色が AA 不足になるため陣営色は **border が担い**、本文は白に統一。色グループは firewolf `SystemMessage.vue` に準拠。値は `main.css` の `--color-sysmsg-*`。

| variant (info\_\*) | 対象コード                                       | bg                      | border                  |
| ------------------ | ------------------------------------------------ | ----------------------- | ----------------------- |
| info_wolf          | PRIVATE_WEREWOLF / PRIVATE_FANATIC               | `#403333`               | `#f00`（赤）            |
| info_village       | PRIVATE_SEER / PRIVATE_WISE                      | `#334033`               | `#0f0`（緑）            |
| info_psychic       | PRIVATE_PSYCHIC / PRIVATE_GURU / PRIVATE_CORONER | `#333340`               | `#00f`（青）            |
| info_mason         | PRIVATE_MASON / PRIVATE_SYMPATHIZER              | `#404033`               | `#fa0`（橙）            |
| info_lovers        | PRIVATE_LOVERS                                   | `#404033`               | `#f0a`（桃）            |
| info_fox           | PRIVATE_FOX                                      | `#403333`               | `#c9c934`（くすんだ黄） |
| info_public        | PUBLIC_SYSTEM                                    | なし（透明）            | `#fff`（白）            |
| info_system        | PRIVATE_SYSTEM                                   | `#404040`（くすんだ灰） | `#ccc`（薄灰）          |

- `CREATOR_SAY` は「村建て」名を持つため会話系（本文ボックス creator）で扱う。info_creator の塗り箱は廃止。
- `LOVERS_SAY` / `SECRET_SAY` は会話系本文ボックス（lovers / secret）。`PRIVATE_ABILITY` は独り言（mono）の本文ボックスを流用。

> 観戦発言は占い師ロールと同じ `--color-seer`（淡金、roleTag 用）を流用。視覚的に色相が近いため共有とした。

#### システム通知の種別タグ（種別1文字 / 色付き）

情報通知系には発言者名がない代わりに、**種別1文字**を枠（border）と同色で名前行右に出す（観戦 roleTag と同じ `text-[10px] tracking-widest`）。コード単位で割り当て。色は `--color-sysmsg-*-border` を流用するが、**赤（`#f00`）と青（`#00f`）は暗背景で沈むため white を混ぜて明度を上げる**（緑/橙/桃/黄は枠色そのまま）。

| 種別         | コード                                           | 色                                       |
| ------------ | ------------------------------------------------ | ---------------------------------------- |
| 狼 / 信      | PRIVATE_WEREWOLF / PRIVATE_FANATIC               | 赤（`wolf-border` に white 60% 混ぜ）    |
| 占 / 賢      | PRIVATE_SEER / PRIVATE_WISE                      | 緑（`village-border`）                   |
| 霊 / 導 / 検 | PRIVATE_PSYCHIC / PRIVATE_GURU / PRIVATE_CORONER | 青（`psychic-border` に white 50% 混ぜ） |
| 共 / 鳴      | PRIVATE_MASON / PRIVATE_SYMPATHIZER              | 橙（`mason-border`）                     |
| 恋           | PRIVATE_LOVERS                                   | 桃（`lovers-border`）                    |
| 狐           | PRIVATE_FOX                                      | 黄（`fox-border`）                       |
| （なし）     | CREATOR_SAY / PUBLIC_SYSTEM / PRIVATE_SYSTEM     | —                                        |

#### 小タグ (roleTag) — 会話系のみ

- 表記: 日本語（`人狼` / `共有` / `独白` / `墓下` / `観戦`）、`text-[10px] tracking-widest` + 該当ロール色。会話系の名前行に名前と並べて表示。
- 情報通知系は roleTag ではなく上記「種別タグ」で識別する。

#### 個人識別カラー

- 会話系の名前テキストの inline style 適用は維持（`message-color.ts` の 10 色）。
- ダーク背景上のコントラスト検証は派生 TODO として `.issues/HANDOFF.md` に残す（必要なら別 Issue）。

#### 実装

- 色実体は `main.css` の `--color-say-*`（会話本文）/ `--color-sysmsg-*`（通知塗り箱）。クラスは `Message.vue` の `<style scoped>` 内 `.msg-say-*` / `.msg-info-*`。
- 種別タグ・本文クラスのコード単位割り当ては `Message.vue` の `SYSTEM_TAG` / `SAY_BODY_CLASS`。`RoleVariant` 型は `frontend/app/lib/api/message-role.ts` を流用。

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

- 背景: `linear-gradient(180deg, var(--color-soft), var(--color-base))` を bg に、**上端 1px の gold グラデ線**（`::before` で transparent→gold→transparent の中央寄せ。ステンドグラスのストリップが一筋光るイメージ）+ **下端 1px の `border-line-soft`** で本体と区切る
- ロゴ: `text-bone` + 二段の blood グロー（近距離 `blood-deep` + 遠距離 `blood`、`color-mix(... transparent)` 経由）。`lastwolf.webp` の赤いオーラと整合（Phase 2 で steel-blue から Black & Blood にピボット済）
- 旧仕様にあった月色順のコニックグラデアバターは、トップにアバター表示がないため未実装（必要になったタイミングで blood/ember/gold 構成で再設計する）

### 村画面の小型カード（`.panel-compact` + `.panel-compact-header`）

参加者 / 進行 / チャット / 村建て機能 / デバッグ の各カード。実体は `main.css` の共通クラス。

- カード本体: `.panel-compact`（`border-radius: 14px`）。rim は **辺・四隅とも均一**（`blood .62` floor で全辺を光らせ、各コーナーに ember→blood の radial 4 枚を上乗せして僅かに暖色）。outer halo は `.panel` の約 1/2〜1/3
- ヘッダ帯: `.panel-compact-header`（`padding: .5rem .75rem .4rem` / `font-bold` / 上端を 13px で角丸）。背景は `wine 32%→transparent` の縦グラデで僅かに沈める
- **header / content の境界線**: `::after` で**両端まで均一な `blood` の 1px 線**（rim の floor と同色。フェードさせない）。旧 `border-b border-line-soft`（#2a1818）は暗背景でほぼ見えず境目が曖昧だったため置換（2026-06 村画面レビュー）
- content: `px-3 py-2`
- 旧 `bg-[#363636]` + `bg-[#fafafa]` のコントラスト強めヘッダから dark theme に統一

### ドキュメントページ（about / rule / faq / release-note / google-auth 等の長文ページ）

- 全体: `<section class="px-4 py-6 sm:py-8">` + `mx-auto max-w-3xl`（読みやすさ優先で 3xl、表が多い `rule` は `max-w-4xl`） + `.panel px-5 py-6 sm:px-7 sm:py-8`
- ページタイトル: `<header class="section-heading"><h1 class="section-title">…</h1></header>`（`.section-heading` で中央寄せ + 下細線、`.section-title` で和文タイトル書式）
- 章タイトル h2: `.doc-section-heading`（軽い下細線あり）
- 小見出し h3: `.doc-sub-heading`（線なし、`RuleAbility.vue` の能力ごと等）
- 本文: `text-sm leading-relaxed text-fg sm:text-[0.9375rem]`
- **本文ラッパーには `text-left` を明示する**: `app.vue` の `.app-root` がグローバルに `text-align: center` を持つため、本文・リスト・目次は中央寄せに引っ張られる。本文ラッパー（`<div class="... text-left">` / `<dl class="text-left">` / `<nav class="text-left">`）で左寄せを宣言する。中央寄せが自然なページ（`google-auth`）は `text-center` のまま
- リンク: `.text-link`
- リスト marker: `marker:text-blood-deep`（深い静脈赤の点）
- 表: `.doc-table` を `<table>` に付ける。セル境界は `color-mix(bone 16%)`（`line-soft` は暗背景で見えないため骨白を薄く混ぜる）、thead は `bg-soft` + 下端 `blood-deep` アクセント。`<tbody>` の `<tr>` に `.row-stripe` を併用、人狼系強調は `text-wolf`
- 「読み込み中…」等の状態テキスト: `text-fg-muted`
- 段落間: `space-y-7`（章間） / 章内リスト間: `space-y-1.5` 〜 `space-y-3`

## モーション・トランジション（Phase 5 / Issue #7）

世界観の没入感を高めるための **控えめな** モーション。人狼はテキスト主体ゲームのため**可読性最優先**で、過剰アニメーションは入れない。動かすのは原則 `transform` / `opacity` のみ（compositor 合成で 60fps を維持し、レイアウト・ペイントの再計算を避ける）。

- **ページ遷移**: `app.pageTransition`（`name: "page"` / `mode: "out-in"`）。leave は速く（0.12s, fade + わずかに上へ）、enter は下から持ち上げて定着（0.22s, fade + `translateY(8px)→0`）。実体は `main.css` の `.page-*`。**全遷移（トップ⇄他ページ含む）で効く**。
  - 当初トップだけ `layout: top` で他（`layout: default`）と分かれており、レイアウト跨ぎでは pageTransition が無音だった。`layoutTransition` を `out-in` で足すと、旧レイアウトが一旦完全に消えその隙間でグローバル背景（`.site-bg` はレイアウト側のみが持ち html/body にダーク指定が無い）の白が露出し「一瞬真っ白 + 間延び」になった。
  - 解決として **レイアウトを `default` 単一に統合**（旧 `top.vue` 削除）。差分は NavBar 有無のみだったため、`default.vue` が `route.path === "/"` のときだけ NavBar を非表示にして旧 top を再現。レイアウト swap 自体が無くなり、`layoutTransition` 無しで全遷移に pageTransition が一貫して効く（白フラッシュ/間延びも構造的に発生しない）。
- **モーダル**: `Modal.vue` の `<Transition>`（opacity 200ms + scale 95%→100%）。Phase 5 では変更せず現状維持
- **prefers-reduced-motion**: `main.css` のグローバル `@media (prefers-reduced-motion: reduce)` で全アニメーション/トランジションを実質無効化（`*` に `animation-duration` / `transition-duration: 0.01ms !important`）。個別実装のガード漏れを防ぐ単一の防波堤。`0` でなく `0.01ms` なのは `transitionend`/`animationend` を発火させ Vue の Transition done コールバックを解決させるため

## 影響範囲（Phase 1 以降で実装）

- `frontend/app/assets/css/main.css` — CSS variables 全面更新。**既存の `--color-{normal,werewolf,mason,monologue,grave,spectate}-say` および `--color-{private,seer,psychic,werewolf,mason,creator}-system-*` は事実上 dead なので Phase 1 で削除**
- `frontend/nuxt.config.ts` — `theme-color` を `#050202`（Black & Blood ピボット後の `--color-deep`）に、PWA manifest の `theme_color` / `background_color` も
- `frontend/app/layouts/default.vue`（旧 `layouts/top.vue` は Phase 5 で `default` に統合・削除）— `background-color` を `var(--color-deep)` に
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
- **モーション**: `prefers-reduced-motion: reduce` で全アニメーション/トランジションを抑止（`main.css` のグローバルガード）。詳細は「モーション・トランジション」節

## 採用しなかった方向性（参考）

- **藍基調案**: 面まで青で染める案。柔らかいが、漆黒の引き締まりと装飾の効きを優先して不採用
- **蝋燭と血**: 暖色支配の案。`top.jpg` と地続きにならず不採用
- **ステンドグラスの紫/赤**: 装飾感は採用、色相は `top.jpg` 由来に置き換え

## Phase 計画

| Phase | 対象                                                                                                  | 状態                                       |
| ----- | ----------------------------------------------------------------------------------------------------- | ------------------------------------------ |
| 0     | デザイン方針合意（本書）                                                                              | 完了                                       |
| 1     | デザイントークン整備（CSS variables / Tailwind theme / フォント読込 / `message-color.ts` ダーク対応） | 起票予定                                   |
| 2     | `components/ui/` 配下の base component 刷新                                                           | 起票予定                                   |
| 3     | `layouts/` と `pages/index.vue` 等トップ周りの刷新 + 村画面の情報設計                                 | 起票予定                                   |
| 4     | 各機能ページ（村一覧・キャラチップ等）の刷新                                                          | 起票予定                                   |
| 5     | 細部のアニメーション・トランジション（任意）                                                          | 完了（ページ遷移 + reduced-motion ガード） |
