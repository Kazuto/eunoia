<template>
  <tbody
    v-bind="forwardedAttrs"
    :class="bodyStyles({ class: classAttr })"
  >
    <tr
      v-for="(item, itemIndex) in items"
      :key="itemIndex"
      :class="rowStyles()"
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

const { classAttr, forwardedAttrs } = useForwardedAttrs();

const bodyStyles = tv({});

const rowStyles = tv({
  base: [
    "border-b last:border-b-0",
    "border-neutral-200",
    "dark:border-neutral-700",
  ],
});

const cellStyles = tv({
  base: ["text-neutral-900", "dark:text-neutral-300"],
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
}>();
</script>
