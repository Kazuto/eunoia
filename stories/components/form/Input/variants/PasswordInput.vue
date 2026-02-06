<template>
  <InputGroup :invalid :disabled>
    <InputGroupAddon v-if="$slots.prepend" position="left" :disabled :invalid>
      <slot name="prepend" />
    </InputGroupAddon>

    <Input
      v-model="model"
      v-bind="{ ...$attrs, ...props }"
      :type="inputType"
      :disabled
      :invalid
    />

    <InputGroupAddon
      position="right"
      @click="toggleVisibility"
      @keydown.enter="toggleVisibility"
      @keydown.space="toggleVisibility"
      role="button"
      :aria-label="isVisible ? 'Hide password' : 'Show password'"
      :aria-pressed="isVisible"
      :disabled
      :invalid
    >
      <component :is="icon" class="h-4 w-4" aria-hidden="true" />
    </InputGroupAddon>
  </InputGroup>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { PiEye, PiEyeClosed } from "vue-icons-plus/pi";
import Input from "../primitives/Input.vue";
import InputGroup from "../primitives/InputGroup.vue";
import InputGroupAddon from "../primitives/InputGroupAddon.vue";

const props = withDefaults(
  defineProps<{
    dense?: boolean;
    invalid?: boolean;
    disabled?: boolean;
  }>(),
  {}
);

defineOptions({
  inheritAttrs: false,
});

const model = defineModel<string>();

const isVisible = ref(false);

const inputType = computed(() => (isVisible.value ? "text" : "password"));

const icon = computed(() => (isVisible.value ? PiEye : PiEyeClosed));

function toggleVisibility() {
  if (props.disabled) return;

  isVisible.value = !isVisible.value;
}
</script>
