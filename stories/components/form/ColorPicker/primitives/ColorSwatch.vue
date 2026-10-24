<template>
  <span
    v-bind="forwardedAttrs"
    :class="swatchStyles({ size, class: classAttr })"
    aria-hidden="true"
  >
    <span
      class="absolute inset-0"
      :style="{ backgroundColor: color ?? 'transparent' }"
    />
  </span>
</template>

<script lang="ts" setup>
import { tv } from "tailwind-variants";
import { useForwardedAttrs } from "@/composables";

defineOptions({
  inheritAttrs: false,
});

const { classAttr, forwardedAttrs } = useForwardedAttrs();

withDefaults(
  defineProps<{
    color?: string | null;
    size?: "sm" | "md" | "lg";
  }>(),
  {
    color: undefined,
    size: "md",
  }
);

const swatchStyles = tv({
  base: [
    "relative inline-block shrink-0 overflow-hidden rounded-[6px] border squircle",
    "border-black/10 dark:border-white/15",
    "bg-[repeating-conic-gradient(#d4d4d4_0_25%,#ffffff_0_50%)] bg-size-[8px_8px]",
  ],
  variants: {
    size: {
      sm: "h-4 w-4",
      md: "h-5 w-5",
      lg: "h-7 w-7",
    },
  },
  defaultVariants: {
    size: "md",
  },
});
</script>
