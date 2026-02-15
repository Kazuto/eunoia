<template>
  <div
    v-bind="forwardedAttrs"
    :class="cardStyles({ dense, class: classAttr })"
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

const cardStyles = tv({
  base: ["rounded-lg", "bg-white", "dark:bg-neutral-900"],
  variants: {
    dense: {
      false: "p-6",
      true: "p-4",
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
