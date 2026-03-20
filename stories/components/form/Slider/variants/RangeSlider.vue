<template>
  <div
    :class="containerStyles({ dense, disabled, class: classAttr })"
    v-bind="forwardedAttrs"
  >
    <div :class="trackBgStyles({ dense, invalid })" />

    <div
      :class="fillStyles({ dense, disabled, invalid })"
      :style="{ left: `${startPct}%`, width: `${endPct - startPct}%` }"
    />

    <HandleTooltip
      :visible="lowerActive"
      :pct="startPct"
      :value="lowerValue"
      :dense
    />
    <HandleTooltip
      :visible="upperActive"
      :pct="endPct"
      :value="upperValue"
      :dense
    />

    <!-- Lower handle -->
    <SliderInput
      :id="id"
      range
      :aria-label="ariaLabelLower"
      :min="min"
      :max="max"
      :step="step"
      :value="lowerValue"
      :disabled="disabled"
      :list="list"
      :dense
      :style="{ zIndex: lowerZ }"
      @input="onLowerInput"
      @pointerdown="onLowerPointerDown"
      @focus="lowerActive = true"
      @blur="lowerActive = false"
    />

    <!-- Upper handle -->
    <SliderInput
      range
      :aria-label="ariaLabelUpper"
      :min="min"
      :max="max"
      :step="step"
      :value="upperValue"
      :disabled="disabled"
      :list="list"
      :dense
      :style="{ zIndex: upperZ }"
      @input="onUpperInput"
      @pointerdown="onUpperPointerDown"
      @focus="upperActive = true"
      @blur="upperActive = false"
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

const model = defineModel<[number, number]>();

const props = withDefaults(
  defineProps<{
    id?: string;
    ariaLabelLower?: string;
    ariaLabelUpper?: string;
    dense?: boolean;
    disabled?: boolean;
    invalid?: boolean;
    min?: number;
    max?: number;
    step?: number;
    list?: string;
  }>(),
  {
    id: undefined,
    ariaLabelLower: undefined,
    ariaLabelUpper: undefined,
    dense: false,
    disabled: false,
    invalid: false,
    min: 0,
    max: 100,
    step: 1,
    list: undefined,
  }
);

const lowerActive = ref(false);
const upperActive = ref(false);

function onLowerPointerDown() {
  if (props.disabled) return;
  lowerActive.value = true;
  window.addEventListener(
    "pointerup",
    () => {
      lowerActive.value = false;
    },
    { once: true }
  );
}

function onUpperPointerDown() {
  if (props.disabled) return;
  upperActive.value = true;
  window.addEventListener(
    "pointerup",
    () => {
      upperActive.value = false;
    },
    { once: true }
  );
}

const lowerValue = computed(() => model.value?.[0] ?? props.min);
const upperValue = computed(() => model.value?.[1] ?? props.max);

const totalRange = computed(() => props.max - props.min);

const startPct = computed(() =>
  totalRange.value > 0
    ? ((lowerValue.value - props.min) / totalRange.value) * 100
    : 0
);

const endPct = computed(() =>
  totalRange.value > 0
    ? ((upperValue.value - props.min) / totalRange.value) * 100
    : 100
);

const lowerZ = computed(() => (lowerValue.value === props.max ? 5 : 3));
const upperZ = computed(() => 4);

function onLowerInput(e: Event) {
  const raw = Number((e.target as HTMLInputElement).value);
  model.value = [Math.min(raw, upperValue.value), upperValue.value];
}

function onUpperInput(e: Event) {
  const raw = Number((e.target as HTMLInputElement).value);
  model.value = [lowerValue.value, Math.max(raw, lowerValue.value)];
}

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
    "pointer-events-none absolute top-1/2 -translate-y-1/2 rounded-full",
    "bg-primary-500",
  ],
  variants: {
    dense: { true: "h-1", false: "h-1.5" },
    disabled: { true: ["bg-neutral-400", "dark:bg-neutral-500"], false: "" },
    invalid: { true: "bg-red-500", false: "" },
  },
});
</script>
