<template>
  <div :class="triggerStyles({ dense, invalid, disabled, class: classAttr })">
    <button
      :id
      ref="buttonRef"
      v-bind="forwardedAttrs"
      type="button"
      aria-haspopup="dialog"
      :aria-expanded="isOpen"
      :aria-controls="isOpen ? panelId : undefined"
      :aria-invalid="invalid || undefined"
      :disabled
      :class="buttonStyles({ dense })"
      @click="emit('toggle')"
      @keydown="emit('keydown', $event)"
    >
      <span
        :id="valueId"
        :class="[
          'truncate',
          !displayValue && 'text-neutral-500 dark:text-neutral-400',
        ]"
      >
        {{ displayValue || placeholder }}
      </span>
    </button>
    <button
      v-if="displayValue && !disabled"
      type="button"
      :class="clearButtonStyles({ dense })"
      :aria-label="clearLabel"
      @click="emit('clear')"
    >
      <Icon
        name="x"
        :size="dense ? 'xs' : 'sm'"
        class="text-neutral-700 dark:text-neutral-300"
      />
    </button>
    <Icon
      name="clock"
      size="sm"
      class="shrink-0 text-neutral-700 dark:text-neutral-300"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { tv } from "tailwind-variants";
import { Icon } from "@/components";
import { useForwardedAttrs } from "@/composables";

defineOptions({
  inheritAttrs: false,
});

const { classAttr, forwardedAttrs } = useForwardedAttrs();

defineProps<{
  id?: string;
  valueId?: string;
  displayValue: string;
  placeholder: string;
  dense?: boolean;
  invalid?: boolean;
  disabled?: boolean;
  isOpen: boolean;
  panelId?: string;
  clearLabel: string;
}>();

const emit = defineEmits<{
  (e: "toggle"): void;
  (e: "keydown", event: KeyboardEvent): void;
  (e: "clear"): void;
}>();

const buttonRef = ref<HTMLButtonElement | null>(null);

defineExpose({
  focus: () => buttonRef.value?.focus({ preventScroll: true }),
});

const triggerStyles = tv({
  base: [
    "flex w-full items-center gap-1",
    "rounded-[10px] border transition-all duration-200 ease-in-out squircle",
    "focus-within:border-primary-500 focus-within:ring-2 focus-within:ring-primary-500",
  ],
  variants: {
    dense: {
      true: "pr-2.5",
      false: "pr-3",
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
  defaultVariants: {
    dense: false,
    invalid: false,
    disabled: false,
  },
});

const buttonStyles = tv({
  base: "flex min-w-0 flex-1 cursor-pointer items-center text-left outline-none disabled:cursor-not-allowed",
  variants: {
    dense: {
      true: "py-1.5 pl-2.5 text-xs",
      false: "py-2 pl-3 text-sm",
    },
  },
  defaultVariants: {
    dense: false,
  },
});

const clearButtonStyles = tv({
  base: [
    "inline-flex shrink-0 cursor-pointer items-center justify-center rounded-full transition-colors",
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
