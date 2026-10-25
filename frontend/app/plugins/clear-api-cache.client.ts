// 以前の Service Worker が保存した API の結果を消す (今は保存していない)
export default defineNuxtPlugin(() => {
  if (!("caches" in window)) return;
  caches.delete("api-cache").catch(() => {});
});
