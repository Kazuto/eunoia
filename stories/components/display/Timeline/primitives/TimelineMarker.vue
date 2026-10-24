<template>
  <span
    aria-hidden="true"
    :class="markerStyles({ variant, withIcon: !!icon })"
  >
    <Icon
      v-if="icon"
      :name="icon"
      size="xs"
    />
    <span
      v-else
      :class="dotStyles({ variant })"
    />
  </span>
</template>

<script setup lang="ts">
import { tv } from "tailwind-variants";
import { Icon } from "@/components/core";

export type TimelineVariant =
  | "primary"
  | "secondary"
  | "success"
  | "warning"
  | "danger";

defineProps<{
  variant: TimelineVariant;
  icon?: string;
}>();

const markerStyles = tv({
  base: "relative z-[1] flex h-6 w-6 shrink-0 items-center justify-center rounded-full",
  variants: {
    variant: {
      primary: "",
      secondary: "",
      success: "",
      warning: "",
      danger: "",
    },
    withIcon: {
      true: "",
      false: "",
    },
  },
  compoundVariants: [
    {
      withIcon: true,
      variant: "primary",
      class: "bg-primary-500 text-primary-50 dark:bg-primary-700",
    },
    {
      withIcon: true,
      variant: "secondary",
      class:
        "bg-neutral-100 text-neutral-700 dark:bg-neutral-700 dark:text-neutral-100",
    },
    {
      withIcon: true,
      variant: "success",
      class: "bg-green-500 text-green-50 dark:bg-green-600",
    },
    {
      withIcon: true,
      variant: "warning",
      class: "bg-yellow-500 text-yellow-950 dark:bg-yellow-600",
    },
    {
      withIcon: true,
      variant: "danger",
      class: "bg-red-500 text-red-50 dark:bg-red-600",
    },
  ],
});

const dotStyles = tv({
  base: "h-2.5 w-2.5 rounded-full ring-4 ring-white dark:ring-neutral-900",
  variants: {
    variant: {
      primary: "bg-primary-500 dark:bg-primary-400",
      secondary: "bg-neutral-400 dark:bg-neutral-500",
      success: "bg-green-500",
      warning: "bg-yellow-500",
      danger: "bg-red-500",
    },
  },
});
</script>
