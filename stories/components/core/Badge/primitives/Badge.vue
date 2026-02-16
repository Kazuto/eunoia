<template>
  <span
    role="status"
    v-bind="forwardedAttrs"
    :class="badgeStyles({ variant, dense, pill, class: classAttr })"
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

const badgeStyles = tv({
  base: "inline-flex items-center font-sans leading-none font-bold",
  variants: {
    variant: {
      primary: "bg-primary-500 text-white dark:bg-primary-500",
      secondary:
        "bg-neutral-100 text-neutral-950 dark:bg-neutral-700 dark:text-neutral-50",
      success:
        "bg-green-400 text-green-950 dark:bg-green-700 dark:text-green-50",
      warning:
        "bg-yellow-500 text-yellow-950 dark:bg-yellow-700 dark:text-yellow-50",
      danger: "bg-red-400 text-red-950 dark:bg-red-700 dark:text-red-50",
    },
    dense: {
      false: "px-2.5 py-1 text-xs",
      true: "px-2 py-0.5 text-[10px]",
    },
    pill: {
      false: "rounded-md",
      true: "rounded-full",
    },
  },
  defaultVariants: {
    variant: "primary",
    dense: false,
    pill: false,
  },
});

withDefaults(
  defineProps<{
    variant?: "primary" | "secondary" | "success" | "warning" | "danger";
    dense?: boolean;
    pill?: boolean;
  }>(),
  {
    variant: "primary",
  }
);
</script>
