<script lang="ts" setup>
import { tv } from "tailwind-variants";

const headerStyles = tv({
  base: [
    "flex shrink-0 items-center justify-between border-b px-4 py-3 font-sans",
    "border-neutral-200 bg-white",
    "dark:border-neutral-800 dark:bg-neutral-900",
  ],
});
</script>

<template>
  <header :class="headerStyles()">
    <div class="flex items-center gap-3">
      <slot name="left" />
    </div>
    <div class="flex items-center gap-3">
      <slot name="right" />
    </div>
  </header>
</template>
