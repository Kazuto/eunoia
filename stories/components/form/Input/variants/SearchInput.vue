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
      type="search"
      :disabled
      :invalid
    />

    <Tooltip
      v-if="model"
      :content="t('clear-search')"
    >
      <InputGroupAddon
        position="right"
        role="button"
        :aria-label="t('clear-search')"
        :disabled
        :invalid
        @click="clearSearch"
        @keydown.enter="clearSearch"
        @keydown.space="clearSearch"
      >
        <Icon
          name="backspace"
          size="sm"
        />
      </InputGroupAddon>
    </Tooltip>
  </InputGroup>
</template>

<script setup lang="ts">
import { computed, toRef } from "vue";
import { Icon, Tooltip } from "@/components";
import Input from "../primitives/Input.vue";
import InputGroup from "../../InputGroup/InputGroup.vue";
import InputGroupAddon from "../../InputGroup/InputGroupAddon.vue";
import { type LocaleMessages, useLocale } from "@/composables";

const model = defineModel<string>({ default: "" });

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

defineOptions({
  inheritAttrs: false,
});

const forwardedProps = computed(() => {
  const { locale: _locale, ...rest } = props;
  return rest;
});

const t = useLocale(
  "input.search",
  toRef(() => props.locale)
);

function clearSearch() {
  model.value = "";
}
</script>
