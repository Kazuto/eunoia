<template>
  <div
    :id
    v-bind="forwardedAttrs"
    role="dialog"
    tabindex="-1"
    :class="panelStyles({ dense, class: classAttr })"
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

const panelStyles = tv({
  base: [
    "z-50 w-max max-w-[min(22rem,calc(100vw-1rem))] rounded-[16px] border font-sans shadow-lg outline-none squircle",
    "border-neutral-300 bg-white text-neutral-900",
    "dark:border-neutral-600 dark:bg-neutral-800 dark:text-neutral-100",
  ],
  variants: {
    dense: {
      false: "p-4 text-sm",
      true: "p-3 text-xs",
    },
  },
  defaultVariants: {
    dense: false,
  },
});

defineProps<{
  id?: string;
  dense?: boolean;
}>();
</script>
