<template>
  <component
    :is="as"
    v-bind="forwardedAttrs"
    :class="containerStyles({ size, padded, class: classAttr })"
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

const containerStyles = tv({
  base: "mx-auto w-full",
  variants: {
    size: {
      sm: "max-w-screen-sm",
      md: "max-w-screen-md",
      lg: "max-w-screen-lg",
      xl: "max-w-screen-xl",
      "2xl": "max-w-screen-2xl",
      full: "max-w-full",
    },
    padded: {
      true: "px-4 sm:px-6 lg:px-8",
      false: "",
    },
  },
  defaultVariants: {
    size: "lg",
    padded: true,
  },
});

withDefaults(
  defineProps<{
    size?: "sm" | "md" | "lg" | "xl" | "2xl" | "full";
    padded?: boolean;
    as?: string;
  }>(),
  {
    size: "lg",
    padded: true,
    as: "div",
  }
);
</script>
