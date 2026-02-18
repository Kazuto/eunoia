<template>
  <Button
    :dense="dense"
    :icon="icon"
    class="bg-red-500 text-red-50 hover:bg-red-600 focus-visible:ring-red-500 active:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800 dark:focus-visible:ring-red-600 dark:active:bg-red-900"
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
