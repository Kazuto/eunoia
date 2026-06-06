<template>
  <TablePrimitive
    v-bind="$attrs"
    :dense
  >
    <TableHead
      :headers
      :dense
    />
    <TableBodyPrimitive
      :headers
      :items="displayItems"
      :loading
      :dense
    />
  </TablePrimitive>
</template>

<script lang="ts" setup>
import { computed } from "vue";
import TablePrimitive from "./primitives/Table.vue";
import {
  default as TableHead,
  type TableHeader,
} from "./primitives/TableHead.vue";
import {
  default as TableBodyPrimitive,
  type TableItem,
} from "./primitives/TableBody.vue";

export type { TableHeader, TableItem };

defineOptions({
  inheritAttrs: false,
});

type Table = {
  headers: TableHeader[];
  items: TableItem[];
  loading?: boolean;
  loadingRows?: number;
  dense?: boolean;
};

const props = withDefaults(defineProps<Table>(), {
  loadingRows: 3,
});

const placeholderItems = computed(() =>
  Array.from({ length: props.loadingRows }, () => ({}))
);

const displayItems = computed(() =>
  props.loading ? placeholderItems.value : props.items
);
</script>
