<template>
  <textarea
    v-bind="forwardedAttrs"
    v-model="model"
    :class="textareaStyles({ dense, class: classAttr })"
    :aria-invalid="invalid || undefined"
  />
</template>

<script setup lang="ts">
import { tv } from "tailwind-variants";
import { useForwardedAttrs } from "@/composables";

defineOptions({
  inheritAttrs: false,
});

const { classAttr, forwardedAttrs } = useForwardedAttrs();

const model = defineModel<string>();

defineProps<{
  dense?: boolean;
  invalid?: boolean;
}>();

const textareaStyles = tv({
  base: [
    "inline-block w-full resize-y outline-none disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
  ],
  variants: {
    dense: {
      false: "px-3 py-2 text-sm",
      true: "px-2.5 py-1.5 text-xs",
    },
  },
  defaultVariants: {
    dense: false,
  },
});
</script>
