<template>
  <button
    v-bind="forwardedAttrs"
    :class="triggerStyles({ dense, open: isOpen, class: classAttr })"
    type="button"
    :aria-haspopup="true"
    :aria-expanded="isOpen"
    :aria-controls="menuId"
    :aria-label="ariaLabel"
    :disabled="disabled || undefined"
    @click="emit('toggle')"
    @keydown="emit('keydown', $event)"
  >
    <slot />
    <Icon
      name="caret-down"
      size="sm"
      :class="['ml-2 shrink-0 transition-transform', isOpen && 'rotate-180']"
    />
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

const triggerStyles = tv({
  base: "inline-flex cursor-pointer items-center rounded-md border border-gray-300 font-sans outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2",
  variants: {
    dense: {
      false: "px-3 py-2 text-sm",
      true: "px-2.5 py-1.5 text-xs",
    },
    open: {
      true: "ring-2 ring-gray-300 ring-offset-2",
    },
  },
  defaultVariants: {
    dense: false,
  },
});

defineProps<{
  dense?: boolean;
  disabled?: boolean;
  isOpen?: boolean;
  menuId?: string;
  ariaLabel?: string;
}>();

const emit = defineEmits<{
  (e: "toggle"): void;
  (e: "keydown", event: KeyboardEvent): void;
}>();
</script>
