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
  base: "inline-block cursor-pointer border-0 rounded-full font-bold leading-none font-sans",
  variants: {
    intent: {
      primary: "bg-primary text-white",
      secondary:
        "bg-transparent text-gray-800 shadow-[inset_0_0_0_1px_rgba(0,0,0,0.15)]",
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
    /**
     * The label of the button
     */
    label: string;
    /**
     * primary or secondary button
     */
    primary?: boolean;
    /**
     * size of the button
     */
    size?: "small" | "medium" | "large";
    /**
     * background color of the button
     */
    backgroundColor?: string;
  }>(),
  { primary: false },
);

const emit = defineEmits<{
  (e: "click", id: number): void;
}>();

const intent = computed(() => (props.primary ? "primary" : "secondary"));

const style = computed(() => ({
  backgroundColor: props.backgroundColor,
}));

const onClick = () => {
  emit("click", 1);
};
</script>
