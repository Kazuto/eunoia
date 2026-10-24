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
      :class="rowStyles({ stacked, dense })"
    >
      <td
        v-for="(header, headerIndex) in headers"
        :key="header.key"
        :role="stacked ? 'cell' : undefined"
        :class="
          cellStyles({
            dense,
            stacked: stacked ? (headerIndex === 0 ? 'title' : 'field') : false,
          })
        "
      >
        <!-- The header still names the cell for screen readers. -->
        <span
          v-if="stacked && headerIndex > 0"
          aria-hidden="true"
          class="text-neutral-500 dark:text-neutral-400"
        >
          {{ header.title }}
        </span>
        <Skeleton v-if="loading" />
        <template v-else>
          {{ item[header.key] }}
        </template>
      </td>
    </tr>
  </tbody>
</template>

<script lang="ts" setup>
import { tv } from "tailwind-variants";
import { useForwardedAttrs } from "@/composables";
import { Skeleton } from "@/components";
import type { TableHeader } from "./TableHead.vue";

defineOptions({
  inheritAttrs: false,
});

const { classAttr, forwardedAttrs } = useForwardedAttrs();

const bodyStyles = tv({
  variants: {
    stacked: {
      true: "block",
    },
  },
});

// Stacked, each row is a card: the first column as its title, and every
// other column as a label and value below.
const rowStyles = tv({
  base: [
    "border-b last:border-b-0",
    "border-neutral-200",
    "dark:border-neutral-700",
  ],
  variants: {
    stacked: {
      true: "flex flex-col",
      false: "",
    },
    dense: {
      true: "",
      false: "",
    },
  },
  compoundVariants: [
    { stacked: true, dense: false, class: "gap-1.5 px-4 py-3" },
    { stacked: true, dense: true, class: "gap-1 px-3 py-2" },
  ],
  defaultVariants: {
    stacked: false,
    dense: false,
  },
});

const cellStyles = tv({
  base: ["text-neutral-900", "dark:text-neutral-300"],
  variants: {
    dense: {
      false: "px-4 py-3",
      true: "px-3 py-2",
    },
    stacked: {
      false: "",
      title: "min-w-0 p-0 font-semibold wrap-anywhere",
      field:
        "flex min-w-0 items-center justify-between gap-4 p-0 text-right wrap-anywhere",
    },
  },
  defaultVariants: {
    dense: false,
    stacked: false,
  },
});

export type TableItem = {
  [key: string]: unknown;
};

type TableBody = {
  headers: TableHeader[];
  items: TableItem[];
  loading?: boolean;
  dense?: boolean;
  stacked?: boolean;
};

defineProps<TableBody>();
</script>
