<template>
  <div
    v-bind="forwardedAttrs"
    role="alert"
    :class="alertStyles({ variant, dense, class: classAttr })"
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

const alertStyles = tv({
  base: "relative flex items-start gap-3 overflow-hidden rounded-md border font-sans",
  variants: {
    variant: {
      info: "border-blue-200 bg-blue-50 text-blue-800",
      success: "border-green-200 bg-green-50 text-green-800",
      warning: "border-yellow-200 bg-yellow-50 text-yellow-800",
      danger: "border-red-200 bg-red-50 text-red-800",
    },
    dense: {
      false: "px-4 py-3 text-sm",
      true: "px-3 py-2 text-xs",
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
  {
    variant: "info",
  }
);
</script>
