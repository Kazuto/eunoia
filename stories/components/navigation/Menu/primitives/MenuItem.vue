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
    "flex cursor-pointer items-center rounded-lg px-3 py-2 text-sm no-underline transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
    "text-neutral-700 hover:bg-neutral-100 hover:text-neutral-900 focus-visible:bg-neutral-100 focus-visible:text-neutral-900 focus-visible:ring-neutral-100 focus-visible:ring-offset-white hover:focus-visible:bg-neutral-200 hover:focus-visible:ring-neutral-200",
    "dark:text-neutral-100 dark:hover:bg-neutral-700 dark:hover:text-neutral-200 dark:focus-visible:bg-neutral-700 dark:focus-visible:text-neutral-200 dark:focus-visible:ring-neutral-700 dark:focus-visible:ring-offset-neutral-800 dark:hover:focus-visible:bg-neutral-600 dark:hover:focus-visible:ring-neutral-600",
  ],
});
</script>

<style scoped></style>
