<template>
  <span>
    <template
      v-for="(part, index) in parts"
      :key="index"
    >
      <mark
        v-if="part.match"
        :class="markStyles()"
        >{{ part.text }}</mark
      >
      <template v-else>{{ part.text }}</template>
    </template>
  </span>
</template>

<script lang="ts" setup>
import { computed } from "vue";
import { tv } from "tailwind-variants";

const markStyles = tv({
  base: [
    "rounded-[4px] bg-yellow-300/60 px-[0.1em] text-inherit",
    "dark:bg-yellow-500/35",
  ],
});

const props = withDefaults(
  defineProps<{
    text: string;
    /** A phrase, or a list of terms each highlighted on its own. */
    query?: string | string[];
    caseSensitive?: boolean;
  }>(),
  {
    query: () => [],
  }
);

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

const parts = computed(() => {
  // NFC so "é" typed as one character matches "e" + a combining accent.
  const text = props.text.normalize("NFC");
  const terms = (Array.isArray(props.query) ? props.query : [props.query])
    .map((term) => term.trim().normalize("NFC"))
    .filter(Boolean);

  if (terms.length === 0) return [{ text, match: false }];

  // Each term is searched on its own, so overlapping terms ("data table",
  // "table view") are all found; overlapping ranges then merge into one mark.
  const ranges: [number, number][] = [];
  for (const term of terms) {
    const pattern = new RegExp(
      escapeRegExp(term),
      props.caseSensitive ? "g" : "gi"
    );
    for (const match of text.matchAll(pattern)) {
      ranges.push([match.index, match.index + match[0].length]);
    }
  }
  ranges.sort((a, b) => a[0] - b[0]);

  const result: { text: string; match: boolean }[] = [];
  let cursor = 0;
  for (const [start, end] of ranges) {
    const last = result.at(-1);
    if (last?.match && start <= cursor) {
      if (end > cursor) {
        last.text += text.slice(cursor, end);
        cursor = end;
      }
      continue;
    }
    if (start > cursor) {
      result.push({ text: text.slice(cursor, start), match: false });
    }
    result.push({ text: text.slice(start, end), match: true });
    cursor = end;
  }
  if (cursor < text.length) {
    result.push({ text: text.slice(cursor), match: false });
  }

  return result;
});
</script>
