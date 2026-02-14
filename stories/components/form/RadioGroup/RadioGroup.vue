<template>
  <RadioGroupPrimitive
    v-bind="$attrs"
    v-model="model"
    :options
    :name="radioName"
    :dense
    :disabled
  />
</template>

<script setup lang="ts">
import RadioGroupPrimitive from "./primitives/RadioGroup.vue";
import { useSanitizedId } from "@/composables";

defineOptions({
  inheritAttrs: false,
});

defineProps<{
  options: { label: string; value: string | number }[];
  dense?: boolean;
  disabled?: boolean;
}>();

const model = defineModel<string | number>();
const radioName = useSanitizedId("radio-group");
</script>
