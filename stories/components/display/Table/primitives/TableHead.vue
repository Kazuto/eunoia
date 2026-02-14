<template>
  <thead
    v-bind="forwardedAttrs"
    :class="classAttr"
  >
    <tr :class="rowStyles({ dense })">
      <th
        v-for="header in headers"
        :key="header.key"
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

const rowStyles = tv({
  base: "border-b border-neutral-300",
});

const cellStyles = tv({
  base: "text-left font-semibold text-neutral-700",
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
  dense?: boolean;
}>();
</script>
