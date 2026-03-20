<template>
  <InputGroup
    :invalid
    :disabled
  >
    <InputGroupAddon
      v-if="$slots.prepend"
      position="left"
      :disabled
      :invalid
    >
      <slot name="prepend" />
    </InputGroupAddon>

    <Input
      v-model="model"
      v-bind="{ ...$attrs, ...props }"
    />

    <InputGroupAddon
      v-if="$slots.append"
      position="right"
      :disabled
      :invalid
    >
      <slot name="append" />
    </InputGroupAddon>
  </InputGroup>
</template>

<script setup lang="ts">
import Input from "../primitives/Input.vue";
import InputGroup from "../../InputGroup/InputGroup.vue";
import InputGroupAddon from "../../InputGroup/InputGroupAddon.vue";

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
