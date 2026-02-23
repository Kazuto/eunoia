<template>
  <Transition
    enter-from-class="opacity-0 scale-90"
    enter-active-class="transition-[opacity,scale] duration-150 origin-bottom"
    leave-active-class="transition-[opacity,scale] duration-100 origin-bottom"
    leave-to-class="opacity-0 scale-90"
  >
    <div
      v-if="visible"
      class="pointer-events-none absolute z-10 -translate-x-1/2 whitespace-nowrap"
      :style="tooltipStyle"
    >
      <div :class="bubbleStyles({ dense })">
        {{ value }}
      </div>
      <!-- Downward arrow pointing at the handle -->
      <div
        class="absolute top-full left-1/2 size-0 -translate-x-1/2 border-x-4 border-t-4 border-x-transparent border-t-neutral-800 dark:border-t-neutral-100"
      />
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { tv } from "tailwind-variants";

const props = defineProps<{
  dense?: boolean;
  visible: boolean;
  /** 0–100 percentage of the handle position within the track. */
  pct: number;
  value: number | string;
}>();

// Thumb diameter matches the inputStyles in each variant:
// normal = h-5 w-5 = 20px, dense = h-3.5 w-3.5 = 14px
const tooltipStyle = computed(() => {
  const diameter = props.dense ? 14 : 20;
  const radius = diameter / 2;
  // Mirrors the browser's native thumb centering:
  // thumbCenter = r + pct/100 * (trackWidth - d)
  return {
    left: `calc(${radius}px + ${props.pct / 100} * (100% - ${diameter}px))`,
    // Position above the thumb: track center (50%) + thumb radius + gap
    bottom: `calc(50% + ${radius}px + 4px)`,
  };
});

const bubbleStyles = tv({
  base: [
    "rounded px-1.5 font-medium tabular-nums",
    "bg-neutral-800 text-white",
    "dark:bg-neutral-100 dark:text-neutral-900",
  ],
  variants: {
    dense: {
      true: "text-2xs py-px",
      false: "py-0.5 text-xs",
    },
  },
});
</script>
