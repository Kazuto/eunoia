<script setup lang="ts">
import Input from "@/components/form/Input/Input.vue";
import { tv } from "tailwind-variants";
import { ref, computed } from "vue";

export type SplitViewItem = {
  key: string | number;
  label: string;
  [key: string]: unknown; // allow extra fields
};

const props = defineProps<{
  items: SplitViewItem[];
  selected?: SplitViewItem;
  searchable?: boolean;
}>();

const search = ref("");

const filteredItems = computed(() => {
  if (!search.value) return props.items;

  return props.items.filter((item: SplitViewItem) =>
    item.label.toLowerCase().includes(search.value.toLowerCase())
  );
});

defineSlots<{
  item: (props: { item: SplitViewItem }) => unknown;
}>();

const emit = defineEmits<{
  select: [item: SplitViewItem];
  search: [search: string];
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
        "bg-primary-200 text-neutral-900 hover:bg-primary-200",
        "dark:bg-primary-800 dark:text-neutral-100 dark:hover:bg-primary-800",
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
    <div v-if="searchable">
      <Input
        v-model="search"
        placeholder="Search..."
        @change="emit('search', search)"
      />
    </div>
    <div
      v-for="item in filteredItems"
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
