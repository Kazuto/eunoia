<template>
  <Button
    :dense="dense"
    :icon="icon"
    :background-color="backgroundColor"
    class="bg-primary text-white"
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
