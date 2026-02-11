<template>
  <div
    v-bind="forwardedAttrs"
    :class="footerStyles({ dense, class: classAttr })"
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

const footerStyles = tv({
  base: "flex items-center gap-2 border-t border-gray-200",
  variants: {
    dense: {
      false: "mt-4 pt-4",
      true: "mt-3 pt-3",
    },
  },
  defaultVariants: {
    dense: false,
  },
});

defineProps<{
  dense?: boolean;
}>();
</script>
