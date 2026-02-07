<template>
  <label
    :class="labelStyles({ dense })"
    v-bind="$attrs"
  >
    <slot />
  </label>
</template>

<script setup lang="ts">
import { tv } from "tailwind-variants";

defineProps<{
  dense?: boolean;
}>();

const labelStyles = tv({
  base: "block font-medium tracking-widest text-gray-700 uppercase",
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
</script>
