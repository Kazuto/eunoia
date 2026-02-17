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
import { useForwardedAttrs } from "@/composables";

defineOptions({
  inheritAttrs: false,
});

const { classAttr, forwardedAttrs } = useForwardedAttrs();

const menuStyles = tv({
  base: "absolute top-full right-0 left-0 z-50 mt-1 max-h-60 overflow-auto rounded-md border border-neutral-300 bg-white shadow-lg dark:border-neutral-600 dark:bg-neutral-800",
  variants: {
    dense: {
      false: "",
      true: "",
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
