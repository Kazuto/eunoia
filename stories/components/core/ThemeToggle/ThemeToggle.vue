<template>
  <button
    :class="cycleStyles({ dense, class: classAttr })"
    v-bind="forwardedAttrs"
    :aria-label="ariaLabel"
    @click="cycleTheme"
    @keydown.enter="cycleTheme"
    @keydown.space="cycleTheme"
  >
    <component
      :is="icon"
      aria-hidden="true"
      :class="iconStyles({ dense })"
    />
  </button>
</template>

<script setup lang="ts">
import { computed, toRef } from "vue";
import { tv } from "tailwind-variants";
import { useTheme } from "@/composables";
import { useForwardedAttrs, useLocale } from "@/composables";
import * as icons from "vue-icons-plus/pi";

defineOptions({
  inheritAttrs: false,
});

const { classAttr, forwardedAttrs } = useForwardedAttrs();

const props = defineProps<{
  dense?: boolean;
}>();

const { theme, nextTheme, cycleTheme } = useTheme();

const icon = computed(() => {
  if (theme.value === "light") {
    return (icons as Record<string, unknown>)["PiSun"];
  }

  if (theme.value === "dark") {
    return (icons as Record<string, unknown>)["PiMoon"];
  }

  return (icons as Record<string, unknown>)["PiCircle"];
});

const cycleStyles = tv({
  base: "dark:focus-visible:ring-offset-dark inline-flex aspect-square items-center justify-center text-neutral-800 transition-colors outline-none hover:bg-black/10 focus-visible:ring-2 focus-visible:ring-neutral-300 focus-visible:ring-offset-2 focus-visible:ring-offset-white active:bg-neutral-200 dark:text-neutral-200 dark:hover:bg-white/10 dark:active:bg-neutral-700",
  variants: {
    dense: {
      false: "rounded-lg p-2.5 text-sm",
      true: "rounded-md p-1.5 text-xs",
    },
  },
});

const iconStyles = tv({
  base: "inline-block shrink-0",
  variants: {
    dense: {
      true: "h-3 w-3",
      false: "h-4 w-4",
    },
  },
});

const ariaLabel = computed(() => {
  return t(nextTheme.value);
});

const t = useLocale(
  "theme-toggle",
  toRef(() => props.locale)
);
</script>

<style scoped></style>
