<template>
  <div
    v-bind="forwardedAttrs"
    :class="hintRowStyles({ dense, class: classAttr })"
  >
    <slot />
  </div>
</template>

<script lang="ts" setup>
import { tv } from "tailwind-variants";
import { useForwardedAttrs } from "@/composables/useForwardedAttrs";

defineOptions({
  inheritAttrs: false,
});

const { classAttr, forwardedAttrs } = useForwardedAttrs();

defineProps<{
  dense?: boolean;
}>();

const hintRowStyles = tv({
  base: "flex justify-between text-gray-400",
  variants: {
    dense: {
      false: "text-xs",
      true: "text-[10px]",
    },
  },
  defaultVariants: {
    dense: false,
  },
});
</script>
