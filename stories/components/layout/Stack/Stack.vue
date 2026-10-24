<template>
  <component
    :is="as"
    v-bind="forwardedAttrs"
    :class="
      stackStyles({ direction, gap, align, justify, wrap, class: classAttr })
    "
  >
    <slot />
  </component>
</template>

<script lang="ts" setup>
import { tv } from "tailwind-variants";
import { useForwardedAttrs } from "@/composables";

defineOptions({
  inheritAttrs: false,
});

const { classAttr, forwardedAttrs } = useForwardedAttrs();

// Spelled out so Tailwind can find every class at build time.
const stackStyles = tv({
  base: "flex",
  variants: {
    direction: {
      row: "flex-row",
      column: "flex-col",
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
    align: {
      start: "items-start",
      center: "items-center",
      end: "items-end",
      stretch: "items-stretch",
      baseline: "items-baseline",
    },
    justify: {
      start: "justify-start",
      center: "justify-center",
      end: "justify-end",
      between: "justify-between",
      around: "justify-around",
      evenly: "justify-evenly",
    },
    wrap: {
      true: "flex-wrap",
      false: "",
    },
  },
  defaultVariants: {
    direction: "column",
    gap: 4,
    wrap: false,
  },
});

withDefaults(
  defineProps<{
    direction?: "row" | "column";
    gap?: 0 | 1 | 2 | 3 | 4 | 6 | 8;
    align?: "start" | "center" | "end" | "stretch" | "baseline";
    justify?: "start" | "center" | "end" | "between" | "around" | "evenly";
    wrap?: boolean;
    as?: string;
  }>(),
  {
    direction: "column",
    gap: 4,
    align: undefined,
    justify: undefined,
    wrap: false,
    as: "div",
  }
);
</script>
