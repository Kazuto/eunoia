<template>
  <Details
    v-bind="$attrs"
    :model-value="accordion.isOpen(value)"
    :dense="accordion.dense.value"
    @update:model-value="(open: boolean) => accordion.setOpen(value, open)"
  >
    <template #summary>
      <slot name="summary" />
    </template>
    <slot />
  </Details>
</template>

<script lang="ts" setup>
import { inject } from "vue";
import { Details } from "@/components";
import { ACCORDION_KEY } from "./context";

defineOptions({
  inheritAttrs: false,
});

defineProps<{
  value: string;
}>();

// The default keeps Vue from warning before the clearer error below.
const injected = inject(ACCORDION_KEY, null);
if (!injected) {
  throw new Error("AccordionItem must be used inside an Accordion.");
}
const accordion = injected;
</script>
