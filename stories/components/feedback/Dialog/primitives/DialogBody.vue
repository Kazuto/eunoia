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

defineProps<{
  dense?: boolean;
}>();

const bodyStyles = tv({
  base: [
    "scrollbar-subtle flex-1 overflow-y-auto",
    "text-neutral-600",
    "dark:text-neutral-400",
  ],
  variants: {
    dense: {
      false: "px-6 py-4 text-sm",
      true: "px-4 py-3 text-xs",
    },
  },
  defaultVariants: {
    dense: false,
  },
});
</script>
