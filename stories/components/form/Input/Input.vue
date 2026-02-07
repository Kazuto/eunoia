<template>
  <div class="flex flex-col gap-1">
    <Label v-if="!isCheckbox" :dense :for="inputId"><slot /></Label>
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
      <template #default v-if="isCheckbox">
        <slot />
      </template>
    </component>
  </div>
</template>

<script setup lang="ts">
import Label from "./primitives/Label.vue";
import { useAttrs, computed } from "vue";
import { useSanitizedId } from "@/composables/useSanitizedId";
import PasswordInput from "./variants/PasswordInput.vue";
import NumberInput from "./variants/NumberInput.vue";
import TextInput from "./variants/TextInput.vue";
import CheckboxInput from "./variants/CheckboxInput.vue";

defineOptions({
  inheritAttrs: false,
});

const attrs = useAttrs();
const inputId = useSanitizedId("input", { useAttrId: true });
const model = defineModel<string | number>();

defineProps<{
  dense?: boolean;
  invalid?: boolean;
  disabled?: boolean;
  indeterminate?: boolean;
  ariaLabel?: string;
  ariaLabelledby?: string;
}>();

const variantMap = new Map<string, Component>([
  ["password", PasswordInput],
  ["number", NumberInput],
  ["checkbox", CheckboxInput],
]);

const isCheckbox = computed(() => attrs.type === "checkbox");

const variantComponent = computed(() => {
  return variantMap.get(attrs.type) ?? TextInput;
});
</script>
