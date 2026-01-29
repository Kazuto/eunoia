<template>
  <button
    :class="buttonStyles({ size, class: attrs.class as string })"
    :style="style"
    @click="emit('click', $event)"
    @focus="emit('focus', $event)"
    @blur="emit('blur', $event)"
  >
    <slot />
  </button>
</template>

<script lang="ts" setup>
import { computed, useAttrs } from "vue";
import { tv } from "tailwind-variants";

defineOptions({
  inheritAttrs: false,
});

const attrs = useAttrs();

const buttonStyles = tv({
  base: "inline-block cursor-pointer rounded-xl border-0 font-sans leading-none font-bold",
  variants: {
    size: {
      small: "px-4 py-2.5 text-xs",
      medium: "px-5 py-2.5 text-sm",
      large: "px-6 py-3 text-base",
    },
  },
  defaultVariants: {
    size: "medium",
  },
});

const props = withDefaults(
  defineProps<{
    size?: "small" | "medium" | "large";
  }>(),
  {}
);

const emit = defineEmits<{
  (e: "click", event: MouseEvent): void;
  (e: "focus", event: FocusEvent): void;
  (e: "blur", event: FocusEvent): void;
}>();
</script>
