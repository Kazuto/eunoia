<template>
  <TablePrimitive
    v-bind="$attrs"
    :dense
  >
    <TableHead :columns :dense />
    <TableBody :columns :rows :dense />
  </TablePrimitive>
</template>

<script lang="ts" setup>
import TablePrimitive from "./primitives/Table.vue";
import TableHead from "./primitives/TableHead.vue";
import TableBody from "./primitives/TableBody.vue";

defineOptions({
  inheritAttrs: false,
});

export interface TableColumn {
  name: string;
  key: string;
}

withDefaults(
  defineProps<{
    columns: TableColumn[];
    rows: Record<string, unknown>[];
    dense?: boolean;
  }>(),
  {},
);
</script>
