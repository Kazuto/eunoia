<template>
  <ul
    :id
    v-bind="forwardedAttrs"
    :class="contentStyles({ class: classAttr })"
    :style="positionStyle"
    role="menu"
    :aria-activedescendant="activeDescendantId"
  >
    <slot />
  </ul>
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
  base: [
    "z-50 mt-1.5 scrollbar-subtle min-w-48 overflow-auto rounded-lg border p-1 shadow-lg",
    "border-neutral-300 bg-white",
    "dark:border-neutral-600 dark:bg-neutral-800",
  ],
});

const props = defineProps<{
  id?: string;
  anchorName: string;
  activeDescendantId?: string;
}>();

const positionStyle = computed(
  () =>
    ({
      position: "fixed",
      "position-anchor": props.anchorName,
      "position-area": "bottom",
    }) as Record<string, string>
);
</script>
