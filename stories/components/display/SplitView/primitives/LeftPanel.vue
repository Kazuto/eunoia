<script setup lang="ts">
import { tv } from "tailwind-variants";

export type SplitViewItem = {
  key: string | number;
  label: string;
  [key: string]: unknown; // allow extra fields
};

defineProps<{
  items: SplitViewItem[];
  selected?: SplitViewItem;
}>();

defineSlots<{
  item: (props: { item: SplitViewItem }) => unknown;
}>();

const emit = defineEmits<{
  select: [item: SplitViewItem];
}>();

const variants = tv({
  base: [
    "flex cursor-pointer items-center justify-between rounded-sm px-4 py-2 text-sm font-medium",
    "text-neutral-900 hover:bg-neutral-200",
    "dark:text-neutral-100 dark:hover:bg-neutral-800",
  ],
  variants: {
    active: {
      true: [
        "pointer-events-none",
        "bg-primary-200 text-neutral-900",
        "dark:bg-primary-800 dark:text-neutral-100",
      ],
      false: "",
    },
  },
});
</script>

<template>
  <div
    class="flex shrink-0 flex-col gap-1 overflow-y-auto bg-neutral-100 p-2 shadow-sm dark:bg-neutral-700"
  >
    <div
      v-for="item in items"
      :key="item.key"
      :class="variants({ active: item.key === selected?.key })"
      @click="emit('select', item)"
    >
      <slot
        name="item"
        :item="item"
      >
        {{ item.label }}
      </slot>
    </div>
  </div>
</template>
