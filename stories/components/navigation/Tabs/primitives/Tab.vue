<template>
  <button
    :id
    type="button"
    role="tab"
    :aria-selected="active"
    :aria-controls="controls"
    :aria-disabled="disabled || undefined"
    :tabindex="active ? 0 : -1"
    :class="variants({ active, dense, disabled })"
    @click="!disabled && emit('select')"
  >
    <slot />
  </button>
</template>

<script setup lang="ts">
import { tv } from "tailwind-variants";

defineProps<{
  id: string;
  controls: string;
  active?: boolean;
  dense?: boolean;
  disabled?: boolean;
}>();

const emit = defineEmits<{
  select: [];
}>();

const variants = tv({
  base: [
    "cursor-pointer rounded-md font-medium transition-colors outline-none focus-visible:ring-2 focus-visible:ring-primary-500",
    "text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900",
    "dark:text-neutral-400 dark:hover:bg-neutral-700 dark:hover:text-neutral-100",
  ],
  variants: {
    active: {
      true: [
        "bg-primary-100 text-primary-800 hover:bg-primary-100 hover:text-primary-800",
        "dark:bg-primary-900 dark:text-primary-200 dark:hover:bg-primary-900 dark:hover:text-primary-200",
      ],
    },
    dense: {
      true: "px-2.5 py-1.5 text-xs",
      false: "px-3 py-2 text-sm",
    },
    disabled: {
      true: "pointer-events-none cursor-not-allowed opacity-50",
    },
  },
});
</script>
