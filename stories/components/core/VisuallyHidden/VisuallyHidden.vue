<template>
  <component
    :is="as"
    class="sr-only"
  >
    <slot />
  </component>
</template>

<script lang="ts" setup>
withDefaults(
  defineProps<{
    as?: string;
  }>(),
  {
    as: "span",
  }
);
</script>
