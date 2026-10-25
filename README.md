# LASTWOLF

人狼ゲーム LASTWOLF の monorepo。

## 構成

```
.
├── frontend/   # Nuxt 4 / pnpm 製のWebフロントエンド (旧 lastwolf-ui)
├── backend/    # Kotlin / Gradle / Spring Boot 製のAPIサーバ (旧 lastwolf-api)
└── e2e/        # E2Eテスト (Playwright 想定、未整備)
```

旧リポジトリの履歴は `git-filter-repo` で各サブディレクトリ配下に保持されています。
個別ファイルの履歴は `git log --follow frontend/...` のように `--follow` を付けると追跡できます。

## 開発

### frontend
```bash
cd frontend
pnpm install
pnpm dev
```

### DB (MySQL)
開発用の MySQL を docker で起動し、DBFlute の ReplaceSchema でテーブルと初期データを作ります。
接続先は `backend/src/main/resources/config/application.yml` と同じ (`127.0.0.1:4306` / `lastwolfdb` / `lastwolfuser`) です。

```bash
docker compose up -d --wait
cd backend/dbflute_lastwolfdb
sh manage.sh replace-schema   # 確認で y を入力。既存のテーブルとデータはすべて作り直される
```

- firewolf / howling-wolf の開発用 MySQL も同じ 4306 番ポートを使うので、同時には起動できません
- 止めるときは `docker compose down`、データも消すときは `docker compose down -v`

### backend
```bash
cd backend
./gradlew test      # DB を起動してから実行する (SpringBootTest が DB に接続するため)
./gradlew bootRun   # Firebase の秘密鍵が必要 (FIREBASE_ADMINSDK_SECRETKEY_PATH / FIREBASE_DATABASE_URL)
```

## 旧リポジトリ

- https://github.com/h-orito/lastwolf-ui (frontend のオリジナル / archive 予定)
- https://github.com/h-orito/lastwolf-api (backend のオリジナル / archive 予定)
