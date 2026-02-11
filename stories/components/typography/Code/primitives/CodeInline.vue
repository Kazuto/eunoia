<template>
  <code
    v-bind="forwardedAttrs"
    :class="codeStyles({ class: classAttr })"
    ><slot
  /></code>
</template>

<script lang="ts" setup>
import { tv } from "tailwind-variants";
import { useForwardedAttrs } from "@/composables/useForwardedAttrs";

defineOptions({
  inheritAttrs: false,
});

const { classAttr, forwardedAttrs } = useForwardedAttrs();

const codeStyles = tv({
  base: "rounded bg-gray-100 px-1.5 py-0.5 font-mono text-[0.875em] text-gray-800 select-all",
});
</script>
