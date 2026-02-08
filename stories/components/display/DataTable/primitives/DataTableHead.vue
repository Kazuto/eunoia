<template>
  <thead v-bind="forwardedAttrs" :class="classAttr">
    <tr :class="rowStyles()">
      <th
        v-for="header in headers"
        :key="header.key"
        :class="cellStyles({ dense, sortable: header.sortable, align: header.align })"
        :aria-sort="getAriaSort(header.key)"
        @click="header.sortable && emit('sort', header.key)"
      >
        <span class="inline-flex items-center gap-1">
          {{ header.title }}
          <span
            v-if="header.sortable"
            class="inline-flex flex-col"
            aria-hidden="true"
          >
            <Icon
              name="caret-up"
              size="xs"
              :class="[
                '-mb-1',
                sortKey === header.key && sortDirection === 'asc'
                  ? 'text-gray-900'
                  : 'text-gray-300',
              ]"
            />
            <Icon
              name="caret-down"
              size="xs"
              :class="[
                sortKey === header.key && sortDirection === 'desc'
                  ? 'text-gray-900'
                  : 'text-gray-300',
              ]"
            />
          </span>
        </span>
      </th>
      <th
        v-if="hasActions"
        :class="cellStyles({ dense, align: 'end' })"
      />
    </tr>
  </thead>
</template>

<script lang="ts" setup>
import { tv } from "tailwind-variants";
import Icon from "@/components/core/Icon/Icon.vue";
import { useForwardedAttrs } from "@/composables/useForwardedAttrs";

defineOptions({
  inheritAttrs: false,
});

const { classAttr, forwardedAttrs } = useForwardedAttrs();

const rowStyles = tv({
  base: "border-b border-gray-300",
});

const cellStyles = tv({
  base: "font-semibold text-gray-700",
  variants: {
    dense: {
      false: "px-4 py-3",
      true: "px-3 py-2",
    },
    sortable: {
      true: "cursor-pointer select-none",
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

const props = defineProps<{
  headers: { title: string; key: string; sortable?: boolean; align?: "start" | "end" }[];
  dense?: boolean;
  hasActions?: boolean;
  sortKey?: string | null;
  sortDirection?: "asc" | "desc" | null;
}>();

const emit = defineEmits<{
  (e: "sort", key: string): void;
}>();

function getAriaSort(key: string) {
  if (props.sortKey !== key || !props.sortDirection) return undefined;
  return props.sortDirection === "asc" ? "ascending" : "descending";
}
</script>
