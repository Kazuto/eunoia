<template>
  <span
    v-bind="forwardedAttrs"
    :class="countStyles({ variant, dense, class: classAttr })"
    :aria-label="String(count)"
  >
    <slot />
  </span>
</template>

<script lang="ts" setup>
import { tv } from "tailwind-variants";
import { useForwardedAttrs } from "@/composables";

defineOptions({
  inheritAttrs: false,
});

const { classAttr, forwardedAttrs } = useForwardedAttrs();

const countStyles = tv({
  base: "inline-flex items-center justify-center rounded-full font-bold",
  variants: {
    variant: {
      primary: [
        "text-primary-500",
        "bg-white",
        "dark:bg-primary-900 dark:text-primary-100",
      ],
      secondary: [
        "bg-neutral-800 text-white",
        "dark:bg-neutral-900 dark:text-neutral-100",
      ],
      success: [
        "bg-green-800 text-white",
        "dark:bg-green-900 dark:text-green-100",
      ],
      warning: [
        "bg-yellow-800 text-white",
        "dark:bg-yellow-900 dark:text-yellow-100",
      ],
      danger: ["bg-red-800 text-white", "dark:bg-red-900 dark:text-red-100"],
    },
    dense: {
      false: "h-4 min-w-4 px-1 text-[10px]",
      true: "h-3.5 min-w-3.5 px-0.5 text-[8px]",
    },
  },
  defaultVariants: {
    variant: "primary",
    dense: false,
  },
});

withDefaults(
  defineProps<{
    variant?: "primary" | "secondary" | "success" | "warning" | "danger";
    dense?: boolean;
    count: number;
  }>(),
  {
    variant: "primary",
  }
);
</script>
