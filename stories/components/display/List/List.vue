<template>
  <component
    :is="ordered ? 'ol' : 'ul'"
    v-bind="forwardedAttrs"
    :class="listStyles({ variant, ordered, class: classAttr })"
  >
    <slot />
  </component>
</template>

<script lang="ts" setup>
import { computed, provide } from "vue";
import { tv } from "tailwind-variants";
import { useForwardedAttrs } from "@/composables";
import { LIST_KEY } from "./primitives/context";

defineOptions({
  inheritAttrs: false,
});

const { classAttr, forwardedAttrs } = useForwardedAttrs();

const listStyles = tv({
  base: "font-sans text-neutral-900 dark:text-neutral-100",
  variants: {
    variant: {
      plain: "",
      divided: "divide-y divide-neutral-200 dark:divide-neutral-700",
      bordered: [
        "divide-y divide-neutral-200 rounded-[14px] border border-neutral-300 squircle",
        "dark:divide-neutral-700 dark:border-neutral-600",
      ],
    },
    ordered: {
      true: "list-outside list-decimal pl-6 marker:text-neutral-500 dark:marker:text-neutral-400",
      false: "list-none",
    },
  },
  defaultVariants: {
    variant: "plain",
    ordered: false,
  },
});

const props = withDefaults(
  defineProps<{
    ordered?: boolean;
    variant?: "plain" | "divided" | "bordered";
    dense?: boolean;
  }>(),
  {
    ordered: false,
    variant: "plain",
  }
);

provide(LIST_KEY, {
  dense: computed(() => props.dense),
  bordered: computed(() => props.variant === "bordered"),
});
</script>
