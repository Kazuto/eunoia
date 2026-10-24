<template>
  <!-- Focusable so keyboard users can scroll it; a scroll container without focusable children is otherwise unreachable. -->
  <div
    tabindex="0"
    v-bind="forwardedAttrs"
    :class="scrollStyles({ orientation, class: classAttr })"
    :style="sizeStyle"
  >
    <slot />
  </div>
</template>

<script lang="ts" setup>
import { computed } from "vue";
import { tv } from "tailwind-variants";
import { useForwardedAttrs } from "@/composables";

defineOptions({
  inheritAttrs: false,
});

const { classAttr, forwardedAttrs } = useForwardedAttrs();

const scrollStyles = tv({
  base: [
    "scrollbar-subtle overscroll-contain rounded-[12px] squircle",
    "focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:outline-none",
  ],
  variants: {
    orientation: {
      vertical: "overflow-x-hidden overflow-y-auto",
      horizontal: "overflow-x-auto overflow-y-hidden",
      both: "overflow-auto",
    },
  },
  defaultVariants: {
    orientation: "vertical",
  },
});

const props = withDefaults(
  defineProps<{
    orientation?: "vertical" | "horizontal" | "both";
    maxHeight?: string | number;
  }>(),
  {
    orientation: "vertical",
    maxHeight: undefined,
  }
);

const sizeStyle = computed(() => {
  if (props.maxHeight == null) return undefined;
  return {
    maxHeight:
      typeof props.maxHeight === "number"
        ? `${props.maxHeight}px`
        : props.maxHeight,
  };
});
</script>
