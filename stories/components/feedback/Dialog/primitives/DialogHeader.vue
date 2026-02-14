<template>
  <div
    v-bind="forwardedAttrs"
    :class="headerStyles({ dense, class: classAttr })"
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

const headerStyles = tv({
  base: "flex items-center justify-between border-b border-neutral-200",
  variants: {
    dense: {
      false: "px-6 py-4",
      true: "px-4 py-3",
    },
  },
  defaultVariants: {
    dense: false,
  },
});
</script>
