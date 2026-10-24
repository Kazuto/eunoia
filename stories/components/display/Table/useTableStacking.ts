import {
  nextTick,
  onBeforeUnmount,
  onMounted,
  ref,
  watch,
  type ComponentPublicInstance,
  type Ref,
} from "vue";

/**
 * "auto" stacks the rows as cards when the columns don't fit side by side,
 * instead of making the table scroll sideways.
 */
export type TableStack = "auto" | "always" | "never";

export function useTableStacking(
  stack: () => TableStack,
  wrapper: Readonly<Ref<HTMLElement | null>>,
  table: Readonly<Ref<ComponentPublicInstance | null>>,
  content: () => unknown
) {
  const stacked = ref(stack() === "always");

  async function measure() {
    const mode = stack();
    if (mode !== "auto") {
      stacked.value = mode === "always";
      return;
    }

    // Lay the columns out side by side, then stack again if they overflow.
    // Both updates land before the next paint, so nothing flickers.
    stacked.value = false;
    await nextTick();

    const tableElement = table.value?.$el as HTMLElement | undefined;
    if (!wrapper.value || !tableElement) return;

    stacked.value =
      tableElement.getBoundingClientRect().width >
      wrapper.value.getBoundingClientRect().width + 0.5;
  }

  let observer: ResizeObserver | undefined;
  let lastWidth = -1;

  onMounted(() => {
    measure();
    document.fonts?.ready.then(measure);

    if (!wrapper.value || typeof ResizeObserver === "undefined") return;

    // Only width matters; stacking changes the height, which mustn't re-trigger.
    observer = new ResizeObserver(([entry]) => {
      if (!entry || entry.contentRect.width === lastWidth) return;
      lastWidth = entry.contentRect.width;
      measure();
    });
    observer.observe(wrapper.value);
  });

  onBeforeUnmount(() => {
    observer?.disconnect();
  });

  watch([stack, content], measure, { flush: "post" });

  return { stacked };
}
