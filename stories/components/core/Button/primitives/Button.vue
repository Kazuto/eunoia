<template>
  <button
    v-bind="forwardedAttrs"
    :class="
      buttonStyles({
        dense,
        icon: hasIcon,
        iconOnly: isIconOnly,
        class: classAttr,
      })
    "
    @click="emit('click', $event)"
    @focus="emit('focus', $event)"
    @blur="emit('blur', $event)"
  >
    <Icon
      v-if="icon"
      :name="icon"
      :size="dense ? 'md' : 'sm'"
    />
    <slot />
  </button>
</template>

<script lang="ts" setup>
import { computed } from "vue";
import { tv } from "tailwind-variants";
import { Icon } from "@/components";
import { useSlotContent, useForwardedAttrs } from "@/composables";

defineOptions({
  inheritAttrs: false,
});

const { classAttr, forwardedAttrs } = useForwardedAttrs();

const props = withDefaults(
  defineProps<{
    dense?: boolean;
    icon?: string;
  }>(),
  {
    icon: undefined,
  }
);

const { hasSlotContent } = useSlotContent();
const hasDefaultSlot = hasSlotContent("default");
const hasIcon = computed(() => !!props.icon);
const isIconOnly = computed(() => hasIcon.value && !hasDefaultSlot.value);

const buttonStyles = tv({
  base: [
    "inline-flex cursor-pointer items-center gap-1.5 rounded-lg border-0 font-sans leading-none font-medium transition-colors outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
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
      true: "aspect-square justify-center",
    },
  },
  compoundVariants: [
    { dense: true, icon: true, class: "px-3 py-2.5" },
    { dense: false, icon: true, class: "px-2.5 py-2" },
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
</script>
