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
  base: [
    "flex h-full flex-col overflow-hidden border-r font-sans transition-[width] duration-200",
    "border-neutral-200 bg-white",
    "dark:border-neutral-800 dark:bg-neutral-900",
  ],
  variants: {
    collapsed: {
      false: "min-w-48",
      true: "w-fit",
    },
  },
  defaultVariants: {
    collapsed: false,
  },
});
</script>
