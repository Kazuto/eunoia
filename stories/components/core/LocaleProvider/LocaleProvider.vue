<template>
  <slot />
</template>

<script setup lang="ts">
import { provide, toRef } from "vue";
import { type LocaleMessages, LOCALE_KEY } from "@/composables/useLocale";

const props = defineProps<{
  locale?: LocaleMessages;
}>();

provide(LOCALE_KEY, toRef(() => props.locale ?? {}));
</script>
