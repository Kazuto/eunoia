<template>
  <component
    :is="element"
    v-bind="elementAttrs"
    :class="
      buttonStyles({
        dense,
        icon: hasIcon,
        iconOnly: isIconOnly,
        class: classAttr,
      })
    "
    @click="onClick"
    @focus="emit('focus', $event)"
    @blur="emit('blur', $event)"
  >
    <Icon
      v-if="icon"
      :name="icon"
      :size="dense ? 'xs' : 'sm'"
    />
    <slot />
  </component>
</template>

<script lang="ts" setup>
import { computed } from "vue";
import { tv } from "tailwind-variants";
import { Icon } from "@/components";
import { useSlotContent, useForwardedAttrs } from "@/composables";
import type { ButtonLinkOptions } from "./linkOptions";

defineOptions({
  inheritAttrs: false,
});

const { classAttr, forwardedAttrs } = useForwardedAttrs();

const props = withDefaults(
  defineProps<ButtonLinkOptions & { dense?: boolean; icon?: string }>(),
  {
    icon: undefined,
    href: undefined,
    target: undefined,
    rel: undefined,
    as: undefined,
  }
);

const { hasSlotContent } = useSlotContent();
const hasDefaultSlot = hasSlotContent("default");
const hasIcon = computed(() => !!props.icon);
const isIconOnly = computed(() => hasIcon.value && !hasDefaultSlot.value);

const isLink = computed(() => !!props.as || !!props.href);
const isDisabled = computed(() => {
  const disabled = forwardedAttrs.value.disabled;

  return disabled !== undefined && disabled !== false;
});

// Links cannot be disabled natively, so a disabled one becomes a plain anchor
// without a destination; a router link would still navigate.
const element = computed(() => {
  if (!isLink.value) return "button";
  if (isDisabled.value) return "a";

  return props.as ?? "a";
});

const elementAttrs = computed(() => {
  if (!isLink.value) return forwardedAttrs.value;

  const { disabled: _disabled, ...attrs } = forwardedAttrs.value;

  if (isDisabled.value) {
    const { to: _to, ...rest } = attrs;

    return {
      ...rest,
      role: "link",
      "aria-disabled": "true",
      tabindex: -1,
    };
  }

  // Only set what was given: an undefined attribute would still override the href
  // that a link component such as a router link renders itself.
  const rel =
    props.rel ??
    (props.target === "_blank" ? "noopener noreferrer" : undefined);

  return {
    ...attrs,
    ...(props.href !== undefined && { href: props.href }),
    ...(props.target !== undefined && { target: props.target }),
    ...(rel !== undefined && { rel }),
  };
});

const buttonStyles = tv({
  base: [
    "inline-flex cursor-pointer items-center gap-1.5 rounded-[14px] border-0 font-sans leading-none font-medium no-underline transition-colors outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50",
    "focus-visible:ring-offset-white",
    "dark:focus-visible:ring-offset-neutral-900",
  ],
  variants: {
    dense: {
      false: "px-3 py-2.25 text-sm",
      true: "px-2.5 py-2 text-xs",
    },
    icon: {
      true: "",
    },
    iconOnly: {
      true: "aspect-square justify-center rounded-[100%] superellipse",
      false: "squircle",
    },
  },
  compoundVariants: [
    { dense: true, icon: true, class: "py-1.75" },
    { dense: false, icon: true, class: "px-2.75" },
  ],
  defaultVariants: {
    dense: false,
    icon: false,
    iconOnly: false,
  },
});

const emit = defineEmits<{
  (e: "click", event: MouseEvent): void;
  (e: "focus", event: FocusEvent): void;
  (e: "blur", event: FocusEvent): void;
}>();

function onClick(event: MouseEvent) {
  if (isLink.value && isDisabled.value) {
    event.preventDefault();
    return;
  }
  emit("click", event);
}
</script>
