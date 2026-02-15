<template>
  <Button
    :dense="dense"
    :icon="icon"
    class="text-white bg-primary-500 hover:bg-primary-600"
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
