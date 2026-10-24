<template>
  <ol
    v-bind="forwardedAttrs"
    :aria-label="ariaLabel ?? t('label')"
    :class="listStyles({ orientation, class: classAttr })"
  >
    <StepperStep
      v-for="(step, index) in steps"
      :key="index"
      :number="index + 1"
      :label="step.label"
      :description="step.description"
      :state="stateOf(index)"
      :orientation
      :completed-label="t('completed')"
      :dense
      :last="index === steps.length - 1"
      :disabled="step.disabled"
      :interactive="isInteractive(index)"
      @select="select(index)"
    />
  </ol>
</template>

<script setup lang="ts">
import { toRef } from "vue";
import { tv } from "tailwind-variants";
import {
  useForwardedAttrs,
  useLocale,
  type LocaleMessages,
} from "@/composables";
import StepperStep, { type StepState } from "./primitives/StepperStep.vue";

export type StepperStepItem = {
  label: string;
  description?: string;
  disabled?: boolean;
};

defineOptions({
  inheritAttrs: false,
});

const { classAttr, forwardedAttrs } = useForwardedAttrs();

const props = withDefaults(
  defineProps<{
    steps: StepperStepItem[];
    orientation?: "horizontal" | "vertical";
    /** Lets users jump back to completed steps. */
    clickable?: boolean;
    dense?: boolean;
    ariaLabel?: string;
    locale?: LocaleMessages;
  }>(),
  {
    orientation: "horizontal",
    ariaLabel: undefined,
    locale: undefined,
  }
);

const model = defineModel<number>({ default: 0 });

const t = useLocale(
  "stepper",
  toRef(() => props.locale)
);

const listStyles = tv({
  base: "m-0 list-none p-0",
  variants: {
    orientation: {
      horizontal: "flex items-center gap-3",
      vertical: "flex flex-col",
    },
  },
});

function stateOf(index: number): StepState {
  if (index < model.value) return "completed";
  if (index === model.value) return "current";
  return "upcoming";
}

function isInteractive(index: number) {
  return (
    props.clickable && index < model.value && !props.steps[index]?.disabled
  );
}

function select(index: number) {
  if (!isInteractive(index)) return;
  model.value = index;
}
</script>
