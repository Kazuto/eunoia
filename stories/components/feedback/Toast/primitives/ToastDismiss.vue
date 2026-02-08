<template>
  <button
    type="button"
    v-bind="forwardedAttrs"
    :class="dismissStyles({ variant, dense, class: classAttr })"
    :aria-label="ariaLabel"
    @click="emit('dismiss', $event)"
  >
    <Icon name="x" size="xs" />
  </button>
</template>

<script lang="ts" setup>
import { tv } from "tailwind-variants";
import Icon from "@/components/core/Icon/Icon.vue";
import { useForwardedAttrs } from "@/composables/useForwardedAttrs";

defineOptions({
  inheritAttrs: false,
});

const { classAttr, forwardedAttrs } = useForwardedAttrs();

const dismissStyles = tv({
  base: "ml-auto inline-flex shrink-0 cursor-pointer items-center justify-center rounded-md border-0 bg-transparent outline-none focus-visible:ring-2 focus-visible:ring-offset-1",
  variants: {
    variant: {
      info: "text-blue-800 hover:bg-blue-100 focus-visible:ring-blue-400",
      success: "text-green-800 hover:bg-green-100 focus-visible:ring-green-400",
      warning:
        "text-yellow-800 hover:bg-yellow-100 focus-visible:ring-yellow-400",
      danger: "text-red-800 hover:bg-red-100 focus-visible:ring-red-400",
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
