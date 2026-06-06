<template>
  <BreadcrumbPrimitive
    v-bind="$attrs"
    :aria-label="ariaLabel ?? t('label')"
  >
    <template
      v-for="(item, index) in items"
      :key="index"
    >
      <BreadcrumbSeparator
        v-if="index > 0"
        :icon="separator"
      />
      <BreadcrumbItemPrimitive
        v-bind="item"
        :active="index === items.length - 1"
      />
    </template>
  </BreadcrumbPrimitive>
</template>

<script setup lang="ts">
import { toRef } from "vue";
import BreadcrumbPrimitive from "./primitives/Breadcrumb.vue";
import {
  default as BreadcrumbItemPrimitive,
  type BreadcrumbItem,
} from "./primitives/BreadcrumbItem.vue";
import BreadcrumbSeparator from "./primitives/BreadcrumbSeparator.vue";
import { useLocale, type LocaleMessages } from "@/composables";

export type { BreadcrumbItem };

defineOptions({
  inheritAttrs: false,
});

const props = defineProps<{
  items: BreadcrumbItem[];
  separator?: string;
  ariaLabel?: string;
  locale?: LocaleMessages;
}>();

const t = useLocale(
  "breadcrumb",
  toRef(() => props.locale)
);
</script>
