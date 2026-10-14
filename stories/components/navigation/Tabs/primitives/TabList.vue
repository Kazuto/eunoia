<template>
  <div
    role="tablist"
    :aria-label="ariaLabel"
    aria-orientation="horizontal"
    :class="variants({ dense })"
  >
    <slot />
  </div>
</template>

<script setup lang="ts">
import { tv } from "tailwind-variants";

defineProps<{
  ariaLabel?: string;
  dense?: boolean;
}>();

const variants = tv({
  base: "flex flex-wrap items-center",
  variants: {
    dense: {
      true: "gap-1",
      false: "gap-2",
    },
  },
});
</script>
