<template>
  <div
    :class="
      wrapperStyles({
        dense,
        invalid,
        disabled,
        open: isOpen,
        class: classAttr,
      })
    "
  >
    <input
      :id
      ref="inputRef"
      v-bind="forwardedAttrs"
      type="text"
      role="combobox"
      autocomplete="off"
      aria-autocomplete="list"
      :aria-expanded="isOpen"
      :aria-controls="isOpen ? listboxId : undefined"
      :aria-activedescendant="activeDescendantId"
      :aria-invalid="invalid || undefined"
      :disabled
      :placeholder
      :value="query"
      :class="inputStyles({ dense })"
      @input="onInput"
      @click="emit('open')"
      @keydown="emit('keydown', $event)"
      @blur="emit('blur', $event)"
    />
    <button
      v-if="clearable && !disabled"
      type="button"
      :class="clearButtonStyles({ dense })"
      :aria-label="clearLabel"
      @mousedown.prevent
      @click="emit('clear')"
    >
      <Icon
        name="x"
        :size="dense ? 'xs' : 'sm'"
      />
    </button>
    <span
      class="flex shrink-0 cursor-pointer items-center pr-3"
      aria-hidden="true"
      @mousedown.prevent
      @click="!disabled && emit('toggle')"
    >
      <Icon
        name="caret-down"
        size="sm"
        :class="[
          'text-neutral-700 transition-transform dark:text-neutral-300',
          isOpen && 'rotate-180',
        ]"
      />
    </span>
  </div>
</template>

<script lang="ts" setup>
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
  query: string;
  dense?: boolean;
  invalid?: boolean;
  disabled?: boolean;
  placeholder?: string;
  isOpen?: boolean;
  clearable?: boolean;
  clearLabel?: string;
  listboxId?: string;
  activeDescendantId?: string;
}>();

const emit = defineEmits<{
  (e: "update:query", value: string): void;
  (e: "open"): void;
  (e: "toggle"): void;
  (e: "clear"): void;
  (e: "keydown", event: KeyboardEvent): void;
  (e: "blur", event: FocusEvent): void;
}>();

const inputRef = ref<HTMLInputElement | null>(null);

function onInput(event: Event) {
  emit("update:query", (event.target as HTMLInputElement).value);
}

defineExpose({
  focus: () => inputRef.value?.focus({ preventScroll: true }),
  inputElement: inputRef,
});

const wrapperStyles = tv({
  base: [
    "inline-flex w-full items-center rounded-[14px] border font-sans transition-colors squircle hover:bg-neutral-50/25",
    "border-neutral-300 focus-within:border-primary-500",
    "dark:border-neutral-700 dark:focus-within:border-primary-500 dark:hover:bg-black/15",
  ],
  variants: {
    dense: {
      false: "min-h-[38px]",
      true: "min-h-[32px]",
    },
    invalid: {
      true: "border-red-500 bg-red-50 text-red-900 focus-within:border-red-400 dark:focus-within:border-red-500",
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

const inputStyles = tv({
  base: [
    "min-w-0 flex-1 bg-transparent outline-none",
    "placeholder:text-neutral-400 dark:text-neutral-100 dark:placeholder:text-neutral-500",
  ],
  variants: {
    dense: {
      false: "py-1.5 pl-3 text-sm",
      true: "py-1.5 pl-2.5 text-xs",
    },
  },
  defaultVariants: {
    dense: false,
  },
});

const clearButtonStyles = tv({
  base: [
    "mx-1 inline-flex shrink-0 cursor-pointer items-center justify-center rounded-full transition-colors",
    "text-neutral-600 hover:bg-neutral-200 focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:outline-none",
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
