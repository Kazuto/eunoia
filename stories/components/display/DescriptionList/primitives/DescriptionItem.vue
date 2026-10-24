<template>
  <div
    v-bind="forwardedAttrs"
    :class="
      itemStyles({
        dense: context?.dense.value,
        orientation: context?.orientation.value,
        class: classAttr,
      })
    "
  >
    <dt class="font-medium text-neutral-500 dark:text-neutral-400">
      <slot name="term">
        {{ term }}
      </slot>
    </dt>
    <dd :class="descriptionStyles({ orientation: context?.orientation.value })">
      <slot />
    </dd>
  </div>
</template>

<script lang="ts" setup>
import { inject } from "vue";
import { tv } from "tailwind-variants";
import { useForwardedAttrs } from "@/composables";
import { DESCRIPTION_LIST_KEY } from "./context";

defineOptions({
  inheritAttrs: false,
});

const { classAttr, forwardedAttrs } = useForwardedAttrs();

const context = inject(DESCRIPTION_LIST_KEY, undefined);

const itemStyles = tv({
  base: "grid",
  variants: {
    dense: {
      false: "py-3",
      true: "py-2",
    },
    orientation: {
      horizontal: "gap-1 sm:grid-cols-3 sm:gap-4",
      vertical: "gap-1",
    },
  },
  defaultVariants: {
    dense: false,
    orientation: "horizontal",
  },
});

const descriptionStyles = tv({
  base: "text-neutral-900 dark:text-neutral-100",
  variants: {
    orientation: {
      horizontal: "sm:col-span-2",
      vertical: "",
    },
  },
  defaultVariants: {
    orientation: "horizontal",
  },
});

withDefaults(
  defineProps<{
    term?: string;
  }>(),
  {
    term: undefined,
  }
);
</script>
