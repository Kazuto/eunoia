<template>
  <label
    :class="labelStyles({ dense, class: classAttr })"
    v-bind="forwardedAttrs"
  >
    <slot />
  </label>
</template>

<script setup lang="ts">
import { tv } from "tailwind-variants";
import { useForwardedAttrs } from "@/composables";

defineProps<{
  dense?: boolean;
}>();

const { classAttr, forwardedAttrs } = useForwardedAttrs();

const labelStyles = tv({
  base: "block tracking-wide text-neutral-700",
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
