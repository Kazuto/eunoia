<template>
  <component
    :is="tag"
    v-bind="forwardedAttrs"
    :class="headlineStyles({ level, class: classAttr })"
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
  }>(),
  {
    level: 1,
  }
);

const tag = computed(() => `h${props.level}` as const);

const headlineStyles = tv({
  base: "font-sans font-bold text-neutral-900 dark:text-neutral-100",
  variants: {
    level: {
      1: "text-4xl",
      2: "text-3xl",
      3: "text-2xl",
      4: "text-xl",
      5: "text-lg",
      6: "text-base",
    },
  },
  defaultVariants: {
    level: 1,
  },
});
</script>
