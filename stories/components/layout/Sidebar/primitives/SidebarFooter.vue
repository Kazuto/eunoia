<template>
  <div
    v-bind="forwardedAttrs"
    :class="sidebarFooterStyles({ class: classAttr })"
  >
    <Divider />
    <div class="p-3">
      <slot />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { tv } from "tailwind-variants";
import { useForwardedAttrs } from "@/composables";
import Divider from "@/components/core/Divider/Divider.vue";

defineOptions({
  inheritAttrs: false,
});

const { classAttr, forwardedAttrs } = useForwardedAttrs();

const sidebarFooterStyles = tv({
  base: "mt-auto",
});
</script>
