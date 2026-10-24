<script lang="ts" setup>
import { tv } from "tailwind-variants";
import { Button, Tooltip, Headline, Truncate, Text } from "@/components";
import HeaderActions from "./primitives/HeaderActions.vue";
import type { HeaderAction } from "@/types";
import {
  onBeforeUnmount,
  onMounted,
  ref,
  useTemplateRef,
  watch,
  type CSSProperties,
} from "vue";

export type HeaderOptions = {
  title?: string;
  description?: string;
  backAction?: HeaderAction;
  copyAction?: HeaderAction;
  /**
   * Shown as buttons next to the primary action. When they don't fit, they
   * move into the "More actions" menu, last first; after them the primary
   * action shrinks to its icon, then moves into the menu as well.
   */
  actions?: HeaderAction[];
  primaryAction?: HeaderAction;
  /** Always in the "More actions" menu, below any actions that moved there. */
  secondaryActions?: HeaderAction[];
  truncateTitleAfter?: number;
  /**
   * Line the title and actions up with a `Page` of this width. Needs `alignTo`.
   * The left and right slots stay at the header's edges.
   */
  width?: "narrow" | "wide" | "extra-wide";
  /** The element the `Page` is centered in, e.g. the app's `<main>`. */
  alignTo?: HTMLElement | null;
  /** Drop the background and bottom border, so the header sits on the page's background. */
  transparent?: boolean;
};

const props = defineProps<HeaderOptions>();

// Must match the Page widths and its horizontal padding (px-4).
const PAGE_WIDTHS = { narrow: "64rem", wide: "80rem", "extra-wide": "1680px" };
const PAGE_PADDING = 16;

const middle = useTemplateRef<HTMLElement>("middle");
const row = useTemplateRef<HTMLElement>("row");
const titleGroup = useTemplateRef<HTMLElement>("titleGroup");
const alignStyle = ref<CSSProperties>();

function toPixels(length: string) {
  if (length.endsWith("rem")) {
    const rootSize = parseFloat(
      getComputedStyle(document.documentElement).fontSize
    );
    return parseFloat(length) * rootSize;
  }
  return parseFloat(length);
}

function align() {
  const target = props.alignTo;
  if (!props.width || !target || !middle.value) {
    alignStyle.value = undefined;
    return;
  }
  // Where the Page's content sits inside the target (excluding its scrollbar).
  const targetLeft = target.getBoundingClientRect().left + target.clientLeft;
  const pageWidth = Math.min(
    toPixels(PAGE_WIDTHS[props.width]),
    target.clientWidth
  );
  const pageLeft = targetLeft + (target.clientWidth - pageWidth) / 2;
  const contentLeft = pageLeft + PAGE_PADDING;
  const contentRight = pageLeft + pageWidth - PAGE_PADDING;

  const area = middle.value.getBoundingClientRect();
  const marginLeft = Math.max(0, contentLeft - area.left);
  const width = Math.max(
    0,
    Math.min(contentRight, area.right) - (area.left + marginLeft)
  );
  alignStyle.value = { marginLeft: `${marginLeft}px`, width: `${width}px` };
}

let observer: ResizeObserver | undefined;

function observe() {
  observer?.disconnect();
  if (typeof ResizeObserver === "undefined") return align();
  observer = new ResizeObserver(() => align());
  if (props.alignTo) observer.observe(props.alignTo);
  if (middle.value?.parentElement) observer.observe(middle.value.parentElement);
  align();
}

onMounted(() => {
  observe();
  window.addEventListener("resize", align);
});
onBeforeUnmount(() => {
  observer?.disconnect();
  window.removeEventListener("resize", align);
});
watch(() => [props.alignTo, props.width, !!props.title], observe, {
  flush: "post",
});

const headerStyles = tv({
  base: [
    "flex min-h-18 shrink-0 flex-wrap items-center justify-between gap-x-4 gap-y-2 border-b px-4 py-3 font-sans",
    "border-neutral-200 bg-white",
    "dark:border-neutral-800 dark:bg-neutral-900",
  ],
  variants: {
    transparent: {
      true: "border-transparent bg-transparent dark:border-transparent dark:bg-transparent",
    },
  },
});
</script>

<template>
  <header :class="headerStyles({ transparent })">
    <div
      v-if="$slots.left"
      class="flex shrink-0 items-center gap-3"
    >
      <slot name="left" />
    </div>
    <div
      v-if="title"
      ref="middle"
      class="min-w-0 flex-1"
    >
      <div
        ref="row"
        class="flex min-w-0 items-center justify-between gap-3"
        :style="alignStyle"
      >
        <div
          ref="titleGroup"
          class="flex min-w-0 items-center gap-3"
        >
          <Tooltip
            v-if="backAction"
            :content="backAction.content"
          >
            <Button
              ghost
              :icon="backAction.icon ?? 'arrow-left'"
              :disabled="backAction.disabled"
              :aria-label="backAction.content"
              @click="backAction.onClick"
            />
          </Tooltip>

          <div class="min-w-0">
            <Headline
              :level="3"
              :scale="6"
            >
              <Truncate
                :content="title"
                :max-length="truncateTitleAfter"
              >
                {{ title }}
              </Truncate>
            </Headline>
            <Text
              v-if="description"
              muted
              size="sm"
              class="truncate"
              :title="description"
            >
              {{ description }}
            </Text>
          </div>

          <Tooltip
            v-if="copyAction"
            :content="copyAction.content"
          >
            <Button
              ghost
              :icon="copyAction.icon ?? 'copy'"
              :disabled="copyAction.disabled"
              :aria-label="copyAction.content"
              @click="copyAction.onClick"
            />
          </Tooltip>
        </div>

        <HeaderActions
          :actions
          :primary-action
          :secondary-actions
          :row
          :title-group
        />
      </div>
    </div>
    <div
      v-if="$slots.right"
      class="ml-auto flex shrink-0 items-center gap-3"
    >
      <slot name="right" />
    </div>
  </header>
</template>
