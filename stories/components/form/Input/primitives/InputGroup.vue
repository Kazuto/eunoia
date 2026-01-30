<template>
  <div :class="variants({ disabled, invalid })" role="group">
    <slot />
  </div>
</template>

<script setup lang="ts">
import { tv } from "tailwind-variants";

withDefaults(
  defineProps<{
    disabled?: boolean;
    invalid?: boolean;
  }>(),
  {}
);

const variants = tv({
  base: "inline-flex rounded-md border border-gray-300 focus:ring-2 focus:ring-gray-300 has-[input:focus]:ring-2 has-[input:focus]:ring-gray-300 has-[input:focus]:ring-offset-2",
  variants: {
    disabled: {
      true: "cursor-not-allowed opacity-50",
    },
    invalid: {
      true: "border-red-500 bg-red-50 text-red-900",
    },
  },
});
</script>
