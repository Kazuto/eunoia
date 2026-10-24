<template>
  <component
    :is="as"
    v-bind="forwardedAttrs"
    :class="
      gridStyles({
        cols: minItemWidth ? undefined : cols,
        gap,
        class: classAttr,
      })
    "
    :style="autoFillStyle"
  >
    <slot />
  </component>
</template>

<script lang="ts" setup>
import { computed } from "vue";
import { tv } from "tailwind-variants";
import { useForwardedAttrs } from "@/composables";

defineOptions({
  inheritAttrs: false,
});

const { classAttr, forwardedAttrs } = useForwardedAttrs();

// Spelled out so Tailwind can find every class at build time.
const gridStyles = tv({
  base: "grid",
  variants: {
    cols: {
      1: "grid-cols-1",
      2: "grid-cols-1 sm:grid-cols-2",
      3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
      4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
      6: "grid-cols-2 sm:grid-cols-3 lg:grid-cols-6",
      12: "grid-cols-4 sm:grid-cols-6 lg:grid-cols-12",
    },
    gap: {
      0: "gap-0",
      1: "gap-1",
      2: "gap-2",
      3: "gap-3",
      4: "gap-4",
      6: "gap-6",
      8: "gap-8",
    },
  },
  defaultVariants: {
    gap: 4,
  },
});

const props = withDefaults(
  defineProps<{
    /** Columns at the widest breakpoint; collapses on smaller screens. */
    cols?: 1 | 2 | 3 | 4 | 6 | 12;
    gap?: 0 | 1 | 2 | 3 | 4 | 6 | 8;
    /** Fits as many columns of at least this width as the row allows; overrides `cols`. */
    minItemWidth?: string;
    as?: string;
  }>(),
  {
    cols: 3,
    gap: 4,
    minItemWidth: undefined,
    as: "div",
  }
);

const autoFillStyle = computed(() =>
  props.minItemWidth
    ? {
        gridTemplateColumns: `repeat(auto-fill, minmax(min(${props.minItemWidth}, 100%), 1fr))`,
      }
    : undefined
);
</script>
