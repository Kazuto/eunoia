<template>
  <span class="flex items-center gap-2">
    <Icon
      v-if="icon"
      :name="icon"
      size="sm"
    />

    <slot />
  </span>
</template>

<script setup lang="ts">
import Icon from "@/components/core/Icon/Icon.vue";

defineProps<{
  icon?: string;
}>();
</script>
