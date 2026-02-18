<template>
  <nav
    v-bind="forwardedAttrs"
    :aria-label="ariaLabel"
    :class="navStyles({ class: classAttr })"
  >
    <slot />
  </nav>
</template>

<script setup lang="ts">
import { tv } from "tailwind-variants";
import { useForwardedAttrs } from "@/composables";

defineOptions({
  inheritAttrs: false,
});

defineProps<{
  ariaLabel?: string;
}>();

const { classAttr, forwardedAttrs } = useForwardedAttrs();

const navStyles = tv({
  base: "flex list-none flex-col gap-2",
});
</script>
