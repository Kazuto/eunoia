<template>
  <input
    type="range"
    v-bind="forwardedAttrs"
    :class="inputStyles({ dense, disabled, range })"
  />
</template>

<script setup lang="ts">
import { tv } from "tailwind-variants";
import { useForwardedAttrs } from "@/composables";

defineOptions({ inheritAttrs: false });

const { forwardedAttrs } = useForwardedAttrs();

defineProps<{
  dense?: boolean;
  disabled?: boolean;
  /** Dual-handle mode: disables pointer-events on the input, re-enables on the thumb only. */
  range?: boolean;
}>();

const inputStyles = tv({
  base: [
    "absolute inset-0 w-full appearance-none bg-transparent focus:outline-none",
    "[&::-webkit-slider-runnable-track]:bg-transparent",
    "[&::-webkit-slider-thumb]:appearance-none",
    "[&::-webkit-slider-thumb]:rounded-full",
    "[&::-webkit-slider-thumb]:bg-white",
    "[&::-webkit-slider-thumb]:border-2",
    "[&::-webkit-slider-thumb]:border-primary-500",
    "[&::-webkit-slider-thumb]:shadow-sm",
    "[&::-webkit-slider-thumb]:cursor-grab",
    "[&::-webkit-slider-thumb:active]:cursor-grabbing",
    "[&::-moz-range-track]:bg-transparent",
    "[&::-moz-range-thumb]:appearance-none",
    "[&::-moz-range-thumb]:rounded-full",
    "[&::-moz-range-thumb]:bg-white",
    "[&::-moz-range-thumb]:border-2",
    "[&::-moz-range-thumb]:border-primary-500",
    "[&::-moz-range-thumb]:shadow-sm",
    "[&::-moz-range-thumb]:cursor-grab",
  ],
  variants: {
    range: {
      true: [
        "pointer-events-none",
        "[&::-webkit-slider-thumb]:pointer-events-auto",
        "[&::-moz-range-thumb]:pointer-events-auto",
      ],
      false: "cursor-pointer",
    },
    dense: {
      true: [
        "[&::-webkit-slider-thumb]:h-3.5 [&::-webkit-slider-thumb]:w-3.5",
        "[&::-moz-range-thumb]:h-3.5 [&::-moz-range-thumb]:w-3.5",
      ],
      false: [
        "[&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5",
        "[&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:w-5",
      ],
    },
    disabled: {
      true: [
        "cursor-not-allowed",
        "[&::-webkit-slider-thumb]:cursor-not-allowed",
        "[&::-webkit-slider-thumb]:border-neutral-400",
        "[&::-webkit-slider-thumb]:bg-neutral-100",
        "[&::-moz-range-thumb]:cursor-not-allowed",
        "[&::-moz-range-thumb]:border-neutral-400",
        "[&::-moz-range-thumb]:bg-neutral-100",
      ],
      false: "",
    },
  },
});
</script>
