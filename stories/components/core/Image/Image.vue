<template>
  <ImagePrimitive
    v-bind="$attrs"
    :src
    :alt
    :width
    :height
    :loading
    :fetchpriority
    :rounded
    :fit
  />
</template>

<script lang="ts" setup>
import ImagePrimitive from "./primitives/Image.vue";

defineOptions({
  inheritAttrs: false,
});

withDefaults(
  defineProps<{
    src: string;
    alt: string;
    width?: string | number;
    height?: string | number;
    loading?: "lazy" | "eager";
    fetchpriority?: "high" | "low" | "auto";
    rounded?: boolean | "full";
    fit?: "cover" | "contain" | "fill" | "none";
  }>(),
  {
    width: undefined,
    height: undefined,
    loading: "lazy",
    fetchpriority: "auto",
    rounded: undefined,
    fit: "cover",
  }
);
</script>
