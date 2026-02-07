<template>
  <li
    :id
    v-bind="forwardedAttrs"
    :class="optionStyles({ dense, selected: isSelected, active: isActive, class: classAttr })"
    role="option"
    :aria-selected="isSelected"
    @click="emit('select', option)"
    @mouseenter="emit('mouseenter')"
    @mousedown.prevent
  >
    <span class="flex-1">{{ option.label }}</span>
    <PiCheck
      v-if="isSelected"
      class="h-4 w-4 shrink-0"
      aria-hidden="true"
    />
  </li>
</template>

<script lang="ts" setup>
import { tv } from "tailwind-variants";
import { PiCheck } from "vue-icons-plus/pi";
import { useForwardedAttrs } from "@/composables/useForwardedAttrs";

defineOptions({
  inheritAttrs: false,
});

const { classAttr, forwardedAttrs } = useForwardedAttrs();

const optionStyles = tv({
  base: "flex cursor-pointer items-center gap-2",
  variants: {
    dense: {
      false: "px-3 py-2.5 text-sm",
      true: "px-2.5 py-2 text-xs",
    },
    selected: {
      true: "font-semibold",
    },
    active: {
      true: "bg-gray-100",
    },
  },
  defaultVariants: {
    dense: false,
  },
});

defineProps<{
  id?: string;
  option: { label: string; value: string | number };
  isSelected?: boolean;
  isActive?: boolean;
  dense?: boolean;
}>();

const emit = defineEmits<{
  (e: "select", option: { label: string; value: string | number }): void;
  (e: "mouseenter"): void;
}>();
</script>
