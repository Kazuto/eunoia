<template>
  <div
    v-bind="forwardedAttrs"
    :class="headerStyles({ dense, class: classAttr })"
  >
    <slot />
  </div>
</template>

<script lang="ts" setup>
import { tv } from "tailwind-variants";
import { useForwardedAttrs } from "@/composables";

defineOptions({
  inheritAttrs: false,
});

const { classAttr, forwardedAttrs } = useForwardedAttrs();

const headerStyles = tv({
  base: "flex items-center justify-between",
  variants: {
    dense: {
      false: "mb-4",
      true: "mb-3",
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
