<template>
  <time
    :datetime="value.toISOString()"
    :title="`${date} ${time}`"
  >
    {{ relative }}
  </time>
</template>

<script setup lang="ts">
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
</script>
