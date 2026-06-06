<template>
  <component
    :is="resolveDynamicComponent(props.tag)"
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
import { type Component, resolveDynamicComponent } from "vue";
import { tv } from "tailwind-variants";
import { Icon } from "@/components";
import { useForwardedAttrs } from "@/composables";

defineOptions({
  inheritAttrs: false,
});

const { classAttr, forwardedAttrs } = useForwardedAttrs();

const props = defineProps<{
  tag: string | Component;
  external?: boolean;
  dense?: boolean;
}>();

const linkStyles = tv({
  base: [
    "inline-flex items-center gap-1 rounded-sm px-0.5 font-sans text-primary-500 underline decoration-primary/30 underline-offset-2 transition-colors outline-none hover:text-primary-600 hover:decoration-primary-600 focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2",
    "focus-visible:ring-offset-white",
    "dark:focus-visible:ring-primary-700 dark:focus-visible:ring-offset-neutral-900",
  ],
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
