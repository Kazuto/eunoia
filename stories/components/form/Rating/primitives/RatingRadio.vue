<template>
  <span
    role="radio"
    v-bind="forwardedAttrs"
    :class="radioStyles({ part, disabled, class: classAttr })"
    :tabindex="focusable && !disabled ? 0 : -1"
    :aria-checked="checked"
    :aria-label="label"
    :aria-disabled="disabled ? 'true' : undefined"
  />
</template>

<script lang="ts" setup>
import { tv } from "tailwind-variants";
import { useForwardedAttrs } from "@/composables";

defineOptions({
  inheritAttrs: false,
});

const { classAttr, forwardedAttrs } = useForwardedAttrs();

withDefaults(
  defineProps<{
    label: string;
    checked: boolean;
    focusable: boolean;
    part?: "full" | "left" | "right";
    disabled?: boolean;
  }>(),
  {
    part: "full",
  }
);

const radioStyles = tv({
  base: [
    "absolute inset-y-0 rounded-[6px] outline-none squircle",
    "focus-visible:ring-2 focus-visible:ring-primary-500",
  ],
  variants: {
    part: {
      full: "inset-x-0",
      left: "left-0 w-1/2",
      right: "right-0 w-1/2",
    },
    disabled: {
      false: "cursor-pointer",
      true: "cursor-not-allowed",
    },
  },
  defaultVariants: {
    part: "full",
    disabled: false,
  },
});
</script>
