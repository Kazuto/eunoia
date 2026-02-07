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
import { useForwardedAttrs } from "@/composables/useForwardedAttrs";

defineOptions({
  inheritAttrs: false,
});

const { classAttr, forwardedAttrs } = useForwardedAttrs();

const badgeStyles = tv({
  base: "inline-flex items-center font-sans font-bold leading-none",
  variants: {
    variant: {
      primary: "bg-primary text-white",
      secondary: "bg-gray-100 text-gray-800",
      success: "bg-green-100 text-green-800",
      warning: "bg-yellow-100 text-yellow-800",
      danger: "bg-red-100 text-red-800",
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
  },
);
</script>
