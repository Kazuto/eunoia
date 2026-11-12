<template>
  <div
    v-bind="forwardedAttrs"
    :class="columnStyles({ dense, class: classAttr })"
  >
    <span
      aria-hidden="true"
      :class="headingStyles({ dense })"
    >
      {{ heading ?? label }}
    </span>
    <div class="relative">
      <!-- The chosen value sits on this band; the columns' bands join into one. -->
      <div
        aria-hidden="true"
        :class="bandStyles({ dense })"
      />
      <ul
        :id
        ref="listRef"
        role="listbox"
        tabindex="0"
        :aria-label="label"
        :aria-activedescendant="
          selectedIndex >= 0 ? optionId(selectedIndex) : undefined
        "
        :class="listStyles({ dense })"
        @keydown="onKeydown"
        @scroll="onScroll"
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
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, onBeforeUnmount, onMounted, ref, watch } from "vue";
import { tv } from "tailwind-variants";
import { useForwardedAttrs } from "@/composables";

export type TimePickerColumnItem = { value: number; label: string };

defineOptions({
  inheritAttrs: false,
});

const { classAttr, forwardedAttrs } = useForwardedAttrs();

const props = defineProps<{
  id: string;
  /** Names the listbox. */
  label: string;
  /** Shown above the column; the label when unset. */
  heading?: string;
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

/** The option whose middle is closest to the band. */
function centeredIndex(list: HTMLElement) {
  const middle = list.scrollTop + list.clientHeight / 2;
  let nearest = -1;
  let distance = Infinity;

  (Array.from(list.children) as HTMLElement[]).forEach((option, index) => {
    const gap = Math.abs(option.offsetTop + option.offsetHeight / 2 - middle);
    if (gap < distance) {
      nearest = index;
      distance = gap;
    }
  });

  return nearest;
}

// Scroll only this column so the panel and page stay put.
function scrollToSelected(smooth: boolean) {
  const list = listRef.value;
  const option = list?.children[selectedIndex.value] as HTMLElement | undefined;
  if (!list || !option) return;

  const top =
    option.offsetTop - list.clientHeight / 2 + option.offsetHeight / 2;

  if (typeof list.scrollTo === "function") {
    list.scrollTo({ top, behavior: smooth ? "smooth" : "instant" });
  } else {
    list.scrollTop = top;
  }
}

// Scrolling the column picks whatever settles on the band.
let settleTimer: ReturnType<typeof setTimeout> | undefined;

function onScroll() {
  clearTimeout(settleTimer);
  settleTimer = setTimeout(() => {
    const list = listRef.value;
    if (!list) return;
    const index = centeredIndex(list);
    if (index >= 0 && index !== selectedIndex.value) selectIndex(index);
  }, 120);
}

onMounted(() => scrollToSelected(false));
onBeforeUnmount(() => clearTimeout(settleTimer));
watch(selectedIndex, () => scrollToSelected(true), { flush: "post" });

defineExpose({
  focus: () => listRef.value?.focus({ preventScroll: true }),
});

const columnStyles = tv({
  base: "group/column flex flex-1 flex-col",
  variants: {
    dense: {
      false: "min-w-14",
      true: "min-w-12",
    },
  },
  defaultVariants: {
    dense: false,
  },
});

const headingStyles = tv({
  base: [
    "flex items-center justify-center truncate px-1 font-medium tracking-wide uppercase transition-colors",
    "text-neutral-500 group-focus-within/column:text-primary-600",
    "dark:text-neutral-400 dark:group-focus-within/column:text-primary-300",
  ],
  variants: {
    dense: {
      false: "h-7 text-[11px]",
      true: "h-6 text-[10px]",
    },
  },
  defaultVariants: {
    dense: false,
  },
});

// Rounded only where the joined band starts and ends.
const bandStyles = tv({
  base: [
    "pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2 transition-colors",
    "group-first/column:rounded-l-[10px] group-last/column:rounded-r-[10px]",
    "bg-neutral-100 group-focus-within/column:bg-primary-100",
    "dark:bg-neutral-800 dark:group-focus-within/column:bg-primary-900/60",
  ],
  variants: {
    dense: {
      false: "h-8",
      true: "h-6",
    },
  },
  defaultVariants: {
    dense: false,
  },
});

// The padding lets the first and last options reach the band. Instead of a
// scrollbar, the fade shows there is more.
const listStyles = tv({
  base: [
    "relative snap-y snap-mandatory overflow-y-auto overscroll-contain outline-none",
    "[scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
    "[mask-image:linear-gradient(to_bottom,transparent,#000_30%,#000_70%,transparent)]",
  ],
  variants: {
    dense: {
      false: "h-56 py-24",
      true: "h-44 py-19",
    },
  },
  defaultVariants: {
    dense: false,
  },
});

const optionStyles = tv({
  base: [
    "mx-1 flex cursor-pointer snap-center items-center justify-center rounded-[8px] tabular-nums transition-colors squircle",
    "text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900",
    "dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-neutral-100",
  ],
  variants: {
    dense: {
      false: "h-8 text-sm",
      true: "h-6 text-xs",
    },
    selected: {
      true: [
        "font-semibold text-neutral-900 hover:bg-transparent",
        "dark:text-neutral-50 dark:hover:bg-transparent",
      ],
    },
  },
  defaultVariants: {
    dense: false,
  },
});
</script>
