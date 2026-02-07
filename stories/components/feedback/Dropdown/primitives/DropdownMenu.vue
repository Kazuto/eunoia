<template>
  <ul
    :id
    v-bind="forwardedAttrs"
    :class="menuStyles({ dense, class: classAttr })"
    role="menu"
    :aria-activedescendant="activeDescendantId"
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

const menuStyles = tv({
  base: "absolute top-full right-0 left-0 z-50 mt-1 max-h-60 overflow-auto rounded-md border border-gray-300 bg-white shadow-lg",
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
  dense?: boolean;
  activeDescendantId?: string;
}>();
</script>
