<template>
  <component :is="variantComponent" :dense="dense">
    <slot />
  </component>
</template>

<script lang="ts" setup>
import { computed } from "vue";
import PrimaryButton from "./variants/PrimaryButton.vue";
import SecondaryButton from "./variants/SecondaryButton.vue";
import GhostButton from "./variants/GhostButton.vue";

const props = withDefaults(
  defineProps<{
    primary?: boolean;
    ghost?: boolean;
    dense?: boolean;
  }>(),
  { primary: false, ghost: false }
);

const variantComponent = computed(() => {
  if (props.ghost) return GhostButton;
  if (props.primary) return PrimaryButton;
  return SecondaryButton;
});
</script>
