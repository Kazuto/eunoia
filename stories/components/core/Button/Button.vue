<template>
  <component
    :is="variantComponent"
    :dense="dense"
    :icon="icon"
  >
    <slot />
  </component>
</template>

<script lang="ts" setup>
import { computed } from "vue";
import PrimaryButton from "./variants/PrimaryButton.vue";
import SecondaryButton from "./variants/SecondaryButton.vue";
import GhostButton from "./variants/GhostButton.vue";
import DestructiveButton from "./variants/DestructiveButton.vue";

const props = withDefaults(
  defineProps<{
    primary?: boolean;
    ghost?: boolean;
    destructive?: boolean;
    dense?: boolean;
    icon?: string;
  }>(),
  { primary: false, ghost: false, destructive: false, icon: undefined }
);

const variantComponent = computed(() => {
  if (props.destructive) return DestructiveButton;
  if (props.ghost) return GhostButton;
  if (props.primary) return PrimaryButton;
  return SecondaryButton;
});
</script>
