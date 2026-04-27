export default defineNuxtPlugin(async () => {
  const CLIENT_VERSION = 5;
  const { apiCall } = useApi();

  try {
    const versionInfo = await apiCall<{ client_version: number }>("/version");
    if (versionInfo.client_version > CLIENT_VERSION) {
      if (window.confirm("新しいバージョンが配信されているため最新バージョンに更新します。")) {
        window.location.reload();
      }
    }
  } catch {
    // バージョンチェック失敗は無視
  }
});
