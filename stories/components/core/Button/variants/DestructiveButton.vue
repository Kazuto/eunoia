<template>
  <Button
    :dense="dense"
    :icon="icon"
    class="bg-red-600 text-white hover:bg-red-700"
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
