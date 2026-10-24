<template>
  <div
    role="group"
    v-bind="forwardedAttrs"
    :aria-labelledby="heading ? headingId : undefined"
    :class="classAttr"
  >
    <div
      v-if="heading"
      :id="headingId"
      :class="headingStyles({ dense })"
    >
      {{ heading }}
    </div>
    <slot />
  </div>
</template>

<script lang="ts" setup>
import { tv } from "tailwind-variants";
import { useForwardedAttrs, useSanitizedId } from "@/composables";

defineOptions({
  inheritAttrs: false,
});

const { classAttr, forwardedAttrs } = useForwardedAttrs();

defineProps<{
  heading?: string;
  dense?: boolean;
}>();

const headingId = useSanitizedId("command-group");

const headingStyles = tv({
  base: [
    "px-3 pt-2 pb-1 font-semibold",
    "text-neutral-500",
    "dark:text-neutral-400",
  ],
  variants: {
    dense: {
      false: "text-xs",
      true: "px-2.5 text-[10px]",
    },
  },
  defaultVariants: {
    dense: false,
  },
});
</script>
