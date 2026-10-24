<script setup lang="ts">
import {
  computed,
  nextTick,
  onBeforeUnmount,
  onMounted,
  ref,
  watch,
} from "vue";
import { Tooltip } from "@/components";

const props = withDefaults(
  defineProps<{
    content: string;
    /** Maximum width, in characters. */
    maxLength?: number;
    /** Lines to show before cutting off; single-line when unset. */
    lines?: number;
  }>(),
  {
    maxLength: 100,
    lines: undefined,
  }
);

const textElement = ref<HTMLElement | undefined>(undefined);
const isOverflowing = ref(false);

const multiline = computed(() => (props.lines ?? 1) > 1);

const textStyle = computed(() => ({
  maxWidth: `${props.maxLength}ch`,
  ...(multiline.value && {
    display: "-webkit-box",
    WebkitBoxOrient: "vertical" as const,
    WebkitLineClamp: String(props.lines),
  }),
}));

let resizeObserver: ResizeObserver | undefined;

function checkOverflow(): void {
  if (!textElement.value) return;

  isOverflowing.value = multiline.value
    ? textElement.value.scrollHeight > textElement.value.clientHeight
    : textElement.value.scrollWidth > textElement.value.clientWidth;
}

onMounted(async () => {
  await nextTick();

  setTimeout(() => {
    checkOverflow();
  }, 0);

  if (textElement.value && typeof ResizeObserver !== "undefined") {
    resizeObserver = new ResizeObserver(() => {
      checkOverflow();
    });

    resizeObserver.observe(textElement.value);
  }
});

onBeforeUnmount(() => {
  if (resizeObserver) {
    resizeObserver.disconnect();
  }
});

watch(
  () => [props.maxLength, props.lines],
  async () => {
    await nextTick();

    checkOverflow();
  }
);
</script>

<template>
  <Tooltip
    :content
    :disabled="!isOverflowing"
  >
    <span
      ref="textElement"
      :class="[
        'block overflow-hidden',
        multiline ? 'break-words' : 'text-ellipsis whitespace-nowrap',
      ]"
      :style="textStyle"
    >
      <slot />
    </span>
  </Tooltip>
</template>
