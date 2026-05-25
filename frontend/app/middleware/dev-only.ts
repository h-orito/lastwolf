/**
 * 開発環境（pnpm dev）でのみアクセス可能にするミドルウェア。
 * 本番ビルドでは 404 を返す。
 */
export default defineNuxtRouteMiddleware(() => {
  if (!import.meta.dev) {
    throw createError({ statusCode: 404, statusMessage: "Not Found" });
  }
});
