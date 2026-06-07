<template>
  <input
    v-bind="forwardedAttrs"
    v-model="model"
    :class="inputStyles({ dense, class: classAttr })"
    :aria-invalid="invalid || undefined"
  />
</template>

<script setup lang="ts">
import { tv } from "tailwind-variants";
import { useForwardedAttrs } from "@/composables";

defineOptions({
  inheritAttrs: false,
});

const { classAttr, forwardedAttrs } = useForwardedAttrs();

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
      false: "px-3 py-2 text-sm",
      true: "px-2.5 py-1.5 text-xs",
    },
  },
  defaultVariants: {
    dense: false,
  },
});
</script>

<style scoped></style>
