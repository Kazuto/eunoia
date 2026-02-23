<template>
  <div class="flex flex-col gap-1">
    <Label
      :dense
      :for="rangeId"
    >
      <slot />
    </Label>

    <div class="flex w-full items-center gap-2">
      <Limit
        v-if="showMinLimit"
        :value="min"
        :dense
      />

      <div class="h-fit w-full">
        <component
          :is="variantComponent"
          :id="rangeId"
          v-model="model"
          :list="options ? markerId : undefined"
          :disabled
          :invalid
          :dense
          :min="min ?? 0"
          :max="max ?? 100"
          :step="step ?? 1"
          v-bind="{ ...forwardedAttrs, ...rangeAriaProps }"
        />

        <Datalist
          v-if="options"
          :id="markerId"
          :options
        />
      </div>

      <Limit
        v-if="showMaxLimit"
        :value="max"
        :dense
      />
    </div>

    <InputHintRow
      v-if="hasHelper || maxlength"
      :dense
    >
      <InputHelper v-if="hasHelper">
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
import { computed } from "vue";
import {
  type LocaleMessages,
  useSanitizedId,
  useForwardedAttrs,
  useLocale,
} from "@/composables";

const rangeId = useSanitizedId("range-slider");
const markerId = useSanitizedId("range-slider-marker");

import Label from "../Input/primitives/Label.vue";
import InputHintRow from "../Input/primitives/InputHintRow.vue";
import InputHelper from "../Input/primitives/InputHelper.vue";
import InputError from "../Input/primitives/InputError.vue";
import SingleSlider from "./variants/SingleSlider.vue";
import RangeSlider from "./variants/RangeSlider.vue";
import Datalist from "./primitives/Datalist.vue";
import Limit from "./primitives/Limit.vue";

defineOptions({
  inheritAttrs: false,
});

const { forwardedAttrs } = useForwardedAttrs();

const model = defineModel<number | [number, number]>();

const props = withDefaults(
  defineProps<{
    range?: boolean;
    dense?: boolean;
    disabled?: boolean;
    invalid?: boolean;
    locale?: LocaleMessages;
    helper?: string;
    errors?: string[];
    maxlength?: number;
    options?: Array<{ label?: string; value: string | number }>;
    min?: number;
    max?: number;
    step?: number;
  }>(),
  {
    range: false,
    dense: false,
    disabled: false,
    invalid: false,
    locale: undefined,
    helper: undefined,
    errors: undefined,
    maxlength: undefined,
    min: undefined,
    max: undefined,
    step: undefined,
    options: undefined,
  }
);

const { t } = useLocale(
  "slider",
  computed(() => props.locale)
);

const variantComponent = computed(() =>
  props.range ? RangeSlider : SingleSlider
);

const rangeAriaProps = computed(() =>
  props.range
    ? { ariaLabelLower: t("lower-handle"), ariaLabelUpper: t("upper-handle") }
    : {}
);

const hasHelper = computed(() => props.helper && !props.errors?.length);

const showMinLimit = computed(() => {
  if (props.min === undefined) return false;
  if (!props.options?.length) return true;
  return Number(props.options[0].value) !== props.min;
});

const showMaxLimit = computed(() => {
  if (props.max === undefined) return false;
  if (!props.options?.length) return true;
  return Number(props.options[props.options.length - 1].value) !== props.max;
});
</script>
