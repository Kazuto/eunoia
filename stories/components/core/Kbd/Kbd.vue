<template>
  <span
    v-bind="$attrs"
    class="inline-flex items-center gap-0.5"
  >
    <template v-if="labels.length">
      <kbd
        v-for="(label, index) in labels"
        :key="index"
        :class="keyStyles({ dense })"
        >{{ label }}</kbd
      >
    </template>
    <kbd
      v-else
      :class="keyStyles({ dense })"
      ><slot
    /></kbd>
  </span>
</template>

<script lang="ts" setup>
import { computed } from "vue";
import { tv } from "tailwind-variants";
import { shortcutLabels } from "@/composables/useShortcut";

defineOptions({
  inheritAttrs: false,
});

const props = defineProps<{
  /** e.g. "/" or "Mod+K"; "Mod" shows ⌘ on macOS and Ctrl elsewhere. Without it, the slot is shown. */
  shortcut?: string;
  dense?: boolean;
}>();

const labels = computed(() =>
  props.shortcut ? shortcutLabels(props.shortcut) : []
);

const keyStyles = tv({
  base: [
    "inline-flex min-w-[1.5em] items-center justify-center rounded-[8px] border border-b-2 font-sans leading-none squircle",
    "border-neutral-200 bg-neutral-50 text-neutral-500",
    "dark:border-neutral-600 dark:bg-neutral-700 dark:text-neutral-300",
  ],
  variants: {
    dense: {
      false: "px-1.5 py-0.5 text-xs",
      true: "px-1 py-px text-[0.625rem]",
    },
  },
  defaultVariants: {
    dense: false,
  },
});
</script>
