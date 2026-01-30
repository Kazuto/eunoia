<template>
  <input
    v-bind="$attrs"
    :class="inputStyles({ size, invalid })"
    v-model="model"
  />
</template>

<script setup lang="ts">
import { tv } from "tailwind-variants";

defineOptions({
  inheritAttrs: false,
});

const model = defineModel<string | number>();

withDefaults(
  defineProps<{
    size?: "small" | "medium" | "large";
    invalid?: boolean;
  }>(),
  {}
);

const inputStyles = tv({
  base: "inline-block w-full rounded-md outline-none hover:bg-gray-50 focus:bg-gray-50 active:bg-gray-100 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none",
  variants: {
    size: {
      small: "px-3.5 py-2.5 text-xs",
      medium: "px-4.5 py-2.5 text-sm",
      large: "px-5.5 py-3 text-base",
    },
    invalid: {
      true: "hover:bg-red-100/50 focus:bg-red-100/50 active:bg-red-100",
    },
  },
  defaultVariants: {
    size: "medium",
  },
});
</script>

<style scoped></style>
