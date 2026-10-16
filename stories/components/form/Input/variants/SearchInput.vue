<template>
  <InputGroup
    class="group/input"
    :invalid
    :disabled
  >
    <InputGroupAddon
      position="left"
      :disabled
      :invalid
    >
      <Icon
        name="magnifying-glass"
        size="sm"
        class="text-neutral-700 dark:text-neutral-300"
      />
    </InputGroupAddon>

    <Input
      v-model="model"
      v-bind="{ ...$attrs, ...forwardedProps }"
      type="search"
      :disabled
      :invalid
    />

    <InputGroupAddon
      v-if="shortcut && !model"
      position="right"
      class="pointer-events-none group-has-[input:focus]/input:hidden"
      aria-hidden="true"
      :disabled
      :invalid
    >
      <Kbd
        :shortcut
        :dense
      />
    </InputGroupAddon>

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
          class="text-neutral-700 dark:text-neutral-300"
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
import Kbd from "../../../core/Kbd/Kbd.vue";
import { type LocaleMessages, useLocale } from "@/composables";

const model = defineModel<string>({ default: "" });

const props = withDefaults(
  defineProps<{
    dense?: boolean;
    invalid?: boolean;
    disabled?: boolean;
    locale?: LocaleMessages;
    shortcut?: string;
  }>(),
  {
    locale: undefined,
    shortcut: undefined,
  }
);

defineOptions({
  inheritAttrs: false,
});

const forwardedProps = computed(() => {
  const { locale: _locale, shortcut: _shortcut, ...rest } = props;
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
