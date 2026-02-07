<template>
  <input
    v-bind="$attrs"
    v-model="model"
    :class="inputStyles({ dense, invalid })"
    :aria-invalid="invalid || undefined"
  >
</template>

<script setup lang="ts">
import { tv } from "tailwind-variants";

defineOptions({
  inheritAttrs: false,
});

const model = defineModel<string | number>();

defineProps<{
  dense?: boolean;
  invalid?: boolean;
}>();

const inputStyles = tv({
  base: "inline-block w-full [appearance:textfield] rounded-md outline-none hover:bg-gray-50 focus:bg-gray-50 active:bg-gray-100 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none",
  variants: {
    dense: {
      false: "px-4.5 py-2.5 text-sm",
      true: "px-3.5 py-2.5 text-xs",
    },
    invalid: {
      true: "hover:bg-red-100/50 focus:bg-red-100/50 active:bg-red-100",
    },
  },
  defaultVariants: {
    dense: false,
  },
});
</script>

<style scoped></style>
