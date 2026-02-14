<template>
  <Button
    :dense="dense"
    :icon="icon"
    class="bg-primary text-white hover:bg-primary/85"
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
