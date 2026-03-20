<template>
  <div class="flex flex-col gap-1">
    <Label
      v-if="hasLabel"
      :dense
      :for="groupId"
    >
      <slot name="label" />
    </Label>
    <div
      :id="groupId"
      role="group"
      :aria-labelledby="ariaLabelledby"
      :aria-label="ariaLabel"
    >
      <slot />
    </div>
    <InputHintRow
      v-if="hasHelper"
      :dense
      class="mt-1"
    >
      <InputHelper>
        {{ helper }}
      </InputHelper>
    </InputHintRow>
    <InputError
      v-if="errors?.length"
      :errors="errors"
      :dense
      class="mt-1"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import Label from "../Input/primitives/Label.vue";
import InputHintRow from "../Input/primitives/InputHintRow.vue";
import InputHelper from "../Input/primitives/InputHelper.vue";
import InputError from "../Input/primitives/InputError.vue";
import { useSanitizedId, useSlotContent } from "@/composables";

const groupId = useSanitizedId("form-group", { useAttrId: true });

const props = defineProps<{
  dense?: boolean;
  helper?: string;
  errors?: string[];
  ariaLabel?: string;
  ariaLabelledby?: string;
}>();

const { hasSlotContent } = useSlotContent();
const hasLabel = hasSlotContent("label");
const hasHelper = computed(() => props.helper && !props.errors?.length);
</script>
