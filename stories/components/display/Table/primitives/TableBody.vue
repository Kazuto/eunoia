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
        <!-- The header still names the cell for screen readers. A dotted leader
             ties the label to its value across the card; its dots are drawn
             as a background, as a 1px dotted border looks too faint. -->
        <template v-if="stacked && headerIndex > 0">
          <span
            aria-hidden="true"
            class="max-w-1/2 shrink-0 text-neutral-500 dark:text-neutral-400"
          >
            {{ header.title }}
          </span>
          <span
            aria-hidden="true"
            class="h-0.5 min-w-6 flex-1 self-center bg-[radial-gradient(circle,currentColor_0.75px,transparent_1px)] bg-size-[4px_2px] bg-repeat-x text-neutral-300 dark:text-neutral-700"
          />
        </template>
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
      field: "flex min-w-0 items-center gap-2 p-0 text-right wrap-anywhere",
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
