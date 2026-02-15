<template>
  <Button
    :dense="dense"
    :icon="icon"
    class="bg-primary-500 text-white hover:bg-primary-600 dark:bg-primary-700 dark:hover:bg-primary-800"
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
