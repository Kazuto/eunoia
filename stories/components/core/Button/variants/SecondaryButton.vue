<template>
  <Button
    :dense="dense"
    :icon="icon"
    class="bg-transparent text-neutral-800 shadow-[inset_0_0_0_1px_rgba(0,0,0,0.15)] hover:bg-neutral-100 active:bg-neutral-200 dark:text-neutral-200 dark:shadow-[inset_0_0_0_1px_rgba(255,255,255,0.15)] dark:hover:bg-neutral-700 dark:active:bg-neutral-600"
  >
    <slot />
  </Button>
</template>

<script lang="ts" setup>
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
</script>
