<template>
  <div>
    <!-- ローディング中 -->
    <div v-if="loadingVillages" class="registry-state">
      <span class="registry-state-mark" aria-hidden="true">···</span>
      <span class="registry-state-text">読み込み中</span>
    </div>

    <!-- データなし -->
    <div v-else-if="!villages || villages.length === 0" class="registry-state">
      <span class="registry-state-mark" aria-hidden="true">—</span>
      <span class="registry-state-text">村が作成されていません</span>
    </div>

    <!-- レジストリ表示 -->
    <nav v-else class="registry" aria-label="進行中の村一覧">
      <NuxtLink
        v-for="village in villages"
        :key="village.id"
        :to="{ path: '/village', query: { id: village.id } }"
        class="registry-entry"
      >
        <span class="registry-numeral" aria-hidden="true">
          <span class="registry-numeral-mark">№</span>
          <span class="registry-numeral-id">{{ village.id }}</span>
        </span>
        <span class="registry-rule" aria-hidden="true"></span>
        <span class="registry-text">
          <span class="registry-title">{{ village.name }}</span>
          <span class="registry-meta">
            <span class="registry-status" :class="statusClass(village.status.code)">
              {{ village.status.name }}
            </span>
            <span class="registry-meta-sep" aria-hidden="true">·</span>
            <span class="registry-meta-field">{{ formatCount(village) }}</span>
            <template v-if="formatOrg(village)">
              <span class="registry-meta-sep" aria-hidden="true">·</span>
              <span class="registry-meta-field">{{ formatOrg(village) }}</span>
            </template>
            <span class="registry-meta-sep" aria-hidden="true">·</span>
            <span class="registry-creator">
              <span class="registry-creator-label">作成者:</span>
              {{ village.creator_player.nickname }}
            </span>
          </span>
        </span>
        <span class="registry-arrow" aria-hidden="true">→</span>
      </NuxtLink>
    </nav>
  </div>
</template>

<script setup lang="ts">
import type { components } from "~/lib/api/schema";
import { VILLAGE_STATUS } from "~/lib/api/village-status-constants";

type SimpleVillageView = components["schemas"]["SimpleVillageView"];

interface Props {
  villages: SimpleVillageView[] | null;
  loadingVillages: boolean;
}

withDefaults(defineProps<Props>(), {
  villages: null,
  loadingVillages: false,
});

// ステータスコード（PROLOGUE / IN_PROGRESS など）→ ロール色クラスへのマッピング
const statusClass = (code: string): string => {
  return `registry-status--${code.toLowerCase()}`;
};

// 募集中は "現在/上限" 形式、それ以外は "現在人数"
const formatCount = (v: SimpleVillageView): string => {
  if (v.status.code === VILLAGE_STATUS.PROLOGUE) {
    return `${v.participants.count}/${v.setting.capacity.max}人`;
  }
  return `${v.participants.count}人`;
};

// 編成は人数確定後（点呼以降）のみ表示。募集中は出さない
const formatOrg = (v: SimpleVillageView): string | null => {
  if (v.status.code === VILLAGE_STATUS.PROLOGUE) return null;
  const org = v.setting.organizations.organization[String(v.participants.count)];
  return org && org.length > 0 ? org : null;
};
</script>

<style scoped>
/* № の "No." 記号は番号本体より小さく目立たないように */
.registry-numeral-mark {
  font-size: 0.7em;
  margin-right: 0.18em;
  opacity: 0.75;
}
.registry-numeral-id {
  letter-spacing: 0.04em;
}

/* ステータスごとに色を変えて、進行段階を一瞥で判別できるようにする
 *   PROLOGUE      → gold (神秘・始まり / 募集中)
 *   ROLLCALLING   → seer (淡金、判断の時)
 *   IN_PROGRESS   → blood (活動中)
 *   EPILOGUE      → wolf (狼陣営が動く終局)
 *   COMPLETED / CANCEL → fg-muted (過去)
 */
.registry-status {
  letter-spacing: 0.1em;
  color: var(--color-fg-secondary);
}
.registry-status--prologue {
  color: var(--color-gold);
}
.registry-status--rollcalling {
  color: var(--color-seer);
}
.registry-status--in_progress {
  color: var(--color-blood);
}
.registry-status--epilogue {
  color: var(--color-wolf);
}
.registry-status--completed,
.registry-status--cancel {
  color: var(--color-fg-muted);
}

.registry-creator {
  color: var(--color-fg-secondary);
  white-space: nowrap;
}
.registry-creator-label {
  color: var(--color-fg-muted);
  margin-right: 0.15em;
}
</style>
