<template>
  <ul
    :id
    ref="listRef"
    v-bind="forwardedAttrs"
    role="listbox"
    tabindex="0"
    :aria-label="label"
    :aria-activedescendant="
      selectedIndex >= 0 ? optionId(selectedIndex) : undefined
    "
    :class="columnStyles({ dense, class: classAttr })"
    @keydown="onKeydown"
  >
    <li
      v-for="(item, index) in items"
      :id="optionId(index)"
      :key="item.value"
      role="option"
      :aria-selected="index === selectedIndex"
      :class="optionStyles({ dense, selected: index === selectedIndex })"
      @click="emit('select', item.value)"
    >
      {{ item.label }}
    </li>
  </ul>
</template>

<script lang="ts" setup>
import { computed, onMounted, ref, watch } from "vue";
import { tv } from "tailwind-variants";
import { useForwardedAttrs } from "@/composables";

export type TimePickerColumnItem = { value: number; label: string };

defineOptions({
  inheritAttrs: false,
});

const { classAttr, forwardedAttrs } = useForwardedAttrs();

const props = defineProps<{
  id: string;
  label: string;
  items: TimePickerColumnItem[];
  selected?: number;
  dense?: boolean;
}>();

const emit = defineEmits<{
  (e: "select", value: number): void;
  (e: "commit"): void;
}>();

const listRef = ref<HTMLUListElement | null>(null);

const selectedIndex = computed(() =>
  props.items.findIndex((item) => item.value === props.selected)
);

function optionId(index: number) {
  return `${props.id}-option-${index}`;
}

function selectIndex(index: number) {
  const item =
    props.items[Math.min(Math.max(index, 0), props.items.length - 1)];
  if (item) emit("select", item.value);
}

function onKeydown(event: KeyboardEvent) {
  const current = selectedIndex.value;
  switch (event.key) {
    case "ArrowDown":
      event.preventDefault();
      selectIndex(current < 0 ? 0 : current + 1);
      break;
    case "ArrowUp":
      event.preventDefault();
      selectIndex(current < 0 ? props.items.length - 1 : current - 1);
      break;
    case "Home":
      event.preventDefault();
      selectIndex(0);
      break;
    case "End":
      event.preventDefault();
      selectIndex(props.items.length - 1);
      break;
    case "Enter":
      event.preventDefault();
      emit("commit");
      break;
  }
}

// Scroll only this column so the panel and page stay put.
function scrollToSelected(center: boolean) {
  const list = listRef.value;
  const option = list?.children[selectedIndex.value] as HTMLElement | undefined;
  if (!list || !option) return;
  if (center) {
    list.scrollTop =
      option.offsetTop - list.clientHeight / 2 + option.offsetHeight / 2;
  } else if (option.offsetTop < list.scrollTop) {
    list.scrollTop = option.offsetTop;
  } else if (
    option.offsetTop + option.offsetHeight >
    list.scrollTop + list.clientHeight
  ) {
    list.scrollTop = option.offsetTop + option.offsetHeight - list.clientHeight;
  }
}

onMounted(() => scrollToSelected(true));
watch(selectedIndex, () => scrollToSelected(false), { flush: "post" });

defineExpose({
  focus: () => listRef.value?.focus({ preventScroll: true }),
});

const columnStyles = tv({
  base: [
    "relative max-h-56 overflow-y-auto overscroll-contain rounded-[10px] outline-none squircle",
    "focus-visible:ring-2 focus-visible:ring-primary-500",
  ],
  variants: {
    dense: {
      false: "w-14 py-1",
      true: "w-12 py-0.5",
    },
  },
  defaultVariants: {
    dense: false,
  },
});

const optionStyles = tv({
  base: [
    "mx-1 cursor-pointer rounded-[8px] text-center tabular-nums transition-colors squircle",
    "text-neutral-900 hover:bg-neutral-100",
    "dark:text-neutral-100 dark:hover:bg-neutral-800",
  ],
  variants: {
    dense: {
      false: "py-1.5 text-sm",
      true: "py-1 text-xs",
    },
    selected: {
      true: [
        "bg-primary-500 font-semibold text-primary-50 hover:bg-primary-500",
        "dark:bg-primary-700 dark:hover:bg-primary-700",
      ],
    },
  },
  defaultVariants: {
    dense: false,
  },
});
</script>
