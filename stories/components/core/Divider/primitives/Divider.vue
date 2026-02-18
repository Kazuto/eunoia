<template>
  <div
    v-if="label"
    role="separator"
    :aria-orientation="orientation"
    v-bind="forwardedAttrs"
    :class="
      dividerStyles({
        orientation,
        labeled: true,
        class: classAttr,
      })
    "
  >
    <hr :class="lineStyles({ orientation })" />
    <span :class="labelStyles()">{{ label }}</span>
    <hr :class="lineStyles({ orientation })" />
  </div>
  <hr
    v-else
    role="separator"
    :aria-orientation="orientation"
    v-bind="forwardedAttrs"
    :class="
      dividerStyles({
        orientation,
        labeled: false,
        class: classAttr,
      })
    "
  />
</template>

<script lang="ts" setup>
import { tv } from "tailwind-variants";
import { useForwardedAttrs } from "@/composables";

defineOptions({
  inheritAttrs: false,
});

const { classAttr, forwardedAttrs } = useForwardedAttrs();

withDefaults(
  defineProps<{
    orientation?: "horizontal" | "vertical";
    label?: string;
  }>(),
  {
    orientation: "horizontal",
    label: undefined,
  }
);

const dividerStyles = tv({
  base: ["border-neutral-200", "dark:border-neutral-700"],
  variants: {
    orientation: {
      horizontal: "w-full",
      vertical: "h-full self-stretch",
    },
    labeled: {
      false: "",
      true: "flex items-center",
    },
  },
  compoundVariants: [
    {
      orientation: "horizontal",
      labeled: false,
      class: "border-t",
    },
    {
      orientation: "vertical",
      labeled: false,
      class: "border-l",
    },
    {
      orientation: "horizontal",
      labeled: true,
      class: "flex-row gap-3",
    },
    {
      orientation: "vertical",
      labeled: true,
      class: "flex-col gap-2",
    },
  ],
  defaultVariants: {
    orientation: "horizontal",
    labeled: false,
  },
});

const lineStyles = tv({
  base: ["flex-1", "border-neutral-200", "dark:border-neutral-700"],
  variants: {
    orientation: {
      horizontal: "border-t",
      vertical: "border-l",
    },
  },
  defaultVariants: {
    orientation: "horizontal",
  },
});

const labelStyles = tv({
  base: ["shrink-0 text-xs", "text-neutral-500", "dark:text-neutral-400"],
});
</script>
