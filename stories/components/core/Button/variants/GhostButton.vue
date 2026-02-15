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
    "bg-transparent text-neutral-800 hover:bg-neutral-100 active:bg-neutral-200",
    "dark:text-neutral-200 dark:hover:bg-neutral-900 dark:active:bg-neutral-600",
  ],
});
</script>
