<template>
  <div
    class="border-neutral-200 bg-white aspect-square h-12 w-12 rounded-md"
    :style="{ backgroundColor: color }"
  ></div>
</template>

<script setup lang="ts">
defineProps<{
  color: string;
}>();
</script>
