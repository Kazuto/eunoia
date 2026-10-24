<template>
  <thead
    v-bind="forwardedAttrs"
    :role="stacked ? 'rowgroup' : undefined"
    :class="headStyles({ stacked, sortable: hasSortable, class: classAttr })"
  >
    <tr
      :role="stacked ? 'row' : undefined"
      :class="rowStyles({ stacked, dense })"
    >
      <th
        v-for="header in headers"
        :key="header.key"
        :role="stacked ? 'columnheader' : undefined"
        :class="
          cellStyles({
            dense,
            align: header.align,
            stacked,
            hidden: stacked && !header.sortable,
          })
        "
        :aria-sort="getAriaSort(header.key)"
      >
        <button
          v-if="header.sortable"
          type="button"
          :class="sortButtonStyles()"
          @click="emit('sort', header.key)"
        >
          {{ header.title }}
          <span
            class="inline-flex flex-col"
            aria-hidden="true"
          >
            <Icon
              name="caret-up"
              size="xs"
              :class="caretStyles({ active: isSorted(header.key, 'asc') })"
              class="-mb-1"
            />
            <Icon
              name="caret-down"
              size="xs"
              :class="caretStyles({ active: isSorted(header.key, 'desc') })"
            />
          </span>
        </button>
        <template v-else>
          {{ header.title }}
        </template>
      </th>
      <th
        v-if="hasActions"
        :role="stacked ? 'columnheader' : undefined"
        :class="cellStyles({ dense, align: 'end', stacked, hidden: stacked })"
      >
        <span class="sr-only">{{ t("actions") }}</span>
      </th>
    </tr>
  </thead>
</template>

<script lang="ts" setup>
import { computed } from "vue";
import { tv } from "tailwind-variants";
import { type DataTableColumn, Icon } from "@/components";
import { useForwardedAttrs, useLocale } from "@/composables";

const t = useLocale("datatable");

defineOptions({
  inheritAttrs: false,
});

const { classAttr, forwardedAttrs } = useForwardedAttrs();

const headStyles = tv({
  variants: {
    // Stacked, only the sortable headers stay visible, as a row of sort toggles.
    stacked: {
      true: "block",
      false: "",
    },
    sortable: {
      true: "",
      false: "",
    },
  },
  compoundVariants: [{ stacked: true, sortable: false, class: "sr-only" }],
  defaultVariants: {
    stacked: false,
    sortable: false,
  },
});

const rowStyles = tv({
  base: ["border-b", "border-neutral-300", "dark:border-neutral-700"],
  variants: {
    stacked: {
      true: "flex flex-wrap items-center gap-x-4 gap-y-1",
      false: "",
    },
    dense: {
      true: "",
      false: "",
    },
  },
  compoundVariants: [
    { stacked: true, dense: false, class: "px-4 py-2" },
    { stacked: true, dense: true, class: "px-3 py-1.5" },
  ],
  defaultVariants: {
    stacked: false,
    dense: false,
  },
});

const cellStyles = tv({
  base: ["font-semibold", "text-neutral-700", "dark:text-neutral-200"],
  variants: {
    dense: {
      false: "px-4 py-3",
      true: "px-3 py-2",
    },
    align: {
      start: "text-left",
      end: "text-right",
    },
    stacked: {
      true: "p-0 text-xs font-medium",
    },
    hidden: {
      true: "sr-only",
    },
  },
  defaultVariants: {
    dense: false,
    align: "start",
    stacked: false,
    hidden: false,
  },
});

const sortButtonStyles = tv({
  base: "inline-flex cursor-pointer items-center gap-1 rounded-[6px] outline-none select-none squircle focus-visible:ring-2 focus-visible:ring-primary-500",
});

const caretStyles = tv({
  variants: {
    active: {
      true: "text-neutral-900 dark:text-neutral-100",
      false: "text-neutral-300 dark:text-neutral-600",
    },
  },
  defaultVariants: {
    active: false,
  },
});

const props = defineProps<{
  headers: Omit<DataTableColumn, "value">[];
  dense?: boolean;
  hasActions?: boolean;
  stacked?: boolean;
  sortKey?: string | null;
  sortDirection?: "asc" | "desc" | null;
}>();

const emit = defineEmits<{
  (e: "sort", key: string): void;
}>();

const hasSortable = computed(() =>
  props.headers.some((header) => header.sortable)
);

function isSorted(key: string, direction: "asc" | "desc") {
  return props.sortKey === key && props.sortDirection === direction;
}

function getAriaSort(key: string) {
  if (props.sortKey !== key || !props.sortDirection) return undefined;
  return props.sortDirection === "asc" ? "ascending" : "descending";
}
</script>
