<template>
  <span :class="thumbStyles({ dense, active })" />
</template>

<script setup lang="ts">
import { tv } from "tailwind-variants";

defineProps<{
  dense?: boolean;
  active?: boolean;
}>();

const thumbStyles = tv({
  base: [
    "absolute rounded-full",
    "bg-white",
    "transition-transform duration-200 ease-in-out",
  ],
  variants: {
    active: {
      // normal: inner width (46px) − circle (16px) − 2 × gap (4px) = 22px
      true: "translate-x-[22px]",
      false: "translate-x-0",
    },
    dense: {
      // dense: inner width (38px) − circle (14px) − 2 × gap (3px) = 18px
      true: "top-0.5 left-[3px] h-3.5 w-3.5",
      false: "top-[3px] left-1 h-4 w-4",
    },
  },
  compoundVariants: [
    { active: true, dense: true, class: "translate-x-[18px]" },
  ],
});
</script>
