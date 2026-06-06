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
        v-for="header in headers"
        :key="header.key"
        :class="cellStyles({ dense })"
      >
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
  },
  defaultVariants: {
    dense: false,
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
};

defineProps<TableBody>();
</script>
