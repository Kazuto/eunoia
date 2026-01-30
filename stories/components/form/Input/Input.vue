<template>
  <div class="flex flex-col gap-1">
    <Label :size><slot /></Label>
    <component
      :is="variantComponent"
      v-model="model"
      v-bind="$attrs"
      :size
      :invalid
      :disabled
    />
  </div>
</template>

<script setup lang="ts">
import Label from "./primitives/Label.vue";
import { useAttrs, computed } from "vue";
import PasswordInput from "./variants/PasswordInput.vue";
import NumberInput from "./variants/NumberInput.vue";
import TextInput from "./variants/TextInput.vue";

defineOptions({
  inheritAttrs: false,
});

const attrs = useAttrs();
const model = defineModel<string | number>();

defineProps<{
  size?: "small" | "medium" | "large";
  invalid?: boolean;
  disabled?: boolean;
}>();

const variantComponent = computed(() => {
  if (attrs.type === "password") return PasswordInput;
  if (attrs.type === "number") return NumberInput;

  return TextInput;
});
</script>
