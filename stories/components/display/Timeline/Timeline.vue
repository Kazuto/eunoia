<template>
  <ol
    v-bind="forwardedAttrs"
    :class="['m-0 list-none p-0', classAttr]"
  >
    <TimelineEntry
      v-for="(item, index) in items"
      :key="index"
      :title="item.title"
      :description="item.description"
      :time="item.time"
      :time-locale="timeLocale"
      :icon="item.icon"
      :variant="item.variant ?? 'primary'"
      :last="index === items.length - 1"
    >
      <slot
        :item="item"
        :index="index"
      />
    </TimelineEntry>
  </ol>
</template>

<script setup lang="ts">
import { useForwardedAttrs } from "@/composables";
import TimelineEntry from "./primitives/TimelineEntry.vue";
import type { TimelineVariant } from "./primitives/TimelineMarker.vue";

export type TimelineItem = {
  title: string;
  description?: string;
  /** A Date is shown relative to now ("2 hours ago"); a string as-is. */
  time?: string | Date;
  /** A Phosphor icon name, shown in a filled marker instead of a dot. */
  icon?: string;
  variant?: TimelineVariant;
};

defineOptions({
  inheritAttrs: false,
});

const { classAttr, forwardedAttrs } = useForwardedAttrs();

withDefaults(
  defineProps<{
    items: TimelineItem[];
    /** Locale for relative times, e.g. "de". */
    timeLocale?: string;
  }>(),
  {
    timeLocale: "en",
  }
);

defineSlots<{
  /** Extra content below an item's description, e.g. a card or a diff. */
  default?: (props: { item: TimelineItem; index: number }) => unknown;
}>();
</script>
