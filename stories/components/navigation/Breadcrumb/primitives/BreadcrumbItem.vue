<template>
  <li v-bind="forwardedAttrs">
    <Link
      v-if="href && !active"
      :href="href"
      :class="itemStyles({ active: false, class: classAttr })"
    >
      <Icon
        v-if="icon"
        :name="icon"
        size="xs"
      />
      {{ label }}
    </Link>
    <span
      v-else
      :class="itemStyles({ active: true, class: classAttr })"
      :aria-current="active ? 'page' : undefined"
    >
      <Icon
        v-if="icon"
        :name="icon"
        size="xs"
      />
      {{ label }}
    </span>
  </li>
</template>

<script setup lang="ts">
import { tv } from "tailwind-variants";
import { Link, Icon } from "@/components";
import { useForwardedAttrs } from "@/composables";

defineOptions({
  inheritAttrs: false,
});

export type BreadcrumbItem = {
  label: string;
  href?: string;
  icon?: string;
  active?: boolean;
};

defineProps<BreadcrumbItem>();

const { classAttr, forwardedAttrs } = useForwardedAttrs();

const itemStyles = tv({
  base: "inline-flex items-center gap-1 text-sm",
  variants: {
    active: {
      true: ["font-semibold", "text-primary-700", "dark:text-primary-300"],
      false: [
        "text-neutral-500 no-underline transition-colors hover:text-neutral-700",
        "dark:text-neutral-400 dark:hover:text-neutral-200",
      ],
    },
  },
});
</script>
