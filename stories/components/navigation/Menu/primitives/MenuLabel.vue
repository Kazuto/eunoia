<template>
  <span class="flex items-center gap-2">
    <div :class="iconWrapperStyles({ icon: !!icon })">
      <Icon
        v-if="icon"
        :name="icon"
        size="sm"
      />
    </div>

    <slot />
  </span>
</template>

<script setup lang="ts">
import { Icon } from "@/components";
import { tv } from "tailwind-variants";

defineProps<{
  icon?: string;
}>();

const iconWrapperStyles = tv({
  base: "flex aspect-square h-6 w-6 items-center justify-center rounded-md p-1",
  variants: {
    icon: {
      true: "bg-random-700 text-neutral-50",
    },
  },
});
</script>
