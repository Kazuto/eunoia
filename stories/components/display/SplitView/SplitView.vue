<script setup lang="ts">
import { tv } from "tailwind-variants";
import {
  default as LeftPanel,
  type SplitViewItem,
} from "./primitives/LeftPanel.vue";
import RightPanel from "./primitives/RightPanel.vue";

export type { SplitViewItem };

const search = defineModel<string>("search", { default: "" });
/** Keys of the checked items when `selectable`. */
const selection = defineModel<SplitViewItem["key"][]>("selection", {
  default: () => [],
});

withDefaults(
  defineProps<{
    items: SplitViewItem[];
    selected?: SplitViewItem;
    searchable?: boolean;
    /** Keep the search field pinned while the list scrolls underneath. */
    stickySearch?: boolean;
    /** Render only the rows in view. Use for long lists. */
    virtual?: boolean;
    /** Estimated row height in px for `virtual`; rows are measured once rendered. */
    itemSize?: number;
    /** More items can be loaded; `endReached` fires when the end comes into view. */
    hasMore?: boolean;
    /** Items are being loaded; suppresses `endReached`. */
    loading?: boolean;
    /** Distance in px from the end at which `endReached` fires. */
    endThreshold?: number;
    /** Total item count, if known, announced to assistive tech for partial lists. */
    total?: number;
    /** Focuses the search field when pressed, e.g. "/" or "Mod+K", and shows it as a hint. */
    searchShortcut?: string;
    /** Show a checkbox per row to check several items, e.g. for bulk actions. Shift extends from the last checked row. */
    selectable?: boolean;
  }>(),
  {
    selected: undefined,
    itemSize: undefined,
    endThreshold: undefined,
    total: undefined,
    searchShortcut: undefined,
  }
);

defineSlots<{
  default: (props: { item: SplitViewItem | undefined }) => unknown;
  header?: (props: { item: SplitViewItem | undefined }) => unknown;
  footer?: (props: { item: SplitViewItem | undefined }) => unknown;
  item: (props: { item: SplitViewItem }) => unknown;
  listFooter?: () => unknown;
  empty?: () => unknown;
}>();

const emit = defineEmits<{
  select: [item: SplitViewItem];
  endReached: [];
}>();

const variants = tv({
  base: [
    "grid h-full min-h-0 grid-cols-12 grid-rows-[minmax(0,1fr)] overflow-hidden rounded-[28px] border squircle",
    "border-neutral-200 bg-white text-neutral-900",
    "dark:border-white/5 dark:bg-neutral-900 dark:text-neutral-100",
  ],
});
</script>

<template>
  <div :class="variants()">
    <LeftPanel
      v-model:search="search"
      v-model:selection="selection"
      class="col-span-2"
      :items
      :searchable
      :selected
      :sticky-search
      :search-shortcut
      :virtual
      :has-more
      :loading
      :total
      :selectable
      v-bind="{
        ...(itemSize === undefined ? {} : { itemSize }),
        ...(endThreshold === undefined ? {} : { endThreshold }),
      }"
      @select="emit('select', $event)"
      @end-reached="emit('endReached')"
    >
      <template #item="{ item }">
        <slot
          name="item"
          :item="item"
        />
      </template>
      <template
        v-if="$slots.empty"
        #empty
      >
        <slot name="empty" />
      </template>
      <template
        v-if="$slots.listFooter"
        #listFooter
      >
        <slot name="listFooter" />
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
