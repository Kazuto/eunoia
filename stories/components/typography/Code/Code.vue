<template>
  <CodeBlock
    v-if="block"
    v-bind="$attrs"
    :filename
    :ariaLabel="t('copy')"
    @copy="(text) => emit('copy', text)"
  >
    <slot />
  </CodeBlock>
  <CodeInline v-else v-bind="$attrs">
    <slot />
  </CodeInline>
</template>

<script lang="ts" setup>
import { toRef } from "vue";
import CodeInline from "./primitives/CodeInline.vue";
import CodeBlock from "./primitives/CodeBlock.vue";
import { type LocaleMessages, useLocale } from "@/composables/useLocale";

defineOptions({
  inheritAttrs: false,
});

const props = withDefaults(
  defineProps<{
    block?: boolean;
    filename?: string;
    locale?: LocaleMessages;
  }>(),
  {
    locale: undefined,
  }
);

const emit = defineEmits<{
  (e: "copy", text: string): void;
}>();

const t = useLocale("code", toRef(() => props.locale));
</script>
