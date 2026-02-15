<template>
  <Badge
    v-bind="$attrs"
    class="inline-flex items-center gap-2"
    :variant
    :dense
    :pill
  >
    <slot />
    <BadgeCount
      v-if="count != null"
      :variant
      :dense
      :count
    >
      {{ displayCount }}
    </BadgeCount>
  </Badge>
</template>

<script lang="ts" setup>
import { computed } from "vue";
import Badge from "./primitives/Badge.vue";
import BadgeCount from "./primitives/BadgeCount.vue";

defineOptions({
  inheritAttrs: false,
});

const props = withDefaults(
  defineProps<{
    variant?: "primary" | "secondary" | "success" | "warning" | "danger";
    dense?: boolean;
    pill?: boolean;
    count?: number;
    maxCount?: number;
  }>(),
  {
    variant: "primary",
    count: undefined,
    maxCount: 99,
  }
);

const displayCount = computed(() => {
  if (props.count == null) return null;
  if (props.count > props.maxCount) return `${props.maxCount}+`;
  return props.count;
});
</script>
