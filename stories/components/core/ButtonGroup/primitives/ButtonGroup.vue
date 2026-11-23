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
import { tv } from "@/utils/tv";
import { useForwardedAttrs } from "@/composables";

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
    "[&>:first-child]:rounded-s-field",
    "[&>:last-child]:rounded-e-field",
  ],
});
</script>
