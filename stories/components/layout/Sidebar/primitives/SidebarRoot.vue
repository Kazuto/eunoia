<template>
  <aside
    v-bind="forwardedAttrs"
    :class="sidebarRootStyles({ collapsed, class: classAttr })"
  >
    <slot />
  </aside>
</template>

<script lang="ts" setup>
import { tv } from "tailwind-variants";
import { useForwardedAttrs } from "@/composables";

defineOptions({
  inheritAttrs: false,
});

const { classAttr, forwardedAttrs } = useForwardedAttrs();

withDefaults(
  defineProps<{
    collapsed?: boolean;
  }>(),
  {
    collapsed: false,
  }
);

const sidebarRootStyles = tv({
  base: "flex h-full shrink-0 flex-col overflow-hidden border-r border-neutral-200 bg-white font-sans transition-[width] duration-200 dark:border-neutral-700 dark:bg-neutral-900",
  variants: {
    collapsed: {
      false: "w-64",
      true: "w-fit",
    },
  },
  defaultVariants: {
    collapsed: false,
  },
});
</script>
