<template>
  <img
    v-bind="forwardedAttrs"
    :class="imageStyles({ rounded, fit, class: classAttr })"
    :src
    :alt
    :width
    :height
    :loading
    :fetchpriority
  />
</template>

<script lang="ts" setup>
import { tv } from "tailwind-variants";
import { useForwardedAttrs } from "@/composables";

defineOptions({
  inheritAttrs: false,
});

const { classAttr, forwardedAttrs } = useForwardedAttrs();

const imageStyles = tv({
  base: "inline-block",
  variants: {
    rounded: {
      true: "rounded-lg",
      full: "rounded-full",
    },
    fit: {
      cover: "object-cover",
      contain: "object-contain",
      fill: "object-fill",
      none: "object-none",
    },
  },
  defaultVariants: {
    fit: "cover",
  },
});

withDefaults(
  defineProps<{
    src: string;
    alt: string;
    width?: string | number;
    height?: string | number;
    loading?: "lazy" | "eager";
    fetchpriority?: "high" | "low" | "auto";
    rounded?: boolean | "full";
    fit?: "cover" | "contain" | "fill" | "none";
  }>(),
  {
    width: undefined,
    height: undefined,
    loading: "lazy",
    fetchpriority: "auto",
    rounded: undefined,
    fit: "cover",
  }
);
</script>
