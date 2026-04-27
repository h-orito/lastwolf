<template>
  <img
    :src="charaImageUrl"
    :alt="`${chara.name.name}の画像`"
    :width="imageWidth"
    :height="imageHeight"
    class="rounded-md align-bottom"
    loading="lazy"
  />
</template>

<script setup lang="ts">
import type { Chara, CharaView } from "~/lib/api/types";

interface Props {
  chara: Chara | CharaView;
  faceType?: string;
  isSmall?: boolean;
  isLarge?: boolean;
  width?: number;
  height?: number;
}

const props = withDefaults(defineProps<Props>(), {
  faceType: "NORMAL",
  isSmall: false,
  isLarge: false,
  width: undefined,
  height: undefined,
});

const charaImageUrl = computed(() => props.chara.image.image_url || "");

const imageWidth = computed(() => {
  if (props.width) return props.width;
  const baseWidth = props.chara.image.width;
  const multiplier = props.isLarge ? 1.5 : 1;
  const divider = props.isSmall ? 2 : 1;
  return Math.round((baseWidth * multiplier) / divider);
});

const imageHeight = computed(() => {
  if (props.height) return props.height;
  const baseHeight = props.chara.image.height;
  const multiplier = props.isLarge ? 1.5 : 1;
  const divider = props.isSmall ? 2 : 1;
  return Math.round((baseHeight * multiplier) / divider);
});
</script>
