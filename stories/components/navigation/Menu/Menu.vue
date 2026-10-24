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
        :current-path="currentPath"
      />
    </template>
  </MenuPrimitive>
</template>

<script setup lang="ts">
import { computed, toRef } from "vue";
import MenuPrimitive from "./primitives/Menu.vue";
import {
  default as MenuItemPrimitive,
  type MenuItem,
} from "./primitives/MenuItem.vue";
import MenuSection from "./primitives/MenuSection.vue";
import {
  containsCurrentPage,
  currentTarget,
  isCurrentPage,
} from "./currentPage";
import { useLocale, type LocaleMessages } from "@/composables";

export type { MenuItem } from "./primitives/MenuItem.vue";

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

// `target` is the one link to mark, which may be a page above the current one.
function annotateItems(items: MenuItem[], target?: string): MenuItem[] {
  if (!target) return items;

  return items.map((item) => {
    if (item.items) {
      return {
        ...item,
        parentActive: containsCurrentPage(item.items, target),
        items: annotateItems(item.items, target),
      };
    }

    return {
      ...item,
      active: isCurrentPage(item, target),
    };
  });
}

const annotatedItems = computed(() =>
  annotateItems(props.items, currentTarget(props.items, props.currentPath))
);
</script>
