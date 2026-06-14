<script setup lang="ts">
import { Button, type ButtonOptions } from "@/components";

const props = withDefaults(
  defineProps<ButtonOptions & { active?: boolean }>(),
  {
    icon: undefined,
    disabled: false,
    dense: false,
    active: false,
  }
);
</script>

<template>
  <Button
    v-bind="props"
    :primary="active"
  >
    <slot />
  </Button>
</template>
