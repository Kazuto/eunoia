<template>
  <button
    :class="chipStyles({ variant, dense, class: attrs.class as string })"
    @click="emit('click', $event)"
    @focus="emit('focus', $event)"
    @blur="emit('blur', $event)"
  >
    <slot />
  </button>
</template>

<script lang="ts" setup>
import { useAttrs } from "vue";
import { tv } from "tailwind-variants";

defineOptions({
  inheritAttrs: false,
});

const attrs = useAttrs();

const chipStyles = tv({
  base: "inline-flex cursor-pointer items-center rounded-full border-0 font-sans font-bold leading-none outline-none focus-visible:ring-2 focus-visible:ring-offset-1",
  variants: {
    variant: {
      primary: "bg-primary text-white focus-visible:ring-primary",
      secondary: "bg-gray-100 text-gray-800 focus-visible:ring-gray-400",
      success: "bg-green-100 text-green-800 focus-visible:ring-green-400",
      warning: "bg-yellow-100 text-yellow-800 focus-visible:ring-yellow-400",
      danger: "bg-red-100 text-red-800 focus-visible:ring-red-400",
    },
    dense: {
      false: "px-3 py-1.5 text-xs",
      true: "px-2.5 py-1 text-[10px]",
    },
  },
  defaultVariants: {
    variant: "primary",
    dense: false,
  },
});

withDefaults(
  defineProps<{
    variant?: "primary" | "secondary" | "success" | "warning" | "danger";
    dense?: boolean;
  }>(),
  {},
);

const emit = defineEmits<{
  (e: "click", event: MouseEvent): void;
  (e: "focus", event: FocusEvent): void;
  (e: "blur", event: FocusEvent): void;
}>();
</script>
