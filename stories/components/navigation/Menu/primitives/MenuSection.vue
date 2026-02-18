<template>
  <li
    v-bind="forwardedAttrs"
    :class="classAttr"
  >
    <ul class="flex list-none flex-col gap-1">
      <Tooltip
        v-if="sidebarCollapsed"
        :content="label"
        placement="right"
        dense
      >
        <li
          :class="sectionStyles({ parentActive })"
          :style="{ paddingLeft: padding }"
        >
          <MenuLabel :icon>
            {{ label }}
          </MenuLabel>
        </li>
      </Tooltip>
      <li
        v-else
        :class="sectionStyles({ parentActive })"
        :style="{ paddingLeft: padding }"
        :aria-expanded="open"
        :aria-controls="childrenId"
        :aria-label="toggleSectionLabel"
        role="button"
        tabindex="0"
        @click="open = !open"
        @keydown.enter="open = !open"
        @keydown.space.prevent="open = !open"
      >
        <MenuLabel :icon>
          {{ label }}
        </MenuLabel>

        <Icon
          name="caret-right"
          size="sm"
          :class="[
            'shrink-0 transition-transform duration-200',
            open && 'rotate-90',
          ]"
        />
      </li>

      <li v-if="!sidebarCollapsed">
        <ul
          :id="childrenId"
          :class="itemStyles({ open })"
          role="group"
        >
          <template
            v-for="(item, index) in items"
            :key="index"
          >
            <MenuSection
              v-if="item.items"
              v-bind="item"
              :level="level + 1"
              :current-path="currentPath"
              :toggle-section-label="toggleSectionLabel"
            />

            <MenuItemPrimitive
              v-else
              v-bind="item"
              :level="level + 1"
            />
          </template>
        </ul>
      </li>
    </ul>
  </li>
</template>

<script setup lang="ts">
import { tv } from "tailwind-variants";
import MenuItemPrimitive from "./MenuItem.vue";
import MenuLabel from "./MenuLabel.vue";
import type { MenuItem } from "../types";
import { Icon } from "@/components";
import Tooltip from "@/components/feedback/Tooltip/Tooltip.vue";
import { useSanitizedId, useForwardedAttrs } from "@/composables";
import { sidebarCollapsedKey } from "@/components/layout/Sidebar/keys";
import { ref, computed, inject } from "vue";

defineOptions({
  inheritAttrs: false,
});

const { classAttr, forwardedAttrs } = useForwardedAttrs();
const sidebarCollapsed = inject(sidebarCollapsedKey, undefined);

const props = defineProps<
  MenuItem & {
    currentPath?: string;
    toggleSectionLabel?: string;
  }
>();

const padding = computed(() => {
  if (props.level <= 1) return;

  return `${props.level * 0.75}rem`;
});

const childrenId = useSanitizedId("menu-section");

const open = ref(true);

const sectionStyles = tv({
  base: [
    "flex cursor-pointer items-center justify-between gap-2 rounded-lg px-3 py-2 text-sm no-underline transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
    "text-neutral-700 hover:bg-neutral-100 hover:text-neutral-900 focus-visible:bg-neutral-100 focus-visible:text-neutral-900 focus-visible:ring-neutral-100 focus-visible:ring-offset-white hover:focus-visible:bg-neutral-200 hover:focus-visible:ring-neutral-200",
    "dark:text-neutral-100 dark:hover:bg-neutral-700 dark:hover:text-neutral-200 dark:focus-visible:bg-neutral-700 dark:focus-visible:text-neutral-200 dark:focus-visible:ring-neutral-700 dark:focus-visible:ring-offset-neutral-800 dark:hover:focus-visible:bg-neutral-600 dark:hover:focus-visible:ring-neutral-600",
  ],
  variants: {
    parentActive: {
      true: ["font-semibold", "text-neutral-900", "dark:text-neutral-50"],
    },
  },
});

const itemStyles = tv({
  base: "flex flex-col gap-2 transition-all duration-300",
  variants: {
    open: {
      true: "max-h-[1000px]",
      false: "max-h-0 overflow-hidden",
    },
  },
});
</script>
