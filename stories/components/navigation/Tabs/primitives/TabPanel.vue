<template>
  <div
    :id
    role="tabpanel"
    :aria-labelledby="labelledby"
    tabindex="0"
    class="outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-inset"
  >
    <slot />
  </div>
</template>

<script setup lang="ts">
defineProps<{
  id: string;
  labelledby: string;
}>();
</script>
