<script setup lang="ts">
import Checkbox from "@/components/form/Checkbox/Checkbox.vue";
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
/** Keys of the checked items when `selectable`. */
const selection = defineModel<SplitViewItem["key"][]>("selection", {
  default: () => [],
});

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
    /** Show a checkbox per row to check several items, e.g. for bulk actions. Shift extends from the last checked row. */
    selectable?: boolean;
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
    "flex cursor-pointer items-center justify-between rounded-[12px] px-2.5 py-1.5 text-sm font-medium squircle",
    "text-neutral-700 hover:bg-neutral-100",
    "dark:text-neutral-200 dark:hover:bg-white/5",
  ],
  variants: {
    active: {
      true: [
        "bg-primary-100 text-primary-900 hover:bg-primary-100",
        "dark:bg-primary-500/15 dark:text-primary-100 dark:hover:bg-primary-500/15",
      ],
      false: "",
    },
    selectable: {
      true: "justify-start",
    },
  },
});

// Rows sit on tinted backgrounds (the pane, hover, the active row), where the
// checkbox's transparent fill and faint border disappear. Give the unchecked box an
// opaque fill and a stronger border here, without changing Checkbox itself.
const checkVariants = tv({
  base: [
    "me-2 flex shrink-0 select-none",
    "[&_input:not(:checked,:indeterminate)+span]:border-neutral-300 [&_input:not(:checked,:indeterminate)+span]:bg-white [&_input:not(:checked,:indeterminate)+span]:hover:border-neutral-500",
    "dark:[&_input:not(:checked,:indeterminate)+span]:border-neutral-500 dark:[&_input:not(:checked,:indeterminate)+span]:bg-neutral-800 dark:[&_input:not(:checked,:indeterminate)+span]:hover:border-neutral-300",
  ],
});

const searchVariants = tv({
  base: "pb-1",
  variants: {
    sticky: {
      true: [
        "sticky -top-2 z-10 -mx-2 -mt-2 px-2 pt-2",
        "bg-white",
        "dark:bg-neutral-900",
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

function isChecked(item: SplitViewItem) {
  return selection.value.includes(item.key);
}

// Shift is read on press, before the checkbox reports its change.
let extendRange = false;
let anchorKey: SplitViewItem["key"] | undefined;

function onCheckPress(event: PointerEvent | KeyboardEvent) {
  extendRange = event.shiftKey;
}

function setChecked(item: SplitViewItem, checked: boolean | undefined) {
  const anchor = props.items.findIndex((other) => other.key === anchorKey);
  const index = props.items.indexOf(item);
  const keys =
    extendRange && anchor >= 0
      ? props.items
          .slice(Math.min(anchor, index), Math.max(anchor, index) + 1)
          .map((other) => other.key)
      : [item.key];
  selection.value = checked
    ? [...new Set([...selection.value, ...keys])]
    : selection.value.filter((key) => !keys.includes(key));
  anchorKey = item.key;
  extendRange = false;
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
    class="relative flex flex-col gap-0.5 overflow-y-auto border-r border-neutral-200 p-2 dark:border-white/5"
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
        <!-- Rows are placed with `top`, not a transform: Firefox anchors popups such
             as tooltips in a row to where the row would be without its transform. -->
        <li
          v-for="row in virtualRows"
          :key="row.key as PropertyKey"
          :ref="measureRow"
          :data-index="row.index"
          :aria-setsize="total ?? items.length"
          :aria-posinset="row.index + 1"
          :class="[
            variants({ active: isActive(items[row.index]!), selectable }),
            'absolute left-0 w-full',
          ]"
          :style="{ top: `${row.start - listOffset}px` }"
          @click="emit('select', items[row.index]!)"
        >
          <span
            v-if="selectable"
            :class="checkVariants()"
            @click.stop
            @pointerdown="onCheckPress"
            @keydown="onCheckPress"
          >
            <Checkbox
              dense
              :model-value="isChecked(items[row.index]!)"
              :aria-label="t('select-item', { label: items[row.index]!.label })"
              @update:model-value="setChecked(items[row.index]!, $event)"
            />
          </span>
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
          :class="variants({ active: isActive(item), selectable })"
          @click="emit('select', item)"
        >
          <span
            v-if="selectable"
            :class="checkVariants()"
            @click.stop
            @pointerdown="onCheckPress"
            @keydown="onCheckPress"
          >
            <Checkbox
              dense
              :model-value="isChecked(item)"
              :aria-label="t('select-item', { label: item.label })"
              @update:model-value="setChecked(item, $event)"
            />
          </span>
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
