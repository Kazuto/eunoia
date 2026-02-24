<template>
  <div
    :class="trackStyles({ dense, disabled, invalid, active, class: classAttr })"
    v-bind="forwardedAttrs"
  >
    <slot />
  </div>
</template>

<script setup lang="ts">
import { tv } from "tailwind-variants";
import { useForwardedAttrs } from "@/composables";

defineOptions({ inheritAttrs: false });

const { classAttr, forwardedAttrs } = useForwardedAttrs();

defineProps<{
  dense?: boolean;
  disabled?: boolean;
  invalid?: boolean;
  active?: boolean;
}>();

const trackStyles = tv({
  base: [
    "relative cursor-pointer rounded-full border p-1 transition-colors duration-200 ease-in-out",
    "focus-within:ring-2 focus-within:ring-primary-500 focus-within:outline-none",
  ],
  variants: {
    active: {
      true: "bg-primary-500",
      false: ["bg-neutral-200", "dark:bg-neutral-700"],
    },
    dense: {
      true: "h-5 w-10",
      false: "h-6 w-12",
    },
    disabled: {
      true: "cursor-not-allowed opacity-40",
      false: "",
    },
    invalid: {
      true: ["border-red-500", "dark:border-red-500"],
      false: ["border-neutral-300", "dark:border-neutral-700"],
    },
  },
  defaultVariants: {
    dense: false,
    disabled: false,
    invalid: false,
    active: false,
  },
});
</script>
