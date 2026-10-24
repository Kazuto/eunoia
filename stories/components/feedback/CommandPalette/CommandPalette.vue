<template>
  <CommandPanel
    v-bind="$attrs"
    :open
    :dense
    :aria-label="t('label')"
    @close="close"
    @mousedown="keepInputFocus"
  >
    <CommandInput
      ref="inputRef"
      v-model="query"
      :dense
      role="combobox"
      aria-expanded="true"
      aria-autocomplete="list"
      :aria-controls="listboxId"
      :aria-activedescendant="activeDescendantId"
      :aria-label="t('label')"
      :placeholder="placeholder ?? t('placeholder')"
      @keydown="onKeydown"
    />
    <div
      :id="listboxId"
      role="listbox"
      :aria-label="t('label')"
      class="min-h-0 flex-1 overflow-y-auto p-1"
    >
      <CommandGroup
        v-for="group in groups"
        :key="group.heading ?? ''"
        :heading="group.heading"
        :dense
      >
        <CommandItem
          v-for="{ item, index } in group.entries"
          :id="optionId(index)"
          :key="item.value"
          :label="item.label"
          :icon="item.icon"
          :shortcut="item.shortcut"
          :disabled="item.disabled"
          :active="activeIndex === index"
          :dense
          @select="select(item)"
          @hover="!item.disabled && (activeIndex = index)"
        />
      </CommandGroup>
    </div>
    <p
      v-if="!flat.length"
      class="px-4 pt-6 pb-8 text-center text-sm text-neutral-500 dark:text-neutral-400"
    >
      {{ t("no-results") }}
    </p>
  </CommandPanel>
</template>

<script lang="ts" setup>
import { computed, nextTick, ref, toRef, watch } from "vue";
import {
  useLocale,
  useSanitizedId,
  useShortcut,
  type LocaleMessages,
} from "@/composables";
import CommandPanel from "./primitives/CommandPanel.vue";
import CommandInput from "./primitives/CommandInput.vue";
import CommandGroup from "./primitives/CommandGroup.vue";
import CommandItem from "./primitives/CommandItem.vue";

export type CommandPaletteItem = {
  label: string;
  value: string;
  group?: string;
  /** Phosphor icon name, e.g. "gear". */
  icon?: string;
  /** Shown as a hint only, e.g. "Mod+S"; the palette does not bind it. */
  shortcut?: string;
  /** Extra terms the search matches besides the label. */
  keywords?: string[];
  disabled?: boolean;
};

defineOptions({
  inheritAttrs: false,
});

const props = withDefaults(
  defineProps<{
    items: CommandPaletteItem[];
    /** Opens the palette from anywhere on the page; empty disables it. */
    shortcut?: string;
    placeholder?: string;
    dense?: boolean;
    locale?: LocaleMessages;
  }>(),
  {
    shortcut: "Mod+K",
    placeholder: undefined,
    locale: undefined,
  }
);

const open = defineModel<boolean>("open", { default: false });

const emit = defineEmits<{
  (e: "select", value: string): void;
}>();

const t = useLocale(
  "command",
  toRef(() => props.locale)
);

const listboxId = useSanitizedId("command-listbox");
const inputRef = ref<InstanceType<typeof CommandInput> | null>(null);
const query = ref("");
const activeIndex = ref(-1);

const filtered = computed(() => {
  const terms = query.value.trim().toLowerCase().split(/\s+/).filter(Boolean);
  if (!terms.length) return props.items;
  return props.items.filter((item) => {
    const haystack = [item.label, ...(item.keywords ?? [])]
      .join(" ")
      .toLowerCase();
    return terms.every((term) => haystack.includes(term));
  });
});

// Groups keep the order in which they first appear; indices follow the rendered order.
const groups = computed(() => {
  const byHeading = new Map<string | undefined, CommandPaletteItem[]>();
  for (const item of filtered.value) {
    const list = byHeading.get(item.group);
    if (list) list.push(item);
    else byHeading.set(item.group, [item]);
  }
  let index = 0;
  return [...byHeading].map(([heading, items]) => ({
    heading,
    entries: items.map((item) => ({ item, index: index++ })),
  }));
});

const flat = computed(() =>
  groups.value.flatMap((group) => group.entries.map(({ item }) => item))
);

function optionId(index: number) {
  return `${listboxId}-option-${index}`;
}

const activeDescendantId = computed(() =>
  activeIndex.value >= 0 ? optionId(activeIndex.value) : undefined
);

/** The next enabled index after `from` in direction `step`, wrapping around. */
function step(from: number, direction: 1 | -1): number {
  const items = flat.value;
  const n = items.length;
  for (let i = 1; i <= n; i++) {
    const next = (((from + direction * i) % n) + n) % n;
    if (!items[next].disabled) return next;
  }
  return -1;
}

const first = () => step(-1, 1);
const last = () => step(flat.value.length, -1);

watch(flat, () => {
  activeIndex.value = first();
});

watch(
  open,
  (isOpen) => {
    if (!isOpen) return;
    query.value = "";
    activeIndex.value = first();
    nextTick(() => inputRef.value?.focus());
  },
  { immediate: true }
);

watch(activeIndex, (index) => {
  if (index < 0) return;
  nextTick(() => {
    document
      .getElementById(optionId(index))
      ?.scrollIntoView?.({ block: "nearest" });
  });
});

useShortcut(
  () => props.shortcut,
  () => {
    open.value = true;
  }
);

function close() {
  open.value = false;
}

function select(item: CommandPaletteItem) {
  if (item.disabled) return;
  emit("select", item.value);
  close();
}

// Keys are handled on the search field, so clicks on headings, padding or the
// icon must not move focus away from it.
function keepInputFocus(event: MouseEvent) {
  if (event.target instanceof HTMLInputElement) return;
  event.preventDefault();
  inputRef.value?.focus();
}

function onKeydown(event: KeyboardEvent) {
  if (event.isComposing) return;
  switch (event.key) {
    case "ArrowDown":
      event.preventDefault();
      activeIndex.value = step(activeIndex.value, 1);
      break;
    case "ArrowUp":
      event.preventDefault();
      activeIndex.value =
        activeIndex.value < 0 ? last() : step(activeIndex.value, -1);
      break;
    case "Home":
      event.preventDefault();
      activeIndex.value = first();
      break;
    case "End":
      event.preventDefault();
      activeIndex.value = last();
      break;
    case "Enter": {
      event.preventDefault();
      const item = flat.value[activeIndex.value];
      if (item) select(item);
      break;
    }
    case "Escape":
      // Handled here so the dialog's own cancel doesn't close it behind the model's back.
      event.preventDefault();
      close();
      break;
  }
}
</script>
