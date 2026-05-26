<template>
  <p v-if="situation?.participate.myself" class="mt-2 text-xs leading-relaxed">
    あなたは<strong> {{ situation.participate.myself.chara.name.name }} </strong>です。<span
      v-if="situation.participate.myself.skill"
      >役職は<strong> {{ situation.participate.myself.skill.name }} </strong>です。</span
    ><span v-if="isDead" class="text-wolf"><br />あなたは死亡しました。</span>
  </p>
</template>

<script setup lang="ts">
const villageStore = useVillageStore();
const situation = computed(() => villageStore.situation);

const isDead = computed(() => {
  return !!situation.value?.participate.myself?.dead;
});
</script>
