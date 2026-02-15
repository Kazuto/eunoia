<template>
  <input
    v-bind="$attrs"
    v-model="model"
    :class="inputStyles({ dense, invalid })"
    :aria-invalid="invalid || undefined"
  />
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
  base: [
    "inline-block w-full [appearance:textfield] outline-none disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none",
  ],
  variants: {
    dense: {
      false: "px-3.5 py-2.5 text-sm",
      true: "px-3.5 py-2.5 text-xs",
    },
  },
  defaultVariants: {
    dense: false,
  },
});
</script>

<style scoped></style>
