<template>
  <ul
    :id
    v-bind="forwardedAttrs"
    :class="dropdownStyles({ dense, placement, class: classAttr })"
    role="listbox"
    :aria-multiselectable="multiple || undefined"
  >
    <slot />
  </ul>
</template>

<script lang="ts" setup>
import { tv } from "tailwind-variants";
import { useForwardedAttrs } from "@/composables";

defineOptions({
  inheritAttrs: false,
});

const { classAttr, forwardedAttrs } = useForwardedAttrs();

const dropdownStyles = tv({
  base: [
    "absolute right-0 left-0 z-50 scrollbar-subtle max-h-60 overflow-auto rounded-md border shadow-lg",
    "border-neutral-300 bg-white",
    "dark:border-neutral-700 dark:bg-neutral-900",
  ],
  variants: {
    dense: {
      false: "py-1",
      true: "py-0.5",
    },
    placement: {
      top: "bottom-full mb-1",
      bottom: "top-full mt-1",
    },
  },
  defaultVariants: {
    dense: false,
  },
});

defineProps<{
  id?: string;
  multiple?: boolean;
  dense?: boolean;
  placement?: "top" | "bottom";
}>();
</script>
