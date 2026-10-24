<template>
  <div
    ref="wrapper"
    :class="classAttr"
  >
    <TablePrimitive
      ref="table"
      v-bind="forwardedAttrs"
      :dense
      :stacked
    >
      <DataTableHead
        :headers="columns"
        :dense
        :stacked
        :has-actions="hasActions"
        :sort-key="sortKey"
        :sort-direction="sortDirection"
        @sort="handleSort"
      />
      <DataTableBody
        :columns
        :items="displayItems"
        :has-actions
        :loading
        :dense
        :stacked
        :row-class
      >
        <template
          v-for="column in columns"
          #[column.key]="{ item }"
        >
          <slot
            :name="column.key"
            :item="item"
          />
        </template>

        <template
          v-if="hasActions"
          #actions="{ item }"
        >
          <slot
            name="actions"
            :item="item"
          />
        </template>

        <template #empty>
          <slot name="empty" />
        </template>
      </DataTableBody>
    </TablePrimitive>
  </div>
</template>

<script lang="ts">
import { type DataTableColumn } from "./primitives/DataTableBody.vue";
import { type TableStack } from "../Table/useTableStacking";

export type { DataTableColumn, TableStack };
</script>

<script lang="ts" setup generic="T extends Record<string, unknown>">
import {
  computed,
  ref,
  useSlots,
  useTemplateRef,
  type ComponentPublicInstance,
} from "vue";
import { useForwardedAttrs } from "@/composables";
import TablePrimitive from "../Table/primitives/Table.vue";
import { useTableStacking } from "../Table/useTableStacking";
import DataTableHead from "./primitives/DataTableHead.vue";
import DataTableBody from "./primitives/DataTableBody.vue";

defineOptions({
  inheritAttrs: false,
});

defineSlots<{
  [key: string]: (props: { item: T }) => unknown;
  actions: (props: { item: T }) => unknown;
  empty: () => unknown;
}>();

const props = withDefaults(
  defineProps<{
    columns: DataTableColumn<T>[];
    items: T[];
    loading?: boolean;
    loadingRows?: number;
    dense?: boolean;
    rowClass?: (item: T) => string;
    /**
     * Show each row as a card when the columns don't fit side by side ("auto"),
     * always, or never.
     */
    stack?: TableStack;
  }>(),
  {
    loadingRows: 3,
    rowClass: undefined,
    stack: "auto",
  }
);

// `class` sizes and places the component; everything else goes to the table.
const { classAttr, forwardedAttrs } = useForwardedAttrs();

const slots = useSlots();
const hasActions = computed(() => !!slots.actions);

const sortKey = ref<string | null>(null);
const sortDirection = ref<"asc" | "desc" | null>(null);

function handleSort(key: string) {
  if (sortKey.value === key) {
    if (sortDirection.value === "asc") {
      sortDirection.value = "desc";
    } else if (sortDirection.value === "desc") {
      sortKey.value = null;
      sortDirection.value = null;
    }
  } else {
    sortKey.value = key;
    sortDirection.value = "asc";
  }
}

const sortedItems = computed(() => {
  if (!sortKey.value || !sortDirection.value) return props.items;

  const header = props.columns.find((h) => h.key === sortKey.value);
  if (!header) return props.items;

  const dir = sortDirection.value === "asc" ? 1 : -1;

  return [...props.items].sort((a, b) => {
    const rawA = a[header.key];
    const rawB = b[header.key];
    const valA = rawA != null ? rawA : header.value?.(a);
    const valB = rawB != null ? rawB : header.value?.(b);

    if (valA == null && valB == null) return 0;
    if (valA == null) return dir;
    if (valB == null) return -dir;

    if (typeof valA === "number" && typeof valB === "number") {
      return (valA - valB) * dir;
    }

    return String(valA).localeCompare(String(valB)) * dir;
  });
});

const placeholderItems = computed(() =>
  Array.from({ length: props.loadingRows }, () => ({}) as T)
);

const displayItems = computed(() =>
  props.loading ? placeholderItems.value : sortedItems.value
);

const { stacked } = useTableStacking(
  () => props.stack,
  useTemplateRef<HTMLElement>("wrapper"),
  useTemplateRef<ComponentPublicInstance>("table"),
  () => [displayItems.value, props.columns, hasActions.value]
);
</script>
