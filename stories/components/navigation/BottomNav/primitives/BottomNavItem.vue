<template>
  <component
    :is="tag"
    v-bind="{ ...forwardedAttrs, ...linkAttrs }"
    :class="itemStyles({ active, class: classAttr })"
  >
    <span :class="indicatorStyles({ active, dense })">
      <Icon
        v-if="icon"
        :name="icon"
        :size="dense ? 'sm' : 'md'"
      />
      <span
        v-if="badgeText"
        aria-hidden="true"
        :class="countStyles()"
      >
        {{ badgeText }}
      </span>
      <span
        v-else-if="badge === true"
        aria-hidden="true"
        :class="dotStyles()"
      />
    </span>
    <span class="max-w-full truncate px-1">{{ label }}</span>
    <!-- The space keeps the name "Inbox 3 new" rather than "Inbox3 new". -->
    <template v-if="badgeLabel">
      {{ " " }}<VisuallyHidden>{{ badgeLabel }}</VisuallyHidden>
    </template>
  </component>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { tv } from "tailwind-variants";
import { Icon, VisuallyHidden } from "@/components";
import { useForwardedAttrs, useLinkComponent } from "@/composables";

defineOptions({
  inheritAttrs: false,
});

const { classAttr, forwardedAttrs } = useForwardedAttrs();
const { linkComponent } = useLinkComponent();

const props = defineProps<{
  label: string;
  icon?: string;
  href?: string;
  to?: string;
  active?: boolean;
  /** A count, or `true` for a dot. */
  badge?: number | boolean;
  /** Read out after the label, e.g. "3 new". */
  badgeLabel?: string;
  dense?: boolean;
}>();

// Without a destination the item is a button, like the "More" item.
const tag = computed(() => {
  if (props.to) return linkComponent;
  if (props.href) return "a";

  return "button";
});

const linkAttrs = computed(() => {
  if (props.to) return { to: props.to };
  if (props.href) return { href: props.href };

  return { type: "button" };
});

const badgeText = computed(() => {
  if (typeof props.badge !== "number" || props.badge <= 0) return undefined;

  return props.badge > 99 ? "99+" : String(props.badge);
});

const itemStyles = tv({
  base: [
    "group flex min-w-0 flex-1 cursor-pointer flex-col items-center justify-center gap-1 rounded-[14px] font-sans text-xs font-medium no-underline transition-colors outline-none squircle focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-inset",
    "text-neutral-600 hover:text-neutral-900",
    "dark:text-neutral-400 dark:hover:text-neutral-100",
  ],
  variants: {
    active: {
      true: [
        "font-semibold text-primary-700 hover:text-primary-800",
        "dark:text-primary-200 dark:hover:text-primary-100",
      ],
    },
  },
});

const indicatorStyles = tv({
  base: "relative flex items-center justify-center rounded-full transition-colors",
  variants: {
    active: {
      true: "bg-primary-100 dark:bg-primary-900",
      false: "group-hover:bg-neutral-100 dark:group-hover:bg-neutral-800",
    },
    dense: {
      false: "h-8 w-14",
      true: "h-6 w-11",
    },
  },
  defaultVariants: {
    active: false,
    dense: false,
  },
});

const countStyles = tv({
  base: [
    "absolute -top-1 left-1/2 ml-1 flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[10px] leading-none font-bold ring-2",
    "bg-red-500 text-white ring-white",
    "dark:bg-red-600 dark:ring-neutral-900",
  ],
});

const dotStyles = tv({
  base: [
    "absolute top-0.5 left-1/2 ml-2 size-2 rounded-full ring-2",
    "bg-red-500 ring-white",
    "dark:bg-red-600 dark:ring-neutral-900",
  ],
});
</script>
