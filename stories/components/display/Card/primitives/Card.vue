<template>
  <div
    v-bind="forwardedAttrs"
    :class="cardStyles({ dense, class: classAttr })"
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

const cardStyles = tv({
  base: "rounded-lg border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-900",
  variants: {
    dense: {
      false: "p-6",
      true: "p-4",
    },
  },
  defaultVariants: {
    dense: false,
  },
});

defineProps<{
  dense?: boolean;
}>();
</script>
