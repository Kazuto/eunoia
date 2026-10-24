<template>
  <button
    type="button"
    :aria-label="label"
    :aria-current="active || undefined"
    :class="indicatorStyles({ active })"
    @click="emit('select')"
  />
</template>

<script setup lang="ts">
import { tv } from "tailwind-variants";

defineProps<{
  label: string;
  active?: boolean;
}>();

const emit = defineEmits<{
  select: [];
}>();

const indicatorStyles = tv({
  base: [
    "h-2 cursor-pointer rounded-full transition-all outline-none",
    "focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-neutral-900",
  ],
  variants: {
    active: {
      true: "w-5 bg-primary-500 dark:bg-primary-400",
      false: [
        "w-2 bg-neutral-300 hover:bg-neutral-400",
        "dark:bg-neutral-600 dark:hover:bg-neutral-500",
      ],
    },
  },
  defaultVariants: {
    active: false,
  },
});
</script>
