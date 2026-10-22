<template>
  <div
    v-bind="forwardedAttrs"
    :id
    role="tooltip"
    :class="contentStyles({ placement, dense, class: classAttr })"
    :style="positionStyle"
  >
    <slot />
  </div>
</template>

<script lang="ts" setup>
import { computed } from "vue";
import { tv } from "tailwind-variants";
import { useForwardedAttrs } from "@/composables";
import type { TooltipPlacement } from "./placement";

defineOptions({
  inheritAttrs: false,
});

const { classAttr, forwardedAttrs } = useForwardedAttrs();

const contentStyles = tv({
  base: [
    "z-50 w-max rounded-[10px] font-sans font-light shadow-lg squircle",
    "bg-neutral-700 text-white",
    "dark:bg-neutral-100 dark:text-neutral-900",
  ],
  variants: {
    placement: {
      top: "mb-1.5",
      "top-start": "mb-1.5",
      bottom: "mt-1.5",
      "bottom-start": "mt-1.5",
      left: "mr-1.5",
      right: "ml-1.5",
    },
    dense: {
      false: "px-3 py-1.5 text-sm",
      true: "px-2 py-1 text-xs",
    },
  },
  defaultVariants: {
    placement: "top",
    dense: false,
  },
});

const props = defineProps<{
  id?: string;
  anchorName: string;
  placement?: TooltipPlacement;
  dense?: boolean;
}>();

// "-start" placements line up with the anchor's start edge instead of centering
// on it, which suits short anchors near an edge, and flip to the other side
// when there is no room.
const positionAreas: Record<TooltipPlacement, string> = {
  top: "top",
  bottom: "bottom",
  left: "left",
  right: "right",
  "top-start": "top span-right",
  "bottom-start": "bottom span-right",
};

const positionStyle = computed(
  () =>
    ({
      position: "fixed",
      "position-anchor": props.anchorName,
      "position-area": positionAreas[props.placement ?? "top"],
      ...(props.placement?.endsWith("-start") && {
        "position-try-fallbacks": "flip-block",
      }),
    }) as Record<string, string>
);
</script>
