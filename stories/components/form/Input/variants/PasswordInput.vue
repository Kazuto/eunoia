<template>
  <InputGroup
    :invalid
    :disabled
  >
    <InputGroupAddon
      v-if="$slots.prepend"
      position="left"
      :disabled
      :invalid
    >
      <slot name="prepend" />
    </InputGroupAddon>

    <Input
      v-model="model"
      v-bind="{ ...$attrs, ...forwardedProps }"
      :type="inputType"
      :disabled
      :invalid
    />

    <InputGroupAddon
      position="right"
      role="button"
      :aria-label="isVisible ? t('hide-password') : t('show-password')"
      :aria-pressed="isVisible"
      :disabled
      :invalid
      @click="toggleVisibility"
      @keydown.enter="toggleVisibility"
      @keydown.space="toggleVisibility"
    >
      <Icon :name="isVisible ? 'eye' : 'eye-closed'" size="sm" />
    </InputGroupAddon>
  </InputGroup>
</template>

<script setup lang="ts">
import { computed, ref, toRef } from "vue";
import Icon from "@/components/core/Icon/Icon.vue";
import Input from "../primitives/Input.vue";
import InputGroup from "../primitives/InputGroup.vue";
import InputGroupAddon from "../primitives/InputGroupAddon.vue";
import { type LocaleMessages, useLocale } from "@/composables/useLocale";

const props = withDefaults(
  defineProps<{
    dense?: boolean;
    invalid?: boolean;
    disabled?: boolean;
    locale?: LocaleMessages;
  }>(),
  {
    locale: undefined,
  }
);

const t = useLocale(
  "input.password",
  toRef(() => props.locale)
);

const forwardedProps = computed(() => {
  const { locale: _locale, ...rest } = props;
  return rest;
});

defineOptions({
  inheritAttrs: false,
});

const model = defineModel<string>();

const isVisible = ref(false);

const inputType = computed(() => (isVisible.value ? "text" : "password"));

function toggleVisibility() {
  if (props.disabled) return;

  isVisible.value = !isVisible.value;
}
</script>
