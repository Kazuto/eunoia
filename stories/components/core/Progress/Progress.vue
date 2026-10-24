<template>
  <div
    role="progressbar"
    :aria-label="t('label')"
    aria-valuemin="0"
    :aria-valuemax="max"
    :aria-valuenow="indeterminate ? undefined : clampedValue"
    v-bind="forwardedAttrs"
    :class="trackStyles({ dense, class: classAttr })"
  >
    <div
      :class="barStyles({ variant, indeterminate })"
      :style="indeterminate ? undefined : { width: `${percent}%` }"
    />
  </div>
</template>

<script lang="ts" setup>
import { computed, toRef } from "vue";
import { tv } from "tailwind-variants";
import {
  useForwardedAttrs,
  useLocale,
  type LocaleMessages,
} from "@/composables";

defineOptions({
  inheritAttrs: false,
});

const { classAttr, forwardedAttrs } = useForwardedAttrs();

const trackStyles = tv({
  base: "relative w-full overflow-hidden rounded-full bg-neutral-200 dark:bg-neutral-700",
  variants: {
    dense: {
      false: "h-2",
      true: "h-1",
    },
  },
  defaultVariants: {
    dense: false,
  },
});

const barStyles = tv({
  base: "h-full rounded-full",
  variants: {
    variant: {
      primary: "bg-primary-500",
      success: "bg-green-500",
      warning: "bg-yellow-500",
      danger: "bg-red-500",
    },
    indeterminate: {
      false:
        "transition-[width] duration-300 ease-out motion-reduce:transition-none",
      true: [
        "absolute inset-y-0 left-0 w-1/3 animate-[progress-indeterminate_1.5s_ease-in-out_infinite]",
        "motion-reduce:w-full motion-reduce:animate-pulse",
      ],
    },
  },
  defaultVariants: {
    variant: "primary",
    indeterminate: false,
  },
});

const props = withDefaults(
  defineProps<{
    /** Omit for an indeterminate bar. */
    value?: number;
    max?: number;
    variant?: "primary" | "success" | "warning" | "danger";
    dense?: boolean;
    locale?: LocaleMessages;
  }>(),
  {
    value: undefined,
    max: 100,
    variant: "primary",
    locale: undefined,
  }
);

const t = useLocale(
  "progress",
  toRef(() => props.locale)
);

const indeterminate = computed(() => props.value == null);

const clampedValue = computed(() =>
  Math.min(Math.max(props.value ?? 0, 0), props.max)
);

const percent = computed(() =>
  props.max > 0 ? (clampedValue.value / props.max) * 100 : 0
);
</script>
