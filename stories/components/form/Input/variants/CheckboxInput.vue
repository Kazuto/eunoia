<template>
  <Label :class="wrapperStyles({ disabled })" :dense>
    <input
      ref="inputRef"
      v-bind="$attrs"
      v-model="model"
      type="checkbox"
      :disabled
      class="sr-only"
    />
    <span :class="boxStyles({ dense, invalid, checked: model, indeterminate })">
      <PiCheck v-if="model && !indeterminate" :class="iconStyles({ dense })" />
      <PiMinus v-else-if="indeterminate" :class="iconStyles({ dense })" />
    </span>
    <slot />
  </Label>
</template>

<script setup lang="ts">
import { ref, toRef, watchEffect } from "vue";
import { tv } from "tailwind-variants";
import { PiCheck, PiMinus } from "vue-icons-plus/pi";
import Label from "../primitives/Label.vue";

defineOptions({
  inheritAttrs: false,
});

const inputRef = ref<HTMLInputElement | null>(null);
const model = defineModel<boolean>();

const props = withDefaults(
  defineProps<{
    dense?: boolean;
    invalid?: boolean;
    disabled?: boolean;
    indeterminate?: boolean;
  }>(),
  {}
);

const indeterminate = toRef(props, "indeterminate");

watchEffect(() => {
  if (inputRef.value) {
    inputRef.value.indeterminate = !!indeterminate.value;
  }
});

const wrapperStyles = tv({
  base: "inline-flex w-fit cursor-pointer items-center gap-2",
  variants: {
    disabled: {
      true: "cursor-not-allowed opacity-50",
    },
  },
});

const boxStyles = tv({
  base: "inline-flex shrink-0 items-center justify-center rounded border border-gray-300 bg-white transition-colors",
  variants: {
    dense: {
      false: "h-5 w-5",
      true: "h-4 w-4",
    },
    checked: {
      true: "border-primary bg-primary",
    },
    indeterminate: {
      true: "border-primary bg-primary",
    },
    invalid: {
      true: "border-red-500",
    },
  },
  compoundVariants: [
    { checked: true, invalid: true, class: "border-red-500 bg-red-500" },
    { indeterminate: true, invalid: true, class: "border-red-500 bg-red-500" },
  ],
  defaultVariants: {
    dense: false,
  },
});

const iconStyles = tv({
  base: "text-white",
  variants: {
    dense: {
      false: "h-3.5 w-3.5",
      true: "h-3 w-3",
    },
  },
  defaultVariants: {
    dense: false,
  },
});
</script>
