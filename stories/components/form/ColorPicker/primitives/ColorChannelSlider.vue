<template>
  <div
    ref="trackRef"
    role="slider"
    v-bind="forwardedAttrs"
    :tabindex="disabled ? -1 : 0"
    :aria-label="label"
    :aria-valuemin="min"
    :aria-valuemax="max"
    :aria-valuenow="Math.round(model)"
    :aria-valuetext="valueText"
    :aria-disabled="disabled ? 'true' : undefined"
    aria-orientation="horizontal"
    :class="trackStyles({ dense, disabled, class: classAttr })"
    :style="{
      background: trackBackground,
      backgroundSize: trackBackgroundSize,
    }"
    @pointerdown="onPointerDown"
    @pointermove="onPointerMove"
    @pointerup="onPointerUp"
    @pointercancel="onPointerUp"
    @keydown="onKeydown"
  >
    <span
      :class="thumbStyles({ dense })"
      :style="{ left: `${percent}%`, backgroundColor: thumbColor }"
    />
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

const props = withDefaults(
  defineProps<{
    label: string;
    min?: number;
    max: number;
    step?: number;
    largeStep?: number;
    valueText?: string;
    trackBackground: string;
    trackBackgroundSize?: string;
    thumbColor?: string;
    dense?: boolean;
    disabled?: boolean;
  }>(),
  {
    min: 0,
    step: 1,
    largeStep: 10,
    valueText: undefined,
    trackBackgroundSize: undefined,
    thumbColor: undefined,
  }
);

const model = defineModel<number>({ required: true });

const trackRef = ref<HTMLElement | null>(null);
const dragging = ref(false);

const percent = computed(
  () => ((model.value - props.min) / (props.max - props.min)) * 100
);

function clamp(value: number) {
  return Math.min(props.max, Math.max(props.min, value));
}

function setFromPointer(event: PointerEvent) {
  const rect = trackRef.value?.getBoundingClientRect();
  if (!rect || rect.width === 0) return;
  const ratio = (event.clientX - rect.left) / rect.width;
  model.value = clamp(props.min + ratio * (props.max - props.min));
}

function onPointerDown(event: PointerEvent) {
  if (props.disabled || event.button !== 0) return;
  event.preventDefault();
  trackRef.value?.focus();
  trackRef.value?.setPointerCapture?.(event.pointerId);
  dragging.value = true;
  setFromPointer(event);
}

function onPointerMove(event: PointerEvent) {
  if (dragging.value) setFromPointer(event);
}

function onPointerUp(event: PointerEvent) {
  dragging.value = false;
  trackRef.value?.releasePointerCapture?.(event.pointerId);
}

function onKeydown(event: KeyboardEvent) {
  if (props.disabled) return;
  const step = event.shiftKey ? props.largeStep : props.step;
  const next: Record<string, number> = {
    ArrowRight: model.value + step,
    ArrowUp: model.value + step,
    ArrowLeft: model.value - step,
    ArrowDown: model.value - step,
    PageUp: model.value + props.largeStep,
    PageDown: model.value - props.largeStep,
    Home: props.min,
    End: props.max,
  };
  if (!(event.key in next)) return;
  event.preventDefault();
  model.value = clamp(next[event.key]);
}

const trackStyles = tv({
  base: [
    "relative w-full touch-none rounded-full outline-none",
    "ring-1 ring-black/10 ring-inset dark:ring-white/15",
    "focus-visible:ring-2 focus-visible:ring-primary-500",
  ],
  variants: {
    dense: {
      false: "h-3",
      true: "h-2.5",
    },
    disabled: {
      false: "cursor-pointer",
      true: "cursor-not-allowed opacity-40",
    },
  },
  defaultVariants: {
    dense: false,
    disabled: false,
  },
});

const thumbStyles = tv({
  base: [
    "pointer-events-none absolute top-1/2 -translate-1/2 rounded-full border-2 border-white shadow-md",
    "ring-1 ring-black/20",
  ],
  variants: {
    dense: {
      false: "h-4 w-4",
      true: "h-3.5 w-3.5",
    },
  },
  defaultVariants: {
    dense: false,
  },
});
</script>
