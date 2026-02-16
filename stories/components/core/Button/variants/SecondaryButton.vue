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
    "bg-transparent text-neutral-800 shadow-[inset_0_0_0_1px_rgba(0,0,0,0.15)] hover:bg-black/10 focus-visible:ring-neutral-300 active:bg-black/5",
    "dark:text-neutral-200 dark:shadow-[inset_0_0_0_1px_rgba(255,255,255,0.15)] dark:hover:bg-white/10 dark:focus-visible:ring-neutral-600 dark:active:bg-white/5",
  ],
});
</script>
