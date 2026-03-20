<template>
  <InputGroup
    :invalid
    :disabled
  >
    <Textarea
      v-model="model"
      v-bind="{ ...$attrs, ...props }"
    />
  </InputGroup>
</template>

<script setup lang="ts">
import Textarea from "../primitives/Textarea.vue";
import InputGroup from "../../Input/primitives/InputGroup.vue";

defineOptions({
  inheritAttrs: false,
});

const props = withDefaults(
  defineProps<{
    dense?: boolean;
    invalid?: boolean;
    disabled?: boolean;
  }>(),
  {}
);

const model = defineModel<string>();
</script>
