<template>
  <span v-bind="forwardedAttrs" :class="counterStyles({ class: classAttr })">
    {{ current }}/{{ max }}
  </span>
</template>

<script lang="ts" setup>
import { tv } from "tailwind-variants";
import { useForwardedAttrs } from "@/composables/useForwardedAttrs";

defineOptions({
  inheritAttrs: false,
});

const { classAttr, forwardedAttrs } = useForwardedAttrs();

defineProps<{
  current: number;
  max: number;
}>();

const counterStyles = tv({
  base: "ml-auto text-gray-400",
});
</script>
