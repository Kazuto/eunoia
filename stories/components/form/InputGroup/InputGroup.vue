<template>
  <div
    v-bind="forwardedAttrs"
    :class="variants({ disabled, invalid, class: classAttr })"
    role="group"
  >
    <slot />
  </div>
</template>

<script setup lang="ts">
import { tv } from "tailwind-variants";
import { useForwardedAttrs } from "@/composables";

defineOptions({
  inheritAttrs: false,
});

const { classAttr, forwardedAttrs } = useForwardedAttrs();

withDefaults(
  defineProps<{
    disabled?: boolean;
    invalid?: boolean;
  }>(),
  {}
);

const variants = tv({
  base: [
    "inline-flex overflow-hidden rounded-md border transition-colors",
    "border-neutral-200 text-neutral-600 hover:bg-neutral-50/25 active:bg-neutral-50/25 has-[input:focus]:border-primary-500 has-[textarea:focus]:border-primary-500",
    "dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-black/15 dark:active:bg-neutral-900/25 dark:has-[input:focus]:border-primary-500 dark:has-[textarea:focus]:border-primary-500",
  ],
  variants: {
    disabled: {
      true: "cursor-not-allowed opacity-50",
    },
    invalid: {
      true: [
        "border-red-500 bg-red-100 text-red-900 hover:bg-red-100/50 active:bg-red-100 has-[input:focus]:border-red-400 has-[textarea:focus]:border-red-400",
        "dark:border-red-700 dark:bg-red-950/25 dark:text-red-300 dark:hover:bg-red-950/50 dark:active:bg-red-950/50 dark:has-[input:focus]:border-red-500 dark:has-[textarea:focus]:border-red-500",
      ],
    },
  },
});
</script>
