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

// A segmented control: the tabs share one track and split its width evenly.
const variants = tv({
  base: [
    "grid auto-cols-fr grid-flow-col items-center rounded-[14px] squircle",
    "bg-neutral-100",
    "dark:bg-neutral-950",
  ],
  variants: {
    dense: {
      true: "gap-0.5 p-0.5",
      false: "gap-1 p-1",
    },
  },
});
</script>
