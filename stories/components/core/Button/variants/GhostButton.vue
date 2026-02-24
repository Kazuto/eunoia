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
    "bg-transparent text-neutral-800 focus-visible:ring-neutral-300 enabled:hover:bg-black/10 enabled:active:bg-black/5",
    "dark:text-neutral-200 dark:focus-visible:ring-neutral-700 dark:enabled:hover:bg-white/10 dark:enabled:active:bg-white/5",
  ],
});
</script>
