<template>
  <button
    v-bind="forwardedAttrs"
    :class="triggerStyles({ open: isOpen, hasName: !!name, class: classAttr })"
    type="button"
    :aria-haspopup="true"
    :aria-expanded="isOpen"
    :aria-controls="menuId"
    :aria-label="ariaLabel"
    @click="emit('toggle')"
    @keydown="emit('keydown', $event)"
  >
    <Image
      :src="image"
      :alt="name ?? ''"
      rounded="full"
      loading="eager"
      class="size-8"
    />
    <span
      v-if="name"
      class="text-sm font-medium text-neutral-900 dark:text-neutral-100"
    >
      {{ name }}
    </span>
  </button>
</template>

<script lang="ts" setup>
import { tv } from "tailwind-variants";
import { Image } from "@/components";
import { useForwardedAttrs } from "@/composables";

defineOptions({
  inheritAttrs: false,
});

const { classAttr, forwardedAttrs } = useForwardedAttrs();

const triggerStyles = tv({
  base: "inline-flex cursor-pointer items-center gap-2 rounded-full border border-neutral-200 bg-white p-1 font-sans outline-none focus-visible:ring-2 focus-visible:ring-neutral-300 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-neutral-700 dark:bg-neutral-800 dark:focus-visible:ring-neutral-700 dark:focus-visible:ring-offset-neutral-900",
  variants: {
    open: {
      true: "ring-2 ring-neutral-300 ring-offset-2 ring-offset-white dark:ring-neutral-600 dark:ring-offset-neutral-900",
    },
    hasName: {
      true: "pr-3",
      false: "aspect-square",
    },
  },
});

defineProps<{
  image: string;
  name?: string;
  isOpen?: boolean;
  menuId?: string;
  ariaLabel?: string;
}>();

const emit = defineEmits<{
  (e: "toggle"): void;
  (e: "keydown", event: KeyboardEvent): void;
}>();
</script>
