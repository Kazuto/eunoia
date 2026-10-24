<template>
  <component
    :is="as"
    v-bind="forwardedAttrs"
    :class="textStyles({ size, muted, weight, class: classAttr })"
  >
    <slot />
  </component>
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
    size?: "sm" | "base" | "lg";
    muted?: boolean;
    weight?: "normal" | "medium" | "semibold" | "bold";
    as?: string;
  }>(),
  {
    size: "base",
    weight: undefined,
    as: "p",
  }
);

const textStyles = tv({
  base: [
    "font-sans leading-relaxed",
    "text-neutral-900",
    "dark:text-neutral-100",
  ],
  variants: {
    size: {
      sm: "text-sm",
      base: "text-base",
      lg: "text-lg",
    },
    muted: {
      true: ["text-neutral-500", "dark:text-neutral-400"],
    },
    weight: {
      normal: "font-normal",
      medium: "font-medium",
      semibold: "font-semibold",
      bold: "font-bold",
    },
  },
  defaultVariants: {
    size: "base",
  },
});
</script>
