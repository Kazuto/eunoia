<script setup lang="ts">
import { Button, type ButtonOptions } from "@/components";
import { computed } from "vue";

const props = withDefaults(
  defineProps<ButtonOptions & { active?: boolean }>(),
  {
    icon: undefined,
    disabled: false,
    dense: false,
    active: false,
  }
);

const propsWithoutActive = computed(() => {
  const { active: _, ...rest } = props;

  return rest;
});
</script>

<template>
  <Button
    v-bind="propsWithoutActive"
    :primary="active"
  >
    <slot />
  </Button>
</template>
