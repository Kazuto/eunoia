<template>
  <tbody
    v-bind="forwardedAttrs"
    :role="stacked ? 'rowgroup' : undefined"
    :class="bodyStyles({ stacked, class: classAttr })"
  >
    <tr
      v-for="(item, itemIndex) in items"
      :key="itemIndex"
      :role="stacked ? 'row' : undefined"
      :class="rowStyles({ stacked, dense, class: rowClass?.(item) })"
    >
      <td
        v-for="(column, columnIndex) in columns"
        :key="column.key"
        :role="stacked ? 'cell' : undefined"
        :class="
          cellStyles({
            dense,
            align: column.align,
            stacked: stacked ? (columnIndex === 0 ? 'title' : 'field') : false,
          })
        "
      >
        <!-- The header still names the cell for screen readers. -->
        <span
          v-if="stacked && columnIndex > 0"
          aria-hidden="true"
          class="text-neutral-500 dark:text-neutral-400"
        >
          {{ column.title }}
        </span>
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
        :role="stacked ? 'cell' : undefined"
        :class="
          cellStyles({ dense, align: 'end', stacked: stacked && 'actions' })
        "
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
    <tr
      v-if="!loading && items.length === 0"
      :role="stacked ? 'row' : undefined"
      :class="stacked ? 'block' : undefined"
    >
      <td
        :colspan="columns.length + (hasActions ? 1 : 0)"
        :role="stacked ? 'cell' : undefined"
        :class="['py-12 text-center', stacked && 'block']"
      >
        <slot name="empty">
          <div class="text-neutral-500 dark:text-neutral-400">
            {{ t("no-data") }}
          </div>
        </slot>
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
import { useForwardedAttrs, useLocale } from "@/composables";
import { Skeleton } from "@/components";

defineOptions({
  inheritAttrs: false,
});

const t = useLocale("common");

defineSlots<{
  [key: string]: (props: { item: T }) => unknown;
  actions: (props: { item: T }) => unknown;
  empty: () => unknown;
}>();

const { classAttr, forwardedAttrs } = useForwardedAttrs();

const bodyStyles = tv({
  variants: {
    stacked: {
      true: "block",
    },
  },
});

// Stacked, each row is a card: the first column as its title with the actions
// beside it, and every other column as a label and value below.
const rowStyles = tv({
  base: [
    "border-b last:border-b-0",
    "border-neutral-200 text-neutral-900",
    "dark:border-neutral-700 dark:text-neutral-300",
  ],
  variants: {
    stacked: {
      true: "grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-3",
      false: "",
    },
    dense: {
      true: "",
      false: "",
    },
  },
  compoundVariants: [
    { stacked: true, dense: false, class: "gap-y-1.5 px-4 py-3" },
    { stacked: true, dense: true, class: "gap-y-1 px-3 py-2" },
  ],
  defaultVariants: {
    stacked: false,
    dense: false,
  },
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
    stacked: {
      false: "",
      title: "col-start-1 row-start-1 min-w-0 p-0 font-semibold wrap-anywhere",
      field:
        "col-span-2 flex min-w-0 items-center justify-between gap-4 p-0 text-right wrap-anywhere",
      actions: "col-start-2 row-start-1 p-0",
    },
  },
  defaultVariants: {
    dense: false,
    align: "start",
    stacked: false,
  },
});

defineProps<{
  columns: DataTableColumn<T>[];
  items: T[];
  hasActions?: boolean;
  loading?: boolean;
  dense?: boolean;
  stacked?: boolean;
  rowClass?: (item: T) => string;
}>();
</script>
