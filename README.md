# Prisma / Apollo Server のテンプレート

## 起動

1. DB の起動

```bash:terminal
docker-compose up
```

2. Web サーバーの起動

```bash:terminal
npm run dev
```

## メモ

/src/generated/schema.graphql を Apollo Studio が参照している（/src/schema.ts を参照）

## TODO:

- 認証周り
  - Google OAuth2 を使って実装
  - ログインと新規登録の口は一緒にする
- テーブル定義のよりよい方法について
