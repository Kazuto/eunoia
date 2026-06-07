<script setup lang="ts">
import { tv } from "tailwind-variants";
import {
  default as LeftPanel,
  type SplitViewItem,
} from "./primitives/LeftPanel.vue";

export type { SplitViewItem };

defineProps<{
  items: SplitViewItem[];
  selected?: SplitViewItem;
}>();

defineSlots<{
  default: () => unknown;
  item: (props: { item: SplitViewItem }) => unknown;
}>();

const emit = defineEmits<{
  select: [item: SplitViewItem];
}>();

const variants = tv({
  base: [
    "flex h-full gap-4 overflow-hidden rounded-md border",
    "border-neutral-200 bg-white text-neutral-900",
    "dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100",
  ],
});
</script>

<template>
  <div :class="variants()">
    <LeftPanel
      :items="items"
      :selected="selected"
      @select="emit('select', $event)"
    >
      <template #item="{ item }">
        <slot
          name="item"
          :item="item"
        />
      </template>
    </LeftPanel>

    <div class="w-full rounded-sm p-4">
      <slot :selected="selected" />
    </div>
  </div>
</template>
