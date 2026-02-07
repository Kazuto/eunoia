<template>
  <div
    :id
    v-bind="forwardedAttrs"
    :class="triggerStyles({ dense, invalid, disabled, open: isOpen, class: classAttr })"
    role="combobox"
    :aria-expanded="isOpen"
    aria-haspopup="listbox"
    :aria-owns="listboxId"
    :aria-activedescendant="activeDescendantId"
    :aria-labelledby="ariaLabelledby"
    :aria-label="ariaLabel"
    :aria-disabled="disabled || undefined"
    :tabindex="disabled ? -1 : 0"
    @click="!disabled && emit('toggle')"
    @keydown="!disabled && emit('keydown', $event)"
  >
    <div
      v-if="multiple && selectedValues.length > 0"
      class="flex flex-1 flex-wrap gap-1"
    >
      <Chip
        v-for="(label, i) in selectedLabels"
        :key="selectedValues[i]"
        variant="secondary"
        :dense
        removable
        @click.stop
        @remove="emit('remove-chip', selectedValues[i])"
      >
        {{ label }}
      </Chip>
    </div>
    <span
      v-else-if="!multiple && selectedLabels.length > 0"
      class="flex-1 truncate"
    >
      {{ selectedLabels[0] }}
    </span>
    <span
      v-else
      class="flex-1 truncate text-gray-400"
    >
      {{ placeholder }}
    </span>
    <PiCaretDown
      :class="['ml-2 h-4 w-4 shrink-0 transition-transform', isOpen && 'rotate-180']"
      aria-hidden="true"
    />
  </div>
</template>

<script lang="ts" setup>
import { tv } from "tailwind-variants";
import { PiCaretDown } from "vue-icons-plus/pi";
import Chip from "@/components/core/Chip/Chip.vue";
import { useForwardedAttrs } from "@/composables/useForwardedAttrs";

defineOptions({
  inheritAttrs: false,
});

const { classAttr, forwardedAttrs } = useForwardedAttrs();

const triggerStyles = tv({
  base: "inline-flex w-full cursor-pointer items-center rounded-md border border-gray-300 font-sans outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2",
  variants: {
    dense: {
      false: "min-h-[42px] px-3 py-2 text-sm",
      true: "min-h-[38px] px-2.5 py-1.5 text-xs",
    },
    invalid: {
      true: "border-red-500 bg-red-50 text-red-900 focus:ring-red-300",
    },
    disabled: {
      true: "pointer-events-none cursor-not-allowed opacity-50",
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
  id?: string;
  selectedLabels: string[];
  selectedValues: Array<string | number>;
  multiple?: boolean;
  dense?: boolean;
  invalid?: boolean;
  disabled?: boolean;
  placeholder?: string;
  isOpen?: boolean;
  listboxId?: string;
  activeDescendantId?: string;
  ariaLabel?: string;
  ariaLabelledby?: string;
}>();

const emit = defineEmits<{
  (e: "toggle"): void;
  (e: "keydown", event: KeyboardEvent): void;
  (e: "remove-chip", value: string | number): void;
}>();
</script>
