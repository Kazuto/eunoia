<script lang="ts" setup>
import { tv } from "tailwind-variants";
import {
  default as PageHeader,
  type PageHeaderOptions,
} from "./primitives/PageHeader.vue";
import { computed } from "vue";

export type PageOptions = {
  width?: "narrow" | "wide";
} & PageHeaderOptions;

const props = withDefaults(defineProps<PageOptions>(), {
  backAction: undefined,
  width: "narrow",
});

const pageVariants = tv({
  base: ["flex flex-col gap-10"],
  variants: {
    width: {
      narrow: ["mx-auto max-w-screen-lg px-4 py-12"],
      wide: ["mx-auto max-w-screen-xl px-4 py-12"],
    },
  },
});

const headerProps = computed(() => {
  const { width: _, ...rest } = props;

  return rest;
});
</script>

<template>
  <div :class="pageVariants({ width: props.width })">
    <PageHeader v-bind="headerProps" />

    <div>
      <slot />
    </div>
  </div>
</template>
