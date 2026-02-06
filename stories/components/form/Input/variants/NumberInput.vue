<template>
  <InputGroup :invalid :disabled>
    <InputGroupAddon v-if="$slots.prepend" position="left" :disabled :invalid>
      <slot name="prepend" />
    </InputGroupAddon>

    <Input
      v-model="model"
      v-bind="{ ...$attrs, ...forwardedProps }"
      role="spinbutton"
      type="number"
      :min
      :max
      :step
      :aria-valuenow="model"
      :aria-valuemin="min"
      :aria-valuemax="max"
    />

    <InputGroupAddon
      position="right"
      @click="decrement"
      @keydown.enter="decrement"
      @keydown.space.prevent="decrement"
      role="button"
      :aria-label="t('decrease-value')"
      tabindex="-1"
      class="rounded-none"
      :disabled
      :invalid
    >
      <PiMinus class="h-4 w-4" aria-hidden="true" />
    </InputGroupAddon>
    <InputGroupAddon
      position="right"
      @click="increment"
      @keydown.enter="increment"
      @keydown.space.prevent="increment"
      role="button"
      :aria-label="t('increase-value')"
      tabindex="-1"
      :disabled
      :invalid
    >
      <PiPlus class="h-4 w-4" aria-hidden="true" />
    </InputGroupAddon>
  </InputGroup>
</template>

<script setup lang="ts">
import { computed, toRef } from "vue";
import { PiPlus, PiMinus } from "vue-icons-plus/pi";
import Input from "../primitives/Input.vue";
import InputGroup from "../primitives/InputGroup.vue";
import InputGroupAddon from "../primitives/InputGroupAddon.vue";
import { type LocaleMessages, useLocale } from "@/composables/useLocale";

defineOptions({
  inheritAttrs: false,
});

const props = withDefaults(
  defineProps<{
    dense?: boolean;
    invalid?: boolean;
    disabled?: boolean;
    min?: number;
    max?: number;
    step?: number;
    locale?: LocaleMessages;
  }>(),
  {
    step: 1,
  }
);

const t = useLocale("input.number", toRef(() => props.locale));

const forwardedProps = computed(() => {
  const { locale, ...rest } = props;
  return rest;
});

const model = defineModel<number>();

function increment() {
  if (props.disabled) return;

  const current = model.value ?? props.min ?? 0;
  const next = current + props.step;

  model.value = props.max !== undefined ? Math.min(next, props.max) : next;
}

function decrement() {
  if (props.disabled) return;

  const current = model.value ?? props.min ?? 0;
  const next = current - props.step;

  model.value = props.min !== undefined ? Math.max(next, props.min) : next;
}
</script>
