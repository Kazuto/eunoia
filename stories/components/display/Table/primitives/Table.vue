<template>
  <table
    v-bind="forwardedAttrs"
    :role="stacked ? 'table' : undefined"
    :class="tableStyles({ dense, stacked, class: classAttr })"
  >
    <slot />
  </table>
</template>

<script lang="ts" setup>
import { tv } from "tailwind-variants";
import { useForwardedAttrs } from "@/composables";

defineOptions({
  inheritAttrs: false,
});

const { classAttr, forwardedAttrs } = useForwardedAttrs();

const tableStyles = tv({
  base: "w-full border-collapse font-sans",
  variants: {
    dense: {
      false: "text-sm",
      true: "text-xs",
    },
    // Stacked rows are no longer laid out as a table. The explicit roles in
    // the stacked parts keep it a table for screen readers.
    stacked: {
      true: "block",
    },
  },
  defaultVariants: {
    dense: false,
  },
});

withDefaults(
  defineProps<{
    dense?: boolean;
    stacked?: boolean;
  }>(),
  {}
);
</script>
