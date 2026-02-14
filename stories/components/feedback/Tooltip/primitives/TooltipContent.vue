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

defineOptions({
  inheritAttrs: false,
});

const { classAttr, forwardedAttrs } = useForwardedAttrs();

const contentStyles = tv({
  base: "z-50 w-max max-w-xs rounded-md bg-gray-900 font-sans text-white shadow-lg",
  variants: {
    placement: {
      top: "mb-1.5",
      bottom: "mt-1.5",
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
  placement?: "top" | "bottom" | "left" | "right";
  dense?: boolean;
}>();

const positionStyle = computed(
  () =>
    ({
      position: "fixed",
      "position-anchor": props.anchorName,
      "position-area": props.placement ?? "top",
    }) as Record<string, string>
);
</script>
