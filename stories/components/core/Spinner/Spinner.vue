<template>
  <span
    role="status"
    v-bind="forwardedAttrs"
    :class="spinnerStyles({ size, class: classAttr })"
  >
    <svg
      class="h-full w-full animate-spin motion-reduce:[animation-duration:1.5s]"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <circle
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        stroke-width="3"
        class="opacity-25"
      />
      <path
        d="M22 12a10 10 0 0 0-10-10"
        stroke="currentColor"
        stroke-width="3"
        stroke-linecap="round"
      />
    </svg>
    <span class="sr-only">{{ label ?? t("label") }}</span>
  </span>
</template>

<script lang="ts" setup>
import { toRef } from "vue";
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

const spinnerStyles = tv({
  base: "inline-block shrink-0 text-primary-500 dark:text-primary-400",
  variants: {
    size: {
      xs: "h-3 w-3",
      sm: "h-4 w-4",
      md: "h-5 w-5",
      lg: "h-6 w-6",
      xl: "h-8 w-8",
    },
  },
  defaultVariants: {
    size: "md",
  },
});

const props = withDefaults(
  defineProps<{
    size?: "xs" | "sm" | "md" | "lg" | "xl";
    label?: string;
    locale?: LocaleMessages;
  }>(),
  {
    size: "md",
    label: undefined,
    locale: undefined,
  }
);

const t = useLocale(
  "spinner",
  toRef(() => props.locale)
);
</script>
