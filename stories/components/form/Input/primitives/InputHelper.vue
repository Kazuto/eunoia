<template>
  <span
    v-bind="forwardedAttrs"
    :class="helperStyles({ class: classAttr })"
  >
    <slot />
  </span>
</template>

<script lang="ts" setup>
import { tv } from "tailwind-variants";
import { useForwardedAttrs } from "@/composables/useForwardedAttrs";

defineOptions({
  inheritAttrs: false,
});

const { classAttr, forwardedAttrs } = useForwardedAttrs();

const helperStyles = tv({
  base: "text-gray-400",
});
</script>
