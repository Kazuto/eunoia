<template>
  <li>
    <ul>
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
  if (props.level <= 1) return "0.75rem";

  return `${props.level * 0.75}rem`;
});

const open = ref(true);

const sectionStyles = tv({
  base: "flex cursor-pointer items-center justify-between rounded-lg px-4 py-2 text-sm text-gray-700 no-underline hover:bg-gray-100 hover:text-gray-900 focus:bg-gray-100 focus:text-gray-900 focus:ring-2 focus:ring-gray-200 focus:ring-offset-2 focus:ring-offset-gray-100 focus:outline-none",
});

const itemStyles = tv({
  base: "grid overflow-hidden p-1 transition-all duration-300",
  variants: {
    open: {
      true: "max-h-[1000px]",
      false: "max-h-0",
    },
  },
});
</script>
