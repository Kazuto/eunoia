<template>
  <div :class="limitStyles({ dense })">
    {{ value }}
  </div>
</template>

<script setup lang="ts">
import { tv } from "tailwind-variants";

defineOptions({
  inheritAttrs: false,
});

defineProps<{
  dense?: boolean;
  value?: string | number;
}>();

const limitStyles = tv({
  base: ["text-xs select-none", "text-neutral-500", "dark:text-neutral-400"],
});
</script>

<style scoped></style>
