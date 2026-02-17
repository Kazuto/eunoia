<template>
  <nav
    :aria-label="ariaLabel"
    v-bind="forwardedAttrs"
  >
    <ol :class="breadcrumbStyles({ class: classAttr })">
      <slot />
    </ol>
  </nav>
</template>

<script setup lang="ts">
import { tv } from "tailwind-variants";
import { useForwardedAttrs } from "@/composables";

defineOptions({
  inheritAttrs: false,
});

defineProps<{
  ariaLabel: string;
}>();

const { classAttr, forwardedAttrs } = useForwardedAttrs();

const breadcrumbStyles = tv({
  base: "flex items-center gap-1",
});
</script>
