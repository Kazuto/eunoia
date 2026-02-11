<template>
  <TablePrimitive
    v-bind="$attrs"
    :dense
  >
    <DataTableHead
      :headers
      :dense
      :has-actions="hasActions"
      :sort-key="sortKey"
      :sort-direction="sortDirection"
      @sort="handleSort"
    />
    <DataTableBody
      :headers
      :items="displayItems"
      :has-actions
      :loading
      :dense
    >
      <template
        v-if="hasActions"
        #actions="{ item }"
      >
        <slot
          name="actions"
          :item="item"
        />
      </template>
    </DataTableBody>
  </TablePrimitive>
</template>

<script lang="ts" setup>
import { computed, ref, useSlots } from "vue";
import TablePrimitive from "../Table/primitives/Table.vue";
import DataTableHead from "./primitives/DataTableHead.vue";
import DataTableBody, {
  type DataTableColumn,
} from "./primitives/DataTableBody.vue";

defineOptions({
  inheritAttrs: false,
});

export type { DataTableColumn };

const props = withDefaults(
  defineProps<{
    headers: DataTableColumn[];
    items: Record<string, unknown>[];
    loading?: boolean;
    loadingRows?: number;
    dense?: boolean;
  }>(),
  {
    loadingRows: 3,
  }
);

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

  const header = props.headers.find((h) => h.key === sortKey.value);
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
  Array.from({ length: props.loadingRows }, () => ({}))
);

const displayItems = computed(() =>
  props.loading ? placeholderItems.value : sortedItems.value
);
</script>
