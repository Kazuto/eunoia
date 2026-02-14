<template>
  <div
    v-bind="forwardedAttrs"
    :class="groupStyles({ dense, disabled, class: classAttr })"
    role="radiogroup"
  >
    <div
      v-if="selectedIndex >= 0"
      :class="indicatorStyles({ dense, focused: isFocused })"
      :style="indicatorStyle"
    />
    <label
      v-for="option in options"
      :key="option.value"
      :class="
        optionStyles({ dense, selected: model === option.value, disabled })
      "
    >
      <input
        v-model="model"
        type="radio"
        :name="name"
        :value="option.value"
        :disabled
        class="sr-only"
        @focus="isFocused = true"
        @blur="isFocused = false"
      />
      {{ option.label }}
    </label>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref } from "vue";
import { tv } from "tailwind-variants";
import { useForwardedAttrs } from "@/composables";

defineOptions({
  inheritAttrs: false,
});

const { classAttr, forwardedAttrs } = useForwardedAttrs();

const props = defineProps<{
  options: { label: string; value: string | number }[];
  name: string;
  dense?: boolean;
  disabled?: boolean;
}>();

const model = defineModel<string | number>();
const isFocused = ref(false);

const selectedIndex = computed(() =>
  props.options.findIndex((opt) => opt.value === model.value)
);

const indicatorStyle = computed(() => {
  const count = props.options.length;
  const i = selectedIndex.value;
  return {
    width: `calc((100% - 0.5rem) / ${count})`,
    left: `calc(0.25rem + ${i} * (100% - 0.5rem) / ${count})`,
  };
});

const groupStyles = tv({
  base: "relative inline-flex w-full rounded-lg bg-neutral-100 p-1",
  variants: {
    dense: {
      false: "",
      true: "",
    },
    disabled: {
      true: "pointer-events-none opacity-50",
    },
  },
});

const indicatorStyles = tv({
  base: "absolute top-1 bottom-1 rounded-md bg-white shadow transition-[left] duration-200 ease-out",
  variants: {
    dense: {
      false: "",
      true: "",
    },
    focused: {
      true: "ring-2 ring-neutral-300 ring-offset-2",
    },
  },
});

const optionStyles = tv({
  base: "relative z-10 flex-1 cursor-pointer text-center font-sans font-medium text-neutral-500 transition-colors duration-200 select-none",
  variants: {
    dense: {
      false: "px-4 py-2 text-sm",
      true: "px-3 py-1.5 text-xs",
    },
    selected: {
      true: "text-neutral-900",
    },
    disabled: {
      true: "cursor-not-allowed",
    },
  },
  defaultVariants: {
    dense: false,
  },
});
</script>
