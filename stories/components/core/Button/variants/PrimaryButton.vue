<template>
  <Button
    :dense="dense"
    :background-color="backgroundColor"
    class="bg-primary text-white"
  >
    <slot />
  </Button>
</template>

<script lang="ts" setup>
import Button from "../primitives/Button.vue";

defineProps<{
  dense?: boolean;
}>();
</script>
