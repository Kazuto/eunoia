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
  base: "inline-flex shrink-0 items-center justify-center rounded-full border border-neutral-300 bg-white transition-colors",
  variants: {
    dense: {
      false: "h-7 w-7",
      true: "h-5 w-5",
    },
    checked: {
      true: "border-primary bg-primary",
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
  base: "text-neutral-700",
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
