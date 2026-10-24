<template>
  <div
    v-bind="forwardedAttrs"
    :class="emptyStyles({ dense, class: classAttr })"
  >
    <span
      v-if="icon"
      :class="iconWrapStyles({ dense })"
    >
      <Icon
        :name="icon"
        :size="dense ? 'md' : 'lg'"
      />
    </span>
    <component
      :is="headingTag"
      class="font-semibold text-neutral-900 dark:text-neutral-100"
    >
      {{ title ?? t("no-data") }}
    </component>
    <p
      v-if="description || $slots.description"
      class="mt-1 max-w-sm text-neutral-500 dark:text-neutral-400"
    >
      <slot name="description">
        {{ description }}
      </slot>
    </p>
    <div
      v-if="$slots.default"
      :class="['flex flex-wrap justify-center gap-2', dense ? 'mt-3' : 'mt-4']"
    >
      <slot />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { toRef } from "vue";
import { tv } from "tailwind-variants";
import { Icon } from "@/components";
import {
  useForwardedAttrs,
  useLocale,
  type LocaleMessages,
} from "@/composables";

defineOptions({
  inheritAttrs: false,
});

const { classAttr, forwardedAttrs } = useForwardedAttrs();

const emptyStyles = tv({
  base: "flex flex-col items-center justify-center text-center font-sans",
  variants: {
    dense: {
      false: "px-6 py-10 text-sm",
      true: "px-4 py-6 text-xs",
    },
  },
  defaultVariants: {
    dense: false,
  },
});

const iconWrapStyles = tv({
  base: [
    "flex items-center justify-center superellipse rounded-[100%]",
    "bg-neutral-100 text-neutral-500",
    "dark:bg-neutral-800 dark:text-neutral-400",
  ],
  variants: {
    dense: {
      false: "mb-3 h-12 w-12",
      true: "mb-2 h-9 w-9",
    },
  },
  defaultVariants: {
    dense: false,
  },
});

const props = withDefaults(
  defineProps<{
    /** Phosphor icon name, e.g. "tray" or "magnifying-glass". */
    icon?: string;
    title?: string;
    description?: string;
    headingTag?: "h2" | "h3" | "h4" | "p";
    dense?: boolean;
    locale?: LocaleMessages;
  }>(),
  {
    icon: undefined,
    title: undefined,
    description: undefined,
    headingTag: "h3",
    locale: undefined,
  }
);

const t = useLocale(
  "common",
  toRef(() => props.locale)
);
</script>
