<template>
  <ButtonGroup
    v-bind="$attrs"
    :aria-label="t('label')"
  >
    <slot />
  </ButtonGroup>
</template>

<script lang="ts" setup>
import { toRef } from "vue";
import ButtonGroup from "./primitives/ButtonGroup.vue";
import { type LocaleMessages, useLocale } from "@/composables/useLocale";

defineOptions({
  inheritAttrs: false,
});

const props = withDefaults(
  defineProps<{
    ariaLabel?: string;
    locale?: LocaleMessages;
  }>(),
  {
    ariaLabel: undefined,
    locale: undefined,
  }
);

const t = useLocale("button-group", toRef(() => ({
  label: props.ariaLabel,
  ...props.locale,
})));
</script>
