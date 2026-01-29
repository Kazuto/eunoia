<template>
  <Button
    :size="size"
    class="bg-transparent text-gray-800 shadow-[inset_0_0_0_1px_rgba(0,0,0,0.15)]"
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
