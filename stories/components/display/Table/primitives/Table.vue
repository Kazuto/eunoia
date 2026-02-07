<template>
  <table
    v-bind="forwardedAttrs"
    :class="tableStyles({ dense, class: classAttr })"
  >
    <slot />
  </table>
</template>

<script lang="ts" setup>
import { tv } from "tailwind-variants";
import { useForwardedAttrs } from "@/composables/useForwardedAttrs";

defineOptions({
  inheritAttrs: false,
});

const { classAttr, forwardedAttrs } = useForwardedAttrs();

const tableStyles = tv({
  base: "w-full border-collapse font-sans",
  variants: {
    dense: {
      false: "text-sm",
      true: "text-xs",
    },
  },
  defaultVariants: {
    dense: false,
  },
});

withDefaults(
  defineProps<{
    dense?: boolean;
  }>(),
  {},
);
</script>
