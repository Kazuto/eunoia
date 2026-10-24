<template>
  <div
    ref="areaRef"
    role="slider"
    v-bind="forwardedAttrs"
    :tabindex="disabled ? -1 : 0"
    :aria-label="label"
    aria-valuemin="0"
    aria-valuemax="100"
    :aria-valuenow="Math.round(saturation * 100)"
    :aria-valuetext="`${Math.round(saturation * 100)}%, ${Math.round(brightness * 100)}%`"
    :aria-disabled="disabled ? 'true' : undefined"
    :class="areaStyles({ dense, disabled, class: classAttr })"
    :style="{ backgroundColor: `hsl(${hue} 100% 50%)` }"
    @pointerdown="onPointerDown"
    @pointermove="onPointerMove"
    @pointerup="onPointerUp"
    @pointercancel="onPointerUp"
    @keydown="onKeydown"
  >
    <span class="absolute inset-0 bg-linear-to-r from-white to-transparent" />
    <span class="absolute inset-0 bg-linear-to-t from-black to-transparent" />
    <span
      class="pointer-events-none absolute h-4 w-4 -translate-1/2 rounded-full border-2 border-white shadow-md ring-1 ring-black/20"
      :style="{
        left: `${saturation * 100}%`,
        top: `${(1 - brightness) * 100}%`,
        backgroundColor: thumbColor,
      }"
    />
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { tv } from "tailwind-variants";
import { useForwardedAttrs } from "@/composables";

defineOptions({
  inheritAttrs: false,
});

const { classAttr, forwardedAttrs } = useForwardedAttrs();

const props = withDefaults(
  defineProps<{
    label: string;
    hue: number;
    thumbColor?: string;
    dense?: boolean;
    disabled?: boolean;
  }>(),
  {
    thumbColor: undefined,
  }
);

// One slider for two axes: left/right moves saturation, up/down moves brightness.
const saturation = defineModel<number>("saturation", { required: true });
const brightness = defineModel<number>("brightness", { required: true });

const areaRef = ref<HTMLElement | null>(null);
const dragging = ref(false);

const clamp01 = (n: number) => Math.min(1, Math.max(0, n));

function setFromPointer(event: PointerEvent) {
  const rect = areaRef.value?.getBoundingClientRect();
  if (!rect || rect.width === 0 || rect.height === 0) return;
  saturation.value = clamp01((event.clientX - rect.left) / rect.width);
  brightness.value = clamp01(1 - (event.clientY - rect.top) / rect.height);
}

function onPointerDown(event: PointerEvent) {
  if (props.disabled || event.button !== 0) return;
  event.preventDefault();
  areaRef.value?.focus();
  areaRef.value?.setPointerCapture?.(event.pointerId);
  dragging.value = true;
  setFromPointer(event);
}

function onPointerMove(event: PointerEvent) {
  if (dragging.value) setFromPointer(event);
}

function onPointerUp(event: PointerEvent) {
  dragging.value = false;
  areaRef.value?.releasePointerCapture?.(event.pointerId);
}

function onKeydown(event: KeyboardEvent) {
  if (props.disabled) return;
  const step = event.shiftKey ? 0.1 : 0.01;
  switch (event.key) {
    case "ArrowRight":
      saturation.value = clamp01(saturation.value + step);
      break;
    case "ArrowLeft":
      saturation.value = clamp01(saturation.value - step);
      break;
    case "ArrowUp":
      brightness.value = clamp01(brightness.value + step);
      break;
    case "ArrowDown":
      brightness.value = clamp01(brightness.value - step);
      break;
    case "PageUp":
      brightness.value = clamp01(brightness.value + 0.1);
      break;
    case "PageDown":
      brightness.value = clamp01(brightness.value - 0.1);
      break;
    case "Home":
      saturation.value = 0;
      break;
    case "End":
      saturation.value = 1;
      break;
    default:
      return;
  }
  event.preventDefault();
}

const areaStyles = tv({
  base: [
    "relative w-full touch-none overflow-hidden rounded-[10px] outline-none squircle",
    "ring-1 ring-black/10 ring-inset dark:ring-white/15",
    "focus-visible:ring-2 focus-visible:ring-primary-500",
  ],
  variants: {
    dense: {
      false: "h-40",
      true: "h-32",
    },
    disabled: {
      false: "cursor-crosshair",
      true: "cursor-not-allowed opacity-40",
    },
  },
  defaultVariants: {
    dense: false,
    disabled: false,
  },
});
</script>
