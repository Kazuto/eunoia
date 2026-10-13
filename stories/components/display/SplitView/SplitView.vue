<script setup lang="ts">
import { tv } from "tailwind-variants";
import {
  default as LeftPanel,
  type SplitViewItem,
} from "./primitives/LeftPanel.vue";
import RightPanel from "./primitives/RightPanel.vue";

export type { SplitViewItem };

const search = defineModel<string>("search", { default: "" });

defineProps<{
  items: SplitViewItem[];
  selected?: SplitViewItem;
  searchable?: boolean;
}>();

defineSlots<{
  default: (props: { item: SplitViewItem | undefined }) => unknown;
  header?: (props: { item: SplitViewItem | undefined }) => unknown;
  footer?: (props: { item: SplitViewItem | undefined }) => unknown;
  item: (props: { item: SplitViewItem }) => unknown;
}>();

const emit = defineEmits<{
  select: [item: SplitViewItem];
}>();

const variants = tv({
  base: [
    "grid h-full min-h-0 grid-cols-12 grid-rows-[minmax(0,1fr)] gap-4 overflow-hidden rounded-md border",
    "border-neutral-200 bg-white text-neutral-900",
    "dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100",
  ],
});
</script>

<template>
  <div :class="variants()">
    <LeftPanel
      v-model:search="search"
      class="col-span-2"
      :items
      :searchable
      :selected
      @select="emit('select', $event)"
    >
      <template #item="{ item }">
        <slot
          name="item"
          :item="item"
        />
      </template>
    </LeftPanel>

    <RightPanel
      class="col-span-10"
      :item="selected"
    >
      <template
        v-if="$slots.header"
        #header="{ item }"
      >
        <slot
          name="header"
          :item="item"
        />
      </template>
      <template #default="{ item }">
        <slot :item="item" />
      </template>
      <template
        v-if="$slots.footer"
        #footer="{ item }"
      >
        <slot
          name="footer"
          :item="item"
        />
      </template>
    </RightPanel>
  </div>
</template>
