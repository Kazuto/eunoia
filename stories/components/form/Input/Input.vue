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
      :aria-label="ariaLabel"
      :aria-labelledby="ariaLabelledby"
      :locale
    >
      <template
        v-if="$slots.prepend"
        #prepend
      >
        <slot name="prepend" />
      </template>
      <template
        v-if="$slots.append"
        #append
      >
        <slot name="append" />
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
import { useSanitizedId } from "@/composables";
import { type LocaleMessages } from "@/composables";
import PasswordInput from "./variants/PasswordInput.vue";
import TextInput from "./variants/TextInput.vue";
import SearchInput from "./variants/SearchInput.vue";

defineOptions({
  inheritAttrs: false,
});

const attrs = useAttrs();
const inputId = useSanitizedId("input", { useAttrId: true });
const model = defineModel<string>();

const props = defineProps<{
  dense?: boolean;
  invalid?: boolean;
  disabled?: boolean;
  helper?: string;
  errors?: string[];
  ariaLabel?: string;
  ariaLabelledby?: string;
  locale?: LocaleMessages;
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
  ["search", SearchInput],
]);

const variantComponent = computed(() => {
  return variantMap.get(attrs.type as string) ?? TextInput;
});
</script>
