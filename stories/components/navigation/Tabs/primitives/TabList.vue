<template>
  <div
    role="tablist"
    :aria-label="ariaLabel"
    aria-orientation="horizontal"
    :class="variants()"
  >
    <slot />
  </div>
</template>

<script setup lang="ts">
import { tv } from "@/utils/tv";

defineProps<{
  ariaLabel?: string;
}>();

// The tabs split the width evenly over one bottom border, which the active tab
// underlines. Flat on purpose, so they don't read as a RadioGroup.
const variants = tv({
  base: [
    "grid auto-cols-fr grid-flow-col border-b",
    "border-neutral-200",
    "dark:border-neutral-700",
  ],
});
</script>
