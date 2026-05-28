<template>
  <section class="px-4 py-6 sm:py-8">
    <div class="mx-auto max-w-5xl">
      <article class="panel px-5 py-6 sm:px-7 sm:py-8">
        <header class="section-heading">
          <h1 class="section-title">キャラチップ一覧</h1>
        </header>

        <p class="mb-5 text-left text-sm leading-relaxed text-fg sm:text-[0.9375rem]">
          キャラ画像は以下の方々に提供いただいています。ありがとうございます。
        </p>

        <!-- 状態表示は table 系ページのため registry-state ではなく rule.vue と同じ text-fg-muted で統一 -->
        <!-- ローディング中 -->
        <div v-if="loading" class="py-8 text-center text-sm text-fg-muted">読み込み中...</div>

        <!-- 取得失敗 -->
        <div v-else-if="hasError" class="py-8 text-center text-sm text-fg-muted">
          キャラチップ一覧の取得に失敗しました。時間をおいて再度お試しください。
        </div>

        <!-- データなし -->
        <div
          v-else-if="tableCharachips.length === 0"
          class="py-8 text-center text-sm text-fg-muted"
        >
          <p>キャラチップがありません</p>
        </div>

        <!-- テーブル -->
        <div v-else class="overflow-x-auto">
          <table class="doc-table text-fg">
            <thead>
              <tr>
                <th class="whitespace-nowrap">キャラチップ名</th>
                <th class="whitespace-nowrap">作者</th>
                <th class="whitespace-nowrap text-center">例</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in tableCharachips" :key="item.charachip_id" class="row-stripe">
                <td>
                  <NuxtLink
                    :to="{ path: '/charachip', query: { id: item.charachip_id } }"
                    class="text-link"
                  >
                    {{ item.charachip_name }}
                  </NuxtLink>
                </td>
                <td>{{ item.designer_name }}</td>
                <td class="text-center">
                  <img
                    v-if="item.chara"
                    :src="item.chara.image.image_url"
                    :alt="item.chara.name.name"
                    :width="item.chara.image.width"
                    :height="item.chara.image.height"
                    class="inline-block"
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </article>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { components } from "~/lib/api/schema";

type CharachipView = components["schemas"]["CharachipView"];
type CharachipsView = components["schemas"]["CharachipsView"];
type Chara = components["schemas"]["Chara"];

interface TableCharachip {
  charachip_id: number;
  charachip_name: string;
  designer_name: string;
  chara: Chara | undefined;
}

const meta = buildPageMeta({ title: "キャラチップ一覧" });
useSeoMeta(meta);

const { apiCall } = useApi();

const charachips = ref<CharachipView[]>([]);
const loading = ref(true);
const hasError = ref(false);

const tableCharachips = computed<TableCharachip[]>(() => {
  return charachips.value.map((charachip: CharachipView) => ({
    charachip_id: charachip.id,
    charachip_name: charachip.name,
    designer_name: charachip.designer.name,
    chara: charachip.chara_list[0],
  }));
});

onMounted(async () => {
  try {
    const data = await apiCall<CharachipsView>("/charachip/list");
    charachips.value = data.list;
  } catch (error) {
    console.error("キャラチップ一覧の取得に失敗しました:", error);
    hasError.value = true;
  } finally {
    loading.value = false;
  }
});
</script>
