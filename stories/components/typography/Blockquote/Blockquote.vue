<template>
  <figure
    v-bind="forwardedAttrs"
    :class="figureStyles({ variant, class: classAttr })"
  >
    <blockquote
      :cite
      :class="quoteStyles({ variant })"
    >
      <slot />
    </blockquote>
    <figcaption
      v-if="author || source || $slots.caption"
      :class="captionStyles({ variant })"
    >
      <slot name="caption">
        <span v-if="author">{{ author }}</span>
        <template v-if="author && source">, </template>
        <cite v-if="source">{{ source }}</cite>
      </slot>
    </figcaption>
  </figure>
</template>

<script lang="ts" setup>
import { tv } from "tailwind-variants";
import { useForwardedAttrs } from "@/composables";

defineOptions({
  inheritAttrs: false,
});

const { classAttr, forwardedAttrs } = useForwardedAttrs();

const figureStyles = tv({
  base: "font-sans",
  variants: {
    variant: {
      default: "",
      pull: "mx-auto max-w-2xl text-center",
    },
  },
});

const quoteStyles = tv({
  variants: {
    variant: {
      default: [
        "border-l-[3px] border-primary-300 pl-4 text-base leading-relaxed text-neutral-700 italic",
        "dark:border-primary-700 dark:text-neutral-300",
      ],
      pull: [
        "text-2xl leading-snug font-semibold text-neutral-900",
        // On the blockquote for a plain-text quote; inside the first and last
        // paragraph otherwise, so the marks don't sit on lines of their own.
        "not-has-[>p]:before:content-['“'] not-has-[>p]:after:content-['”']",
        "[&>p:first-child]:before:content-['“'] [&>p:last-child]:after:content-['”']",
        "dark:text-neutral-100",
      ],
    },
  },
});

const captionStyles = tv({
  base: "text-sm text-neutral-500 not-italic before:content-['—_'] dark:text-neutral-400 [&_cite]:not-italic",
  variants: {
    variant: {
      default: "mt-2 pl-[calc(1rem+3px)]",
      pull: "mt-4",
    },
  },
});

withDefaults(
  defineProps<{
    /** URL of the quoted source, set as the blockquote's cite attribute. */
    cite?: string;
    author?: string;
    /** Title of the work quoted from, rendered in a <cite>. */
    source?: string;
    variant?: "default" | "pull";
  }>(),
  {
    cite: undefined,
    author: undefined,
    source: undefined,
    variant: "default",
  }
);
</script>
