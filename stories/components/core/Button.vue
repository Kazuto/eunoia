<template>
  <button
    type="button"
    :class="buttonStyles({ intent, size })"
    @click="onClick"
    :style="style"
  >
    {{ label }}
  </button>
</template>

<script lang="ts" setup>
import { computed } from "vue";
import { tv } from "tailwind-variants";

const buttonStyles = tv({
  base: "inline-block cursor-pointer rounded-xl border-0 font-sans leading-none font-bold",
  variants: {
    intent: {
      primary: "bg-primary text-white",
      secondary:
        "bg-transparent text-gray-800 shadow-[inset_0_0_0_1px_rgba(0,0,0,0.15)]",
      ghost:
        "bg-transparent text-gray-800 hover:bg-gray-100 active:bg-gray-200",
    },
    size: {
      small: "px-4 py-2.5 text-xs",
      medium: "px-5 py-2.5 text-sm",
      large: "px-6 py-3 text-base",
    },
  },
  defaultVariants: {
    intent: "secondary",
    size: "medium",
  },
});

const props = withDefaults(
  defineProps<{
    label: string;
    primary?: boolean;
    ghost?: boolean;
    size?: "small" | "medium" | "large";
    backgroundColor?: string;
  }>(),
  { primary: false, ghost: false }
);

const emit = defineEmits<{
  (e: "click", id: number): void;
}>();

const intent = computed(() => {
  if (props.ghost) return "ghost";
  if (props.primary) return "primary";
  return "secondary";
});

const style = computed(() => ({
  backgroundColor: props.backgroundColor,
}));

const onClick = () => {
  emit("click", 1);
};
</script>
