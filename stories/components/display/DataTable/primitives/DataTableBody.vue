<template>
  <tbody
    v-bind="forwardedAttrs"
    :class="classAttr"
  >
    <tr
      v-for="(item, itemIndex) in items"
      :key="itemIndex"
      :class="rowStyles()"
    >
      <td
        v-for="header in headers"
        :key="header.key"
        :class="cellStyles({ dense, align: header.align })"
      >
        <Skeleton v-if="loading" />
        <template v-else>
          {{ header.value ? header.value(item) : item[header.key] }}
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

<script lang="ts" setup>
import { tv } from "tailwind-variants";
import { useForwardedAttrs } from "@/composables/useForwardedAttrs";
import Skeleton from "@/components/core/Skeleton/Skeleton.vue";

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

export interface DataTableColumn {
  title: string;
  key: string;
  sortable?: boolean;
  align?: "start" | "end";
  value?: (item: Record<string, unknown>) => unknown;
}

defineProps<{
  headers: DataTableColumn[];
  items: Record<string, unknown>[];
  hasActions?: boolean;
  loading?: boolean;
  dense?: boolean;
}>();
</script>
