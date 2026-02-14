<template>
  <component
    :is="resolvedIcon"
    v-if="resolvedIcon"
    v-bind="forwardedAttrs"
    :class="iconStyles({ size, class: classAttr })"
    aria-hidden="true"
  />
</template>

<script lang="ts" setup>
import { computed } from "vue";
import { tv } from "tailwind-variants";
import { useForwardedAttrs } from "@/composables";
import * as icons from "vue-icons-plus/pi";

defineOptions({
  inheritAttrs: false,
});

const { classAttr, forwardedAttrs } = useForwardedAttrs();

const iconStyles = tv({
  base: "inline-block shrink-0",
  variants: {
    size: {
      xs: "h-3 w-3",
      sm: "h-4 w-4",
      md: "h-5 w-5",
      lg: "h-6 w-6",
      xl: "h-8 w-8",
    },
  },
  defaultVariants: {
    size: "md",
  },
});

function toPascalCase(str: string): string {
  return str
    .split("-")
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join("");
}

const props = defineProps<{
  name: string;
  type?: "thin" | "light" | "regular" | "bold" | "fill" | "duotone";
  size?: "xs" | "sm" | "md" | "lg" | "xl";
}>();

const resolvedIcon = computed(() => {
  const pascalName = toPascalCase(props.name);
  const suffix =
    !props.type || props.type === "regular" ? "" : toPascalCase(props.type);
  const key = `Pi${pascalName}${suffix}`;
  return (icons as Record<string, unknown>)[key];
});
</script>
