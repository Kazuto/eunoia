<template>
  <Button
    :size="size"
    class="bg-transparent text-gray-800 hover:bg-gray-100 active:bg-gray-200"
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
