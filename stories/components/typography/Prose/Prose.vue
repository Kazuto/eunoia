<template>
  <component
    :is="as"
    v-bind="forwardedAttrs"
    :class="proseStyles({ size, class: classAttr })"
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

// The element styles live in the eunoia-prose utility in styles.css.
const proseStyles = tv({
  base: "eunoia-prose",
  variants: {
    size: {
      sm: "text-sm",
      base: "text-base",
      lg: "text-lg",
    },
  },
  defaultVariants: {
    size: "base",
  },
});

withDefaults(
  defineProps<{
    size?: "sm" | "base" | "lg";
    as?: string;
  }>(),
  {
    size: "base",
    as: "div",
  }
);
</script>
