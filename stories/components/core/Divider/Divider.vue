<template>
  <DividerPrimitive
    v-bind="$attrs"
    :orientation
    :label
  />
</template>

<script lang="ts" setup>
import DividerPrimitive from "./primitives/Divider.vue";

defineOptions({
  inheritAttrs: false,
});

withDefaults(
  defineProps<{
    orientation?: "horizontal" | "vertical";
    label?: string;
  }>(),
  {
    orientation: "horizontal",
    label: undefined,
  }
);
</script>
