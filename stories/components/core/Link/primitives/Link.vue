<template>
  <component
    :is="tag"
    v-bind="forwardedAttrs"
    :class="linkStyles({ dense, class: classAttr })"
  >
    <slot />
    <Icon
      v-if="external"
      name="arrow-square-out"
      :size="dense ? 'xs' : 'sm'"
      class="shrink-0"
    />
  </component>
</template>

<script lang="ts" setup>
import { type Component } from "vue";
import { tv } from "tailwind-variants";
import { Icon } from "@/components";
import { useForwardedAttrs } from "@/composables";

defineOptions({
  inheritAttrs: false,
});

const { classAttr, forwardedAttrs } = useForwardedAttrs();

defineProps<{
  tag: string | Component;
  external?: boolean;
  dense?: boolean;
}>();

const linkStyles = tv({
  base: "focus:ring-neutral-300 text-primary-500 hover:text-primary-600 hover:decoration-primary-600 inline-flex items-center gap-1 rounded-sm px-0.5 font-sans underline decoration-primary/30 underline-offset-2 transition-colors focus:ring-2 focus:ring-offset-2 focus:outline-none",
  variants: {
    dense: {
      false: "text-sm",
      true: "text-xs",
    },
  },
  defaultVariants: {
    dense: false,
  },
});
</script>
