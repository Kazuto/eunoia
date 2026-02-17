<template>
  <div
    ref="containerRef"
    class="relative inline-block"
    :style="anchorStyle"
  >
    <UserMenuTrigger
      v-bind="$attrs"
      :image
      :name
      :is-open="isOpen"
      :menu-id="menuId"
      :aria-label="t('toggle')"
      @toggle="toggleMenu"
      @keydown="handleTriggerKeydown"
    />
    <UserMenuContent
      v-if="isOpen"
      :id="menuId"
      :anchor-name="anchorName"
      :active-descendant-id="activeDescendantId"
    >
      <UserMenuItemPrimitive
        v-for="(item, index) in items"
        :id="`${menuId}-item-${index}`"
        :key="item.label"
        :label="item.label"
        :href="item.href"
        :icon="item.icon"
        :variant="item.variant"
        :disabled="item.disabled"
        :is-active="activeIndex === index"
        :dense
        @select="handleItemSelect"
        @mouseenter="activeIndex = index"
      />
    </UserMenuContent>
  </div>
</template>

<script lang="ts" setup>
import { computed, onBeforeUnmount, ref, toRef, watch } from "vue";
import { useSanitizedId, useLocale, type LocaleMessages } from "@/composables";
import type { UserMenuItem } from "./types";
import UserMenuTrigger from "./primitives/UserMenuTrigger.vue";
import UserMenuContent from "./primitives/UserMenuContent.vue";
import UserMenuItemPrimitive from "./primitives/UserMenuItem.vue";

defineOptions({
  inheritAttrs: false,
});

const props = withDefaults(
  defineProps<{
    image?: string;
    name?: string;
    items: UserMenuItem[];
    dense?: boolean;
    locale?: LocaleMessages;
  }>(),
  {
    image: undefined,
    name: undefined,
    locale: undefined,
  }
);

const emit = defineEmits<{
  (e: "select", label: string): void;
}>();

const t = useLocale(
  "user-menu",
  toRef(() => props.locale)
);

const id = useSanitizedId("user-menu");
const menuId = `${id}-menu`;
const anchorName = `--${id}`;
const anchorStyle = { "anchor-name": anchorName } as Record<string, string>;

const isOpen = ref(false);
const activeIndex = ref(-1);
const containerRef = ref<HTMLElement | null>(null);

const enabledIndices = computed(() =>
  props.items.reduce<number[]>((acc, item, index) => {
    if (!item.disabled) acc.push(index);
    return acc;
  }, [])
);

const activeDescendantId = computed(() => {
  if (!isOpen.value || activeIndex.value < 0) return undefined;
  return `${menuId}-item-${activeIndex.value}`;
});

function openMenu() {
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

function handleItemSelect(label: string) {
  emit("select", label);
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
        if (!item.disabled) handleItemSelect(item.label);
      } else if (!isOpen.value) {
        openMenu();
      }
      break;

    case " ":
      event.preventDefault();
      if (isOpen.value && activeIndex.value >= 0) {
        const item = props.items[activeIndex.value];
        if (!item.disabled) handleItemSelect(item.label);
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
