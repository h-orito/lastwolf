<template>
  <div>
    <section class="py-8 px-4 bg-gray-100">
      <div class="max-w-5xl mx-auto">
        <h1 class="text-lg font-bold mb-4">キャラチップ一覧</h1>
        <div class="text-sm">
          <p class="mb-4">キャラ画像は以下の方々に提供いただいています。ありがとうございます。</p>

          <!-- ローディング中 -->
          <div v-if="loading" class="text-center py-8 text-gray-500">読み込み中...</div>

          <!-- データなし -->
          <div v-else-if="tableCharachips.length === 0" class="text-center py-8 text-gray-500">
            <p>キャラチップがありません</p>
          </div>

          <!-- テーブル -->
          <div v-else class="overflow-x-auto">
            <table class="w-full border-collapse bg-white text-sm text-left">
              <thead>
                <tr>
                  <th class="border-b-2 border-gray-300 px-3 py-2 text-left font-semibold">
                    キャラチップ名
                  </th>
                  <th class="border-b-2 border-gray-300 px-3 py-2 text-left font-semibold">作者</th>
                  <th class="border-b-2 border-gray-300 px-3 py-2 text-left font-semibold">例</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="item in tableCharachips"
                  :key="item.charachip_id"
                  class="odd:bg-white even:bg-gray-50"
                >
                  <td class="border-b border-gray-200 px-3 py-1">
                    <NuxtLink
                      :to="{ path: '/charachip', query: { id: item.charachip_id } }"
                      class="text-blue-600 hover:text-blue-800"
                    >
                      {{ item.charachip_name }}
                    </NuxtLink>
                  </td>
                  <td class="border-b border-gray-200 px-3 py-1">{{ item.designer_name }}</td>
                  <td class="border-b border-gray-200 px-3 py-1 text-center">
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
        </div>
      </div>
    </section>
  </div>
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
  } finally {
    loading.value = false;
  }
});
</script>
