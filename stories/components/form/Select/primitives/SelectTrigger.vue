<template>
  <div
    :id
    v-bind="forwardedAttrs"
    :class="
      triggerStyles({
        dense,
        invalid,
        disabled,
        open: isOpen,
        class: classAttr,
      })
    "
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
      class="flex-1 truncate text-neutral-400"
    >
      {{ placeholder }}
    </span>
    <Icon
      name="caret-down"
      size="sm"
      :class="['ml-2 shrink-0 transition-transform', isOpen && 'rotate-180']"
    />
  </div>
</template>

<script lang="ts" setup>
import { tv } from "tailwind-variants";
import { Icon, Chip } from "@/components";
import { useForwardedAttrs } from "@/composables";

defineOptions({
  inheritAttrs: false,
});

const { classAttr, forwardedAttrs } = useForwardedAttrs();

const triggerStyles = tv({
  base: [
    "inline-flex w-full cursor-pointer items-center rounded-md border font-sans transition-colors outline-none hover:bg-neutral-50/25",
    "border-neutral-300 focus-visible:border-primary-500",
    "dark:border-neutral-700 dark:hover:bg-black/15 dark:focus-visible:border-primary-500",
  ],
  variants: {
    dense: {
      false: "min-h-[42px] px-3 py-1.5 text-sm",
      true: "min-h-[38px] px-2.5 py-1.5 text-xs",
    },
    invalid: {
      true: "border-red-500 bg-red-50 text-red-900 focus-visible:border-red-400 dark:focus-visible:border-red-500",
    },
    disabled: {
      true: "pointer-events-none cursor-not-allowed opacity-50",
    },
    open: {
      true: "border-primary-500 dark:border-primary-500",
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
