<template>
  <ul
    :id
    v-bind="forwardedAttrs"
    :class="dropdownStyles({ dense, class: classAttr })"
    role="listbox"
    :aria-multiselectable="multiple || undefined"
  >
    <slot />
  </ul>
</template>

<script lang="ts" setup>
import { tv } from "tailwind-variants";
import { useForwardedAttrs } from "@/composables/useForwardedAttrs";

defineOptions({
  inheritAttrs: false,
});

const { classAttr, forwardedAttrs } = useForwardedAttrs();

const dropdownStyles = tv({
  base: "absolute left-0 right-0 top-full z-50 mt-1 max-h-60 overflow-auto rounded-md border border-gray-300 bg-white shadow-lg",
  variants: {
    dense: {
      false: "py-1",
      true: "py-0.5",
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
}>();
</script>
