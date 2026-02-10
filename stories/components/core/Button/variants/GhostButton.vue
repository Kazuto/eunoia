<template>
  <Button
    :dense="dense"
    :icon="icon"
    class="bg-transparent text-gray-800 hover:bg-gray-100 active:bg-gray-200"
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
