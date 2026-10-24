<template>
  <div
    v-bind="forwardedAttrs"
    :class="['relative w-full overflow-hidden *:size-full', classAttr]"
    :style="{ aspectRatio: String(ratio) }"
  >
    <slot />
  </div>
</template>

<script lang="ts" setup>
import { useForwardedAttrs } from "@/composables";

defineOptions({
  inheritAttrs: false,
});

const { classAttr, forwardedAttrs } = useForwardedAttrs();

withDefaults(
  defineProps<{
    /** A number (16 / 9) or a CSS aspect-ratio string ("4 / 3"). */
    ratio?: number | string;
  }>(),
  {
    ratio: 16 / 9,
  }
);
</script>
