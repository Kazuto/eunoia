<template>
  <div
    v-bind="forwardedAttrs"
    :class="wrapperStyles({ class: classAttr })"
    :style="anchorStyle"
    :aria-describedby="isVisible ? tooltipId : undefined"
    @mouseenter="show"
    @mouseleave="hide"
    @focusin="show"
    @focusout="hide"
  >
    <slot />
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
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { tv } from "tailwind-variants";
import { useSanitizedId, useForwardedAttrs } from "@/composables";
import TooltipContent from "./primitives/TooltipContent.vue";

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
    placement?: "top" | "bottom" | "left" | "right";
    dense?: boolean;
    disabled?: boolean;
  }>(),
  {
    content: undefined,
    placement: undefined,
  }
);

const id = useSanitizedId("tooltip");
const anchorName = `--${id}`;
const tooltipId = id;
const anchorStyle = { "anchor-name": anchorName } as Record<string, string>;
const isVisible = ref(false);

function show() {
  if (props.disabled) return;
  isVisible.value = true;
}

function hide() {
  isVisible.value = false;
}
</script>
