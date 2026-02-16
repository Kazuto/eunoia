<template>
  <button
    type="button"
    v-bind="forwardedAttrs"
    :class="chipStyles({ variant, dense, class: classAttr })"
    @click="emit('click', $event)"
    @focus="emit('focus', $event)"
    @blur="emit('blur', $event)"
  >
    <slot />
  </button>
</template>

<script lang="ts" setup>
import { tv } from "tailwind-variants";
import { useForwardedAttrs } from "@/composables";

defineOptions({
  inheritAttrs: false,
});

const { classAttr, forwardedAttrs } = useForwardedAttrs();

const chipStyles = tv({
  base: "inline-flex cursor-pointer items-center rounded-full border-0 font-sans leading-none font-bold outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-neutral-900",
  variants: {
    variant: {
      primary:
        "bg-primary-500 text-white focus-visible:ring-primary-500 dark:bg-primary-700 dark:focus-visible:ring-primary-700",
      secondary:
        "bg-neutral-100 text-neutral-900 focus-visible:ring-neutral-100 dark:bg-neutral-700 dark:text-neutral-50 dark:focus-visible:ring-neutral-700",
      success:
        "bg-green-400 text-green-900 focus-visible:ring-green-400 dark:bg-green-700 dark:text-green-50 dark:focus-visible:ring-green-700",
      warning:
        "bg-yellow-500 text-yellow-900 focus-visible:ring-yellow-500 dark:bg-yellow-700 dark:text-yellow-50 dark:focus-visible:ring-yellow-700",
      danger:
        "bg-red-400 text-red-900 focus-visible:ring-red-400 dark:bg-red-700 dark:text-red-50 dark:focus-visible:ring-red-700",
    },
    dense: {
      false: "px-3 py-1.5 text-xs",
      true: "px-2.5 py-1 text-[10px]",
    },
  },
  defaultVariants: {
    variant: "primary",
    dense: false,
  },
});

withDefaults(
  defineProps<{
    variant?: "primary" | "secondary" | "success" | "warning" | "danger";
    dense?: boolean;
  }>(),
  {
    variant: "primary",
  }
);

const emit = defineEmits<{
  (e: "click", event: MouseEvent): void;
  (e: "focus", event: FocusEvent): void;
  (e: "blur", event: FocusEvent): void;
}>();
</script>
