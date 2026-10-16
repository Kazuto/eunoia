<script setup lang="ts">
import Input from "@/components/form/Input/Input.vue";
import { type LocaleMessages, useLocale } from "@/composables";
import { useVirtualizer } from "@tanstack/vue-virtual";
import { tv } from "tailwind-variants";
import {
  computed,
  nextTick,
  onBeforeUnmount,
  onMounted,
  ref,
  toRef,
  useTemplateRef,
  watch,
} from "vue";

export type SplitViewItem = {
  key: string | number;
  label: string;
  [key: string]: unknown; // allow extra fields
};

const search = defineModel<string>("search", { default: "" });

const props = withDefaults(
  defineProps<{
    items: SplitViewItem[];
    selected?: SplitViewItem;
    searchable?: boolean;
    /** Keep the search field pinned while the list scrolls underneath. */
    stickySearch?: boolean;
    /** Render only the rows in view. Use for long lists. */
    virtual?: boolean;
    /** Estimated row height in px for `virtual`; rows are measured once rendered. */
    itemSize?: number;
    /** More items can be loaded; `endReached` fires when the end comes into view. */
    hasMore?: boolean;
    /** Items are being loaded; suppresses `endReached`. */
    loading?: boolean;
    /** Distance in px from the end at which `endReached` fires. */
    endThreshold?: number;
    /** Total item count, if known, announced to assistive tech for partial lists. */
    total?: number;
    /** Focuses the search field when pressed, e.g. "/" or "Mod+K", and shows it as a hint. */
    searchShortcut?: string;
    locale?: LocaleMessages;
  }>(),
  {
    itemSize: 36,
    endThreshold: 200,
    total: undefined,
    selected: undefined,
    searchShortcut: undefined,
    locale: undefined,
  }
);

const t = useLocale(
  "split-view",
  toRef(() => props.locale)
);

defineSlots<{
  item: (props: { item: SplitViewItem }) => unknown;
  listFooter?: () => unknown;
  empty?: () => unknown;
}>();

const emit = defineEmits<{
  select: [item: SplitViewItem];
  endReached: [];
}>();

const variants = tv({
  base: [
    "flex cursor-pointer items-center justify-between rounded-sm px-4 py-2 text-sm font-medium",
    "text-neutral-900 hover:bg-neutral-200",
    "dark:text-neutral-100 dark:hover:bg-neutral-800",
  ],
  variants: {
    active: {
      true: [
        "bg-primary-200 text-neutral-900 hover:bg-primary-200",
        "dark:bg-primary-800 dark:text-neutral-100 dark:hover:bg-primary-800",
      ],
      false: "",
    },
  },
});

const searchVariants = tv({
  base: "pb-1",
  variants: {
    sticky: {
      true: [
        "sticky top-0 z-10 -mx-2 -mt-2 px-2 pt-2",
        "bg-neutral-100",
        "dark:bg-neutral-700",
      ],
    },
  },
});

const scroller = useTemplateRef<HTMLElement>("scroller");
const list = useTemplateRef<HTMLElement>("list");
const listOffset = ref(0);

const virtualizer = useVirtualizer(
  computed(() => ({
    count: props.virtual ? props.items.length : 0,
    getScrollElement: () => scroller.value ?? null,
    estimateSize: () => props.itemSize,
    getItemKey: (index: number) => props.items[index]?.key ?? index,
    scrollMargin: listOffset.value,
    overscan: 10,
  }))
);
const virtualRows = computed(() =>
  props.virtual ? virtualizer.value.getVirtualItems() : []
);

function measureRow(element: unknown) {
  if (element instanceof Element) virtualizer.value.measureElement(element);
}

function isActive(item: SplitViewItem) {
  return item.key === props.selected?.key;
}

function checkEnd() {
  const element = scroller.value;
  if (!element || !props.hasMore || props.loading) return;
  const remaining =
    element.scrollHeight - element.scrollTop - element.clientHeight;
  if (remaining <= props.endThreshold) emit("endReached");
}

// The list may not fill the panel yet (short first page, tall panel): keep asking.
watch(
  () => [props.items.length, props.hasMore, props.loading],
  () => nextTick(checkEnd)
);

let resizeObserver: ResizeObserver | undefined;
onMounted(() => {
  if (typeof ResizeObserver === "undefined") return;
  resizeObserver = new ResizeObserver(() => {
    listOffset.value = list.value?.offsetTop ?? 0;
    checkEnd();
  });
  if (scroller.value) resizeObserver.observe(scroller.value);
  if (list.value) resizeObserver.observe(list.value);
  listOffset.value = list.value?.offsetTop ?? 0;
});
onBeforeUnmount(() => resizeObserver?.disconnect());

// Bring an externally changed selection into view, e.g. a newly created item.
watch(
  () => props.selected?.key,
  async (key) => {
    if (key === undefined) return;
    const index = props.items.findIndex((item) => item.key === key);
    if (index < 0) return;
    await nextTick();
    if (props.virtual) {
      virtualizer.value.scrollToIndex(index, { align: "auto" });
      return;
    }
    list.value
      ?.querySelector(`[data-index="${index}"]`)
      ?.scrollIntoView?.({ block: "nearest" });
  }
);
</script>

<template>
  <div
    ref="scroller"
    class="relative flex flex-col gap-1 overflow-y-auto bg-neutral-100 p-2 shadow-sm dark:bg-neutral-700"
    @scroll.passive="checkEnd"
  >
    <div
      v-if="searchable"
      :class="searchVariants({ sticky: stickySearch })"
    >
      <Input
        v-model="search"
        type="search"
        :placeholder="t('search')"
        :aria-label="t('search')"
        :shortcut="searchShortcut"
      />
    </div>
    <ul
      ref="list"
      :class="virtual ? 'relative shrink-0' : undefined"
      :style="
        virtual ? { height: `${virtualizer.getTotalSize()}px` } : undefined
      "
    >
      <template v-if="virtual">
        <li
          v-for="row in virtualRows"
          :key="row.key as PropertyKey"
          :ref="measureRow"
          :data-index="row.index"
          :aria-setsize="total ?? items.length"
          :aria-posinset="row.index + 1"
          :class="[
            variants({ active: isActive(items[row.index]!) }),
            'absolute top-0 left-0 w-full',
          ]"
          :style="{ transform: `translateY(${row.start - listOffset}px)` }"
          @click="emit('select', items[row.index]!)"
        >
          <slot
            name="item"
            :item="items[row.index]!"
          >
            {{ items[row.index]?.label }}
          </slot>
        </li>
      </template>
      <template v-else>
        <li
          v-for="(item, index) in items"
          :key="item.key"
          :data-index="index"
          :aria-setsize="total"
          :aria-posinset="total === undefined ? undefined : index + 1"
          :class="variants({ active: isActive(item) })"
          @click="emit('select', item)"
        >
          <slot
            name="item"
            :item="item"
          >
            {{ item.label }}
          </slot>
        </li>
      </template>
    </ul>
    <slot
      v-if="!items.length && !loading"
      name="empty"
    />
    <slot name="listFooter" />
  </div>
</template>
