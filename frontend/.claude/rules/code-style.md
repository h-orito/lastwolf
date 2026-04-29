---
paths: ["app/**/*.{ts,vue}"]
---

# コードスタイルガイドライン

## 概要

このプロジェクトのコードスタイルは、以下の設定ファイルで管理されています。

## 設定ファイル

### エディタ設定

- **`.editorconfig`**: エディタ共通の基本設定
  - インデント: スペース2つ
  - 文字コード: UTF-8
  - 改行コード: LF
  - 末尾の空白: 自動削除
  - 最終行に改行: あり

### コードフォーマット

- **oxfmt**: Rust製フォーマッター（`vp fmt` が内部的に使用）
  - 設定ファイル: `.oxfmtrc.json`（存在しない場合はデフォルト設定）

### リンティング

- **oxlint**: Rust製リンター（`vp check` が内部的に使用）
  - 設定ファイル: **`.oxlintrc.json`**
  - ESLint の代替（`eslint.config.js` は不使用）

### コマンドランナー

- **`vite-plus`** (`vp`): lint/format のラッパーCLI
  - `vp check` = oxlint 実行
  - `vp check --fix` = oxlint 自動修正
  - `vp fmt` = oxfmt 実行

## コマンド

```bash
# リント実行
pnpm lint

# 自動修正付きリント
pnpm lint:fix

# フォーマット実行
pnpm format

# 型チェック
pnpm type-check
```

## 重要事項

- **コミット前には必ず以下を実行**:

  ```bash
  pnpm lint:fix && pnpm format && pnpm type-check
  ```

- 設定ファイルの内容を直接変更する場合は、チーム全体での合意が必要です
- VSCode使用時は、推奨拡張機能（oxlint、EditorConfig）をインストールしてください

# 実装ガイドライン

## TypeScript 型安全性

### 禁止事項

1. **`as any` の使用は禁止**
   - 型の問題は適切な型定義で解決する
   - 例外的に使用が必要な場合は、必ずユーザーに確認を取ること

2. **`as unknown` の使用も禁止**
   - 型変換は具体的な型定義で対応する
   - 適切なインターフェースや型定義を作成する

3. **`@ts-ignore` の使用禁止**
   - 型エラーは必ず解決する
   - 一時的な回避策も避ける

4. **`any` 型の直接使用禁止**
   - 適切な型を定義して使用
   - API レスポンスなどは適切に型定義する

5. **`// eslint-disable` / `// oxlint-disable` の使用禁止**
   - lint ルールは遵守する
   - ルールの例外を設ける場合は、必ずユーザーに確認を取ること

### 推奨される型対応方法

```typescript
// ❌ 悪い例
const data = response as any;
const data2 = response as unknown;
const props = defineProps<any>();

// ✅ 良い例
interface ApiResponse {
  data: VillageView;
}
const data = response as ApiResponse;

// 具体的な型定義を作成
interface CustomProps {
  villageId: string;
  isActive: boolean;
}
const props = defineProps<CustomProps>();
```

## 開発サーバー

- **ポート**: 3000
- **起動コマンド**: `pnpm dev`
- **URL**: http://localhost:3000

## storeを直接使用しない

参照であっても必ずcomposables経由で使用する
