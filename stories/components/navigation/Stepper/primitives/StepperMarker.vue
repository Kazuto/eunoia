<template>
  <span
    aria-hidden="true"
    :class="markerStyles({ state, dense })"
  >
    <Icon
      v-if="state === 'completed'"
      name="check"
      type="bold"
      :size="dense ? 'xs' : 'sm'"
    />
    <template v-else>{{ number }}</template>
  </span>
</template>

<script setup lang="ts">
import { tv } from "tailwind-variants";
import { Icon } from "@/components/core";
import type { StepState } from "./StepperStep.vue";

defineProps<{
  number: number;
  state: StepState;
  dense?: boolean;
}>();

const markerStyles = tv({
  base: "flex shrink-0 items-center justify-center rounded-full font-bold transition-colors",
  variants: {
    state: {
      completed: [
        "bg-primary-500 text-primary-50",
        "dark:bg-primary-700 dark:text-primary-50",
      ],
      current: [
        "border-2 border-primary-500 bg-white text-primary-700",
        "dark:border-primary-400 dark:bg-neutral-900 dark:text-primary-200",
      ],
      upcoming: [
        "border-2 border-neutral-300 bg-white text-neutral-500",
        "dark:border-neutral-600 dark:bg-neutral-900 dark:text-neutral-400",
      ],
    },
    dense: {
      false: "h-8 w-8 text-sm",
      true: "h-6 w-6 text-xs",
    },
  },
  defaultVariants: {
    dense: false,
  },
});
</script>
