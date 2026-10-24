<template>
  <button
    type="button"
    v-bind="forwardedAttrs"
    :class="triggerStyles({ dense, invalid, disabled, class: classAttr })"
    :disabled
    :aria-expanded="isOpen"
    :aria-controls="isOpen ? panelId : undefined"
    :aria-invalid="invalid ? 'true' : undefined"
    aria-haspopup="dialog"
  >
    <ColorSwatch
      :color="value"
      :size="dense ? 'sm' : 'md'"
    />
    <span
      :id="valueId"
      class="min-w-0 flex-1 truncate text-left font-mono uppercase"
    >
      {{ value }}
    </span>
    <Icon
      name="caret-down"
      size="sm"
      class="text-neutral-700 dark:text-neutral-300"
    />
  </button>
</template>

<script lang="ts" setup>
import { tv } from "tailwind-variants";
import { useForwardedAttrs } from "@/composables";
import { Icon } from "@/components";
import ColorSwatch from "./ColorSwatch.vue";

defineOptions({
  inheritAttrs: false,
});

const { classAttr, forwardedAttrs } = useForwardedAttrs();

defineProps<{
  value?: string | null;
  valueId?: string;
  isOpen: boolean;
  panelId: string;
  dense?: boolean;
  invalid?: boolean;
  disabled?: boolean;
}>();

const triggerStyles = tv({
  base: [
    "flex w-full items-center gap-2",
    "rounded-[10px] border squircle",
    "transition-all duration-200 ease-in-out",
    "focus-visible:border-primary-500 focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:outline-none",
  ],
  variants: {
    dense: {
      true: "px-2.5 py-1.5 text-xs",
      false: "px-3 py-2 text-sm",
    },
    invalid: {
      true: "border-red-500 dark:border-red-500",
      false: "border-neutral-300 dark:border-neutral-700",
    },
    disabled: {
      true: [
        "bg-neutral-100 dark:bg-neutral-900",
        "text-neutral-400 dark:text-neutral-500",
        "cursor-not-allowed",
      ],
      false: [
        "cursor-pointer bg-white dark:bg-neutral-800",
        "text-neutral-900 dark:text-neutral-100",
        "hover:border-neutral-400 dark:hover:border-neutral-600",
      ],
    },
  },
  defaultVariants: {
    dense: false,
    invalid: false,
    disabled: false,
  },
});
</script>
