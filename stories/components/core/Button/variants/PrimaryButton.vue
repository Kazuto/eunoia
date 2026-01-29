<template>
  <Button
    :size="size"
    :background-color="backgroundColor"
    class="bg-primary text-white"
  >
    <slot />
  </Button>
</template>

<script lang="ts" setup>
import Button from "../primitives/Button.vue";

defineProps<{
  size?: "small" | "medium" | "large";
}>();
</script>
