<template>
  <tbody v-bind="forwardedAttrs" :class="classAttr">
    <tr
      v-for="(row, rowIndex) in rows"
      :key="rowIndex"
      :class="rowStyles()"
    >
      <td
        v-for="column in columns"
        :key="column.key"
        :class="cellStyles({ dense })"
      >
        {{ row[column.key] }}
      </td>
    </tr>
  </tbody>
</template>

<script lang="ts" setup>
import { tv } from "tailwind-variants";
import { useForwardedAttrs } from "@/composables/useForwardedAttrs";

defineOptions({
  inheritAttrs: false,
});

const { classAttr, forwardedAttrs } = useForwardedAttrs();

const rowStyles = tv({
  base: "border-b border-gray-200 last:border-b-0",
});

const cellStyles = tv({
  base: "text-gray-900",
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

defineProps<{
  columns: { name: string; key: string }[];
  rows: Record<string, unknown>[];
  dense?: boolean;
}>();
</script>
