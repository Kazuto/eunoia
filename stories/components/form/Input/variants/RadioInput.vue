<template>
  <div v-bind="$attrs" role="radiogroup" class="flex flex-col gap-2">
    <label
      v-for="option in options"
      :key="option.value"
      :class="wrapperStyles({ disabled })"
    >
      <input
        v-model="model"
        type="radio"
        :name="radioName"
        :value="option.value"
        :disabled
        class="sr-only"
      />
      <span
        :class="
          radioStyles({
            dense,
            invalid,
            checked: model === option.value,
          })
        "
      >
        <span
          :class="dotStyles({ dense, visible: model === option.value })"
        />
      </span>
      <span :class="labelStyles({ dense })">{{ option.label }}</span>
    </label>
  </div>
</template>

<script setup lang="ts">
import { tv } from "tailwind-variants";
import { useSanitizedId } from "@/composables/useSanitizedId";

defineOptions({
  inheritAttrs: false,
});

const model = defineModel<string | number>();

const radioName = useSanitizedId("radio");

withDefaults(
  defineProps<{
    options: { label: string; value: string | number }[];
    dense?: boolean;
    invalid?: boolean;
    disabled?: boolean;
  }>(),
  {}
);

const wrapperStyles = tv({
  base: "inline-flex w-fit cursor-pointer items-center gap-2",
  variants: {
    disabled: {
      true: "cursor-not-allowed opacity-50",
    },
  },
});

const radioStyles = tv({
  base: "inline-flex shrink-0 items-center justify-center rounded-full border border-gray-300 bg-white transition-colors",
  variants: {
    dense: {
      false: "h-7 w-7",
      true: "h-5 w-5",
    },
    checked: {
      true: "border-primary bg-primary",
    },
    invalid: {
      true: "border-red-500",
    },
  },
  compoundVariants: [
    { checked: true, invalid: true, class: "border-red-500 bg-red-500" },
  ],
  defaultVariants: {
    dense: false,
  },
});

const dotStyles = tv({
  base: "rounded-full bg-white transition-opacity",
  variants: {
    dense: {
      false: "h-2.5 w-2.5",
      true: "h-1.5 w-1.5",
    },
    visible: {
      true: "opacity-100",
      false: "opacity-0",
    },
  },
  defaultVariants: {
    dense: false,
    visible: false,
  },
});

const labelStyles = tv({
  base: "text-gray-700",
  variants: {
    dense: {
      false: "text-sm",
      true: "text-xs",
    },
  },
  defaultVariants: {
    dense: false,
  },
});
</script>
