<template>
  <AvatarPrimitive
    v-bind="$attrs"
    :src
    :name
    :size
  />
</template>

<script lang="ts" setup>
import AvatarPrimitive from "./primitives/Avatar.vue";

defineOptions({
  inheritAttrs: false,
});

withDefaults(
  defineProps<{
    src?: string;
    name?: string;
    size?: "xs" | "sm" | "md" | "lg" | "xl";
  }>(),
  {
    src: undefined,
    name: undefined,
    size: "md",
  }
);
</script>
