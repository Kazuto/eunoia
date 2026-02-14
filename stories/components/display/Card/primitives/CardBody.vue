<template>
  <div
    v-bind="forwardedAttrs"
    :class="bodyStyles({ dense, class: classAttr })"
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

const bodyStyles = tv({
  base: "text-neutral-600 dark:text-neutral-400",
  variants: {
    dense: {
      false: "text-sm",
      true: "text-xs",
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
