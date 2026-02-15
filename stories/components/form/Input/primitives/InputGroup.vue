<template>
  <div
    :class="variants({ disabled, invalid })"
    role="group"
  >
    <slot />
  </div>
</template>

<script setup lang="ts">
import { tv } from "tailwind-variants";

withDefaults(
  defineProps<{
    disabled?: boolean;
    invalid?: boolean;
  }>(),
  {}
);

const variants = tv({
  base: [
    "inline-flex overflow-hidden rounded-md border transition-colors focus:ring-2 has-[input:focus]:ring-2",
    "border-neutral-200 text-neutral-600 hover:bg-neutral-50/25 focus:bg-neutral-50/25 focus:ring-neutral-300 active:bg-neutral-50/25 has-[input:focus]:ring-primary-300",
    "dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-900/25 dark:focus:bg-neutral-900/25 dark:focus:ring-primary-500 dark:active:bg-neutral-900/25 dark:has-[input:focus]:ring-primary-500",
  ],
  variants: {
    disabled: {
      true: "cursor-not-allowed opacity-50",
    },
    invalid: {
      true: [
        "border-red-500 bg-red-100 text-red-900 hover:bg-red-100/50 focus:bg-red-100/50 active:bg-red-100",
        "dark:border-red-700 dark:bg-red-950/25 dark:text-red-300 dark:hover:bg-red-950/50 dark:focus:bg-red-950/50 dark:active:bg-red-950/50",
      ],
    },
  },
});
</script>
