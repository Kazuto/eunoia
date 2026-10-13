<script lang="ts" setup>
import { tv } from "tailwind-variants";
import PageHeader, {
  type PageHeaderOptions,
} from "../Page/primitives/PageHeader.vue";

defineProps<Partial<PageHeaderOptions>>();

const headerStyles = tv({
  base: [
    "flex shrink-0 flex-wrap items-center justify-between gap-x-4 gap-y-2 border-b px-4 py-3 font-sans",
    "border-neutral-200 bg-white",
    "dark:border-neutral-800 dark:bg-neutral-900",
  ],
});
</script>

<template>
  <header :class="headerStyles()">
    <div
      v-if="$slots.left"
      class="flex shrink-0 items-center gap-3"
    >
      <slot name="left" />
    </div>
    <PageHeader
      v-if="title"
      class="min-w-0 flex-1"
      :title
      :description
      :back-action
      :copy-action
      :primary-action
      :secondary-actions
      :truncate-title-after
      compact
    />
    <div
      v-if="$slots.right"
      class="ml-auto flex shrink-0 items-center gap-3"
    >
      <slot name="right" />
    </div>
  </header>
</template>
