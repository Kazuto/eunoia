<template>
  <span
    v-bind="forwardedAttrs"
    :class="labelStyles({ class: classAttr })"
  >
    <div :class="iconWrapperStyles({ icon: !!icon })">
      <Icon
        v-if="icon"
        :name="icon"
        size="sm"
      />
    </div>

    <span
      v-if="!sidebarCollapsed"
      class="truncate"
    >
      <slot />
    </span>
  </span>
</template>

<script setup lang="ts">
import { inject } from "vue";
import { Icon } from "@/components";
import { tv } from "tailwind-variants";
import { useForwardedAttrs } from "@/composables";
import { sidebarCollapsedKey } from "@/components/layout/Sidebar/keys";

defineOptions({
  inheritAttrs: false,
});

defineProps<{
  icon?: string;
}>();

const { classAttr, forwardedAttrs } = useForwardedAttrs();
const sidebarCollapsed = inject(sidebarCollapsedKey, undefined);

const labelStyles = tv({
  base: "flex items-center gap-2",
});

const iconWrapperStyles = tv({
  base: "flex aspect-square h-6 w-6 items-center justify-center rounded-md p-1",
  variants: {
    icon: {
      true: "bg-primary-700 text-neutral-50",
    },
  },
});
</script>
