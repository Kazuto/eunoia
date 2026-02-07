<template>
  <label
    :class="labelStyles({ dense, class: classAttr })"
    v-bind="$forwardedAttrs"
  >
    <slot />
  </label>
</template>

<script setup lang="ts">
import { tv } from "tailwind-variants";
import { useForwardedAttrs } from "@/composables/useForwardedAttrs";

defineProps<{
  dense?: boolean;
}>();

const { classAttr, forwardedAttrs } = useForwardedAttrs();

const labelStyles = tv({
  base: "block font-medium tracking-widest text-gray-700 uppercase",
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
</script>
