<template>
  <InputGroup :invalid :disabled>
    <InputGroupAddon v-if="$slots.prepend" position="left" :disabled :invalid>
      <slot name="prepend" />
    </InputGroupAddon>

    <Input
      v-model="model"
      v-bind="{ ...$attrs, ...props }"
      role="spinbutton"
      type="number"
      :min
      :max
      :step
      :aria-valuenow="model"
      :aria-valuemin="min"
      :aria-valuemax="max"
    />

    <InputGroupAddon
      position="right"
      @click="decrement"
      @keydown.enter="decrement"
      @keydown.space.prevent="decrement"
      role="button"
      aria-label="Decrease value"
      tabindex="-1"
      class="rounded-none"
      :disabled
      :invalid
    >
      <PiMinus class="h-4 w-4" aria-hidden="true" />
    </InputGroupAddon>
    <InputGroupAddon
      position="right"
      @click="increment"
      @keydown.enter="increment"
      @keydown.space.prevent="increment"
      role="button"
      aria-label="Increase value"
      tabindex="-1"
      :disabled
      :invalid
    >
      <PiPlus class="h-4 w-4" aria-hidden="true" />
    </InputGroupAddon>
  </InputGroup>
</template>

<script setup lang="ts">
import { PiPlus, PiMinus } from "vue-icons-plus/pi";
import Input from "../primitives/Input.vue";
import InputGroup from "../primitives/InputGroup.vue";
import InputGroupAddon from "../primitives/InputGroupAddon.vue";

defineOptions({
  inheritAttrs: false,
});

const props = withDefaults(
  defineProps<{
    dense?: boolean;
    invalid?: boolean;
    disabled?: boolean;
    min?: number;
    max?: number;
    step?: number;
  }>(),
  {
    step: 1,
  }
);

const model = defineModel<number>();

function increment() {
  if (props.disabled) return;

  const current = model.value ?? props.min ?? 0;
  const next = current + props.step;

  model.value = props.max !== undefined ? Math.min(next, props.max) : next;
}

function decrement() {
  if (props.disabled) return;

  const current = model.value ?? props.min ?? 0;
  const next = current - props.step;

  model.value = props.min !== undefined ? Math.max(next, props.min) : next;
}
</script>
