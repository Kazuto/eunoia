<template>
  <Chip
    :variant
    :dense
    @click="emit('click', $event)"
    @focus="emit('focus', $event)"
    @blur="emit('blur', $event)"
  >
    <slot />
    <ChipRemove
      v-if="removable"
      :variant
      :dense
      @remove="emit('remove', $event)"
    />
  </Chip>
</template>

<script lang="ts" setup>
import Chip from "./primitives/Chip.vue";
import ChipRemove from "./primitives/ChipRemove.vue";

withDefaults(
  defineProps<{
    variant?: "primary" | "secondary" | "success" | "warning" | "danger";
    dense?: boolean;
    removable?: boolean;
  }>(),
  {},
);

const emit = defineEmits<{
  (e: "click", event: MouseEvent): void;
  (e: "focus", event: FocusEvent): void;
  (e: "blur", event: FocusEvent): void;
  (e: "remove", event: MouseEvent | KeyboardEvent): void;
}>();
</script>
