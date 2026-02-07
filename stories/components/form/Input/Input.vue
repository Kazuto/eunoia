<template>
  <div class="flex flex-col gap-1">
    <Label
      :dense
      :for="inputId"
    ><slot /></Label>
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
    />
  </div>
</template>

<script setup lang="ts">
import Label from "./primitives/Label.vue";
import { useAttrs, computed } from "vue";
import { useSanitizedId } from "@/composables/useSanitizedId";
import PasswordInput from "./variants/PasswordInput.vue";
import NumberInput from "./variants/NumberInput.vue";
import TextInput from "./variants/TextInput.vue";

defineOptions({
  inheritAttrs: false,
});

const attrs = useAttrs();
const inputId = useSanitizedId("input");
const model = defineModel<string | number>();

defineProps<{
  dense?: boolean;
  invalid?: boolean;
  disabled?: boolean;
  ariaLabel?: string;
  ariaLabelledby?: string;
}>();

const variantComponent = computed(() => {
  if (attrs.type === "password") return PasswordInput;
  if (attrs.type === "number") return NumberInput;

  return TextInput;
});
</script>
