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
  headers: { title: string; key: string }[];
  items: Record<string, unknown>[];
  loading?: boolean;
  dense?: boolean;
}>();
</script>
