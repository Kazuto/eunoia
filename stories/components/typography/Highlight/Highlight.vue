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
  const terms = (Array.isArray(props.query) ? props.query : [props.query])
    .map((term) => term.trim())
    .filter(Boolean)
    // Longer terms first, so "data table" wins over "data" where both match.
    .sort((a, b) => b.length - a.length);

  if (terms.length === 0) return [{ text: props.text, match: false }];

  const pattern = new RegExp(
    `(${terms.map(escapeRegExp).join("|")})`,
    props.caseSensitive ? "g" : "gi"
  );

  // With a capturing group, split() puts each match at an odd index.
  return props.text
    .split(pattern)
    .map((text, index) => ({ text, match: index % 2 === 1 }))
    .filter((part) => part.text !== "");
});
</script>
