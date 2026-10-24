<template>
  <span
    v-bind="forwardedAttrs"
    :class="starStyles({ class: classAttr })"
    aria-hidden="true"
  >
    <Icon
      name="star"
      :size="dense ? 'md' : 'lg'"
      class="text-neutral-400 dark:text-neutral-500"
    />
    <span
      v-if="fill !== 'empty'"
      :class="fillStyles({ fill })"
    >
      <Icon
        name="star"
        type="fill"
        :size="dense ? 'md' : 'lg'"
        class="text-yellow-500"
      />
    </span>
  </span>
</template>

<script lang="ts" setup>
import { tv } from "tailwind-variants";
import { useForwardedAttrs } from "@/composables";
import { Icon } from "@/components";

defineOptions({
  inheritAttrs: false,
});

const { classAttr, forwardedAttrs } = useForwardedAttrs();

defineProps<{
  fill: "empty" | "half" | "full";
  dense?: boolean;
}>();

const starStyles = tv({
  base: "pointer-events-none relative inline-flex",
});

const fillStyles = tv({
  base: "absolute inset-y-0 left-0 overflow-hidden",
  variants: {
    fill: {
      empty: "w-0",
      half: "w-1/2",
      full: "w-full",
    },
  },
});
</script>
