<template>
  <Button :dense="dense" class="bg-red-600 text-white hover:bg-red-700">
    <slot />
  </Button>
</template>

<script lang="ts" setup>
import Button from "../primitives/Button.vue";

defineProps<{
  dense?: boolean;
}>();
</script>
