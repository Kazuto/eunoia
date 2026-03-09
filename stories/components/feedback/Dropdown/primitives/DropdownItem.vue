<template>
  <li
    :id
    v-bind="forwardedAttrs"
    :class="
      itemStyles({
        dense,
        active: isActive,
        variant,
        disabled,
        class: classAttr,
      })
    "
    role="menuitem"
    :aria-disabled="disabled || undefined"
    @click="!disabled && emit('select', value)"
    @mouseenter="emit('mouseenter')"
    @mousedown.prevent
  >
    {{ label }}
  </li>
</template>

<script lang="ts" setup>
import { tv } from "tailwind-variants";
import { useForwardedAttrs } from "@/composables";

defineOptions({
  inheritAttrs: false,
});

const { classAttr, forwardedAttrs } = useForwardedAttrs();

const itemStyles = tv({
  base: [
    "flex cursor-pointer items-center gap-2 rounded-md",
    "text-neutral-900",
    "dark:text-neutral-100",
  ],
  variants: {
    dense: {
      false: "px-3 py-2.25 text-sm",
      true: "px-2.5 py-2 text-xs",
    },
    active: {
      true: ["bg-neutral-200", "dark:bg-neutral-700"],
    },
    variant: {
      default: "",
      danger: ["text-red-600", "dark:text-red-400"],
    },
    disabled: {
      true: "pointer-events-none cursor-not-allowed opacity-50",
    },
  },
  compoundVariants: [
    {
      active: true,
      variant: "danger",
      class: "bg-red-200 dark:bg-red-950",
    },
  ],
  defaultVariants: {
    dense: false,
    variant: "default",
  },
});

defineProps<{
  id?: string;
  label: string;
  value: string;
  dense?: boolean;
  disabled?: boolean;
  isActive?: boolean;
  variant?: "default" | "danger";
}>();

const emit = defineEmits<{
  (e: "select", value: string): void;
  (e: "mouseenter"): void;
}>();
</script>
