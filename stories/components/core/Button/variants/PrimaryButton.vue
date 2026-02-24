<template>
  <Button
    :dense="dense"
    :icon="icon"
    :class="buttonStyles()"
  >
    <slot />
  </Button>
</template>

<script lang="ts" setup>
import { tv } from "tailwind-variants";
import Button from "../primitives/Button.vue";

withDefaults(
  defineProps<{
    dense?: boolean;
    icon?: string;
  }>(),
  {
    icon: undefined,
  }
);

const buttonStyles = tv({
  base: [
    "bg-primary-500 text-primary-50 focus-visible:ring-primary-500 enabled:hover:bg-primary-600 enabled:active:bg-primary-700",
    "dark:bg-primary-700 dark:focus-visible:ring-primary-700 dark:enabled:hover:bg-primary-800 dark:enabled:active:bg-primary-900",
  ],
});
</script>
