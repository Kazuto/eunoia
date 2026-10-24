<template>
  <time
    :datetime="valid ? value.toISOString() : undefined"
    :title="valid ? `${date} ${time}` : undefined"
  >
    {{ relative }}
  </time>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useRelativeTime } from "@/composables";

const props = withDefaults(
  defineProps<{
    value: Date;
    locale?: string;
  }>(),
  {
    locale: "en",
  }
);

const { relative, date, time } = useRelativeTime(() => props.value, {
  locale: () => props.locale,
});

// An invalid Date would throw in toISOString() and take the whole list down.
const valid = computed(() => !Number.isNaN(props.value.getTime()));
</script>
