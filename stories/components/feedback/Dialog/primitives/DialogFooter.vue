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

defineProps<{
  dense?: boolean;
}>();

const footerStyles = tv({
  base: "flex items-center justify-end gap-2 border-t border-gray-200",
  variants: {
    dense: {
      false: "px-6 py-4",
      true: "px-4 py-3",
    },
  },
  defaultVariants: {
    dense: false,
  },
});
</script>
