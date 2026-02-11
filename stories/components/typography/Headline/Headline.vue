<template>
  <HeadlinePrimitive
    v-bind="$attrs"
    :level
  >
    <slot />
  </HeadlinePrimitive>
</template>

<script lang="ts" setup>
import HeadlinePrimitive from "./primitives/Headline.vue";

defineOptions({
  inheritAttrs: false,
});

withDefaults(
  defineProps<{
    level?: 1 | 2 | 3 | 4 | 5 | 6;
  }>(),
  {
    level: 1,
  }
);
</script>
