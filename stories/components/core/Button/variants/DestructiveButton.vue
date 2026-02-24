<template>
  <Button
    :dense="dense"
    :icon="icon"
    class="bg-red-500 text-red-50 focus-visible:ring-red-500 enabled:hover:bg-red-600 enabled:active:bg-red-700 dark:bg-red-700 dark:focus-visible:ring-red-600 dark:enabled:hover:bg-red-800 dark:enabled:active:bg-red-900"
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
