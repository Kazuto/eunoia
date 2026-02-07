<template>
  <Badge :variant :dense :pill>
    <slot />
    <BadgeCount v-if="count != null" :variant :dense :count>
      {{ displayCount }}
    </BadgeCount>
  </Badge>
</template>

<script lang="ts" setup>
import { computed } from "vue";
import Badge from "./primitives/Badge.vue";
import BadgeCount from "./primitives/BadgeCount.vue";

const props = withDefaults(
  defineProps<{
    variant?: "primary" | "secondary" | "success" | "warning" | "danger";
    dense?: boolean;
    pill?: boolean;
    count?: number;
    maxCount?: number;
  }>(),
  {
    maxCount: 99,
  }
);

const displayCount = computed(() => {
  if (props.count == null) return null;
  if (props.count > props.maxCount) return `${props.maxCount}+`;
  return props.count;
});
</script>
