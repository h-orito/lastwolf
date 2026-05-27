<template>
  <div>
    <nav v-if="tableVillages.length > 0" class="registry" aria-label="最近終了した村一覧">
      <NuxtLink
        v-for="v in tableVillages"
        :key="v.id"
        :to="{ path: '/village', query: { id: v.id } }"
        class="registry-entry"
      >
        <span class="registry-numeral" aria-hidden="true">
          <span class="registry-numeral-mark">№</span>
          <span class="registry-numeral-id">{{ v.id }}</span>
        </span>
        <span class="registry-rule" aria-hidden="true"></span>
        <span class="registry-text">
          <span class="registry-title">{{ v.name }}</span>
          <span class="registry-meta">
            <span class="registry-meta-field">{{ v.participantCount }}</span>
            <span class="registry-meta-sep" aria-hidden="true">·</span>
            <span class="registry-meta-field">{{ v.organization }}</span>
            <span class="registry-meta-sep" aria-hidden="true">·</span>
            <span class="registry-meta-camp">{{ v.winCamp }}</span>
          </span>
        </span>
        <span class="registry-arrow" aria-hidden="true">→</span>
      </NuxtLink>
    </nav>

    <div v-else class="registry-state">
      <span class="registry-state-mark" aria-hidden="true">—</span>
      <span class="registry-state-text">終了した村はありません</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { components } from "~/lib/api/schema";

type SimpleVillageView = components["schemas"]["SimpleVillageView"];

interface Props {
  villages: SimpleVillageView[];
}

const props = defineProps<Props>();

const tableVillages = computed(() =>
  props.villages.map((village) => ({
    id: village.id,
    name: village.name,
    participantCount: `${village.participants.count}人`,
    organization:
      village.setting.organizations.organization[String(village.participants.count)] ?? "",
    winCamp: village.win_camp?.name ?? "引分",
  })),
);
</script>

<style scoped>
.registry-numeral-mark {
  font-size: 0.7em;
  margin-right: 0.18em;
  opacity: 0.75;
}
.registry-numeral-id {
  letter-spacing: 0.04em;
}

/* 勝利陣営は bone で軽く強調（meta の他項目より目立たせる） */
.registry-meta-camp {
  color: var(--color-bone);
}
</style>
