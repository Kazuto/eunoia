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
      <TableHead
        :headers
        :dense
        :stacked
      />
      <TableBodyPrimitive
        :headers
        :items="displayItems"
        :loading
        :dense
        :stacked
      />
    </TablePrimitive>
  </div>
</template>

<script lang="ts" setup>
import { computed, useTemplateRef, type ComponentPublicInstance } from "vue";
import { useForwardedAttrs } from "@/composables";
import TablePrimitive from "./primitives/Table.vue";
import {
  default as TableHead,
  type TableHeader,
} from "./primitives/TableHead.vue";
import {
  default as TableBodyPrimitive,
  type TableItem,
} from "./primitives/TableBody.vue";
import { useTableStacking, type TableStack } from "./useTableStacking";

export type { TableHeader, TableItem, TableStack };

defineOptions({
  inheritAttrs: false,
});

type Table = {
  headers: TableHeader[];
  items: TableItem[];
  loading?: boolean;
  loadingRows?: number;
  dense?: boolean;
  /**
   * Show each row as a card when the columns don't fit side by side ("auto"),
   * always, or never.
   */
  stack?: TableStack;
};

const props = withDefaults(defineProps<Table>(), {
  loadingRows: 3,
  stack: "auto",
});

// `class` sizes and places the component; everything else goes to the table.
const { classAttr, forwardedAttrs } = useForwardedAttrs();

const placeholderItems = computed(() =>
  Array.from({ length: props.loadingRows }, () => ({}))
);

const displayItems = computed(() =>
  props.loading ? placeholderItems.value : props.items
);

const { stacked } = useTableStacking(
  () => props.stack,
  useTemplateRef<HTMLElement>("wrapper"),
  useTemplateRef<ComponentPublicInstance>("table"),
  () => [displayItems.value, props.headers]
);
</script>
