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
  base: "ml-1.5 inline-flex items-center justify-center rounded-full",
  variants: {
    variant: {
      primary: "bg-white/25 text-white hover:bg-white/40",
      secondary: "bg-neutral-800/15 text-neutral-800 hover:bg-neutral-800/25",
      success: "bg-green-800/15 text-green-800 hover:bg-green-800/25",
      warning: "bg-yellow-800/15 text-yellow-800 hover:bg-yellow-800/25",
      danger: "bg-red-800/15 text-red-800 hover:bg-red-800/25",
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
