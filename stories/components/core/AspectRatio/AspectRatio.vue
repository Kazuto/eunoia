<template>
  <div
    v-bind="forwardedAttrs"
    :class="ratioStyles({ class: classAttr })"
    :style="{ aspectRatio: String(ratio) }"
  >
    <slot />
  </div>
</template>

<script lang="ts" setup>
import { tv } from "tailwind-variants";
import { useForwardedAttrs } from "@/composables";

defineOptions({
  inheritAttrs: false,
});

const { classAttr, forwardedAttrs } = useForwardedAttrs();

const ratioStyles = tv({
  base: "relative w-full overflow-hidden *:size-full",
});

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
