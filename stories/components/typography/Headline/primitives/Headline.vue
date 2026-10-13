<template>
  <component
    :is="tag"
    v-bind="forwardedAttrs"
    :class="headlineStyles({ scale: scale ?? level, class: classAttr })"
  >
    <slot />
  </component>
</template>

<script lang="ts" setup>
import { computed } from "vue";
import { tv } from "tailwind-variants";
import { useForwardedAttrs } from "@/composables";

defineOptions({
  inheritAttrs: false,
});

const { classAttr, forwardedAttrs } = useForwardedAttrs();

const props = withDefaults(
  defineProps<{
    level?: 1 | 2 | 3 | 4 | 5 | 6;
    scale?: 1 | 2 | 3 | 4 | 5 | 6;
  }>(),
  {
    level: 1,
    scale: undefined,
  }
);

const tag = computed(() => `h${props.level}` as const);

const headlineStyles = tv({
  base: ["font-sans", "text-neutral-900", "dark:text-neutral-100"],
  variants: {
    scale: {
      1: "text-4xl font-bold",
      2: "text-3xl font-bold",
      3: "text-2xl font-bold",
      4: "text-xl font-semibold",
      5: "text-lg font-semibold",
      6: "text-base font-semibold",
    },
  },
  defaultVariants: {
    scale: 1,
  },
});
</script>
