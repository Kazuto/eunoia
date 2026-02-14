<template>
  <li>
    <Link
      :href="href"
      :class="itemStyles()"
      tabindex="0"
      :style="{ paddingLeft: padding }"
    >
      <MenuLabel :icon>
        {{ label }}
      </MenuLabel>
    </Link>
  </li>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { Link } from "@/components";
import { tv } from "tailwind-variants";
import MenuLabel from "./MenuLabel.vue";
import type { MenuItem } from "../types";

const props = defineProps<MenuItem>();

const padding = computed(() => {
  if (props.level <= 1) return;

  return `${props.level * 0.75}rem`;
});

const itemStyles = tv({
  base: [
    "flex cursor-pointer items-center rounded-lg px-3 py-2 text-sm no-underline transition-all duration-200 focus:ring-2 focus:ring-offset-2 focus:outline-none",
    "text-neutral-700 hover:bg-neutral-100 hover:text-neutral-900 focus:bg-neutral-100 focus:text-neutral-900 focus:ring-neutral-100 focus:ring-offset-white hover:focus:bg-neutral-200 hover:focus:ring-neutral-200",
    "dark:text-neutral-100 dark:hover:bg-neutral-700 dark:hover:text-neutral-200 dark:focus:bg-neutral-700 dark:focus:text-neutral-200 dark:focus:ring-neutral-700 dark:focus:ring-offset-neutral-800 dark:hover:focus:bg-neutral-600 dark:hover:focus:ring-neutral-600",
  ],
});
</script>

<style scoped></style>
