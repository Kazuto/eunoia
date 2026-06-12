<template>
  <IconPrimitive
    v-bind="$attrs"
    :name
    :type
    :size
  />
</template>

<script lang="ts" setup>
import {
  default as IconPrimitive,
  type IconOptions,
} from "./primitives/Icon.vue";

export type { IconOptions };

defineOptions({
  inheritAttrs: false,
});

withDefaults(defineProps<IconOptions>(), {
  type: "regular",
  size: "md",
});
</script>
