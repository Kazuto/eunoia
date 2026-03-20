<template>
  <div
    v-bind="forwardedAttrs"
    :class="
      variants({
        position,
        invalid,
        disabled,
        role: forwardedAttrs.role,
        class: classAttr,
      })
    "
    :tabindex="forwardedAttrs.role === 'button' ? 0 : undefined"
  >
    <slot />
  </div>
</template>
<script setup lang="ts">
import { tv } from "tailwind-variants";
import { useForwardedAttrs } from "@/composables";

defineProps<{
  position?: "left" | "right";
  invalid?: boolean;
  disabled?: boolean;
}>();

defineOptions({
  inheritAttrs: false,
});

const { classAttr, forwardedAttrs } = useForwardedAttrs();

const variants = tv({
  base: "flex items-center border border-transparent text-neutral-500",
  variants: {
    role: {
      button: [
        "cursor-pointer transition-colors outline-none disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
        "text-neutral-600 hover:bg-neutral-200 focus-visible:bg-neutral-200",
        "dark:text-neutral-400 dark:hover:bg-neutral-700 dark:focus-visible:bg-neutral-700",
      ],
      undefined: "rounded-md px-3 py-1",
    },
  },
  compoundVariants: [
    {
      role: "button",
      class: "px-2 py-0",
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
