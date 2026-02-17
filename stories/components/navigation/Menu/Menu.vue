<template>
  <MenuPrimitive :aria-label="ariaLabel ?? t('label')">
    <template
      v-for="(item, index) in annotatedItems"
      :key="index"
    >
      <MenuSection
        v-if="item.items"
        v-bind="item"
        :level="1"
        :current-path="currentPath"
        :toggle-section-label="t('toggle-section')"
      >
      </MenuSection>

      <MenuItemPrimitive
        v-else
        v-bind="item"
        :level="1"
      />
    </template>
  </MenuPrimitive>
</template>

<script setup lang="ts">
import { computed, toRef } from "vue";
import MenuPrimitive from "./primitives/Menu.vue";
import MenuItemPrimitive from "./primitives/MenuItem.vue";
import MenuSection from "./primitives/MenuSection.vue";
import type { MenuItem } from "./types";
import { useLocale, type LocaleMessages } from "@/composables";

const props = defineProps<{
  items: MenuItem[];
  currentPath?: string;
  ariaLabel?: string;
  locale?: LocaleMessages;
}>();

const t = useLocale(
  "menu",
  toRef(() => props.locale)
);

function hasActiveDescendant(items: MenuItem[], path: string): boolean {
  for (const item of items) {
    if (item.href === path) return true;
    if (item.items && hasActiveDescendant(item.items, path)) return true;
  }
  return false;
}

function annotateItems(items: MenuItem[], path?: string): MenuItem[] {
  if (!path) return items;

  return items.map((item) => {
    if (item.items) {
      return {
        ...item,
        parentActive: hasActiveDescendant(item.items, path),
        items: annotateItems(item.items, path),
      };
    }

    return {
      ...item,
      active: item.href === path,
    };
  });
}

const annotatedItems = computed(() =>
  annotateItems(props.items, props.currentPath)
);
</script>
