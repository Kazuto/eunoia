<template>
  <div
    :id
    v-bind="forwardedAttrs"
    role="dialog"
    :aria-label="label"
    :class="panelStyles({ dense, class: classAttr })"
    data-colorpicker-panel
    @mousedown.stop
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
  id: string;
  label: string;
  dense?: boolean;
}>();

const panelStyles = tv({
  base: [
    "z-50 flex flex-col rounded-[14px] border shadow-lg squircle",
    "border-neutral-300 bg-white text-neutral-900",
    "dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100",
  ],
  variants: {
    dense: {
      false: "w-64 gap-3 p-3",
      true: "w-56 gap-2 p-2",
    },
  },
  defaultVariants: {
    dense: false,
  },
});
</script>
