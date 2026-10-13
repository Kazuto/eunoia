<script lang="ts" setup>
import { tv } from "tailwind-variants";
import {
  default as PageHeader,
  type PageHeaderOptions,
} from "./primitives/PageHeader.vue";
import { computed } from "vue";

export type PageOptions = {
  width?: "narrow" | "wide";
  title?: string;
  showHeader?: boolean;
} & Omit<PageHeaderOptions, "title">;

const props = withDefaults(defineProps<PageOptions>(), {
  backAction: undefined,
  title: undefined,
  width: "narrow",
  showHeader: true,
});

const pageVariants = tv({
  base: ["flex flex-col gap-10"],
  variants: {
    width: {
      narrow: ["mx-auto max-w-screen-lg px-4"],
      wide: ["mx-auto max-w-screen-xl px-4"],
    },
    showHeader: {
      true: "py-12",
      false: "py-6",
    },
  },
});

const headerProps = computed(() => {
  const { width: _, showHeader: __, title: ___, ...rest } = props;

  return rest;
});
</script>

<template>
  <div
    :class="
      pageVariants({ width: props.width, showHeader: !!(showHeader && title) })
    "
  >
    <PageHeader
      v-if="showHeader && title"
      v-bind="headerProps"
      :title
    />

    <div>
      <slot />
    </div>
  </div>
</template>
