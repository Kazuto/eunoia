<template>
  <IconPrimitive
    v-bind="$attrs"
    :name
    :type
    :size
  />
</template>

<script lang="ts" setup>
import IconPrimitive from "./primitives/Icon.vue";

defineOptions({
  inheritAttrs: false,
});

withDefaults(
  defineProps<{
    name: string;
    type?: "thin" | "light" | "regular" | "bold" | "fill" | "duotone";
    size?: "xs" | "sm" | "md" | "lg" | "xl";
  }>(),
  {
    type: "regular",
    size: "md",
  }
);
</script>
