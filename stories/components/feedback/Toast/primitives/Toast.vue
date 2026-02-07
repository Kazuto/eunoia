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
import { useForwardedAttrs } from "@/composables/useForwardedAttrs";

defineOptions({
  inheritAttrs: false,
});

const { classAttr, forwardedAttrs } = useForwardedAttrs();

const toastStyles = tv({
  base: "relative flex items-start gap-3 overflow-hidden rounded-lg border bg-white font-sans shadow-lg",
  variants: {
    variant: {
      info: "border-blue-200 text-blue-800",
      success: "border-green-200 text-green-800",
      warning: "border-yellow-200 text-yellow-800",
      danger: "border-red-200 text-red-800",
    },
    dense: {
      false: "min-w-72 max-w-sm px-4 py-3 text-sm",
      true: "min-w-64 max-w-xs px-3 py-2 text-xs",
    },
  },
  defaultVariants: {
    variant: "info",
    dense: false,
  },
});

withDefaults(
  defineProps<{
    variant?: "info" | "success" | "warning" | "danger";
    dense?: boolean;
  }>(),
  {},
);
</script>
