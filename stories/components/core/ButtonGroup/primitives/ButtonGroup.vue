<template>
  <div
    role="group"
    v-bind="forwardedAttrs"
    :aria-label="ariaLabel"
    :class="buttonGroupStyles({ class: classAttr })"
  >
    <slot />
  </div>
</template>

<script lang="ts" setup>
import { tv } from "tailwind-variants";
import { useForwardedAttrs } from "@/composables/useForwardedAttrs";

defineOptions({
  inheritAttrs: false,
});

const { classAttr, forwardedAttrs } = useForwardedAttrs();

defineProps<{
  ariaLabel: string;
}>();

const buttonGroupStyles = tv({
  base: [
    "inline-flex",
    "[&>*]:rounded-none",
    "[&>:first-child]:rounded-s-lg",
    "[&>:last-child]:rounded-e-lg",
  ],
});
</script>
