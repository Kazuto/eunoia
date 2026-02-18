<template>
  <p
    v-bind="forwardedAttrs"
    :class="textStyles({ size, muted, class: classAttr })"
  >
    <slot />
  </p>
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
  }>(),
  {
    size: "base",
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
  },
  defaultVariants: {
    size: "base",
  },
});
</script>
