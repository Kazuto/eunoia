<template>
  <div
    :id="id"
    role="button"
    tabindex="0"
    :class="triggerStyles({ dense, invalid, disabled, class: classAttr })"
    :aria-label="ariaLabel"
    :aria-labelledby="ariaLabelledby"
    :aria-expanded="isOpen"
    :aria-controls="isOpen ? calendarId : undefined"
    :aria-disabled="disabled ? 'true' : undefined"
    :aria-invalid="invalid ? 'true' : undefined"
    aria-haspopup="dialog"
    v-bind="forwardedAttrs"
    @click="emit('toggle')"
    @keydown="emit('keydown', $event)"
  >
    <div class="flex w-full items-center gap-2">
      <div class="flex min-w-0 flex-1 items-center gap-1">
        <template v-if="selectedDates.length > 0">
          <template v-if="mode === 'single'">
            <span :class="['truncate', dense ? 'text-xs' : 'text-sm']">{{
              selectedDates[0]
            }}</span>
          </template>
          <template v-else>
            <span :class="['truncate', dense ? 'text-xs' : 'text-sm']">{{
              selectedDates[0]
            }}</span>
            <span
              :class="[
                dense ? 'text-xs' : 'text-sm',
                'text-neutral-500 dark:text-neutral-400',
              ]"
              >-</span
            >
            <span :class="['truncate', dense ? 'text-xs' : 'text-sm']">{{
              selectedDates[1]
            }}</span>
          </template>
        </template>
        <template v-else>
          <span
            :class="[
              'truncate text-neutral-500 dark:text-neutral-400',
              dense ? 'text-xs' : 'text-sm',
            ]"
          >
            {{ placeholder }}
          </span>
        </template>
      </div>
      <div class="ml-auto flex items-center gap-1">
        <button
          v-if="selectedDates.length > 0"
          type="button"
          :class="clearButtonStyles({ dense })"
          :aria-label="t('clear-selection')"
          @click.stop="clearSelection"
        >
          <Icon
            name="x"
            :size="dense ? 'xs' : 'sm'"
          />
        </button>
        <Icon
          name="calendar"
          size="sm"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { tv } from "tailwind-variants";
import { useForwardedAttrs } from "@/composables";
import { useLocale } from "@/composables/useLocale";
import { Icon } from "@/components";

const props = defineProps<{
  mode: "single" | "range";
  selectedDates: string[];
  dense?: boolean;
  invalid?: boolean;
  disabled?: boolean;
  placeholder: string;
  isOpen: boolean;
  id?: string;
  ariaLabel?: string;
  ariaLabelledby?: string;
}>();

const emit = defineEmits<{
  (e: "toggle"): void;
  (e: "keydown", event: KeyboardEvent): void;
  (e: "remove-date", index: number): void;
}>();

const { classAttr, forwardedAttrs } = useForwardedAttrs();

const t = useLocale("datepicker");

function clearSelection(event: Event) {
  event.stopPropagation();
  // We'll emit events for the parent to handle clearing
  if (props.selectedDates.length > 0) {
    // Emit for each selected date to remove them
    for (let i = props.selectedDates.length - 1; i >= 0; i--) {
      emit("remove-date", i);
    }
  }
}

const triggerStyles = tv({
  base: [
    "flex w-full items-center justify-between",
    "rounded-md border transition-colors",
    "focus-within:border-primary-500 focus-within:ring-2 focus-within:ring-primary-500",
    "cursor-pointer",
    "transition-all duration-200 ease-in-out",
  ],
  variants: {
    dense: {
      true: "px-2.5 py-1.5 text-xs",
      false: "px-3 py-2 text-sm",
    },
    invalid: {
      true: "border-red-500 dark:border-red-500",
      false: "border-neutral-300 dark:border-neutral-700",
    },
    disabled: {
      true: [
        "bg-neutral-100 dark:bg-neutral-900",
        "text-neutral-400 dark:text-neutral-500",
        "cursor-not-allowed",
      ],
      false: [
        "bg-white dark:bg-neutral-800",
        "text-neutral-900 dark:text-neutral-100",
        "hover:border-neutral-400 dark:hover:border-neutral-600",
      ],
    },
  },
  compoundVariants: [
    {
      invalid: false,
      disabled: false,
      class: "border-neutral-300 dark:border-neutral-700",
    },
  ],
  defaultVariants: {
    dense: false,
    invalid: false,
    disabled: false,
  },
});

const clearButtonStyles = tv({
  base: [
    "inline-flex cursor-pointer items-center justify-center rounded-full transition-colors",
    "text-neutral-600 hover:bg-neutral-200 focus:ring-2 focus:ring-primary-500 focus:outline-none",
    "dark:text-neutral-400 dark:hover:bg-neutral-700",
  ],
  variants: {
    dense: {
      false: "h-5 w-5 p-0.5",
      true: "h-4 w-4 p-0.5",
    },
  },
  defaultVariants: {
    dense: false,
  },
});
</script>
