<template>
  <ActionPanel title="管理メニュー" panel-key="admin">
    <!-- 参加者がいない場合 -->
    <p v-if="!participantList.length" class="text-center text-gray-500 dark:text-gray-400">
      参加者がいません
    </p>

    <!-- 参加者テーブル -->
    <div v-else class="overflow-x-auto">
      <table class="w-full text-sm">
        <thead class="bg-gray-100 dark:bg-gray-700">
          <tr>
            <th class="px-4 py-2 text-left text-gray-700 dark:text-gray-300">キャラ名</th>
            <th class="px-4 py-2 text-left text-gray-700 dark:text-gray-300">Twitter</th>
            <th class="px-4 py-2 text-left text-gray-700 dark:text-gray-300">役職</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="p in participantList"
            :key="p.name"
            class="border-t border-gray-200 dark:border-gray-600"
          >
            <td class="px-4 py-2">{{ p.name }}</td>
            <td class="px-4 py-2">
              <a
                v-if="p.twitter_user_name"
                :href="`https://twitter.com/${p.twitter_user_name}`"
                target="_blank"
                rel="noopener noreferrer"
                class="text-blue-600 hover:underline dark:text-(--ui-primary)"
              >
                {{ p.nickname }}@{{ p.twitter_user_name }}
              </a>
              <span v-else>{{ p.nickname }}</span>
            </td>
            <td class="px-4 py-2">{{ p.skill_name }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </ActionPanel>
</template>

<script setup lang="ts">
import ActionPanel from "../ActionPanel.vue";
import { useVillage } from "~/composables/village/useVillage";

const { allParticipants } = useVillage();

const participantList = computed(() =>
  allParticipants.value.map((p) => ({
    name: p.chara.name.name,
    twitter_user_name: p.player?.twitter_user_name ?? "",
    nickname: p.player?.nickname ?? "",
    skill_name: p.skill?.name ?? "",
  })),
);
</script>
