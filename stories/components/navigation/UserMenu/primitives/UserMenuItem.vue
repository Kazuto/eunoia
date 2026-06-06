<template>
  <li
    :id
    v-bind="forwardedAttrs"
    :class="
      itemStyles({
        active: isActive,
        variant,
        disabled,
        dense,
        class: classAttr,
      })
    "
    role="menuitem"
    :aria-disabled="disabled || undefined"
    @click="handleClick"
    @mouseenter="emit('mouseenter')"
    @mousedown.prevent
  >
    <Icon
      v-if="icon"
      :name="icon"
      size="sm"
      class="shrink-0"
    />
    <component
      :is="props.href ? Link : 'span'"
      v-bind="props.href ? { href: props.href } : {}"
      class="flex-1"
    >
      {{ label }}
    </component>
  </li>
</template>

<script lang="ts" setup>
import { tv } from "tailwind-variants";
import { Icon, Link } from "@/components";
import { useForwardedAttrs } from "@/composables";

defineOptions({
  inheritAttrs: false,
});

const { classAttr, forwardedAttrs } = useForwardedAttrs();

const itemStyles = tv({
  base: [
    "flex cursor-pointer items-center gap-2 rounded-md",
    "text-neutral-900",
    "dark:text-neutral-100",
  ],
  variants: {
    dense: {
      false: "px-3 py-2.5 text-sm",
      true: "px-2.5 py-2 text-xs",
    },
    active: {
      true: ["bg-neutral-200", "dark:bg-neutral-700"],
    },
    variant: {
      default: "",
      danger: ["text-red-600", "dark:text-red-400"],
    },
    disabled: {
      true: "pointer-events-none cursor-not-allowed opacity-50",
    },
  },
  compoundVariants: [
    {
      active: true,
      variant: "danger",
      class: "bg-red-200 dark:bg-red-950",
    },
  ],
  defaultVariants: {
    dense: false,
    variant: "default",
  },
});

export type UserMenuItem = {
  id?: string;
  label: string;
  href?: string;
  icon?: string;
  dense?: boolean;
  disabled?: boolean;
  isActive?: boolean;
  variant?: "default" | "danger";
};

const props = defineProps<UserMenuItem>();

const emit = defineEmits<{
  (e: "select", label: string): void;
  (e: "mouseenter"): void;
}>();

function handleClick() {
  if (!props.disabled) {
    emit("select", props.label);
  }
}
</script>
