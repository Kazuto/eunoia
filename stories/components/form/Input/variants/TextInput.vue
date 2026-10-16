<template>
  <InputGroup
    class="group/input"
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
      v-bind="{ ...$attrs, ...inputProps }"
    />

    <InputGroupAddon
      v-if="shortcut && !model"
      position="right"
      class="pointer-events-none group-has-[input:focus]/input:hidden"
      aria-hidden="true"
      :disabled
      :invalid
    >
      <Kbd
        :shortcut
        :dense
      />
    </InputGroupAddon>

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
import Kbd from "../../../core/Kbd/Kbd.vue";
import { computed } from "vue";

defineOptions({
  inheritAttrs: false,
});

const props = withDefaults(
  defineProps<{
    dense?: boolean;
    invalid?: boolean;
    disabled?: boolean;
    shortcut?: string;
  }>(),
  { shortcut: undefined }
);

const inputProps = computed(() => {
  const { shortcut: _shortcut, ...rest } = props;
  return rest;
});

const model = defineModel<string>();
</script>
