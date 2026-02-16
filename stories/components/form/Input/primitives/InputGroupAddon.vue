<template>
  <div
    :class="
      variants({
        position,
        invalid,
        disabled,
        role: $attrs.role,
        class: $attrs.class,
      })
    "
    :tabindex="$attrs.role === 'button' ? 0 : undefined"
    v-bind="$attrs"
  >
    <slot />
  </div>
</template>
<script setup lang="ts">
import { tv } from "tailwind-variants";

defineProps<{
  position?: "left" | "right";
  invalid?: boolean;
  disabled?: boolean;
}>();

defineOptions({
  inheritAttrs: false,
});

const variants = tv({
  base: [
    "flex items-center rounded-md border border-transparent px-3 py-1 text-neutral-500",
  ],
  variants: {
    role: {
      button: [
        "cursor-pointer outline-none focus-visible:text-primary-300 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 dark:focus-visible:text-primary-500",
      ],
    },
  },
  compoundVariants: [
    {
      disabled: true,
      role: "button",
      class:
        "cursor-not-allowed hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 active:bg-transparent",
    },
    {
      position: "left",
      invalid: true,
      class:
        "border-r-red-500 bg-red-50 text-red-900 hover:bg-red-100/50 focus-visible:bg-red-100/50 active:bg-red-100",
    },
    {
      position: "right",
      invalid: true,
      class:
        "border-l-red-500 bg-red-50 text-red-900 hover:bg-red-100/50 focus-visible:bg-red-100/50 active:bg-red-100",
    },
  ],
});
</script>
