<template>
  <section class="px-4 py-6 sm:py-8">
    <div class="mx-auto max-w-5xl">
      <article class="panel px-5 py-6 sm:px-7 sm:py-8">
        <header class="section-heading">
          <h1 class="section-title">{{ charachip ? charachip.name : "キャラチップ" }}</h1>
        </header>

        <!-- 状態表示は table 系の charachip-list と同様 registry-state ではなく text-fg-muted で統一 -->
        <!-- ローディング中 -->
        <div v-if="loading" class="py-8 text-center text-sm text-fg-muted">読み込み中...</div>

        <!-- 取得失敗 -->
        <div v-else-if="hasError" class="py-8 text-center text-sm text-fg-muted">
          キャラチップの取得に失敗しました。時間をおいて再度お試しください。
        </div>

        <!-- データあり -->
        <template v-else-if="charachip">
          <div class="mb-6 text-center text-sm text-fg-secondary">
            <p>
              作者: <span class="text-fg">{{ charachip.designer.name }}</span>
            </p>
            <a :href="charachip.description_url" target="_blank" rel="noopener" class="text-link">
              作者HP
            </a>
          </div>

          <div class="flex flex-wrap justify-center gap-2">
            <div
              v-for="chara in charachip.chara_list"
              :key="chara.id"
              class="flex w-[100px] flex-col items-center rounded-lg border border-line-soft bg-elev p-1.5"
            >
              <img
                :src="chara.image.image_url"
                :alt="chara.name.name"
                :width="chara.image.width"
                :height="chara.image.height"
                class="mx-auto"
              />
              <p class="mt-1 text-center text-xs text-fg-secondary">{{ chara.name.name }}</p>
            </div>
          </div>
        </template>

        <!-- データなし -->
        <div v-else class="py-8 text-center text-sm text-fg-muted">
          <p>キャラチップが見つかりませんでした</p>
        </div>
      </article>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { components } from "~/lib/api/schema";

type CharachipView = components["schemas"]["CharachipView"];

const route = useRoute();

// route.query.id は string | string[] | undefined。配列だと `/charachip/[object Array]` の
// ような不正な URL になるため、string のときのみ採用する（player-record.vue と同じガード）。
const charachipId = computed(() => {
  const id = route.query.id;
  return typeof id === "string" ? id : "";
});

const { apiCall } = useApi();

const charachip = ref<CharachipView | null>(null);
const loading = ref(true);
const hasError = ref(false);

// SEO（初期設定）
useSeoMeta(buildPageMeta({ title: "キャラチップ" }));

// キャラチップ名取得後にSEOタイトルを動的更新
watchEffect(() => {
  if (charachip.value) {
    useSeoMeta(buildPageMeta({ title: `キャラチップ: ${charachip.value.name}` }));
  }
});

onMounted(async () => {
  if (!charachipId.value) {
    loading.value = false;
    return;
  }
  try {
    charachip.value = await apiCall<CharachipView>(`/charachip/${charachipId.value}`);
  } catch (error) {
    console.error("キャラチップの取得に失敗しました:", error);
    hasError.value = true;
  } finally {
    loading.value = false;
  }
});
</script>
