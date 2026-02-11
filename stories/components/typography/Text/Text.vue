<template>
  <TextPrimitive
    v-bind="$attrs"
    :size
    :muted
  >
    <slot />
  </TextPrimitive>
</template>

<script lang="ts" setup>
import TextPrimitive from "./primitives/Text.vue";

defineOptions({
  inheritAttrs: false,
});

withDefaults(
  defineProps<{
    size?: "sm" | "base" | "lg";
    muted?: boolean;
  }>(),
  {
    size: "base",
  }
);
</script>
