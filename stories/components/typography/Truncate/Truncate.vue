<script setup lang="ts">
import { nextTick, onBeforeUnmount, onMounted, ref, watch } from "vue";
import { Tooltip } from "@/components";

const props = withDefaults(
  defineProps<{
    content: string;
    maxLength?: number;
  }>(),
  {
    maxLength: 100,
  }
);

const textElement = ref<HTMLElement | undefined>(undefined);
const isOverflowing = ref(false);

let resizeObserver: ResizeObserver | undefined;

function checkOverflow(): void {
  if (!textElement.value) return;

  isOverflowing.value =
    textElement.value.scrollWidth > textElement.value.clientWidth;
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
  () => props.maxLength,
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
      class="block overflow-hidden text-ellipsis whitespace-nowrap"
      :style="{ maxWidth: `${maxLength}ch` }"
    >
      <slot />
    </span>
  </Tooltip>
</template>
