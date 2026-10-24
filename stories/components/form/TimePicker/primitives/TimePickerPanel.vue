<template>
  <div
    :id
    v-bind="forwardedAttrs"
    role="dialog"
    data-timepicker-panel
    :class="panelStyles({ dense, placement, floating, class: classAttr })"
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

defineProps<{
  id?: string;
  dense?: boolean;
  placement?: "top" | "bottom";
  floating?: boolean;
}>();

const panelStyles = tv({
  base: [
    "z-50 flex w-max divide-x rounded-[16px] border shadow-lg squircle",
    "divide-neutral-200 border-neutral-300 bg-white",
    "dark:divide-neutral-700 dark:border-neutral-700 dark:bg-neutral-900",
  ],
  variants: {
    floating: {
      true: "fixed m-0",
      false: "absolute left-0",
    },
    dense: {
      false: "p-1",
      true: "p-0.5",
    },
    placement: {
      top: "bottom-full mb-1",
      bottom: "top-full mt-1",
    },
  },
  defaultVariants: {
    dense: false,
    floating: false,
  },
});
</script>
