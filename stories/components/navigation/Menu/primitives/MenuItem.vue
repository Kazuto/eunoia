<template>
  <li
    v-bind="forwardedAttrs"
    :class="classAttr"
  >
    <Tooltip
      :content="label"
      :disabled="!sidebarCollapsed"
      placement="right"
      dense
      class="w-full"
    >
      <Link
        :href
        :to="props.to"
        :class="itemStyles({ active })"
        :aria-current="active ? 'page' : undefined"
        tabindex="0"
        :style="{ paddingLeft: padding }"
      >
        <MenuLabel :icon>
          {{ label }}
        </MenuLabel>
      </Link>
    </Tooltip>
  </li>
</template>

<script setup lang="ts">
import { computed, inject } from "vue";
import { Link } from "@/components";
import Tooltip from "@/components/feedback/Tooltip/Tooltip.vue";
import { tv } from "tailwind-variants";
import { useForwardedAttrs } from "@/composables";
import MenuLabel from "./MenuLabel.vue";
import { sidebarCollapsedKey } from "@/components/layout/Sidebar/keys";

defineOptions({
  inheritAttrs: false,
});

const { classAttr, forwardedAttrs } = useForwardedAttrs();
const sidebarCollapsed = inject(sidebarCollapsedKey, undefined);

export type MenuItem = {
  label: string;
  href?: string;
  ariaLabel?: string;
  icon?: string;
  level?: number;
  items?: MenuItem[];
  active?: boolean;
  parentActive?: boolean;
  to?: string;
};

const props = withDefaults(defineProps<MenuItem>(), {
  ariaLabel: undefined,
  href: undefined,
  icon: undefined,
  items: undefined,
  level: 1,
  to: undefined,
});

const padding = computed(() => {
  if (props.level <= 1) return;

  return `${props.level * 0.75}rem`;
});

const itemStyles = tv({
  base: [
    "flex w-full cursor-pointer items-center rounded-lg px-3 py-2 text-sm no-underline transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
    "text-neutral-700 hover:bg-neutral-100 hover:text-neutral-900 focus-visible:bg-neutral-100 focus-visible:text-neutral-900 focus-visible:ring-neutral-100 focus-visible:ring-offset-white hover:focus-visible:bg-neutral-200 hover:focus-visible:ring-neutral-200",
    "dark:text-neutral-100 dark:hover:bg-neutral-700 dark:hover:text-neutral-200 dark:focus-visible:bg-neutral-700 dark:focus-visible:text-neutral-200 dark:focus-visible:ring-neutral-700 dark:focus-visible:ring-offset-neutral-800 dark:hover:focus-visible:bg-neutral-600 dark:hover:focus-visible:ring-neutral-600",
  ],
  variants: {
    active: {
      true: [
        "font-semibold",
        "bg-primary-200 text-primary-800 hover:bg-primary-300 hover:text-primary-900 focus-visible:bg-primary-100 focus-visible:text-primary-900 focus-visible:ring-primary-200 focus-visible:ring-offset-white",
        "dark:bg-primary-950 dark:text-primary-200 dark:hover:bg-primary-900 dark:hover:text-primary-100 dark:focus-visible:bg-primary-900 dark:focus-visible:text-primary-100 dark:focus-visible:ring-primary-800 dark:focus-visible:ring-offset-neutral-800",
      ],
    },
  },
});
</script>
