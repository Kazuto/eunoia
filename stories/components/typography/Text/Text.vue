<template>
  <TextPrimitive
    v-bind="$attrs"
    :size
    :muted
    :weight
    :as
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
    weight?: "normal" | "medium" | "semibold" | "bold";
    /** Element to render, e.g. "span" for inline text. */
    as?: string;
  }>(),
  {
    size: "base",
    weight: undefined,
    as: "p",
  }
);
</script>
