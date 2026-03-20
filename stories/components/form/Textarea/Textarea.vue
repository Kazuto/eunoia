<template>
  <div class="flex flex-col gap-1">
    <Label
      :dense
      :for="textareaId"
      ><slot
    /></Label>
    <TextareaInput
      v-bind="$attrs"
      :id="textareaId"
      v-model="model"
      :dense
      :invalid
      :disabled
      :aria-label="ariaLabel"
      :aria-labelledby="ariaLabelledby"
    />
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
import Label from "../Input/primitives/Label.vue";
import InputHintRow from "../Input/primitives/InputHintRow.vue";
import InputHelper from "../Input/primitives/InputHelper.vue";
import InputCounter from "../Input/primitives/InputCounter.vue";
import InputError from "../Input/primitives/InputError.vue";
import TextareaInput from "./variants/TextareaInput.vue";
import { useAttrs, computed } from "vue";
import { useSanitizedId } from "@/composables";

defineOptions({
  inheritAttrs: false,
});

const attrs = useAttrs();
const textareaId = useSanitizedId("textarea", { useAttrId: true });
const model = defineModel<string>();

const props = defineProps<{
  dense?: boolean;
  invalid?: boolean;
  disabled?: boolean;
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
</script>
