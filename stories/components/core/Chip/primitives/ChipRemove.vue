<template>
  <span
    v-bind="forwardedAttrs"
    :class="removeStyles({ variant, dense, class: classAttr })"
    role="button"
    tabindex="-1"
    :aria-label="ariaLabel"
    @click.stop="emit('remove', $event)"
    @keydown.enter.stop="emit('remove', $event)"
    @keydown.space.stop="emit('remove', $event)"
  >
    <Icon
      name="x"
      size="xs"
    />
  </span>
</template>

<script lang="ts" setup>
import { tv } from "tailwind-variants";
import { Icon } from "@/components";
import { useForwardedAttrs } from "@/composables";

defineOptions({
  inheritAttrs: false,
});

const { classAttr, forwardedAttrs } = useForwardedAttrs();

const removeStyles = tv({
  base: "inline-flex aspect-square items-center justify-center rounded-full transition-colors",
  variants: {
    variant: {
      primary:
        "bg-primary-600 text-white hover:bg-primary-400 dark:bg-primary-900 dark:text-primary-100 dark:hover:bg-primary-950",
      secondary:
        "bg-neutral-600 text-white hover:bg-neutral-400 dark:bg-neutral-900 dark:text-neutral-100 dark:hover:bg-neutral-950",
      success:
        "bg-green-600 text-white hover:bg-green-400 dark:bg-green-900 dark:text-green-100 dark:hover:bg-green-950",
      warning:
        "bg-yellow-600 text-white hover:bg-yellow-500 dark:bg-yellow-900 dark:text-yellow-100 dark:hover:bg-yellow-950",
      danger:
        "bg-red-600 text-white hover:bg-red-400 dark:bg-red-900 dark:text-red-100 dark:hover:bg-red-950",
    },
    dense: {
      false: "h-4 w-4 p-0.5 text-[10px]",
      true: "h-3.5 w-3.5 text-[8px]",
    },
  },
  defaultVariants: {
    variant: "primary",
    dense: false,
  },
});

defineProps<{
  variant?: "primary" | "secondary" | "success" | "warning" | "danger";
  dense?: boolean;
  ariaLabel: string;
}>();

const emit = defineEmits<{
  (e: "remove", event: MouseEvent | KeyboardEvent): void;
}>();
</script>
