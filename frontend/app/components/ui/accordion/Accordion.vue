<template>
  <div>
    <div v-for="(item, index) in items" :key="index">
      <button
        type="button"
        class="flex w-full cursor-pointer items-center py-2.5 text-sm text-white no-underline hover:text-blue-400"
        @click="toggle(index)"
        @keydown.enter="toggle(index)"
      >
        <Icon v-if="item.icon" :name="item.icon" class="h-4 w-4" />
        <span class="ml-2 flex-1 text-left">{{ item.label }}</span>
        <Icon
          :name="openStates[index] ? 'i-heroicons-chevron-up' : 'i-heroicons-chevron-down'"
          class="h-4 w-4"
        />
      </button>
      <div v-if="openStates[index]">
        <slot :name="item.slot" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Icon from "~/components/ui/icon/Icon.vue";

interface AccordionItem {
  label: string;
  slot: string;
  defaultOpen?: boolean;
  icon?: string;
}

interface Props {
  items: AccordionItem[];
}

const props = defineProps<Props>();

const openStates = ref<Record<number, boolean>>({});

onMounted(() => {
  props.items.forEach((item, index) => {
    openStates.value[index] = item.defaultOpen ?? false;
  });
});

const toggle = (index: number) => {
  openStates.value = {
    ...openStates.value,
    [index]: !openStates.value[index],
  };
};
</script>
