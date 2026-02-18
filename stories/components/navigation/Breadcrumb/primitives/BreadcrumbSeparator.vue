<template>
  <li
    role="presentation"
    aria-hidden="true"
    class="flex items-center"
    v-bind="forwardedAttrs"
  >
    <Icon
      :name="icon"
      size="xs"
      :class="separatorStyles({ class: classAttr })"
    />
  </li>
</template>

<script setup lang="ts">
import { tv } from "tailwind-variants";
import { Icon } from "@/components";
import { useForwardedAttrs } from "@/composables";

defineOptions({
  inheritAttrs: false,
});

withDefaults(
  defineProps<{
    icon?: string;
  }>(),
  {
    icon: "caret-right",
  }
);

const { classAttr, forwardedAttrs } = useForwardedAttrs();

const separatorStyles = tv({
  base: ["text-neutral-400", "dark:text-neutral-500"],
});
</script>
