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
    "bg-transparent text-neutral-800 hover:bg-black/10 focus-visible:ring-neutral-300 active:bg-black/5",
    "dark:text-neutral-200 dark:hover:bg-white/10 dark:focus-visible:ring-neutral-700 dark:active:bg-white/5",
  ],
});
</script>
