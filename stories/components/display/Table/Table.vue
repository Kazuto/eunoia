<template>
  <TablePrimitive
    v-bind="$attrs"
    :dense
  >
    <TableHead
      :headers
      :dense
    />
    <TableBody
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
import TableHead from "./primitives/TableHead.vue";
import TableBody from "./primitives/TableBody.vue";

defineOptions({
  inheritAttrs: false,
});

export interface TableHeader {
  title: string;
  key: string;
}

const props = withDefaults(
  defineProps<{
    headers: TableHeader[];
    items: Record<string, unknown>[];
    loading?: boolean;
    loadingRows?: number;
    dense?: boolean;
  }>(),
  {
    loadingRows: 3,
  }
);

const placeholderItems = computed(() =>
  Array.from({ length: props.loadingRows }, () => ({}))
);

const displayItems = computed(() =>
  props.loading ? placeholderItems.value : props.items
);
</script>
