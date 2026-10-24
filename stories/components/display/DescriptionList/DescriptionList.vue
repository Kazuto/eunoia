<template>
  <dl
    v-bind="forwardedAttrs"
    :class="listStyles({ dense, class: classAttr })"
  >
    <slot>
      <DescriptionItem
        v-for="item in items"
        :key="item.term"
        :term="item.term"
      >
        {{ item.description }}
      </DescriptionItem>
    </slot>
  </dl>
</template>

<script lang="ts" setup>
import { computed, provide } from "vue";
import { tv } from "tailwind-variants";
import { useForwardedAttrs } from "@/composables";
import DescriptionItem from "./primitives/DescriptionItem.vue";
import { DESCRIPTION_LIST_KEY } from "./primitives/context";

export type DescriptionListItem = {
  term: string;
  description: string;
};

defineOptions({
  inheritAttrs: false,
});

const { classAttr, forwardedAttrs } = useForwardedAttrs();

const listStyles = tv({
  base: "divide-y divide-neutral-200 font-sans dark:divide-neutral-700",
  variants: {
    dense: {
      false: "text-sm",
      true: "text-xs",
    },
  },
  defaultVariants: {
    dense: false,
  },
});

const props = withDefaults(
  defineProps<{
    items?: DescriptionListItem[];
    /** "horizontal" puts terms beside their descriptions from the sm breakpoint up. */
    orientation?: "horizontal" | "vertical";
    dense?: boolean;
  }>(),
  {
    items: () => [],
    orientation: "horizontal",
  }
);

provide(DESCRIPTION_LIST_KEY, {
  dense: computed(() => props.dense),
  orientation: computed(() => props.orientation),
});
</script>
