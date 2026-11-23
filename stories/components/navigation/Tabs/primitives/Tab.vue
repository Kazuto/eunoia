<template>
  <button
    :id
    type="button"
    role="tab"
    :aria-selected="active"
    :aria-controls="controls"
    :aria-disabled="disabled || undefined"
    :tabindex="active ? 0 : -1"
    :class="variants({ active, dense, divided, disabled })"
    @click="!disabled && emit('select')"
  >
    <slot />
  </button>
</template>

<script setup lang="ts">
import { tv } from "@/utils/tv";

defineProps<{
  id: string;
  controls: string;
  active?: boolean;
  dense?: boolean;
  divided?: boolean;
  disabled?: boolean;
}>();

const emit = defineEmits<{
  select: [];
}>();

const variants = tv({
  // Side-specific border colors, so the divider and the underline don't
  // overwrite each other. -mb-px lays the underline over the list's border.
  base: [
    "-mb-px cursor-pointer border-b-2 text-center font-semibold transition-colors outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-inset",
    "border-b-transparent text-neutral-500 hover:text-neutral-900",
    "dark:text-neutral-400 dark:hover:text-neutral-100",
  ],
  variants: {
    active: {
      true: [
        "border-b-primary-500 font-bold text-neutral-900",
        "dark:text-neutral-50",
      ],
    },
    dense: {
      true: "px-2.5 py-1.5 text-xs",
      false: "px-3 py-2 text-sm",
    },
    divided: {
      true: [
        "not-first:border-l",
        "border-l-neutral-200",
        "dark:border-l-neutral-700",
      ],
    },
    disabled: {
      true: "pointer-events-none cursor-not-allowed opacity-50",
    },
  },
});
</script>
