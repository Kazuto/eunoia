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
      :is="linkTag"
      v-bind="linkAttrs"
      class="flex-1"
    >
      {{ label }}
    </component>
  </li>
</template>

<script lang="ts" setup>
import { computed } from "vue";
import { tv } from "tailwind-variants";
import { Icon } from "@/components";
import { useForwardedAttrs, useNuxtLink } from "@/composables";

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

const { hasNuxtLink } = useNuxtLink();

const linkTag = computed(() => {
  if (!props.href) return "span";
  if (hasNuxtLink.value) return "NuxtLink";

  return "a";
});

const linkAttrs = computed(() => {
  if (!props.href) return {};
  if (hasNuxtLink.value) return { to: props.href };

  return { href: props.href };
});

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
