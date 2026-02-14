<template>
  <MenuPrimitive>
    <template
      v-for="(item, index) in items"
      :key="index"
    >
      <MenuSection
        v-if="item.items"
        v-bind="item"
        :level="1"
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
import MenuPrimitive from "./primitives/Menu.vue";
import MenuItemPrimitive from "./primitives/MenuItem.vue";
import type { MenuItem } from "./primitives/MenuItem.vue";
import MenuSection from "./primitives/MenuSection.vue";

defineProps<{
  items: MenuItem[];
  currentPath?: string;
}>();
</script>

<style scoped></style>
