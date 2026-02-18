<template>
  <h3
    v-bind="forwardedAttrs"
    :class="titleStyles({ dense, class: classAttr })"
  >
    <slot />
  </h3>
</template>

<script lang="ts" setup>
import { tv } from "tailwind-variants";
import { useForwardedAttrs } from "@/composables";

defineOptions({
  inheritAttrs: false,
});

const { classAttr, forwardedAttrs } = useForwardedAttrs();

const titleStyles = tv({
  base: ["font-semibold", "text-neutral-900", "dark:text-neutral-100"],
  variants: {
    dense: {
      false: "text-lg",
      true: "text-base",
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
