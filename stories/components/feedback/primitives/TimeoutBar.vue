<template>
  <div
    v-bind="forwardedAttrs"
    :class="timeoutBarStyles({ variant, class: classAttr })"
    :style="{ animationDuration: `${duration}ms` }"
  />
</template>

<script lang="ts" setup>
import { tv } from "tailwind-variants";
import { useForwardedAttrs } from "@/composables/useForwardedAttrs";

defineOptions({
  inheritAttrs: false,
});

const { classAttr, forwardedAttrs } = useForwardedAttrs();

const timeoutBarStyles = tv({
  base: "absolute bottom-0 left-0 h-0.5 w-full animate-[timeout-shrink_linear_forwards]",
  variants: {
    variant: {
      info: "bg-blue-400",
      success: "bg-green-400",
      warning: "bg-yellow-400",
      danger: "bg-red-400",
    },
  },
  defaultVariants: {
    variant: "info",
  },
});

withDefaults(
  defineProps<{
    variant?: "info" | "success" | "warning" | "danger";
    duration?: number;
  }>(),
  {},
);
</script>
