<template>
  <thead v-bind="forwardedAttrs" :class="classAttr">
    <tr :class="rowStyles({ dense })">
      <th
        v-for="column in columns"
        :key="column.key"
        :class="cellStyles({ dense })"
      >
        {{ column.name }}
      </th>
    </tr>
  </thead>
</template>

<script lang="ts" setup>
import { tv } from "tailwind-variants";
import { useForwardedAttrs } from "@/composables/useForwardedAttrs";

defineOptions({
  inheritAttrs: false,
});

const { classAttr, forwardedAttrs } = useForwardedAttrs();

const rowStyles = tv({
  base: "border-b border-gray-300",
});

const cellStyles = tv({
  base: "text-left font-semibold text-gray-700",
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
  dense?: boolean;
}>();
</script>
