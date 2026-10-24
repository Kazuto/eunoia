<template>
  <li
    :aria-current="state === 'current' ? 'step' : undefined"
    :class="itemStyles({ orientation, last })"
  >
    <component
      :is="interactive ? 'button' : 'div'"
      :type="interactive ? 'button' : undefined"
      :class="bodyStyles({ orientation, interactive, disabled })"
      @click="interactive && emit('select')"
    >
      <StepperMarker
        :number
        :state
        :dense
      />
      <span :class="textStyles({ orientation, dense })">
        <span :class="labelStyles({ state, dense })">
          {{ label }}
          <span
            v-if="state === 'completed'"
            class="sr-only"
          >
            ({{ completedLabel }})
          </span>
        </span>
        <span
          v-if="description"
          :class="descriptionStyles({ dense })"
        >
          {{ description }}
        </span>
      </span>
    </component>
    <span
      v-if="!last"
      aria-hidden="true"
      :class="
        connectorStyles({
          orientation,
          dense,
          completed: state === 'completed',
        })
      "
    />
  </li>
</template>

<script setup lang="ts">
import { tv } from "tailwind-variants";
import StepperMarker from "./StepperMarker.vue";

export type StepState = "completed" | "current" | "upcoming";

defineProps<{
  number: number;
  label: string;
  description?: string;
  state: StepState;
  orientation: "horizontal" | "vertical";
  completedLabel: string;
  dense?: boolean;
  last?: boolean;
  disabled?: boolean;
  interactive?: boolean;
}>();

const emit = defineEmits<{
  select: [];
}>();

const itemStyles = tv({
  variants: {
    orientation: {
      horizontal: "flex min-w-0 items-center gap-3",
      vertical: "relative flex",
    },
    last: {
      true: "",
      false: "",
    },
  },
  compoundVariants: [
    { orientation: "horizontal", last: false, class: "flex-1" },
    { orientation: "vertical", last: false, class: "pb-6" },
  ],
});

const bodyStyles = tv({
  base: "flex gap-3 rounded-[12px] text-left squircle",
  variants: {
    orientation: {
      horizontal: "items-center",
      vertical: "items-start",
    },
    interactive: {
      true: "cursor-pointer outline-none hover:opacity-80 focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-neutral-900",
    },
    disabled: {
      true: "opacity-50",
    },
  },
});

const textStyles = tv({
  base: "flex min-w-0 flex-col",
  variants: {
    orientation: {
      horizontal: "",
      vertical: "",
    },
    dense: {
      true: "",
      false: "",
    },
  },
  // Nudges the first line onto the marker's centre line in the vertical layout.
  compoundVariants: [
    { orientation: "vertical", dense: false, class: "pt-1.5" },
    { orientation: "vertical", dense: true, class: "pt-0.5" },
  ],
});

const labelStyles = tv({
  base: "font-semibold",
  variants: {
    state: {
      completed: "text-neutral-900 dark:text-neutral-100",
      current: "text-neutral-900 dark:text-neutral-50",
      upcoming: "text-neutral-500 dark:text-neutral-400",
    },
    dense: {
      false: "text-sm",
      true: "text-xs",
    },
  },
});

const descriptionStyles = tv({
  base: "text-neutral-500 dark:text-neutral-400",
  variants: {
    dense: {
      false: "text-xs",
      true: "text-[11px]",
    },
  },
});

const connectorStyles = tv({
  base: "rounded-full",
  variants: {
    orientation: {
      horizontal: "h-0.5 min-w-4 flex-1",
      vertical: "absolute bottom-1 w-0.5",
    },
    dense: {
      true: "",
      false: "",
    },
    completed: {
      true: "bg-primary-500 dark:bg-primary-700",
      false: "bg-neutral-300 dark:bg-neutral-600",
    },
  },
  // The vertical line runs from just below the marker to the next step.
  compoundVariants: [
    { orientation: "vertical", dense: false, class: "top-9 left-[15px]" },
    { orientation: "vertical", dense: true, class: "top-7 left-[11px]" },
  ],
});
</script>
