<template>
  <label :class="wrapperStyles({ disabled })">
    <input
      v-bind="$attrs"
      v-model="model"
      type="radio"
      :value="value"
      :disabled
      class="sr-only"
    />
    <span :class="radioStyles({ dense, invalid, checked: model === value })">
      <span :class="dotStyles({ dense, visible: model === value })" />
    </span>
    <span
      v-if="$slots.description"
      :class="descriptionStyles({ dense })"
    >
      <slot name="description" />
    </span>
  </label>
</template>

<script setup lang="ts">
import { tv } from "tailwind-variants";

defineOptions({
  inheritAttrs: false,
});

const model = defineModel<string | number>();

defineProps<{
  value: string | number;
  dense?: boolean;
  invalid?: boolean;
  disabled?: boolean;
}>();

const wrapperStyles = tv({
  base: "inline-flex w-fit cursor-pointer items-center gap-2",
  variants: {
    disabled: {
      true: "cursor-not-allowed opacity-50",
    },
  },
});

const radioStyles = tv({
  base: [
    "inline-flex shrink-0 items-center justify-center rounded-full border transition-colors",
    "border-neutral-200 hover:bg-neutral-50/25 focus:bg-neutral-50/25 focus:ring-neutral-300 active:bg-neutral-50/25 has-[input:focus]:ring-neutral-300",
    "dark:border-neutral-700 dark:text-neutral-200 dark:hover:bg-neutral-900/25 dark:focus:bg-neutral-900/25 dark:focus:ring-primary-500 dark:active:bg-neutral-900/25 dark:has-[input:focus]:ring-primary-500",
  ],
  variants: {
    dense: {
      false: "h-7 w-7",
      true: "h-5 w-5",
    },
    checked: {
      true: "border-primary-500 bg-primary-500 dark:border-primary-500 dark:bg-primary-500",
      false: [
        "hover:bg-neutral-50/25 focus:bg-neutral-50/25 focus:ring-neutral-300 active:bg-neutral-50/25 has-[input:focus]:ring-neutral-300",
        "dark:hover:bg-neutral-900/25 dark:focus:bg-neutral-900/25 dark:focus:ring-primary-500 dark:active:bg-neutral-900/25 dark:has-[input:focus]:ring-primary-500",
      ],
    },
    invalid: {
      true: "border-red-500",
    },
  },
  compoundVariants: [
    { checked: true, invalid: true, class: "border-red-500 bg-red-500" },
  ],
  defaultVariants: {
    dense: false,
  },
});

const dotStyles = tv({
  base: "rounded-full bg-white transition-opacity",
  variants: {
    dense: {
      false: "h-2.5 w-2.5",
      true: "h-1.5 w-1.5",
    },
    visible: {
      true: "opacity-100",
      false: "opacity-0",
    },
  },
  defaultVariants: {
    dense: false,
    visible: false,
  },
});

const descriptionStyles = tv({
  base: "text-neutral-700 dark:text-neutral-300",
  variants: {
    dense: {
      false: "text-sm",
      true: "text-xs",
    },
  },
  defaultVariants: {
    dense: false,
  },
});
</script>
