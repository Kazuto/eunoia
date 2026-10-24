<template>
  <thead
    v-bind="forwardedAttrs"
    :role="stacked ? 'rowgroup' : undefined"
    :class="headStyles({ stacked, class: classAttr })"
  >
    <tr
      :role="stacked ? 'row' : undefined"
      :class="rowStyles()"
    >
      <th
        v-for="header in headers"
        :key="header.key"
        :role="stacked ? 'columnheader' : undefined"
        :class="cellStyles({ dense })"
      >
        {{ header.title }}
      </th>
    </tr>
  </thead>
</template>

<script lang="ts" setup>
import { tv } from "tailwind-variants";
import { useForwardedAttrs } from "@/composables";

defineOptions({
  inheritAttrs: false,
});

const { classAttr, forwardedAttrs } = useForwardedAttrs();

// Stacked, every row labels its own values, so the header is only read out.
const headStyles = tv({
  variants: {
    stacked: {
      true: "sr-only",
    },
  },
});

const rowStyles = tv({
  base: ["border-b", "border-neutral-300", "dark:border-neutral-700"],
});

const cellStyles = tv({
  base: [
    "text-left font-semibold",
    "text-neutral-700",
    "dark:text-neutral-200",
  ],
  variants: {
    dense: {
      false: "px-4 py-3",
      true: "px-3 py-2",
    },
  },
  defaultVariants: {
    dense: false,
  },
});

export type TableHeader = {
  title: string;
  key: string;
};

type TableHead = {
  headers: TableHeader[];
  dense?: boolean;
  stacked?: boolean;
};

defineProps<TableHead>();
</script>
