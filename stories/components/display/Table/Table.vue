<template>
  <TablePrimitive
    v-bind="$attrs"
    :dense
  >
    <TableHead :headers :dense />
    <TableBody :headers :items :dense />
  </TablePrimitive>
</template>

<script lang="ts" setup>
import TablePrimitive from "./primitives/Table.vue";
import TableHead from "./primitives/TableHead.vue";
import TableBody from "./primitives/TableBody.vue";

defineOptions({
  inheritAttrs: false,
});

export interface TableHeader {
  title: string;
  key: string;
}

withDefaults(
  defineProps<{
    headers: TableHeader[];
    items: Record<string, unknown>[];
    dense?: boolean;
  }>(),
  {},
);
</script>
