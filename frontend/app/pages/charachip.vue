<template>
  <div>
    <section class="py-8 px-4 bg-gray-100">
      <div class="max-w-5xl mx-auto text-left">
        <h1 class="text-lg font-bold mb-4">キャラチップ: {{ charachip ? charachip.name : "" }}</h1>

        <!-- ローディング中 -->
        <div v-if="loading" class="text-center py-8 text-gray-500">読み込み中...</div>

        <!-- データあり -->
        <template v-else-if="charachip">
          <div class="mb-4 text-sm">
            <p>作者: {{ charachip.designer.name }}</p>
            <a
              :href="charachip.description_url"
              target="_blank"
              class="text-blue-600 hover:text-blue-800 underline"
              >作者HP</a
            >
          </div>
          <div class="text-sm">
            <div class="flex flex-wrap justify-center">
              <div
                v-for="chara in charachip.chara_list"
                :key="chara.id"
                class="text-center chara-select-box"
              >
                <img
                  :src="chara.image.image_url"
                  :alt="chara.name.name"
                  :width="chara.image.width"
                  :height="chara.image.height"
                  class="mx-auto"
                />
                <p class="text-xs mt-1">{{ chara.name.name }}</p>
              </div>
            </div>
          </div>
        </template>

        <!-- エラー・データなし -->
        <div v-else class="text-center py-8 text-gray-500">
          <p>キャラチップが見つかりませんでした</p>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import type { components } from "~/lib/api/schema";

type CharachipView = components["schemas"]["CharachipView"];

const route = useRoute();

const charachipId = computed(() => route.query.id);

const { apiCall } = useApi();

const charachip = ref<CharachipView | null>(null);
const loading = ref(true);

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
  } finally {
    loading.value = false;
  }
});
</script>

<style scoped>
.chara-select-box {
  border: 1px solid #cccccc;
  border-radius: 16px;
  padding: 5px;
  margin: 5px;
  width: 100px;
}
</style>
