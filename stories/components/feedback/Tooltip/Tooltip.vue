<template>
  <div
    v-bind="$attrs"
    class="inline-flex"
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
import { ref, useId } from "vue";
import TooltipContent from "./primitives/TooltipContent.vue";

defineOptions({
  inheritAttrs: false,
});

withDefaults(
  defineProps<{
    content?: string;
    placement?: "top" | "bottom" | "left" | "right";
    dense?: boolean;
  }>(),
  {
    content: undefined,
    placement: undefined,
  },
);

const id = useId().replace(/[^a-zA-Z0-9]/g, "-");
const anchorName = `--tooltip-${id}`;
const tooltipId = `tooltip-${id}`;
const anchorStyle = { "anchor-name": anchorName } as Record<string, string>;
const isVisible = ref(false);

function show() {
  isVisible.value = true;
}

function hide() {
  isVisible.value = false;
}
</script>
