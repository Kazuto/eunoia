<template>
  <div ref="containerRef" class="relative inline-block">
    <DropdownTrigger
      v-bind="$attrs"
      :dense
      :disabled
      :is-open="isOpen"
      :menu-id="menuId"
      :ariaLabel="t('toggle')"
      @toggle="toggleMenu"
      @keydown="handleTriggerKeydown"
    >
      <slot name="trigger">{{ t("toggle") }}</slot>
    </DropdownTrigger>
    <DropdownMenu
      v-if="isOpen"
      :id="menuId"
      :dense
      :active-descendant-id="activeDescendantId"
    >
      <DropdownItem
        v-for="(item, index) in items"
        :key="item.value"
        :id="`${menuId}-item-${index}`"
        :label="item.label"
        :value="item.value"
        :variant="item.variant"
        :disabled="item.disabled"
        :is-active="activeIndex === index"
        :dense
        @select="handleItemSelect"
        @mouseenter="activeIndex = index"
      />
    </DropdownMenu>
  </div>
</template>

<script lang="ts" setup>
import { computed, onBeforeUnmount, ref, toRef, useId, watch } from "vue";
import { type LocaleMessages, useLocale } from "@/composables/useLocale";
import DropdownTrigger from "./primitives/DropdownTrigger.vue";
import DropdownMenu from "./primitives/DropdownMenu.vue";
import DropdownItem from "./primitives/DropdownItem.vue";

defineOptions({
  inheritAttrs: false,
});

export interface DropdownItemOption {
  label: string;
  value: string;
  disabled?: boolean;
  variant?: "default" | "danger";
}

const props = withDefaults(
  defineProps<{
    items: DropdownItemOption[];
    dense?: boolean;
    disabled?: boolean;
    locale?: LocaleMessages;
  }>(),
  {},
);

const emit = defineEmits<{
  (e: "select", value: string): void;
}>();

const t = useLocale("dropdown", toRef(() => props.locale));

const menuId = useId();

const isOpen = ref(false);
const activeIndex = ref(-1);
const containerRef = ref<HTMLElement | null>(null);

const enabledIndices = computed(() =>
  props.items.reduce<number[]>((acc, item, index) => {
    if (!item.disabled) acc.push(index);
    return acc;
  }, []),
);

const activeDescendantId = computed(() => {
  if (!isOpen.value || activeIndex.value < 0) return undefined;
  return `${menuId}-item-${activeIndex.value}`;
});

function openMenu() {
  if (props.disabled) return;
  isOpen.value = true;
  activeIndex.value = -1;
}

function closeMenu() {
  isOpen.value = false;
  activeIndex.value = -1;
}

function toggleMenu() {
  if (isOpen.value) {
    closeMenu();
  } else {
    openMenu();
  }
}

function nextEnabledIndex(current: number): number {
  const indices = enabledIndices.value;
  if (indices.length === 0) return -1;
  const pos = indices.findIndex((i) => i > current);
  return pos >= 0 ? indices[pos] : indices[0];
}

function prevEnabledIndex(current: number): number {
  const indices = enabledIndices.value;
  if (indices.length === 0) return -1;
  for (let i = indices.length - 1; i >= 0; i--) {
    if (indices[i] < current) return indices[i];
  }
  return indices[indices.length - 1];
}

function handleItemSelect(value: string) {
  emit("select", value);
  closeMenu();
}

function handleTriggerKeydown(event: KeyboardEvent) {
  switch (event.key) {
    case "ArrowDown":
      event.preventDefault();
      if (!isOpen.value) {
        openMenu();
        activeIndex.value = nextEnabledIndex(-1);
      } else {
        activeIndex.value = nextEnabledIndex(activeIndex.value);
      }
      break;

    case "ArrowUp":
      event.preventDefault();
      if (!isOpen.value) {
        openMenu();
        activeIndex.value = prevEnabledIndex(props.items.length);
      } else {
        activeIndex.value = prevEnabledIndex(activeIndex.value);
      }
      break;

    case "Enter":
      event.preventDefault();
      if (isOpen.value && activeIndex.value >= 0) {
        const item = props.items[activeIndex.value];
        if (!item.disabled) handleItemSelect(item.value);
      } else if (!isOpen.value) {
        openMenu();
      }
      break;

    case " ":
      event.preventDefault();
      if (isOpen.value && activeIndex.value >= 0) {
        const item = props.items[activeIndex.value];
        if (!item.disabled) handleItemSelect(item.value);
      } else if (!isOpen.value) {
        openMenu();
      }
      break;

    case "Escape":
      event.preventDefault();
      closeMenu();
      break;

    case "Tab":
      closeMenu();
      break;

    case "Home":
      if (isOpen.value) {
        event.preventDefault();
        activeIndex.value = nextEnabledIndex(-1);
      }
      break;

    case "End":
      if (isOpen.value) {
        event.preventDefault();
        activeIndex.value = prevEnabledIndex(props.items.length);
      }
      break;
  }
}

function onClickOutside(event: MouseEvent) {
  if (
    containerRef.value &&
    !containerRef.value.contains(event.target as Node)
  ) {
    closeMenu();
  }
}

watch(isOpen, (open) => {
  if (open) {
    document.addEventListener("mousedown", onClickOutside);
  } else {
    document.removeEventListener("mousedown", onClickOutside);
  }
});

watch(activeIndex, (index) => {
  if (index >= 0 && isOpen.value) {
    const el = document.getElementById(`${menuId}-item-${index}`);
    el?.scrollIntoView({ block: "nearest" });
  }
});

onBeforeUnmount(() => {
  document.removeEventListener("mousedown", onClickOutside);
});
</script>
