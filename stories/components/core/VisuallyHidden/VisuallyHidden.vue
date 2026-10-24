<template>
  <component
    :is="as"
    v-bind="forwardedAttrs"
    :class="hiddenStyles({ focusable, class: classAttr })"
  >
    <slot />
  </component>
</template>

<script lang="ts" setup>
import { tv } from "tailwind-variants";
import { useForwardedAttrs } from "@/composables";

defineOptions({
  inheritAttrs: false,
});

const { classAttr, forwardedAttrs } = useForwardedAttrs();

const hiddenStyles = tv({
  base: "sr-only",
  variants: {
    // For focusable content such as a skip link, which has to be seen once
    // keyboard focus lands on it.
    focusable: {
      true: "focus-within:not-sr-only",
    },
  },
});

withDefaults(
  defineProps<{
    as?: string;
    /** Show the content while something inside it has focus. */
    focusable?: boolean;
  }>(),
  {
    as: "span",
  }
);
</script>
