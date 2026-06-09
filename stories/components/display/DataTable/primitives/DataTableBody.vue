<template>
  <tbody
    v-bind="forwardedAttrs"
    :class="bodyStyles({ class: classAttr })"
  >
    <tr
      v-for="(item, itemIndex) in items"
      :key="itemIndex"
      :class="rowStyles({ class: rowClass?.(item) })"
    >
      <td
        v-for="column in columns"
        :key="column.key"
        :class="cellStyles({ dense, align: column.align })"
      >
        <Skeleton v-if="loading" />
        <template v-else>
          <slot
            :name="column.key"
            :item="item"
          >
            {{ column.value ? column.value(item) : item[column.key] }}
          </slot>
        </template>
      </td>
      <td
        v-if="hasActions"
        :class="cellStyles({ dense, align: 'end' })"
      >
        <Skeleton
          v-if="loading"
          width="80px"
        />
        <slot
          v-else
          name="actions"
          :item="item"
        />
      </td>
    </tr>
  </tbody>
</template>

<script lang="ts">
export type DataTableColumn<T = Record<string, unknown>> = {
  title: string;
  key: string;
  sortable?: boolean;
  align?: "start" | "end";
  value?: (item: T) => unknown;
};
</script>

<script lang="ts" setup generic="T extends Record<string, unknown>">
import { tv } from "tailwind-variants";
import { useForwardedAttrs } from "@/composables";
import { Skeleton } from "@/components";

defineOptions({
  inheritAttrs: false,
});

defineSlots<{
  [key: string]: (props: { item: T }) => unknown;
  actions: (props: { item: T }) => unknown;
}>();

const { classAttr, forwardedAttrs } = useForwardedAttrs();

const bodyStyles = tv({});

const rowStyles = tv({
  base: [
    "border-b last:border-b-0",
    "border-neutral-200 text-neutral-900",
    "dark:border-neutral-700 dark:text-neutral-300",
  ],
});

const cellStyles = tv({
  base: [],
  variants: {
    dense: {
      false: "px-4 py-3",
      true: "px-3 py-2",
    },
    align: {
      start: "text-left",
      end: "text-right",
    },
  },
  defaultVariants: {
    dense: false,
    align: "start",
  },
});

defineProps<{
  columns: DataTableColumn<T>[];
  items: T[];
  hasActions?: boolean;
  loading?: boolean;
  dense?: boolean;
  rowClass?: (item: T) => string;
}>();
</script>
