<template>
  <li>
    <ul class="flex flex-col gap-1">
      <li
        :class="sectionStyles()"
        :style="{ paddingLeft: padding }"
        :aria-expanded="open"
        tabindex="0"
        @click="open = !open"
        @keydown.enter="open = !open"
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

      <li>
        <ul :class="itemStyles({ open })">
          <template
            v-for="(item, index) in items"
            :key="index"
          >
            <MenuSection
              v-if="item.items"
              v-bind="item"
              :level="level + 1"
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
import { ref, computed } from "vue";

const props = defineProps<MenuItem>();

const padding = computed(() => {
  if (props.level <= 1) return;

  return `${props.level * 0.75}rem`;
});

const open = ref(true);

const sectionStyles = tv({
  base: [
    "flex cursor-pointer items-center justify-between gap-2 rounded-lg px-3 py-2 text-sm no-underline transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
    "text-neutral-700 hover:bg-neutral-100 hover:text-neutral-900 focus-visible:bg-neutral-100 focus-visible:text-neutral-900 focus-visible:ring-neutral-100 focus-visible:ring-offset-white hover:focus-visible:bg-neutral-200 hover:focus-visible:ring-neutral-200",
    "dark:text-neutral-100 dark:hover:bg-neutral-700 dark:hover:text-neutral-200 dark:focus-visible:bg-neutral-700 dark:focus-visible:text-neutral-200 dark:focus-visible:ring-neutral-700 dark:focus-visible:ring-offset-neutral-800 dark:hover:focus-visible:bg-neutral-600 dark:hover:focus-visible:ring-neutral-600",
  ],
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
