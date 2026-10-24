<template>
  <li
    v-bind="forwardedAttrs"
    :class="
      itemStyles({
        dense: list?.dense.value,
        bordered: list?.bordered.value,
        class: classAttr,
      })
    "
  >
    <div class="flex items-start gap-3">
      <span
        v-if="$slots.leading"
        class="flex shrink-0 items-center text-neutral-500 dark:text-neutral-400"
      >
        <slot name="leading" />
      </span>
      <div class="min-w-0 flex-1">
        <div class="font-medium">
          <slot />
        </div>
        <div
          v-if="$slots.description"
          class="mt-0.5 text-neutral-500 dark:text-neutral-400"
        >
          <slot name="description" />
        </div>
      </div>
      <span
        v-if="$slots.trailing"
        class="flex shrink-0 items-center"
      >
        <slot name="trailing" />
      </span>
    </div>
  </li>
</template>

<script lang="ts" setup>
import { inject } from "vue";
import { tv } from "tailwind-variants";
import { useForwardedAttrs } from "@/composables";
import { LIST_KEY } from "./context";

defineOptions({
  inheritAttrs: false,
});

const { classAttr, forwardedAttrs } = useForwardedAttrs();

const list = inject(LIST_KEY, undefined);

const itemStyles = tv({
  base: "",
  variants: {
    dense: {
      false: "py-3 text-sm",
      true: "py-2 text-xs",
    },
    bordered: {
      true: "",
      false: "",
    },
  },
  compoundVariants: [
    { bordered: true, dense: false, class: "px-4" },
    { bordered: true, dense: true, class: "px-3" },
  ],
  defaultVariants: {
    dense: false,
    bordered: false,
  },
});
</script>
