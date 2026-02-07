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
import { useForwardedAttrs } from "@/composables/useForwardedAttrs";

defineOptions({
  inheritAttrs: false,
});

const { classAttr, forwardedAttrs } = useForwardedAttrs();

const countStyles = tv({
  base: "ml-1.5 inline-flex items-center justify-center rounded-full font-bold",
  variants: {
    variant: {
      primary: "bg-white text-primary",
      secondary: "bg-gray-800 text-white",
      success: "bg-green-800 text-white",
      warning: "bg-yellow-800 text-white",
      danger: "bg-red-800 text-white",
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
  {},
);
</script>
