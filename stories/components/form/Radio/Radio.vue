<template>
  <label :class="wrapperStyles({ disabled })">
    <input
      v-bind="$attrs"
      :id="radioId"
      v-model="model"
      type="radio"
      :value="value"
      :disabled
      :aria-label="ariaLabel"
      :aria-labelledby="ariaLabelledby"
      class="peer sr-only"
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
import { useSanitizedId } from "@/composables";

defineOptions({
  inheritAttrs: false,
});

const radioId = useSanitizedId("radio", { useAttrId: true });
const model = defineModel<string | number>();

defineProps<{
  value: string | number;
  dense?: boolean;
  invalid?: boolean;
  disabled?: boolean;
  ariaLabel?: string;
  ariaLabelledby?: string;
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
    "border-neutral-200 peer-focus-visible:border-primary-500",
    "dark:border-neutral-700 dark:bg-transparent dark:text-neutral-200 dark:peer-focus-visible:border-primary-500",
  ],
  variants: {
    dense: {
      false: "h-6 w-6",
      true: "h-5 w-5",
    },
    checked: {
      true: [
        "border-primary-500 bg-primary-500 peer-focus-visible:border-primary-700",
        "dark:border-primary-500 dark:bg-primary-500 dark:peer-focus-visible:border-primary-300",
      ],
      false: [
        "hover:bg-neutral-50/25 active:bg-neutral-50/25",
        "dark:hover:bg-black/15 dark:active:bg-neutral-900/25",
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
  base: ["text-neutral-700", "dark:text-neutral-300"],
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
