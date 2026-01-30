<template>
  <label :class="labelStyles({ size })">
    <slot />
  </label>
</template>

<script setup lang="ts">
import { tv } from "tailwind-variants";

withDefaults(
  defineProps<{
    size?: "small" | "medium" | "large";
  }>(),
  {}
);

const labelStyles = tv({
  base: "block text-sm font-medium text-gray-700 uppercase tracking-widest",
  variants: {
    size: {
      small: "text-xs",
      medium: "text-sm",
      large: "text-base",
    },
  },
  defaultVariants: {
    size: "medium",
  },
});
</script>
