<template>
  <nav
    :aria-label="ariaLabel"
    class="flex list-none flex-col gap-2"
  >
    <slot />
  </nav>
</template>

<script setup lang="ts">
defineProps<{
  ariaLabel?: string;
}>();
</script>
