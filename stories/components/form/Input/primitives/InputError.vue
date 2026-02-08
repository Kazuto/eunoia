<template>
  <ul
    v-bind="forwardedAttrs"
    :class="errorStyles({ dense, class: classAttr })"
    role="alert"
  >
    <li v-for="(message, i) in errors" :key="i">{{ message }}</li>
  </ul>
</template>

<script lang="ts" setup>
import { tv } from "tailwind-variants";
import { useForwardedAttrs } from "@/composables/useForwardedAttrs";

defineOptions({
  inheritAttrs: false,
});

const { classAttr, forwardedAttrs } = useForwardedAttrs();

defineProps<{
  errors: string[];
  dense?: boolean;
}>();

const errorStyles = tv({
  base: "list-disc pl-4 text-red-500",
  variants: {
    dense: {
      false: "text-xs",
      true: "text-[10px]",
    },
  },
  defaultVariants: {
    dense: false,
  },
});
</script>
