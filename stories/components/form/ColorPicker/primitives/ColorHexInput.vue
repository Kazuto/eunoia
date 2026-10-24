<template>
  <input
    v-model="draft"
    type="text"
    v-bind="forwardedAttrs"
    :class="inputStyles({ dense, class: classAttr })"
    :aria-label="label"
    :maxlength="9"
    autocomplete="off"
    spellcheck="false"
    @keydown.enter.prevent="emit('commit', draft)"
    @blur="emit('commit', draft)"
  />
</template>

<script lang="ts" setup>
import { tv } from "tailwind-variants";
import { useForwardedAttrs } from "@/composables";

defineOptions({
  inheritAttrs: false,
});

const { classAttr, forwardedAttrs } = useForwardedAttrs();

defineProps<{
  label: string;
  dense?: boolean;
}>();

const draft = defineModel<string>({ required: true });

const emit = defineEmits<{
  (e: "commit", value: string): void;
}>();

const inputStyles = tv({
  base: [
    "w-full min-w-0 rounded-[10px] border font-mono uppercase squircle",
    "border-neutral-300 bg-white text-neutral-900",
    "dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100",
    "focus:border-primary-500 focus:ring-2 focus:ring-primary-500 focus:outline-none",
  ],
  variants: {
    dense: {
      false: "px-2.5 py-1.5 text-sm",
      true: "px-2 py-1 text-xs",
    },
  },
  defaultVariants: {
    dense: false,
  },
});
</script>
