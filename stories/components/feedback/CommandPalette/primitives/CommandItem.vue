<template>
  <div
    :id
    v-bind="forwardedAttrs"
    role="option"
    :aria-selected="active"
    :aria-disabled="disabled || undefined"
    :class="itemStyles({ dense, active, disabled, class: classAttr })"
    @click="!disabled && emit('select')"
    @mousemove="emit('hover')"
    @mousedown.prevent
  >
    <Icon
      v-if="icon"
      :name="icon"
      :size="dense ? 'sm' : 'md'"
      class="text-neutral-500 dark:text-neutral-400"
    />
    <span class="flex-1 truncate">{{ label }}</span>
    <Kbd
      v-if="shortcut"
      :shortcut
      dense
    />
  </div>
</template>

<script lang="ts" setup>
import { tv } from "tailwind-variants";
import { useForwardedAttrs } from "@/composables";
import { Icon, Kbd } from "@/components";

defineOptions({
  inheritAttrs: false,
});

const { classAttr, forwardedAttrs } = useForwardedAttrs();

withDefaults(
  defineProps<{
    id?: string;
    label: string;
    icon?: string;
    shortcut?: string;
    active?: boolean;
    disabled?: boolean;
    dense?: boolean;
  }>(),
  {
    id: undefined,
    icon: undefined,
    shortcut: undefined,
  }
);

const emit = defineEmits<{
  (e: "select"): void;
  (e: "hover"): void;
}>();

const itemStyles = tv({
  base: [
    "flex cursor-pointer items-center gap-2 rounded-[10px] squircle",
    "text-neutral-900",
    "dark:text-neutral-100",
  ],
  variants: {
    dense: {
      false: "px-3 py-2.25 text-sm",
      true: "px-2.5 py-2 text-xs",
    },
    active: {
      true: ["bg-neutral-200", "dark:bg-neutral-700"],
    },
    disabled: {
      true: "cursor-not-allowed opacity-50",
    },
  },
  defaultVariants: {
    dense: false,
  },
});
</script>
