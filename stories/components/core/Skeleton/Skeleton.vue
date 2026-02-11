<template>
  <SkeletonPrimitive
    v-bind="$attrs"
    :variant
    :rounded
    :width
    :height
  />
</template>

<script lang="ts" setup>
import SkeletonPrimitive from "./primitives/Skeleton.vue";

defineOptions({
  inheritAttrs: false,
});

withDefaults(
  defineProps<{
    variant?: "text" | "circular" | "rectangular";
    rounded?: boolean;
    width?: string | number;
    height?: string | number;
  }>(),
  {
    variant: "text",
    width: undefined,
    height: undefined,
  }
);
</script>
