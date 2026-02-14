<template>
  <div
    v-bind="forwardedAttrs"
    :class="skeletonStyles({ variant, rounded, class: classAttr })"
    :style="dimensionStyles"
    aria-hidden="true"
  />
</template>

<script lang="ts" setup>
import { computed } from "vue";
import { tv } from "tailwind-variants";
import { useForwardedAttrs } from "@/composables";

defineOptions({
  inheritAttrs: false,
});

const { classAttr, forwardedAttrs } = useForwardedAttrs();

const skeletonStyles = tv({
  base: "animate-pulse bg-neutral-200",
  variants: {
    variant: {
      text: "rounded",
      circular: "rounded-full",
      rectangular: "rounded-none",
    },
    rounded: {
      true: "rounded-lg",
    },
  },
  defaultVariants: {
    variant: "text",
  },
});

const props = withDefaults(
  defineProps<{
    variant?: "text" | "circular" | "rectangular";
    rounded?: boolean;
    width?: string | number;
    height?: string | number;
  }>(),
  {
    variant: "text",
    width: undefined,
    height: undefined,
  }
);

const dimensionStyles = computed(() => {
  const style: Record<string, string> = {};
  if (props.width) {
    style.width =
      typeof props.width === "number" ? `${props.width}px` : props.width;
  }
  if (props.height) {
    style.height =
      typeof props.height === "number" ? `${props.height}px` : props.height;
  }
  if (props.variant === "text" && !props.height) {
    style.height = "1em";
  }
  if (props.variant === "circular") {
    const size = style.width || style.height || "40px";
    style.width = size;
    style.height = size;
  }
  if (!props.width && props.variant !== "circular") {
    style.width = "100%";
  }
  return style;
});
</script>
