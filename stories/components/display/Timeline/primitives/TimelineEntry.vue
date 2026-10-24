<template>
  <li :class="['relative flex gap-3', last ? '' : 'pb-6']">
    <span
      v-if="!last"
      aria-hidden="true"
      class="absolute top-7 bottom-1 left-[11px] w-0.5 rounded-full bg-neutral-200 dark:bg-neutral-700"
    />
    <TimelineMarker
      :variant
      :icon
    />
    <div class="flex min-w-0 flex-1 flex-col gap-0.5 pt-0.5">
      <div class="flex flex-wrap items-baseline justify-between gap-x-3">
        <span
          class="text-sm font-semibold text-neutral-900 dark:text-neutral-100"
        >
          {{ title }}
        </span>
        <span
          v-if="time"
          class="shrink-0 text-xs whitespace-nowrap text-neutral-500 dark:text-neutral-400"
        >
          <TimelineTime
            v-if="time instanceof Date"
            :value="time"
            :locale="timeLocale"
          />
          <template v-else>{{ time }}</template>
        </span>
      </div>
      <p
        v-if="description"
        class="m-0 text-sm text-neutral-600 dark:text-neutral-400"
      >
        {{ description }}
      </p>
      <slot />
    </div>
  </li>
</template>

<script setup lang="ts">
import TimelineMarker, { type TimelineVariant } from "./TimelineMarker.vue";
import TimelineTime from "./TimelineTime.vue";

defineProps<{
  title: string;
  description?: string;
  time?: string | Date;
  timeLocale?: string;
  icon?: string;
  variant: TimelineVariant;
  last?: boolean;
}>();
</script>
