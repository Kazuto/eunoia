<script setup lang="ts">
import type { SplitViewItem } from "./LeftPanel.vue";

defineProps<{
  item?: SplitViewItem;
}>();

defineSlots<{
  default: (props: { item: SplitViewItem | undefined }) => unknown;
  header?: (props: { item: SplitViewItem | undefined }) => unknown;
  footer?: (props: { item: SplitViewItem | undefined }) => unknown;
}>();
</script>

<template>
  <div
    class="flex min-h-0 min-w-0 flex-col overflow-hidden rounded-[6px] squircle"
  >
    <div
      v-if="$slots.header"
      class="shrink-0 border-b border-neutral-200 p-4 dark:border-white/5"
    >
      <slot
        name="header"
        :item="item"
      />
    </div>
    <div class="min-h-0 flex-1 overflow-y-auto p-4">
      <slot :item="item" />
    </div>
    <div
      v-if="$slots.footer"
      class="shrink-0 border-t border-neutral-200 p-4 dark:border-white/5"
    >
      <slot
        name="footer"
        :item="item"
      />
    </div>
  </div>
</template>
