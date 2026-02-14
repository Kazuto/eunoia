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
  base: "inline-flex items-center gap-1 rounded-sm px-0.5 font-sans text-primary underline decoration-primary/30 underline-offset-2 transition-colors hover:text-primary-hover hover:decoration-primary-hover focus-visible:ring-2 focus-visible:ring-gray-300 focus-visible:ring-offset-2 focus-visible:outline-none",
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
