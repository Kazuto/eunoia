<template>
  <datalist
    :id="markerId"
    v-bind="forwardedAttrs"
    :class="markerStyles({ dense, class: classAttr })"
  >
    <option
      v-for="option in options"
      v-bind="option"
      :key="option.value"
      class="p-0 text-center"
    />
  </datalist>
</template>
<script setup lang="ts">
import { tv } from "tailwind-variants";
import { useForwardedAttrs } from "@/composables";

defineOptions({
  inheritAttrs: false,
});

const { classAttr, forwardedAttrs } = useForwardedAttrs();

defineProps<{
  options?: Record<{ label?: string; value: string | number }>;
}>();

const markerStyles = tv({
  base: ["flex justify-between"],
  variants: {
    dense: {
      true: "text-xs",
      false: "text-xs",
    },
  },
});
</script>
