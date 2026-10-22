<template>
  <div
    v-bind="forwardedAttrs"
    :class="wrapperStyles({ class: classAttr })"
    :style="anchorStyle"
    :aria-describedby="isVisible ? tooltipId : undefined"
    @mouseenter="showAfterDelay"
    @mouseleave="hide"
    @focusin="show"
    @focusout="hide"
  >
    <slot />
    <Teleport
      :to="teleportTo ?? 'body'"
      :disabled="!teleportTo"
    >
      <TooltipContent
        v-if="isVisible"
        :id="tooltipId"
        :anchor-name="anchorName"
        :placement
        :dense
      >
        <slot name="content">
          {{ content }}
        </slot>
      </TooltipContent>
    </Teleport>
  </div>
</template>

<script lang="ts" setup>
import { onBeforeUnmount, ref } from "vue";
import { tv } from "tailwind-variants";
import { useSanitizedId, useForwardedAttrs } from "@/composables";
import TooltipContent from "./primitives/TooltipContent.vue";
import type { TooltipPlacement } from "./primitives/placement";

defineOptions({
  inheritAttrs: false,
});

const { classAttr, forwardedAttrs } = useForwardedAttrs();

const wrapperStyles = tv({
  base: "inline-flex",
});

const props = withDefaults(
  defineProps<{
    content?: string;
    placement?: TooltipPlacement;
    dense?: boolean;
    disabled?: boolean;
    /**
     * Milliseconds the pointer must rest before the tooltip shows, so moving
     * across many anchors does not flash a tooltip on each. Focus shows it at
     * once.
     */
    delay?: number;
    /**
     * Teleport outside containers that clip or move their content, e.g. scrolling
     * or virtualized lists. Native dialogs own their tooltips.
     */
    teleportTo?: string | HTMLElement;
  }>(),
  {
    content: undefined,
    placement: undefined,
    delay: 0,
    teleportTo: undefined,
  }
);

const id = useSanitizedId("tooltip");
const anchorName = `--${id}`;
const tooltipId = id;
const anchorStyle = { "anchor-name": anchorName } as Record<string, string>;
const isVisible = ref(false);

let showTimer: ReturnType<typeof setTimeout> | undefined;

function cancelShow() {
  clearTimeout(showTimer);
  showTimer = undefined;
}

function show() {
  cancelShow();
  if (props.disabled) return;
  isVisible.value = true;
}

function showAfterDelay() {
  if (!props.delay) return show();
  cancelShow();
  if (props.disabled) return;
  showTimer = setTimeout(show, props.delay);
}

function hide() {
  cancelShow();
  isVisible.value = false;
}

onBeforeUnmount(cancelShow);
</script>
