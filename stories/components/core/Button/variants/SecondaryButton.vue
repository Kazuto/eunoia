<template>
  <Button
    :dense="dense"
    :icon="icon"
    class="bg-transparent text-gray-800 shadow-[inset_0_0_0_1px_rgba(0,0,0,0.15)]"
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
