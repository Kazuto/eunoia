<template>
  <div class="flex flex-col gap-1">
    <Label
      :dense
      :for="inputId"
      ><slot
    /></Label>
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
        v-bind="{ ...$attrs, ...forwardedProps }"
        :id="inputId"
        v-model="model"
        role="spinbutton"
        type="number"
        :min
        :max
        :step
        :aria-label="ariaLabel"
        :aria-labelledby="ariaLabelledby"
        :aria-valuenow="model"
        :aria-valuemin="min"
        :aria-valuemax="max"
      />

      <InputGroupAddon
        role="button"
        :aria-label="t('decrease-value')"
        tabindex="-1"
        :disabled
        :invalid
        :dense
        @click="decrement"
        @keydown.enter="decrement"
        @keydown.space.prevent="decrement"
      >
        <Icon
          name="minus"
          size="sm"
        />
      </InputGroupAddon>
      <InputGroupAddon
        role="button"
        :aria-label="t('increase-value')"
        tabindex="-1"
        :disabled
        :invalid
        :dense
        @click="increment"
        @keydown.enter="increment"
        @keydown.space.prevent="increment"
      >
        <Icon
          name="plus"
          size="sm"
        />
      </InputGroupAddon>
    </InputGroup>
    <InputHintRow
      v-if="hasHelper"
      :dense
    >
      <InputHelper>
        {{ helper }}
      </InputHelper>
    </InputHintRow>
    <InputError
      v-if="errors?.length"
      :errors="errors"
      :dense
    />
  </div>
</template>

<script setup lang="ts">
import { computed, toRef, watch } from "vue";
import { Icon } from "@/components";
import Label from "../Input/primitives/Label.vue";
import Input from "../Input/primitives/Input.vue";
import InputGroup from "../InputGroup/InputGroup.vue";
import InputGroupAddon from "../InputGroup/InputGroupAddon.vue";
import InputHintRow from "../Input/primitives/InputHintRow.vue";
import InputHelper from "../Input/primitives/InputHelper.vue";
import InputError from "../Input/primitives/InputError.vue";
import { useSanitizedId } from "@/composables";
import { type LocaleMessages, useLocale } from "@/composables";

defineOptions({
  inheritAttrs: false,
});

const inputId = useSanitizedId("number-input", { useAttrId: true });
const model = defineModel<number>();

const props = withDefaults(
  defineProps<{
    dense?: boolean;
    invalid?: boolean;
    disabled?: boolean;
    helper?: string;
    errors?: string[];
    ariaLabel?: string;
    ariaLabelledby?: string;
    min?: number;
    max?: number;
    step?: number;
    locale?: LocaleMessages;
  }>(),
  {
    min: undefined,
    max: undefined,
    step: 1,
    locale: undefined,
    helper: undefined,
    errors: () => [],
    ariaLabel: undefined,
    ariaLabelledby: undefined,
  }
);

const hasHelper = computed(() => props.helper && !props.errors?.length);

const t = useLocale(
  "input.number",
  toRef(() => props.locale)
);

const forwardedProps = computed(() => {
  const {
    locale: _locale,
    helper: _helper,
    errors: _errors,
    ariaLabel: _ariaLabel,
    ariaLabelledby: _ariaLabelledby,
    ...rest
  } = props;
  return rest;
});

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

// Clip value to min/max when user types directly
watch(
  model,
  (value) => {
    if (value === undefined || value === null) return;

    let clipped = value;

    if (props.min !== undefined && value < props.min) {
      clipped = props.min;
    }

    if (props.max !== undefined && value > props.max) {
      clipped = props.max;
    }

    if (clipped !== value) {
      model.value = clipped;
    }
  },
  { flush: "post" }
);
</script>
