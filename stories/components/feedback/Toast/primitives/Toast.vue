<template>
  <div
    v-bind="forwardedAttrs"
    role="status"
    :class="toastStyles({ variant, dense, class: classAttr })"
  >
    <slot />
    <slot name="timeout" />
  </div>
</template>

<script lang="ts" setup>
import { tv } from "tailwind-variants";
import { useForwardedAttrs } from "@/composables";

defineOptions({
  inheritAttrs: false,
});

const { classAttr, forwardedAttrs } = useForwardedAttrs();

const toastStyles = tv({
  base: "relative flex items-start gap-3 overflow-hidden rounded-lg border bg-white font-sans shadow-lg",
  variants: {
    variant: {
      info: [
        "border-blue-400 bg-blue-100 text-blue-800",
        "dark:border-blue-700 dark:bg-blue-950 dark:text-blue-300",
      ],
      success: [
        "border-green-400 bg-green-100 text-green-800",
        "dark:border-green-700 dark:bg-green-950 dark:text-green-300",
      ],
      warning: [
        "border-yellow-500 bg-yellow-100 text-yellow-800",
        "dark:border-yellow-700 dark:bg-yellow-950 dark:text-yellow-300",
      ],
      danger: [
        "border-red-400 bg-red-100 text-red-800",
        "dark:border-red-700 dark:bg-red-950 dark:text-red-300",
      ],
    },
    dense: {
      false: "max-w-sm min-w-72 px-4 py-3 text-sm",
      true: "max-w-xs min-w-64 px-3 py-2 text-xs",
    },
  },
  defaultVariants: {
    variant: "info",
    dense: false,
  },
});

export type Toast = {
  variant: "info" | "success" | "warning" | "danger";
  dense: boolean;
};

withDefaults(
  defineProps<{
    variant?: "info" | "success" | "warning" | "danger";
    dense?: boolean;
  }>(),
  {
    variant: "info",
  }
);
</script>
