<template>
  <li>
    <Link
      :href="href"
      :class="itemStyles()"
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
  if (props.level <= 1) return "0.75rem";

  return `${props.level * 0.75}rem`;
});

const itemStyles = tv({
  base: "block cursor-pointer rounded-lg px-4 py-2 text-sm text-neutral-700 no-underline focus:bg-neutral-100 focus:text-neutral-900 focus:ring-2 focus:ring-neutral-200 focus:ring-offset-2 focus:ring-offset-neutral-100 focus:outline-none",
  variants: {
    active: {
      true: "bg-neutral-100 text-neutral-900",
      false: "hover:bg-neutral-50 hover:text-neutral-900",
    },
  },
});
</script>

<style scoped></style>
