<template>
  <div
    role="group"
    aria-roledescription="slide"
    :aria-label="label"
    :inert="!active || undefined"
    class="w-full shrink-0 snap-start snap-always"
  >
    <slot />
  </div>
</template>

<script setup lang="ts">
defineProps<{
  label: string;
  active?: boolean;
}>();
</script>
