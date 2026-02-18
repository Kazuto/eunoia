<template>
  <button
    type="button"
    v-bind="forwardedAttrs"
    :class="dismissStyles({ variant, dense, class: classAttr })"
    :aria-label="ariaLabel"
    @click="emit('dismiss', $event)"
  >
    <Icon
      name="x"
      size="xs"
    />
  </button>
</template>

<script lang="ts" setup>
import { tv } from "tailwind-variants";
import { Icon } from "@/components";
import { useForwardedAttrs } from "@/composables";

defineOptions({
  inheritAttrs: false,
});

const { classAttr, forwardedAttrs } = useForwardedAttrs();

const dismissStyles = tv({
  base: "ml-auto inline-flex shrink-0 cursor-pointer items-center justify-center rounded-md border-0 bg-transparent outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
  variants: {
    variant: {
      info: [
        "text-blue-800 hover:bg-blue-300 focus-visible:ring-blue-300 focus-visible:ring-offset-blue-200",
        "dark:text-blue-300 dark:hover:bg-blue-800 dark:focus-visible:ring-blue-800 dark:focus-visible:ring-offset-blue-950",
      ],
      success: [
        "text-green-800 hover:bg-green-300 focus-visible:ring-green-400 focus-visible:ring-offset-green-200",
        "dark:text-green-300 dark:hover:bg-green-800 dark:focus-visible:ring-green-800 dark:focus-visible:ring-offset-green-950",
      ],
      warning: [
        "text-yellow-800 hover:bg-yellow-400 focus-visible:ring-yellow-400 focus-visible:ring-offset-yellow-200",
        "dark:text-yellow-300 dark:hover:bg-yellow-800 dark:focus-visible:ring-yellow-800 dark:focus-visible:ring-offset-yellow-950",
      ],
      danger: [
        "text-red-800 hover:bg-red-300 focus-visible:ring-red-300 focus-visible:ring-offset-red-200",
        "dark:text-red-300 dark:hover:bg-red-800 dark:focus-visible:ring-red-800 dark:focus-visible:ring-offset-red-950",
      ],
    },
    dense: {
      false: "h-5 w-5 p-1 text-sm",
      true: "h-4 w-4 p-0.5 text-xs",
    },
  },
  defaultVariants: {
    variant: "info",
    dense: false,
  },
});

defineProps<{
  variant?: "info" | "success" | "warning" | "danger";
  dense?: boolean;
  ariaLabel: string;
}>();

const emit = defineEmits<{
  (e: "dismiss", event: MouseEvent): void;
}>();
</script>
