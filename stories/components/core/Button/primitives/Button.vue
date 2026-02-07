<template>
  <button
    :class="buttonStyles({ dense, class: attrs.class as string })"
    :style="style"
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

const buttonStyles = tv({
  base: "inline-block cursor-pointer rounded-lg border-0 font-sans leading-none font-bold",
  variants: {
    dense: {
      false: "px-5 py-2.5 text-sm",
      true: "px-4 py-2.5 text-xs",
    },
  },
  defaultVariants: {
    dense: false,
  },
});

withDefaults(
  defineProps<{
    dense?: boolean;
  }>(),
  {}
);

const emit = defineEmits<{
  (e: "click", event: MouseEvent): void;
  (e: "focus", event: FocusEvent): void;
  (e: "blur", event: FocusEvent): void;
}>();
</script>
