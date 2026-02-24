<template>
  <h2
    :id
    v-bind="forwardedAttrs"
    :class="titleStyles({ dense, class: classAttr })"
  >
    <slot />
  </h2>
</template>

<script lang="ts" setup>
import { tv } from "tailwind-variants";
import { useForwardedAttrs } from "@/composables";

defineOptions({
  inheritAttrs: false,
});

const { classAttr, forwardedAttrs } = useForwardedAttrs();

defineProps<{
  id?: string;
  dense?: boolean;
}>();

const titleStyles = tv({
  base: ["font-semibold", "text-neutral-900", "dark:text-neutral-100"],
  variants: {
    dense: {
      false: "text-lg",
      true: "text-base",
    },
  },
  defaultVariants: {
    dense: false,
  },
});
</script>
