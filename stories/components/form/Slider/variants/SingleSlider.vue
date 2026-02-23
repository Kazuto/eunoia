<template>
  <div
    :class="containerStyles({ dense, disabled, class: classAttr })"
    v-bind="forwardedAttrs"
  >
    <div :class="trackBgStyles({ dense, invalid })" />

    <div
      :class="fillStyles({ dense, disabled, invalid })"
      :style="{ width: `${fillPct}%` }"
    />

    <HandleTooltip
      :visible="isActive"
      :pct="fillPct"
      :value="model ?? (min + max) / 2"
      :dense
    />

    <SliderInput
      :id="id"
      :value="model"
      :min="min"
      :max="max"
      :step="step"
      :disabled="disabled"
      :dense
      @input="model = Number(($event.target as HTMLInputElement).value)"
      @pointerdown="onPointerDown"
      @focus="isActive = true"
      @blur="isActive = false"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { tv } from "tailwind-variants";
import { useForwardedAttrs } from "@/composables";
import HandleTooltip from "../primitives/HandleTooltip.vue";
import SliderInput from "../primitives/SliderInput.vue";

defineOptions({ inheritAttrs: false });

const { classAttr, forwardedAttrs } = useForwardedAttrs();

const model = defineModel<number>();

const props = withDefaults(
  defineProps<{
    id?: string;
    dense?: boolean;
    disabled?: boolean;
    invalid?: boolean;
    min?: number;
    max?: number;
    step?: number;
  }>(),
  {
    id: undefined,
    dense: false,
    disabled: false,
    invalid: false,
    min: 0,
    max: 100,
    step: 1,
  }
);

const isActive = ref(false);

function onPointerDown() {
  if (props.disabled) return;
  isActive.value = true;
  window.addEventListener(
    "pointerup",
    () => {
      isActive.value = false;
    },
    { once: true }
  );
}

const fillPct = computed(() => {
  // Browser default for an uncontrolled range is the midpoint, so match that.
  const val = model.value ?? (props.min + props.max) / 2;
  const range = props.max - props.min;
  return range > 0 ? ((val - props.min) / range) * 100 : 0;
});

const containerStyles = tv({
  base: "relative flex w-full items-center select-none",
  variants: {
    dense: { true: "h-5", false: "h-6" },
    disabled: { true: "opacity-50", false: "" },
  },
});

const trackBgStyles = tv({
  base: [
    "pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2 rounded-full",
    "bg-neutral-200",
    "dark:bg-neutral-700",
  ],
  variants: {
    dense: { true: "h-1", false: "h-1.5" },
    invalid: { true: ["bg-red-100", "dark:bg-red-900"], false: "" },
  },
});

const fillStyles = tv({
  base: [
    "pointer-events-none absolute top-1/2 left-0 -translate-y-1/2 rounded-full",
    "bg-primary-500",
  ],
  variants: {
    dense: { true: "h-1", false: "h-1.5" },
    disabled: { true: ["bg-neutral-400", "dark:bg-neutral-500"], false: "" },
    invalid: { true: "bg-red-500", false: "" },
  },
});
</script>
