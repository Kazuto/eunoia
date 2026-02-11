<template>
  <div class="flex flex-col gap-1">
    <Label
      :dense
      :for="inputId"
      ><slot
    /></Label>
    <component
      :is="variantComponent"
      v-bind="$attrs"
      :id="inputId"
      v-model="model"
      :dense
      :invalid
      :disabled
      :indeterminate
      :aria-label="ariaLabel"
      :aria-labelledby="ariaLabelledby"
    >
      <template
        v-if="$slots.description"
        #description
      >
        <slot name="description" />
      </template>
    </component>
    <InputHintRow
      v-if="hasHelper || maxlength"
      :dense
    >
      <InputHelper v-if="hasHelper">
        {{ helper }}
      </InputHelper>
      <InputCounter
        v-if="maxlength"
        :current="modelLength"
        :max="maxlength"
      />
    </InputHintRow>
    <InputError
      v-if="errors?.length"
      :errors="errors"
      :dense
    />
  </div>
</template>

<script setup lang="ts">
import Label from "./primitives/Label.vue";
import InputHintRow from "./primitives/InputHintRow.vue";
import InputHelper from "./primitives/InputHelper.vue";
import InputCounter from "./primitives/InputCounter.vue";
import InputError from "./primitives/InputError.vue";
import { useAttrs, computed, type Component } from "vue";
import { useSanitizedId } from "@/composables/useSanitizedId";
import PasswordInput from "./variants/PasswordInput.vue";
import NumberInput from "./variants/NumberInput.vue";
import TextInput from "./variants/TextInput.vue";
import CheckboxInput from "./variants/CheckboxInput.vue";
import RadioInput from "./variants/RadioInput.vue";

defineOptions({
  inheritAttrs: false,
});

const attrs = useAttrs();
const inputId = useSanitizedId("input", { useAttrId: true });
const model = defineModel<string | number>();

const props = defineProps<{
  dense?: boolean;
  invalid?: boolean;
  disabled?: boolean;
  indeterminate?: boolean;
  helper?: string;
  errors?: string[];
  ariaLabel?: string;
  ariaLabelledby?: string;
}>();

const hasHelper = computed(() => props.helper && !props.errors?.length);

const maxlength = computed(() => {
  const val = attrs.maxlength;
  return val != null ? Number(val) : undefined;
});

const modelLength = computed(() => {
  if (typeof model.value === "string") return model.value.length;
  return 0;
});

const variantMap = new Map<string, Component>([
  ["password", PasswordInput],
  ["number", NumberInput],
  ["checkbox", CheckboxInput],
  ["radio", RadioInput],
]);

const variantComponent = computed(() => {
  return variantMap.get(attrs.type) ?? TextInput;
});
</script>
